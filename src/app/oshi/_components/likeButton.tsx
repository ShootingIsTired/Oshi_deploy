"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { likePic, unlikePic, isPicLikedByUser } from "../actions";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
type Props = {
    params: {
        picId: string;
    };
    className?: string;
    onUnlike?: () => void; // Optional prop
};

export default function LikeButton(props: Props) {
    const { data: session } = useSession();
    const picId = props.params.picId;
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const checkIfLiked = async () => {
            if (session && session.user) {
                const likedStatus = await isPicLikedByUser(session.user.id, picId);
                setIsLiked(likedStatus);
            }
        };
        checkIfLiked();
    }, [session, picId]);

    const handleLikeClick = async () => {
        if (!session || !session.user) {
            console.log("User not logged in");
            return;
        }

        if (isLiked) {
            await unlikePic(session.user.id, picId);
            props.onUnlike && props.onUnlike(); // Check if onUnlike is provided and call it
        } else {
            await likePic(session.user.id, picId);
        }
        setIsLiked(!isLiked);
    };

    return (
        <button onClick={handleLikeClick} className={props.className}>
            {isLiked ? 
                <FavoriteIcon className={props.className}/> : 
                <FavoriteBorderIcon className={props.className} />
            }
        </button>
    );
}
