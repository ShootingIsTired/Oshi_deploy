"use client";
interface CloudinaryWidgetOptions {
    cloud_name: string | undefined;
    upload_preset: string | undefined;
    cropping?: boolean;
    cropping_aspect_ratio?: number;
    cropping_default_selection_ratio?: number;
    cropping_show_dimensions?: boolean;
    show_completed_button?: boolean;
    show_cancel?: boolean;
    theme?: string;
    // Add other relevant options
  }
  
  interface CloudinaryWidget {
    openUploadWidget: (
      options: CloudinaryWidgetOptions,
      callback: (error: string, result: CloudinaryUploadResult) => void
    ) => void;
    // Add other relevant methods
  }
  
  declare global {
    interface Window {
      cloudinary: CloudinaryWidget;
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

interface CloudinaryUploadResult {
    event: string;
    info: {
        secure_url: string; // URL of the uploaded file
        public_id: string; // Public ID of the file
        // Add other fields based on Cloudinary's actual response
    };
}

export default function AddPicForm(props: Props) {
    const oshiId = props.params.oshiId;
    console.log("Current oshiId:", oshiId);
    const [pictures, setPictures] = useState<Picture[]>([]);
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
    }, [props.params.oshiId]);

    const openCloudinaryWidget = useCallback(() => {
        if (typeof window.cloudinary === 'undefined') {
            console.error('Cloudinary script not loaded');
            return;
        }
        window.cloudinary.openUploadWidget(
            {
                // cloud_name: 'dtosgqqle',
                // upload_preset: 'dzx7q9vm',
                cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME,
                cropping: true,               // Enable cropping
                cropping_aspect_ratio: 1,     // Set aspect ratio to 1:1 for square
                cropping_default_selection_ratio: 1, // Default selection ratio
                cropping_show_dimensions: true,
                show_completed_button: true,  // Show 'Done' button after upload
                show_cancel: true,
                theme: 'white',
            },
            async (error: string, result: CloudinaryUploadResult) => {
                if (error) {
                    console.error('Upload error:', error);
                    return;
                }
                if (result.event === 'success') {
                    props.onImageUpload? props.onImageUpload(result.info.secure_url) : null;
                    console.log('Upload result:', result.info.secure_url);
                    
                    try {
                        // Add the picture to the database
                        console.log("Current oshiId when adding data:", props.params.oshiId);
                        const newPictureData = await addPicture({
                            oshiId: props.params.oshiId,
                            imageUrl: result.info.secure_url,
                        });

                        setPictures(prev => [...prev, { ...newPictureData, likeCount: 0 }]);

                    } catch (error) {
                        console.error('Error saving picture:', error);
                    }
                }
            }
        );
    }, [props.params.oshiId]);

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
