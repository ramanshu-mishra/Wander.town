"use client"

import { userInterface } from "@/interface";
import { useState } from "react"

export default function useGetUserDetails(){
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error|null>(null);
    const [data,setData] = useState<userInterface|null>(null);

    async function getData(){
        
    }
}