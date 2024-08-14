// Code for getting a single post from the database

import React, { useState } from "react";
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";

export default async function GetSinglePost({title}: {title: any}): Promise<JSX.Element> {
    const response = await axios.get(`/api/getsinglepost/${title}`); // Adjust to pass the correct title or id
    // return response.data;

    if (response.status !== 200) {
        throw new Error(response.statusText);
    }
    return (
        <div>
            <h1>Single Post</h1>
            <div>
                <h2>Title: {response.data.title}</h2>
                <p>Content: {response.data.content}</p>
                <p>Author: {response.data.author}</p>
            </div>
        </div>
    )

}


