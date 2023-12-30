"use client";

import React, { useState, useEffect } from 'react';
import { getAllOshis, getOshisByTag } from '../../actions';
import LinkPic from '../../_components/linkPic';
import { Button } from "@/components/ui/button";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
type Oshi = {
    id: string;
    name: string;
    country: string;
};
const ExploreGallery = () => {
    const [oshis, setOshis] = useState<Oshi[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilters, setCountryFilters] = useState<string[]>([]);
    const [filteredOshis, setFilteredOshis] = useState<Oshi[]>([]);
    const [tagSearchTerm, setTagSearchTerm] = useState('');

    useEffect(() => {
        const fetchOshis = async () => {
            const allOshis = await getAllOshis();
            setOshis(allOshis.oshis);
        };
        fetchOshis();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [oshis, searchTerm, countryFilters, tagSearchTerm]);

    const applyFilters = async () => {
        let oshisToDisplay = oshis;

        // Apply name search filter
        if (searchTerm) {
            oshisToDisplay = oshisToDisplay.filter(oshi =>
                oshi.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply country filter
        if (countryFilters.length > 0) {
            oshisToDisplay = oshisToDisplay.filter(oshi =>
                countryFilters.includes(oshi.country)
            );
        }

        // Apply tag search filter
        if (tagSearchTerm) {
            const oshiIdsByTag = await getOshisByTag(tagSearchTerm);
            oshisToDisplay = oshisToDisplay.filter(oshi =>
                oshiIdsByTag.includes(oshi.id)
            );
        }

        setFilteredOshis(oshisToDisplay);
    };

    useEffect(() => {
        const fetchOshis = async () => {
            const allOshis = await getAllOshis();
            setOshis(allOshis.oshis);
            setFilteredOshis(allOshis.oshis); // Set all oshis by default
        };
        fetchOshis();
    }, []);

    useEffect(() => {
        filterOshis();
    }, [searchTerm, countryFilters]); // Depend on countryFilters array

    const toggleCountryFilter = (country: string) => {
        setCountryFilters((prevFilters) =>
            prevFilters.includes(country)
                ? prevFilters.filter((c) => c !== country) // Remove filter
                : [...prevFilters, country] // Add filter
        );
    };

    const filterOshis = () => {
        let oshisToDisplay = oshis;

        if (searchTerm) {
            oshisToDisplay = oshisToDisplay.filter((oshi) =>
                oshi.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (countryFilters.length > 0) {
            oshisToDisplay = oshisToDisplay.filter((oshi) =>
                countryFilters.includes(oshi.country)
            );
        }

        setFilteredOshis(oshisToDisplay);
    };

    // Add a function to clear all filters
    const clearFilters = () => {
        setCountryFilters([]);
        setSearchTerm('');
        setTagSearchTerm('');
        setFilteredOshis(oshis); // Reset to all oshis
    };


    return (
        <div className="p-10">
            <h1 className="text-xl font-bold mb-4">Explore</h1>
            <div className="search-filter-section mb-6">
                <div className="flex flex-wrap gap-2 justify-center">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input px-3 py-1.5 border rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Search by tag"
                        value={tagSearchTerm}
                        onChange={(e) => setTagSearchTerm(e.target.value)}
                        className="search-input px-3 py-1.5 border rounded-md"
                    />

                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <button onClick={() => toggleCountryFilter('Japan')}
                        className={`px-3 py-1 rounded-md 
                        ${countryFilters.includes('Japan') ? 'bg-lime-700 text-white' : 'bg-gray-200'}`}>
                        Japan🇯🇵</button>
                    <button onClick={() => toggleCountryFilter('Korea')}
                        className={`px-3 py-1 rounded-md 
                        ${countryFilters.includes('Korea') ? 'bg-lime-700 text-white' : 'bg-gray-200'}`}>
                        Korea🇰🇷</button>
                    <button onClick={() => toggleCountryFilter('Mainland China')}
                        className={`px-3 py-1 rounded-md 
                        ${countryFilters.includes('Mainland China') ? 'bg-lime-700 text-white' : 'bg-gray-200'}`}>
                        Mainland China🇨🇳</button>
                    <button onClick={() => toggleCountryFilter('Taiwan')}
                        className={`px-3 py-1 rounded-md 
                        ${countryFilters.includes('Taiwan') ? 'bg-lime-700 text-white' : 'bg-gray-200'}`}>
                        Taiwan🇹🇼</button>
                    <Button onClick={clearFilters}
                        className="submit-button h-10 text-center rounded-xl px-4 py-2 text-l drop-shadow-md transition-all bg-amber-500 hover:bg-amber-400">
                        <FilterAltOffIcon className="h-5 w-5 mr-2" />Clear Filter</Button>
                </div>
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredOshis.length > 0 ? (
                    filteredOshis.map(oshi => (
                        <LinkPic key={oshi.id} oshiId={oshi.id} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-600">No Results</p>
                )}
            </div>
        </div>
    );
};
export default ExploreGallery;