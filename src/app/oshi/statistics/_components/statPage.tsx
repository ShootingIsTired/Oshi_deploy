"use client";
import React, { useState, useEffect } from 'react';
import { countUsers, countOshis, countPics, getTopTags } from '../../actions';
import TagIcon from '@mui/icons-material/Tag';

interface TagData {
    tag: string;
    count: number;
}
export default function StatPage() {
    const [userCount, setUserCount] = useState(0);
    const [oshiCount, setOshiCount] = useState(0);
    const [picCount, setPicCount] = useState(0);
    const [topTags, setTopTags] = useState<TagData[]>([]);

    useEffect(() => {
        async function loadStats() {
            const users = await countUsers();
            const oshis = await countOshis();
            const pics = await countPics();
            const tags = await getTopTags();

            setUserCount(users);
            setOshiCount(oshis);
            setPicCount(pics);
            setTopTags(tags);
        }
        loadStats();
    }, []);

    return (
        <main className="flex flex-col h-full w-full items-left justify-center p-6">
            <h1 className=" text-2xl font-semibold text-gray-800 mb-8">Statistics</h1>
            <div className="space-y-6 mb-10">
                <p className="text-lg text-gray-700">Number of Users: <span className="text-2xl text-amber-500 font-semibold">{userCount}</span></p>
                <p className="text-lg text-gray-700">Number of Total Oshis: <span className="text-2xl text-amber-500 font-semibold">{oshiCount}</span></p>
                <p className="text-lg text-gray-700">Number of Total Pictures: <span className="text-2xl text-amber-500 font-semibold">{picCount}</span></p>
            </div>
            <div className="w-full max-w-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Top 10 Tags:</h2>
                <ul className="list-disc list-inside bg-white shadow-md rounded p-4">
                    {topTags.map((tag, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-100 rounded px-4 py-2 my-2">
                            <TagIcon className="h-6 w-6" />
                            <span className="text-gray-700">{tag.tag}</span>
                            <span className="font-semibold text-gray-500">{tag.count}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}