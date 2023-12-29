// src/app/oshi/ranking/_components/countryRanking.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { getOshiRankingByCountry } from "../../actions";
import LinkPic from '../../_components/linkPic';
type Oshi = {
    id: string;
    name: string;
    keepCount: number;
};

type CountryRankingProps = {
    country: string;
};

const CountryRanking: React.FC<CountryRankingProps> = ({ country }) => {
    const [oshiRanking, setOshiRanking] = useState<Oshi[]>([]);

    useEffect(() => {
        const fetchOshiRanking = async () => {
            const ranking = await getOshiRankingByCountry(country);
            setOshiRanking(ranking.slice(0, 5)); // Get the top 5 oshis
        };
        fetchOshiRanking();
    }, [country]);

    return (
        <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{country}</h2>
        <div className="flex space-x-4">
            {oshiRanking.map((oshi, index) => (
            <div className="relative" key={oshi.id}>
                <div className="absolute -left-6 top-0 bg-amber-500 px-2 py-1 text-sm text-white font-bold z-10">
                {index + 1}
                </div>
                <LinkPic oshiId={oshi.id} />
            </div>
            ))}
        </div>
        </section>
    );
};

export default CountryRanking;
