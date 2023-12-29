import {getOshiRankingByCountry, getMostLikedOshiPicture } from  "../actions";
import React from 'react';
import KeepButton from '../_components/keepButton';
import Link from 'next/link';
import LinkPic from '../_components/linkPic';
import ReportForm from '../report/_components/reportForm';

const RankingPage = () => {
  return (
    <main className="h-full w-full overflow-auto bg-gray-100">
        <ReportForm />
    </main>
  );
};

export default RankingPage;