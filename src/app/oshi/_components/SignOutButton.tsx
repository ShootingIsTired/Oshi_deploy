"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { publicEnv } from "@/lib/env/public";
import LogoutIcon from '@mui/icons-material/Logout';

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/auth` });
  };

  return (
    <Button
      data-testid="sign-out-button"
      variant={"outline"}
      onClick={handleSignOut}
      className="bg-white"
    >
      <LogoutIcon className="h-5 w-5 mr-2" />
      Sign Out
    </Button>
  );
}

