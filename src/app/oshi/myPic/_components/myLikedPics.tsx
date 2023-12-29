"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { getLikedPicsByUser, getLikeCountByPic, unlikePic } from "../../actions";
import LikeButton from '../../_components/likeButton';
import { Pic } from "@/lib/types";
import Image from 'next/image';

export default function MyLikedPics() {
    const { data: session } = useSession();
    const [likedPics, setLikedPics] = useState<Pic[]>([]);

    const handleUnlike = async (picId: string) => {
        if (!session || !session.user) {
            // Handle case where user is not logged in
            console.log("User not logged in");
            return;
        }
        // Optimistically update the state
        const unlikedPicData = likedPics.find(pic => pic.id === picId);

        // Optimistically update the state to remove the unliked picture
        setLikedPics(prevPics => prevPics.filter(pic => pic.id !== picId));

        try {
            // Perform the unlike action
            await unlikePic(session.user.id, picId);
        } catch (error) {
            // If there's an error, revert the state back
            if (unlikedPicData) {
                setLikedPics(prevPics => [...prevPics, unlikedPicData]);
            }
            console.error('Error unliking picture:', error);
            // Optionally, show an error notification to the user
        }
    };
    useEffect(() => {
        async function fetchLikedPics() {
            if (session && session.user) {
                const pics = await getLikedPicsByUser(session.user.id);
                const picsWithLikeCounts = await Promise.all(pics.map(async pic => {
                    const likeCount = await getLikeCountByPic(pic.id);
                    return { ...pic, likeCount };  // assuming pic already has oshiId
                }));
                setLikedPics(picsWithLikeCounts);
            }
        }
        fetchLikedPics();
    }, [session]);

    return (
        <>
            <div className="p-10">
                <h1 className="text-xl font-bold mb-4">My Picture</h1>
                <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[600px]">
                    {likedPics.map((pic, index) => (
                        <div key={index} className="relative">
                            <Image src={pic.imageUrl} width={500} height={500} alt={`Liked Picture ${index}`} className="w-full h-auto" />
                            <div className="absolute bottom-0 left-0 right-0 bg-white p-1 flex justify-between items-center">
                                <LikeButton
                                    params={{ picId: pic.id }}
                                    className="like-button ml-1"
                                    onUnlike={() => handleUnlike(pic.id)}
                                />
                                <span className="text-black mr-1">{pic.likeCount} likes</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
