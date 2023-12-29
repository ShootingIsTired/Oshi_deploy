"use client";
import React from 'react';
import Link from 'next/link';

interface LinkCountryProps {
    country: string;
    countryFlag: string;
}

const LinkCountry: React.FC<LinkCountryProps> = ({ country, countryFlag }) => {
    return (
        <>
            <Link href={`/explore?country=${country}`} passHref>
                <span className="text-2xl flex flex-col items-center mb-4 cursor-pointer">{countryFlag}</span>
            </Link>
        </>
    );
};

export default LinkCountry;
