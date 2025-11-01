import Button from "@/components/Button";
import { useGetUsername } from "@/hooks/useGetUsername";
import { useEffect } from "react";


export default function Navbar(){
    const username = useGetUsername();
    useEffect(()=>{
        console.log(username);
    },[username])
    return (
        <div className="flex justify-between">
            <div className="text-[4rem] text-neutral-950 font-normal tracking-widest select-none">WANDER </div>
            <div>
                <Button  variant="nav" className="flex items-center gap-2 tracking-wide"> <Plus></Plus> Create Space</Button>
            </div>
            <div></div>
        </div>
    )
}


 function Plus(){
    return (
        <svg className="w-5 translate-y-0.45" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3.497A8.5 8.5 0 0 0 3.497 12 8.5 8.5 0 0 0 12 20.503 8.5 8.5 0 0 0 20.503 12 8.5 8.5 0 0 0 12 3.497m4.937 9.463a.413.413 0 0 1-.411.411H13.37v3.155a.413.413 0 0 1-.411.411h-1.92a.413.413 0 0 1-.411-.411V13.37H7.474a.413.413 0 0 1-.411-.411v-1.92c0-.226.185-.411.411-.411h3.155V7.474c0-.226.185-.411.41-.411h1.92c.227 0 .412.185.412.411v3.155h3.155c.226 0 .411.185.411.41z"></path></svg>
    )
}