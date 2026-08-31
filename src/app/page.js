"use client";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";
import LawBackground from "@/components/LawBg";
import useAuth from "@/hooks/useAuth";
import Loader from "@/templates/loader/Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoLaw } from "react-icons/go";

export default function Home() {

  const { user, loading} = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="relative col-span-12 lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-hidden lg:min-h-screen">
        <LawBackground />
        
        <div className="flex items-center gap-2 z-10 justify-center lg:justify-start">
          <GoLaw className="text-3xl text-white" />
          <h2 className="text-2xl text-white font-serif font-bold">LexFlow</h2>
        </div>

        <div className="hidden lg:flex gap-2 flex-col items-end text-right z-10">
          <h2 className="text-2xl text-white font-serif font-bold">
            Securely manage cases, <br /> payments and financial operations.
          </h2>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-6 bg-white min-h-[calc(100vh-80px)] lg:min-h-screen p-6 sm:p-8 flex items-center justify-center">
        {isSignUp ? (
          <SignUp onSwitchToSignIn={() => setIsSignUp(false)} />
        ) : (
          <SignIn onSwitchToSignUp={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  );
}