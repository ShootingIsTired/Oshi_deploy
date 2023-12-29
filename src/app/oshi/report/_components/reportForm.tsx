"use client"
import React, { useState, FormEvent } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from 'next-auth/react';
import EmailIcon from '@mui/icons-material/Email';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ReportIcon from '@mui/icons-material/Report';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
function ReportForm() {
    const { data: session } = useSession();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const isValidEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!email.trim()) {
            toast.toast({
                title: "Error",
                description: "Email cannot be empty.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }
        if (!isValidEmail(email)) {
            toast.toast({
                title: "Error",
                description: "Please enter a valid email address.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }
        if (!message.trim()) {
            toast.toast({
                title: "Error",
                description: "Report message cannot be empty.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }
        const fullMessage = session?.user?.id ? `User ID: ${session.user.id}\n\n${message}` : message;
        try {
            const response = await fetch('/api/sendEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, message: fullMessage }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send');
            }

            // Show success toast
            toast.toast({ title: "Success", description: "Report sent successfully", variant: "positive" });
            setEmail('');
            setMessage('');
        } catch (error) {
            if (error instanceof Error) {
                // Show error toast with the error message
                toast.toast({ title: "Error", description: error.message, variant: "destructive" });
            } else {
                // Show a generic error toast
                toast.toast({ title: "Error", description: "Something went wrong. Please try again later.", variant: "destructive" });
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="flex min-h-screen w-full flex-col gap-4 p-10 overflow-auto">
            <div className="rules-section bg-amber-100 p-4 rounded-lg mb-4 shadow-md">
                <h2 className="text-xl font-semibold mb-2 text-red-800"><ReportIcon className="mb-2 mr-1"/> Report Submission Guidelines</h2>
                <ul className="list-disc pl-5 text-gray-700 ml-2">
                    <li>Clearly describe the issue, providing specific details like Oshi names, picture descriptions, or links.</li>
                    <li>Our team reviews each report and may reach out for further information via email.</li>
                    <li>Your privacy is respected; reports are confidential and identities are not disclosed without consent.</li>
                </ul>
                <p className="mt-4 ml-2"><VolunteerActivismIcon className="h-4 w-4 mb-1 mr-1"/>Your input is vital for our community's integrity and safety. Thank you for your support.</p>
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label className="text-xl"><EmailIcon className="h-5 w-5 mr-2" />Your Email</Label>

                <Input className="form-input h-10 bg-white"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label className="text-xl"><SummarizeIcon className="h-5 w-5 mr-2" />Report Message</Label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="form-input h-40"
                />
            </div>
            <Button className="submit-button h-12 w-full text-center rounded-xl px-4 py-2 text-xl drop-shadow-md transition-all bg-amber-500 hover:bg-amber-400" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Report'}
            </Button>

        </div>
    );
}

export default ReportForm;
