"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { getKeepsByUser, getMostLikedOshiPicture, countKeeps, removeKeepOshi, getOshi } from "../../actions";
import KeepButton from '../../_components/keepButton';
import { Pic, OshiInfo } from "@/lib/types";
import Link from 'next/link';
import Image from 'next/image';

// Define a new type that matches the structure we need
type KeptOshi = {
    id: string;
    name: string;
    imageUrl: string | null;
    keepCount: number;
};

export default function MyKeptOshis() {
    const { data: session } = useSession();
    const [keptOshis, setKeptOshis] = useState<KeptOshi[]>([]);

    useEffect(() => {
        async function fetchKeptOshis() {
            if (session?.user) {
                const oshis = await getKeepsByUser(session.user.id);
                setKeptOshis(oshis); // Directly setting the state with the fetched data
            }
        }
        fetchKeptOshis();
    }, [session]);

    const handleRemoveKeep = async (oshiId: string) => {
        if (!session?.user) {
            console.log("User not logged in");
            return;
        }
        setKeptOshis(prevOshis => prevOshis.filter(oshi => oshi.id !== oshiId));
        await removeKeepOshi(session.user.id, oshiId);
    };

    return (
        <>
            <div className="p-10">
                <h1 className="text-xl font-bold mb-4">My Oshi</h1>
                <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[600px]">
                    {keptOshis.map((oshi) => (
                        <div key={oshi.id} className="relative">
                            <Link href={`/oshi/${oshi.id}`} passHref>
                                <div className="cursor-pointer">
                                    <Image src={oshi.imageUrl || "./defaultProfile.png"} width={500} height={500} alt={oshi.name} className="w-full h-auto" />
                                </div>
                            </Link>
                            <div className="absolute bottom-0 left-0 right-0 bg-white p-1 flex justify-between items-center">
                                <div className="flex items-center">
                                    <KeepButton
                                        oshiId={oshi.id}
                                        onKeep={() => handleRemoveKeep(oshi.id)}
                                        className='ml-1'
                                    />
                                    <span className="text-black p-2">{oshi.keepCount} keeps</span>
                                </div>
                                <span className="text-black text-right flex-grow mr-2">{oshi.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
