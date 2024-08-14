"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

function UserPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <>
      {status === "loading" && <div>Loading...</div>}
      {session ? (
        <div>
          <h1 className="text-black">{session.user?.name}</h1>
          <h2 className="text-black">{session.user?.email}</h2>
          <Image src={session.user?.image || "../../../../public/default.png"} alt="profile picture" />
          {/* <button onClick={() => router.push("/dashboard/profile")}>Profile</button> */}
        </div>
      ) : (
        <div>
          <h1 className="text-black">Not logged in</h1>
          <button className="text-black" onClick={() => router.push("/login")}>
            Login
          </button>
        </div>
      )}
    </>
  );
}

export default UserPanel;
