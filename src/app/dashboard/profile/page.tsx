"use client";

import { useSession, signOut } from "next-auth/react";
import React from "react";
import { useRouter } from "next/navigation";
import UserPanel from "../../components/common/UserPanel";
import Header from "../../components/Header"
import Footer from "../../components/Footer"

function ProfilePage() {

  const { data: session, status } = useSession();

  const router = useRouter();
  console.log(session, status);
  const logout =  () => {
    signOut();
    router.push("/login");
    
  };

  return (
    <>
      <Header />
        <div className="justify-center h-[calc(100vh-4rem)] flex flex-col items-center gap-y-5">
            <h1 className="font-bold text-3xl text-black">Profile</h1>

            <UserPanel />


            <button className="bg-zinc-800 px-4 py-2 block mb-2"
            onClick={logout}
            >
             Logout
            </button>
        </div>
      <Footer />
    </>
  );
}

export default ProfilePage;



