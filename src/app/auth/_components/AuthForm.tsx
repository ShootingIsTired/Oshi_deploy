"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import Image from "next/image";

// Run: npx shadcn-ui@latest add button
import { Button } from "@/components/ui/button";
// Run: npx shadcn-ui@latest add card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicEnv } from "@/lib/env/public";

import AuthInput from "./AuthInput";

function AuthForm() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 3. sign in by calling signIn() with the correct parameters
    // hint: notion clone
    await signIn("credentials", {
      email,
      name,
      password,
      callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/oshi`,
    });

    // TODO: 3. end
  };
  return (
    <Card className="min-w-[100px]">
      <CardHeader>
        <CardTitle>Sign {isSignUp ? "Up" : "In"}</CardTitle>
      </CardHeader>
      <CardContent className="items-center flex flex-col gap-1 ml-6 mr-6">

        <Image
          src="/logo.png"
          alt="Banner"
          width={200}
          height={20}
          style={{
            animation: 'rotate 10s linear infinite',
            justifyContent: 'center',
            padding: '1px'
          }}
        />

        <Image
          src="/oshiWord.png"
          alt="Banner"
          width={200}
          height={10}
        />

        <Button
          onClick={async () => {
            signIn("github", {
              callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/oshi`,
            });
          }}
          className="flex w-full mt-4"
          variant={"outline"}
        >
          <Image src="/github.png" alt="github icon" width={20} height={20} />
          <span className="grow ml-10 mr-10">Sign In with Github</span>
        </Button>
        <Button
          onClick={async () => {
            signIn("google", {
              callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/oshi`,
            });
          }}
          className="flex w-full mt-2"
          variant={"outline"}
        >
          <Image src="/google.png" alt="google icon" width={20} height={20} />
          <span className="grow">Sign In with Google</span>
        </Button>
      </CardContent>
    </Card>
  );
}

export default AuthForm;
