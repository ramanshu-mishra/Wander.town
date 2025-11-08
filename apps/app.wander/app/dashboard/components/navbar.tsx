"use client"
import Button from "@/components/Button";
import { useUserDetails, useUserProfile } from "@/store";

import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";


export default function Navbar({className}:{className:string}){
    
    const {setActive, active}  = useUserProfile();
    const router = useRouter();
    const {userDetails} = useUserDetails();
    const {data,loading,error,fetchData,reset}  = useFetchData();


    async function handleLogOut(){
        
        if(loading)return;
        const url = process.env.NEXT_AUTH_AuthServer ?? "http://localhost:3000";
        try{
        const res = await fetchData(`${url}/logOut`,{
            credentials: "include"
        });
        const success = res.success;
        console.log(success);
        if(success){
            router.push("/login");
        }
    }
    finally{
        reset();
    }
 }

    return (
        <>
        <div className={cn("select-none ", className)}>
        <div className="flex justify-between  items-center  ">
            <div className="text-[2rem]  text-neutral-950 font-normal tracking-widest select-none">WANDER</div>
            <div className="flex gap-4 items-center">
                <Button onClick={() => router.push("/dashboard/create-space")} variant="nav" className="flex h-fit items-center gap-2 tracking-wide"> <Plus></Plus> Create Space</Button>
                <div className="flex rounded-full justify-center items-center bg-blue-400 h-12 w-12 cursor-pointer mx-2" 
                onClick={()=>{
                        setActive(!active);
                }}
                >
                    {userDetails? userDetails.image ? <img src={userDetails.image} alt = "user" className="flex rounded-full justify-center items-center h-12 w-12"></img> : userDetails.username[0].toUpperCase() : 'W'}
                </div>
            </div>
            
        </div>
        </div>
        {active && <div className="fixed top-20 right-10 z-[99999] bg-neutral-100 w-80 min-h-50 rounded-lg shadow-lg will-change-auto pointer-events-auto select-none py-2 px-4">
                <div className="flex gap-4  py-2">
                    <div className="flex rounded-full justify-center items-center bg-blue-400 h-15 w-15 cursor-pointer  text-2xl" 
                >
                    {userDetails? userDetails.image ? <img src={userDetails.image} alt = "user" className="flex rounded-full justify-center items-center h-12 w-12"></img> : userDetails.username[0].toUpperCase() : 'W'}
                </div>
                    <div className="flex gap-1 font-semibold text-lg">{userDetails?.name.split(" ").map((n,idx)=>{
                        const newWord = n[0].toUpperCase() + n.slice(1);
                        return(
                            <span key={idx}>{newWord}</span>
                        )
                    })}</div>
                </div>

                <div className="flex flex-col gap-2 px-2">
                    <ProfileButtons text="SignOut" onClick={()=>{
                        handleLogOut();
                    }}></ProfileButtons>
                </div>
        </div>}
        </>
    )
}


 function Plus(){
    return (
        <svg className="w-5 translate-y-0.45" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3.497A8.5 8.5 0 0 0 3.497 12 8.5 8.5 0 0 0 12 20.503 8.5 8.5 0 0 0 20.503 12 8.5 8.5 0 0 0 12 3.497m4.937 9.463a.413.413 0 0 1-.411.411H13.37v3.155a.413.413 0 0 1-.411.411h-1.92a.413.413 0 0 1-.411-.411V13.37H7.474a.413.413 0 0 1-.411-.411v-1.92c0-.226.185-.411.411-.411h3.155V7.474c0-.226.185-.411.41-.411h1.92c.227 0 .412.185.412.411v3.155h3.155c.226 0 .411.185.411.41z"></path></svg>
    )
}

function ProfileButtons({icon, onClick, className, text}:{icon?: React.ReactNode, onClick?:()=>void, className?: string, text:string}){
    return (
        <div className={cn("hover:bg-neutral-300 py-2 px-2 rounded-xl", className)} onClick={onClick}>
            {icon} {text}
        </div>
    )
}