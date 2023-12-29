"use client";

import { useState, useEffect } from "react";
import { addTagToOshi } from "../../actions";
import TagIcon from '@mui/icons-material/Tag';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getTagsByOshi, removeTagsFromOshi } from "../../actions";
type Props = {
    params: { oshiId: string };
};

export default function AddTagForm(props: Props) {
    const oshiId = props.params.oshiId;
    const [oldTags, setOldTags] = useState<string[]>([]);
    const [newTags, setNewTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState<string>("");
    const { toast } = useToast();
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tags = await getTagsByOshi(oshiId);
                setOldTags(tags);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, [oshiId]);

    const handleAddTag = async () => {
        if ([...oldTags, ...newTags].length >= 10) {
            toast({ title: "Limit Reached",
            description: "Up to 10 tags only.",
            variant: "destructive", });
            return;
        }
        if (currentTag && !oldTags.includes(currentTag.toUpperCase()) && !newTags.includes(currentTag)) {
            try {
                await addTagToOshi(oshiId, currentTag.toUpperCase());
                setNewTags(prevTags => [...prevTags, currentTag.toUpperCase()]);
            } catch (error) {
                toast({ title: "Error", description: "Failed to add tag.", variant: "destructive" });
            }
        }
        setCurrentTag("");
    };

    const handleRemoveNewTag = async (tag: string) => {
        try {
            await removeTagsFromOshi(oshiId, tag);
            setNewTags(newTags.filter(t => t !== tag));
        } catch (error) {
            toast({ title: "Error", description: "Failed to remove tag.", variant: "destructive" });
        }
    };


    return (
        <>
            <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-center gap-3 p-2">
                    <Label className="text-4xl w-auto">
                        <TagIcon className="h-8 w-8" /> {/* Adjust size as needed */}
                    </Label>
                    <Input
                        className="form-input h-10" // Adjusted height
                        id="oshi-tags"
                        value={currentTag}
                        maxLength={15}  // Limit the length of tag text
                        placeholder="Careful! Tags cannot be deleted once you leave this page."
                        onChange={(e) => setCurrentTag(e.target.value)}
                    />
                    <Button
                        className="submit-button h-10 text-center rounded-xl px-4 py-2 text-l drop-shadow-md transition-all bg-amber-500 hover:bg-amber-400" // Adjusted height to match Textarea
                        onClick={handleAddTag}
                    >
                        Add Tag
                    </Button>
                </div>
                <div className="tags-container flex flex-wrap gap-1">
                    {[...oldTags, ...newTags].map((tag, index) => (
                        <div key={index} className="tag flex items-center bg-gray-300 rounded  px-1 py-0.5 m-1 text-sm">
                            # {tag}
                            {newTags.includes(tag) && (
                                <button onClick={() => handleRemoveNewTag(tag)} className="delete-tag ml-2">
                                    &#10005;
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>


        </>
    )
}