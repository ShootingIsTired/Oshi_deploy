// src/app/oshi/explore/page.tsx
import React from 'react';
import ExploreGallery from './_components/exploreGallery';

const ExplorePage = () => {
  // This component now simply maps over the oshis and renders the LinkPic component for each
  return (
    <div className="w-full h-full bg-gray-100 overflow-auto">
      <ExploreGallery />
    </div>
  );
};

export default ExplorePage;
