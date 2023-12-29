import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image"; // Import the Image component
import { getKeepsByUser } from "../actions";
import ReportIcon from '@mui/icons-material/Report';
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import SignOutButton from "./SignOutButton";
import HomeIcon from '@mui/icons-material/Home';
import Face4Icon from '@mui/icons-material/Face4';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

export default async function Navbar() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || !session?.user) {
    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}`);
  }
  const projects = await getKeepsByUser(userId);
  return (
    <nav className="flex min-w-fit flex-col justify-between gap-2 overflow-hidden" style={{ backgroundColor: '#F3E1C1' }}>
      <div className="flex h-40 w-full flex-row items-center gap-5 px-3 py-2 pt-4 p-2">
        <Image
          src="/oshibanner.png" // Path to your image
          alt="Banner" // Alternative text for the image
          width={300} // Set the width as needed
          height={40} // Set the height as needed
        />
      </div>
      <div className="flex flex-col w-full justify-between px-3 py-2 gap-2">
        <Link
          className="flex items-center justify-center w-full text-center rounded-xl bg-gray-50 px-4 py-2 text-lg drop-shadow-md transition-all hover:bg-gray-200"
          href="/oshi"
        >
          <HomeIcon className="h-5 w-5 mr-2" /> {/* Adjust margin as needed */}
          Home
        </Link>

        <Link
          className="flex items-center justify-center w-full text-center rounded-xl bg-gray-50 px-4 py-2 text-lg drop-shadow-md transition-all hover:bg-gray-200"
          href="/oshi/myOshi"
        >
          <Face4Icon className="h-5 w-5 mr-2" /> {/* Adjust margin as needed */}
          My Oshi
        </Link>

        <Link
          className="flex items-center justify-center w-full text-center rounded-xl bg-gray-50 px-4 py-2 text-lg drop-shadow-md transition-all hover:bg-gray-200"
          href="/oshi/myPic">
          <InsertPhotoIcon className="h-5 w-5 mr-2" />
          My Picture
        </Link>

        <Link
          className="flex items-center justify-center w-full text-center rounded-xl bg-gray-50 px-4 py-2 text-lg drop-shadow-md transition-all hover:bg-gray-200"
          href="/oshi/ranking">
          <EmojiEventsIcon className="h-5 w-5 mr-2" />
          Ranking
        </Link>

        <Link
          className="flex items-center justify-center w-full text-center rounded-xl bg-gray-50 px-4 py-2 text-lg drop-shadow-md transition-all hover:bg-gray-200"
          href="/oshi/explore">
          <SearchIcon className="h-5 w-5 mr-2" /> 
          Explore
        </Link>

        <Link
          className="w-full text-center rounded-xl bg-gray-50 px-4 py-2 text-lg drop-shadow-md transition-all hover:bg-gray-200"
          href="/oshi/add">
          <AddIcon className="h-5 w-5 mr-2" /> 
          Add
        </Link>
        
        <Link
          className="w-full text-center rounded-xl bg-gray-50 px-4 py-2 text-lg drop-shadow-md transition-all hover:bg-gray-200"
          href="/oshi/statistics">
          <LeaderboardIcon className="h-5 w-5 mr-2" /> 
          Statistics
        </Link>

        <Link
          className="w-full text-center rounded-xl bg-gray-50 px-4 py-2 text-lg drop-shadow-md transition-all hover:bg-gray-200"
          href="/oshi/report">
          <ReportIcon className="h-5 w-5 mr-2" /> 
          Report
        </Link>

      </div>
      <div className="flex w-full items-center justify-between gap-8 px-4 py-2">
        <div className="flex items-center gap-2">
          <Image
            src="/profile.png" // Path to your profile image
            alt="Profile" // Alternative text for the image
            width={50} // Set the width as needed (32px for example)
            height={50} // Set the height as needed (32px for example)
            className="rounded-full" // To make the image round
          />
          <span className="text-md font-semibold">
            {
              // @ts-ignore
              session.user.name
            }
          </span>
        </div>
        <SignOutButton />
      </div>
    </nav>
  );
}
