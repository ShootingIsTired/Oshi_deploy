import { getMostKeepedOshiByCountry } from "./actions";
import React from 'react';
import LinkPic from './_components/linkPic';

type Oshi = {
  id: string;
  name: string;
  keepCount: number;
};

type RenderOshiProps = {
  countryFlag: string;
  oshi: Oshi | null;
};

export default async function HomePage() {
  //Japan
  const mostKeepedOshiInJapan = await getMostKeepedOshiByCountry("Japan");

  //Korea
  const mostKeepedOshiInKorea = await getMostKeepedOshiByCountry("Korea");

  //Taiwan
  const mostKeepedOshiInTaiwan = await getMostKeepedOshiByCountry("Taiwan");

  //China
  const mostKeepedOshiInChina = await getMostKeepedOshiByCountry("Mainland China");

  // Function to render each country's oshi
const renderOshi = ({ countryFlag, oshi }: RenderOshiProps) => (
  <div className="relative">
    {oshi && (
      <>
        <div className="flex flex-col items-center mb-4">
          <LinkPic oshiId={oshi.id} /> {/* Pass the oshiId directly */}
          <div className="mt-2 text-lg font-bold">
            <span className="text-3xl font-bold">{countryFlag}</span>
          </div>
        </div>
      </>
    )}
  </div>
);
  
  return (
    <main className="h-full w-full bg-no-repeat bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
      <div className="grid grid-cols-3 grid-rows-3 h-full items-center justify-items-center">
        {/* Korea at the top middle */}
        <div className="row-start-1 col-start-2">
          {renderOshi({ countryFlag: "🇰🇷", oshi: mostKeepedOshiInKorea})}
        </div>
  
        {/* China on the left middle */}
        <div className="row-start-2 col-start-1">
          {renderOshi({ countryFlag: "🇨🇳", oshi: mostKeepedOshiInChina})}
        </div>
  
        {/* Japan on the right middle */}
        <div className="row-start-2 col-start-3">
          {renderOshi({ countryFlag: "🇯🇵", oshi: mostKeepedOshiInJapan})}
        </div>
  
        {/* Taiwan at the bottom middle */}
        <div className="row-start-3 col-start-2">
          {renderOshi({ countryFlag: "🇹🇼", oshi: mostKeepedOshiInTaiwan})}
        </div>
  
      </div>
    </main>
  );  
}

