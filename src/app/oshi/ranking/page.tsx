import {getOshiRankingByCountry, getMostLikedOshiPicture } from  "../actions";
import React from 'react';
import KeepButton from '../_components/keepButton';
import Link from 'next/link';
import LinkPic from '../_components/linkPic';
import CountryRanking from './_components/countryRanking';

const RankingPage = () => {
  return (
    <main className="h-full w-full overflow-auto bg-gray-100">
      <div className="p-10 space-y-10">
        <CountryRanking country="Japan" />
        <CountryRanking country="Korea" />
        <CountryRanking country="Taiwan" />
        <CountryRanking country="Mainland China" />
      </div>
    </main>
  );
};

export default RankingPage;
