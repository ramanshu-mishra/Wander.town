"use client"
import { useIsAuthenticated } from "@/hooks/isAuthenticated"
import { useRouter } from "next/navigation";
import { useEffect } from "react"

export default function Page({children}: { children: React.ReactNode }) {

    const router = useRouter();

    async function logOut(){
       const res =  await fetch(`${process.env.NEXT_PUBLILC_AuthServer}/logout`);
       const data = await res.json();
       if(!res.ok){
        router.push("/login");
       }
    }

    const {data,error} = useIsAuthenticated();

    
    
    useEffect(()=>{
        if(data){
            router.push("/dashboard");
        }
    },[data]);

    useEffect(()=>{
        if(error){
            logOut();
        }
    },[error]);
    
    return (
        <>
        {children}
        </>
    )
}