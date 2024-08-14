"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useRouter } from "next/navigation";
import React from "react";
import landPic from "../../public/landing.jpg";
import { useSession } from "next-auth/react";

export default function Home() {
  // const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <>
      <div className="" data-testid="result">
        <Header />
        <main className="flex justify-center items-center px-6 lg:px-8 min-h-[470px]">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-blue-900 sm:text-6xl">
                Welcome to Chatter!
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                A place to read, write, and widen your understanding <br />
                To get started click on the button below
              </p>
              {!session ? (
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    href="/register"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </Link>
                </div>
              ) : (
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    href="/allposts"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="max-md:hidden">
            <Image
              src={landPic}
              alt="landing picture"
              width={500}
              height={500}
            />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
