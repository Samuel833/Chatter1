"use client"

import React from "react"
import ShowAllPosts from "../components/Posts/Posts"
import Header from "../components/Header"



export default function getAllPosts() {

    return (
        <>
            <Header />
            <div className="bg-neutral-100 h-full">
                <div className="flex justify-center p-3">
                    <h1 className="text-xl">All Posts</h1>
                </div>
                <ShowAllPosts />
            </div>
        </>
    )
}