"use client"


import { useEffect, useState } from "react";
import Image from "next/image";

export default function OuterWrapper({children}: {children:React.ReactNode}){
    const [isOnline, setOnline]=  useState(true);


    useEffect(()=>{
    const handleOnline = ()=>setOnline(true);
    const handleOffline = ()=>setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    }, []);

    useEffect(()=>{
        console.log("online status: ", isOnline);
    }, [isOnline])


   return (
        <>
        {
        !isOnline && <div className="min-h-screen min-w-screen bg-neutral-200 flex flex-col">
            <div className="w-full">
                <div className="text-[2rem]  text-neutral-950 font-normal tracking-widest select-none">WANDER
                </div>
            </div>
            <div className="flex-1 flex justify-center items-center -translate-y-10">
            <Image src="/assets/offline.png" alt="offline" width={400} height={0}>
                </Image>

            </div>
                
        </div>
        }
        {isOnline && children}
        </>
    )
}