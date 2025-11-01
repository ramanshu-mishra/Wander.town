"use client"

import { userInterface } from "@repo/interface";
import { useEffect, useState } from "react"

export default function useGetUserDetails(){
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error|null>(null);
    const [data,setData] = useState<userInterface|null>(null);
    const url = process.env.NEXT_PUBLIC_AuthServer??"http://localhost:3000";


    async function getData(){
        setError(null);
        setLoading(true);
        setData(null);
        try{
        const res = await fetch(`${url}/userDetails`, {
            credentials: "include"
        });
        const data = await res.json();
        if(!res.ok){
            console.log(data.message);
            setError(new Error(data.message));
        }
        else{
            console.log(data);
            setData(data);
        }
    }
    catch(e){
        console.log("Error catched here");
        console.log((e as Error).message);
        setError(e as Error);
    }
    finally{
        setLoading(false);
    }
    }


    useEffect(()=>{
        getData();
    },[]);

    return {loading,error,data};
}