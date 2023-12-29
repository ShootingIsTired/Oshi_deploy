"use client";

import { useState, useEffect } from "react";
import { countKeeps, getOshi } from "../../actions";
import { redirect } from "next/navigation";
import KeepButton from "../../_components/keepButton";
type Props = {
    params: { oshiId: string };
    className?: string; // Optional if you want to make it not required
};


export default function KeepCount(props: Props) {

    const [keepCount, setKeepCount] = useState(0);

    const handleKeep = async () => {
        // Update the keep count based on the keep/unkeep action
        const updatedKeepCount = await countKeeps(props.params.oshiId);
        setKeepCount(updatedKeepCount);
    };

    useEffect(() => {
        async function fetchData() {
            const fetchedOshi = await getOshi(props.params.oshiId);
            if (!fetchedOshi) {
                redirect("/oshi");
            } else {
                const fetchedKeepCount = await countKeeps(props.params.oshiId);
                setKeepCount(fetchedKeepCount);
            }
        }
        fetchData();
    }, [props.params.oshiId]);

    return (
        <div className="flex flex-row" >
            <KeepButton oshiId={props.params.oshiId} className="h-9 w-9" onKeep={handleKeep} />
            <p className="flex flex-grow text-xl h-9 p-1"> {keepCount} keeps</p>
        </div>
    );
}
