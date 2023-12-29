import React from 'react';
import CountryRanking from './_components/countryRanking';

export default function RankingPage(){
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

