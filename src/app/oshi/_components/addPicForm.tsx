"use client";
declare global {
    interface Window {
        cloudinary: any;
    }
}

export { }; // This line is necessary if you're in a module scope
import { useState, useEffect, useCallback, useRef } from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

import { Button } from "@/components/ui/button";
import {  addPicture, getOshiPicturesSortedByLikes } from "../actions";
import LikeButton from "./likeButton";
import Image from "next/image";

type Props = {
    params: { oshiId: string };
    className?: string; // Optional if you want to make it not required
    onImageUpload?: (url: string) => void;
};


type Picture = {
    id: string;
    imageUrl: string | null;
    likeCount: number;
};

export default function AddPicForm(props: Props) {
    const oshiId = props.params.oshiId;
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [pictureUrl, setPictureUrl] = useState(null); // State to store the picture URL
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Async function to fetch pictures
        const fetchPictures = async () => {
            try {
                const pics = await getOshiPicturesSortedByLikes(oshiId);
                setPictures(pics);
            } catch (error) {
                console.error('Error fetching pictures:', error);
            }
        };

        fetchPictures(); // Call the async function

        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [oshiId]);

    const openCloudinaryWidget = useCallback(() => {
        if (typeof window.cloudinary === 'undefined') {
            console.error('Cloudinary script not loaded');
            return;
        }
        window.cloudinary.openUploadWidget(
            {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
                cropping: true,               // Enable cropping
                cropping_aspect_ratio: 1,     // Set aspect ratio to 1:1 for square
                cropping_default_selection_ratio: 1, // Default selection ratio
                cropping_show_dimensions: true,
                show_completed_button: true,  // Show 'Done' button after upload
                show_cancel: true,
                theme: 'white',
            },
            async (error: any, result: any) => {
                if (error) {
                    console.error('Upload error:', error);
                    return;
                }
                if (result.event === 'success') {
                    props.onImageUpload? props.onImageUpload(result.info.secure_url) : null;
                    console.log('Upload result:', result.info.secure_url);
                    setPictureUrl(result.info.secure_url);
                    try {
                        // Add the picture to the database
                        const newPictureData = await addPicture({
                            oshiId: oshiId,
                            imageUrl: result.info.secure_url,
                        });

                        setPictures(prev => [...prev, { ...newPictureData, likeCount: 0 }]);

                    } catch (error) {
                        console.error('Error saving picture:', error);
                    }
                }
            }
        );
    }, [oshiId]);

    return (
        <>
            <div className={props.className + " flex flex-row gap-1 pt-4"}>
            <Button onClick={openCloudinaryWidget}
                className='flex flex-col items-center justify-center rounded-xl p-2 text-l text-white drop-shadow-md transition-all bg-amber-500 hover:bg-amber-400 whitespace-normal'
                style={{ width: '100px', height: '100px' }}>
                <AddAPhotoIcon className="mb-1"/> {/* Icon at the top */}
                Upload {/* Text in the middle */}
                <br /> {/* Line break for spacing */}
                Image {/* Text at the bottom */}
            </Button>
                <div className="flex-grow flex overflow-x-auto" style={{ width: '500px', height: '120px' }} ref={scrollContainerRef}>
                    {pictures.map((pic, index) => (
                        <div key={index} className="shrink-0 relative mr-2" style={{ width: '100px', height: '100px' }}>
                            <Image
                                src={pic.imageUrl || '/defaultProfile.png'}
                                alt={`Oshi Image ${index}`}
                                width={500} 
                                height={500} 
                                className="object-cover w-full h-full"
                            />
                            <div
                                className="absolute bottom-1 right-1"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    borderRadius: '50%',
                                    padding: '2px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <LikeButton params={{ picId: pic.id }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );


}
