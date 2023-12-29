import { redirect } from "next/navigation";
import { getOshi } from "../actions";
import { Separator } from "@/components/ui/separator";
import { getTagsByOshi, getMostLikedOshiPicture } from "../actions";
import AddTagForm from "./_components/addTagForm";
import AddPicForm from "../_components/addPicForm";
import KeepButton from "../_components/keepButton";
import InstagramIcon from '@mui/icons-material/Instagram';
import AddCommentForm from "./_components/addCommentForm";
import KeepCount from "./_components/keepCount";
import Image from "next/image";

type Props = {
    params: { oshiId: string };
};
type CountryFlags = {
    [key: string]: string;
};

const countryFlags: CountryFlags = {
    "Japan": "🇯🇵",
    "Korea": "🇰🇷",
    "Taiwan": "🇹🇼",
    "Mainland China": "🇨🇳",
    "": "🌏",
};

export default async function OshiPage(props: Props) {
    const oshi = await getOshi(props.params.oshiId);
    const tags = await getTagsByOshi(props.params.oshiId);
    const mostLikedPicture = await getMostLikedOshiPicture(props.params.oshiId);
    // const pictures = await getOshiPicturesSortedByLikes(props.params.oshiId);
    if (!oshi) {
        redirect("/oshi");
    }

    const flagEmoji = oshi && oshi.country ? countryFlags[oshi.country] || "🌏" : "🌏";
    const profileImageUrl = mostLikedPicture ? mostLikedPicture.imageUrl : "/defaultProfile.png";

    return (
        <div className="flex flex-col min-h-screen w-full overflow-auto">
            <div className="flex flex-grow flex-col overflow-auto">
                <div className="flex w-full flex-row gap-4 p-2">
                    {/* Left side container */}
                    <div className="flex flex-grow flex-col gap-2 p-8 pt-12">
                        <div className="flex w-full h-full flex-row gap-2">
                            <h1 className="text-8xl">{oshi.name}</h1>
                        </div>

                        <div className="flex w-full flex-row items-center gap-4">
                            <h2 className="text-5xl">{flagEmoji}</h2>
                            <a href={oshi.igUrl ?? ""} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover">
                                <InstagramIcon className="h-9 w-9" /> {/* Adjust size as needed */}
                            </a>
                            <KeepCount params={{ oshiId: oshi.id }}/>
                        </div>
                    </div>
                    {/* Profile image container */}
                    <div className="flex flex-shrink-0 justify-end items-center p-4 mr-10">
                        <Image
                            src={profileImageUrl || "/defaultProfile.png"}
                            width={500} 
                            height={500} 
                            alt={oshi.name}
                            className="h-44 w-44 object-cover rounded-xl shadow-xl"
                        />
                    </div>
                </div>
                <Separator className="gap-1" />
                <div className="flex flex-col flex-grow px-4 md:px-12 overflow-auto pt-2">
                    <AddTagForm params={props.params} />
                    <div className="flex w-full">
                        <AddPicForm params={{ oshiId: oshi.id }} className="w-full" />
                    </div>

                </div>
            </div>
            <div className="px-4 md:px-12 py-2">
                <AddCommentForm params={{ oshiId: oshi.id }} />
            </div>
            <div className="px-4 md:px-12 py-2">
            </div>
        </div>
    );
}

