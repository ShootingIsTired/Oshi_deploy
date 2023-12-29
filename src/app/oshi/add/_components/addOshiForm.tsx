"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PeopleIcon from '@mui/icons-material/People';
import { addOshi, addTagToOshi } from "../../actions";
import Face4Icon from '@mui/icons-material/Face4';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { OshiInfo } from "@/lib/types";
import PublicIcon from '@mui/icons-material/Public';
import LinkIcon from '@mui/icons-material/Link';
import TagIcon from '@mui/icons-material/Tag';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";
export default function AddOshiForm() {
  const { data: session } = useSession();
    const userId = session?.user?.id;
    if (!userId || !session?.user) {
        redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}`);
    }
  const [oshiName, setOshiName] = useState<OshiInfo["name"]>("");
  const [oshiCountry, setOshiCountry] = useState<OshiInfo["country"]>("Japan");
  const [oshiIgUrl, setOshiIgUrl] = useState<OshiInfo["igUrl"]>("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");
  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag.toUpperCase())) {
      setTags(prevTags => [...prevTags, currentTag.toUpperCase()]);
       // Reset the input field after adding the tag
    }
    setCurrentTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!oshiName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    if (!oshiIgUrl.trim()) {
      toast({
        title: "Error",
        description: "Give us a link to see her!",
        variant: "destructive",
      });
      return;
    }
    if (oshiName.length > 30) {
      toast({
        title: "Error",
        description: "The name should not exceed 30 characters.",
        variant: "destructive",
      });
      return;
    }
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    if (oshiIgUrl && !urlPattern.test(oshiIgUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid Instagram URL.",
        variant: "destructive",
      });
      return;
    }
    if (tags.length > 10) {
      toast({
        title: "Limit Reached",
        description: "You can add up to 10 tags only.",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);
    console.log("oshiName", oshiName);
    console.log("oshiCountry", oshiCountry);
    console.log("oshiIgUrl", oshiIgUrl);
    try {
      // Adjusted to match the expected structure of oshiData
      const newOshi = await addOshi({
        name: oshiName,
        country: oshiCountry,
        igUrl: oshiIgUrl,
      });


      for (const tag of tags) {
        await addTagToOshi(newOshi.id, tag.toUpperCase());
      }
      // Redirect to the new oshi page (adjust the URL as needed)
      router.push(`/oshi/${newOshi.id}`);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }
    }

    setIsUploading(false);
    setOshiName("");
    setOshiCountry("Japan");
    setOshiIgUrl("");
    setTags([]);
  };
  return (
    <>
      <div className="flex min-h-screen w-full flex-col gap-4 p-10 overflow-auto">
        <div className="rules-section bg-amber-100 p-4 rounded-lg mb-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-red-800"><PeopleIcon className="mb-2 mr-1"/>  Community Guidelines</h2>
          <ul className="list-disc pl-5 text-gray-700 ml-2">
            <li>You can add any Oshi you like, but keep in mind that other users can report the content if they find it inappropriate.</li>
            <li>Ensure that the content you upload is respectful and does not violate any community standards.</li>
          </ul>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Label className="text-xl"><Face4Icon className="h-5 w-5 mr-2" /> Name</Label>

          <Input className="form-input h-10  bg-white"
            id="oshi-name" value={oshiName}
            onChange={(e) => setOshiName(e.target.value)} />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label className="text-xl"><PublicIcon className="h-5 w-5 mr-2" />Country</Label>
          <select
            className="form-input h-10 bg-white" // Use the same styling as other inputs
            id="oshi-country"
            value={oshiCountry}
            onChange={(e) => setOshiCountry(e.target.value)}
          >
            <option value="Japan">Japan 🇯🇵</option>
            <option value="Korea">Korea 🇰🇷</option>
            <option value="Mainland China">Mainland China 🇨🇳</option>
            <option value="Taiwan">Taiwan 🇹🇼</option>
          </select>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label className="text-xl"><LinkIcon className="h-5 w-5 mr-2" />Instagram URL</Label>
          <Input className="form-input h-10  bg-white" id="oshi-igUrl" value={oshiIgUrl ?? ""} onChange={(e) => setOshiIgUrl(e.target.value)} />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label className="text-xl"> <TagIcon className="h-5 w-5 mr-2" />Tags</Label>
          <div className="flex w-full items-center gap-2">
            <Input
              className="form-input h-10 bg-white" // Adjusted height
              maxLength={15}  // Limit the length of tag text
              id="oshi-tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
            />
            <Button
              className="submit-button h-10 text-center rounded-xl px-4 py-2 text-l drop-shadow-md transition-all bg-amber-500 hover:bg-amber-400" // Adjusted height to match Textarea
              onClick={handleAddTag}
              disabled={tags.length >= 10}
            >
              Add Tag
            </Button>
          </div>
        </div>

        <div className="tags-container flex flex-wrap gap-2"> {/* Flex and gap utilities for spacing */}
          {tags.map((tag, index) => (
            <div key={index} className="tag flex items-center bg-gray-300 rounded  px-1 py-0.5 m-1 text-sm">
              # {tag}
              <button onClick={() => handleRemoveTag(tag)} className="delete-tag ml-2">
                &#10005;
              </button>
            </div>
          ))}
        </div>
        <Button className="submit-button h-12 w-full text-center rounded-xl px-4 py-2 text-xl drop-shadow-md transition-all bg-amber-500 hover:bg-amber-400" onClick={handleCreate} disabled={isUploading}>
          {isUploading ? "Adding..." : "Add Oshi"}
        </Button>
      </div>
    </>
  );
}