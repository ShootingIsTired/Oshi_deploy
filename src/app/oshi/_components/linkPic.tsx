"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getMostLikedOshiPicture, getOshi, countKeeps } from '../actions';
import KeepButton from './keepButton';

type Props = {
    oshiId: string;
};

// Return a pic with a link to the oshi page, keep button and keep count
export default function LinkPic(props: Props) {
    const oshiId = props.oshiId;
    const [imageUrl, setImageUrl] = useState('/defaultProfile.png'); // Default image
    const [oshiName, setOshiName] = useState('');
    const [keepCount, setKeepCount] = useState(0); // Initialize keepCount state
    
    // Handler for when an oshi is kept or unkept
    const handleKeep = async () => {
        // Update the keep count based on the keep/unkeep action
        const updatedKeepCount = await countKeeps(oshiId);
        setKeepCount(updatedKeepCount);
    };

    useEffect(() => {
        async function fetchOshiDetails() {
            // Fetch the most liked picture for the oshi
            const picture = await getMostLikedOshiPicture(oshiId);
            if (picture?.imageUrl) {
                setImageUrl(picture.imageUrl);
            }

            // Fetch the oshi's details for the alt text
            const oshiDetails = await getOshi(oshiId);
            if (oshiDetails?.name) {
                setOshiName(oshiDetails.name);
            }

            // Fetch the current keep count
            const currentKeepCount = await countKeeps(oshiId);
            setKeepCount(currentKeepCount);
        }

        fetchOshiDetails();
    }, [oshiId]);

    return (
        <div className="relative group max-w-xs mx-auto">
            <Link href={`/oshi/${oshiId}`} passHref>
                <Image src={imageUrl} alt={oshiName} width={500} height={500} className="h-auto w-48 cursor-pointer" />
            </Link>
            <div className="absolute bottom-0 left-0 right-0 bg-white p-1 flex justify-between items-center">
                <div className="flex items-center pl-2">
                    <KeepButton oshiId={oshiId} onKeep={handleKeep} />
                    <span className="text-black ml-2">{keepCount}</span>
                </div>
                <span className="pr-2 text-right flex-grow">{oshiName}</span> {/* This will push the name to the right */}
            </div>
        </div>
    );
    
    
}