"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getComments, postComment } from "../../actions";
import type { Comment } from "@/lib/types"; 
import SmsIcon from '@mui/icons-material/Sms';
type Props = {
    params: { oshiId: string };
};

export default function AddCommentForm(props: Props) {
    const oshiId = props.params.oshiId;
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                let fetchedComments = await getComments(oshiId);
                fetchedComments = fetchedComments.sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                const transformedComments = fetchedComments.map(comment => ({
                    ...comment,
                    id: comment.id.toString() // Transform id to string
                }));
                setComments(transformedComments);
            } catch (error) {
                console.error('Error fetching comments:', error);
                toast({ title: "Error", description: "Failed to load comments.", variant: "destructive" });
            }
        };
        fetchComments();
    }, [oshiId, toast]);


    const handleAddComment = async () => {
        if (!session || !session.user) {
            console.log("User not logged in");
            return;
        }
        if (newComment.trim()) {
            try {
                await postComment(session.user.id, oshiId, newComment);

                let fetchedComments = await getComments(oshiId);
                fetchedComments = fetchedComments.sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                const transformedComments = fetchedComments.map(comment => ({
                    ...comment,
                    id: comment.id.toString() // Transform id to string
                }));

                setComments(transformedComments);
                setNewComment('');
            } catch (error) {
                toast({ title: "Error", description: "Failed to post comment.", variant: "destructive" });
            }
        }
    };
    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        // Adjust the format as per your requirements
    };

    return (
        <>
            <div className="flex w-full flex-col">
                <div className="comments-container flex flex-col gap-1 overflow-auto flex-grow overflow-auto max-h-[140px]">
                    {comments.map((comment, index) => (
                        <div key={index} className="comment bg-gray-100 rounded px-1 py-0.5 m-1 text-sm flex justify-between">
                            <span><SmsIcon className="h-4 w-4" /> {comment.comment}</span>
                            <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                        </div>
                    ))}
                </div>
                <div className="flex w-full items-center gap-2 p-1 pt-2">
                    <Input
                        className="form-input h-10"
                        id="oshi-comments"
                        value={newComment}
                        placeholder="Write a comment..."
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                        className="submit-button h-10 text-center rounded-xl px-4 py-2 text-l drop-shadow-md transition-all bg-amber-500 hover:bg-amber-400"
                        onClick={handleAddComment}
                    >
                        Comment
                    </Button>
                </div>
            </div>
        </>
    );
}
