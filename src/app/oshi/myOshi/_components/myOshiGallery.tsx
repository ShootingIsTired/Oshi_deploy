"use client";
import React, {useState, useEffect} from 'react'
import { useSession } from "next-auth/react";
import { getKeepsByUser, removeKeepOshi, countKeeps, getMostLikedOshiPicture } from "../../actions";
import KeepButton from '../../_components/keepButton';
import Link from 'next/link';
import Image from 'next/image';

type KeptOshi = {
  picUrl: string | null | undefined;
  keepCount: number;
  id: string;
  name: string;
  country: string;
  igUrl: string;
}

export default function MyOshiGallery(){
  const {data:session} = useSession();
  const [keptOshis, setKeptOshi] = useState<KeptOshi[]>([]);
  const handleUnkeep = async (oshiId: string)=>{
    if(!session||!session.user){
      console.log("User not logged in");
      return;
    }
    const unkeepOshiData = keptOshis.find(oshi =>oshi.id == oshiId);
    setKeptOshi(prevOshis => prevOshis.filter(oshi => oshi.id !== oshiId));

    try{
      await removeKeepOshi(session.user.id, oshiId);
    }catch(error){
      if(unkeepOshiData){
        setKeptOshi(prevOshis => [...prevOshis, unkeepOshiData]);
      }
      console.error('Error unliking', error);
    }
  };
  useEffect(()=>{
    async function fetchKeptOshis(){
      if(session&& session.user){
        const oshis = await getKeepsByUser(session.user.id);
        const oshisWithKeepCounts = await Promise.all(oshis.map(async oshi =>{
          const keepCount = await countKeeps(oshi.id);
          const mostLikedPicture = await getMostLikedOshiPicture(oshi.id)
          const picUrl = mostLikedPicture?.imageUrl??"/defaultProfile.png";
          return {...oshi, picUrl ,keepCount};
        }));
        setKeptOshi(oshisWithKeepCounts);
      }
    }
    fetchKeptOshis();
  },[session]);

  return(
    <>
      <div className="p-10">
        <h1 className="text-xl font-bold mb-4">My Oshi</h1>
        <div className="grid grid-cols-3 gap-5 
        // overflow-y
        //  max-h-[800px]
        "
         >
          {keptOshis.map((oshi,index)=>(
              <div key={index} className="relative">
                <Link href={`/oshi/${oshi.id}`} passHref>
                  <Image className="w-full h-full object-cover" width={500} height={500} src={oshi.picUrl??"/defaultProfile.png"} alt={`Kept Oshi ${index}`}></Image>
                </Link>
                <div className="absolute bottom-0 left-0 right-0 bg-white p-1 flex justify-between items-center">
                  <KeepButton oshiId={oshi.id} onKeep={()=>handleUnkeep(oshi.id)}/>
                  <span className="text-black">{oshi.keepCount}</span>
                  <span className="pr-2 text-right flex-grow">{oshi.name}</span> {/* This will push the name to the right */}
                </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}