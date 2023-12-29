"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { keepOshi, removeKeepOshi, isOshiKeptByUser } from "../actions";
import KeepIcon from "@mui/icons-material/TurnedInNot";
import UnkeepIcon from "@mui/icons-material/TurnedIn";

type Props = {
    oshiId: string;
    className?: string; // Optional if you want to make it not required
    onKeep?: () => void;
};

export default function KeepButton(props: Props) {
    const { data: session } = useSession();
    const oshiId = props.oshiId;
    const [isKept, setIsKept] = useState(false);

    useEffect(() => {
        const checkIfKeeped = async () => {
            if (session && session.user) {
                const keptStatus = await isOshiKeptByUser(session.user.id, oshiId);
                setIsKept(keptStatus);
            }
        };
        checkIfKeeped();
    }, [session, oshiId]);

    const handleKeepClick = async () => {
        if (!session || !session.user) {
            // Handle case where user is not logged in
            console.log("User not logged in");
            return;
        }

        if (isKept) {
            await removeKeepOshi(session.user.id, oshiId);
        } else {
            await keepOshi(session.user.id, oshiId);
        }
        setIsKept(!isKept);
        props.onKeep?.();
    };

    return (
        <button onClick={handleKeepClick} className={props.className}>
            {isKept ? <UnkeepIcon className={props.className}/> : <KeepIcon className={props.className}/>}
        </button>
    );
}