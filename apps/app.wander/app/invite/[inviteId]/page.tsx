"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFetchData } from "@/hooks/useFetchData";
import { previewInterface } from "@repo/interface";
import { FetchError } from "@repo/utils/FetchError";
import { toast, ToastContainer } from "react-toastify";
import ErrorToast from "@/components/ErrorToast";
import { cn } from "@/utils/cn";
import {motion} from "motion/react";
import Skeleton from "@/components/skeletons/inviteSkeleton";
import InvitePreview from "@/components/invitePreview";
import Sorry from "@/public/assets/Sorry.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {Repeat2Icon, RotateCcw} from "lucide-react"







export default function Page(){
    const inviteId = useParams().inviteId;
    const {loading, data, reset, fetchData} = useFetchData();
    const [_data,setData] = useState<previewInterface|null>(null);
    const [error,setError] = useState<Error|null>(null);
    const [retry , setRetry] = useState(true);
    const router = useRouter();

    async function getSpacePreview(){
        
        try{
        const preview = await fetchData(`${process.env.NEXT_PUBLIC_AuthServer}/spacePreview/${inviteId}`,{credentials: "include"});
        setData(preview);
        console.log(preview);   
        }
        catch(e){
            if(e instanceof FetchError){
                toast(<ErrorToast message={e.json}></ErrorToast>);
            }
            else if(e instanceof Error){
                toast(<ErrorToast message={e.message}></ErrorToast>);
            }
            else{   
                toast(<ErrorToast></ErrorToast>)
            }
            setError(e as Error);
        }
        finally{
            reset();
        }
    }

    useEffect(()=>{
        console.log(inviteId);
    },[]);

    useEffect(()=>{
        getSpacePreview();
    },[]);

    useEffect(()=>{
        if(error instanceof FetchError && error.json == "invalid_token"){
            setRetry(false);
            toast(<ErrorToast message="Invalid Invite Link"></ErrorToast>)
        }
    },[error])  



    return (
        <div className="min-h-screen flex items-center">
            <div className="h-screen w-[30%] bg-neutral-100 flex flex-col select-none">
                <div className="text-[2.5rem] justify-center flex font-normal tracking-widest m-2">WANDER </div>
                <div className="flex-1 flex flex-col items-center justify-center -translate-y-10">
                     <div>
                        You've been Invited to a
                     </div>
                     <div className="flex flex-col items-center">
                        <SeperatedText className="text-2xl" text={"WANDER-SPACE"}></SeperatedText>
                        <motion.svg width="" height="20" viewBox="0 0 538 47" fill="none" xmlns="http://www.w3.org/2000/svg">
<motion.path d="M491.019 39.4344C489.963 37.0424 482.539 34.3784 468.559 29.1944C462.647 27.0021 453.339 24.5544 424.159 19.4984C394.979 14.4424 346.139 7.0504 304.743 3.50639C263.347 -0.0376093 230.875 0.490383 196.723 3.13838C162.571 5.78638 127.723 10.5384 105.151 14.3064C82.5793 18.0744 73.3393 20.7144 66.2033 23.6584C59.0673 26.6024 54.3153 29.7704 51.6033 32.0624C48.8913 34.3544 48.3633 35.6744 120.559 36.7504C192.755 37.8264 337.691 38.6184 418.691 39.9504C499.691 41.2824 512.363 43.1304 519.815 44.0824C527.267 45.0344 529.115 45.0344 528.879 45.0344C526.267 45.0344 520.387 43.9784 504.363 40.6624C491.836 38.0699 470.123 34.9704 385.711 29.9024C301.299 24.8344 154.779 18.2344 78.6393 15.0984C2.49929 11.9624 1.1793 12.4904 1.0273 12.7624C0.566775 13.5865 5.65931 13.8264 47.2793 14.1024C86.2619 14.3609 161.499 11.7384 229.959 11.9744C298.419 12.2104 357.819 14.5864 398.979 17.1304C440.139 19.6744 461.259 22.3144 475.175 23.6744C495.115 25.623 502.739 25.8264 509.359 27.9504C523.531 32.4975 535.267 33.0344 536.483 33.0344C537.115 33.0344 532.683 33.0344 523.527 31.4504C514.371 29.8664 499.323 26.6984 417.255 21.7664C335.187 16.8344 186.555 10.2344 107.743 7.09839C28.9313 3.96239 24.4433 4.49038 20.1513 4.76238C15.8593 5.03437 11.8993 5.03437 11.0473 5.69437C10.1953 6.35437 12.5713 7.67437 16.4353 8.75038C20.2993 9.82638 25.5793 10.6184 100.899 11.0264C176.219 11.4344 321.419 11.4344 402.819 12.3584C484.219 13.2824 497.419 15.1304 504.879 16.0824C512.339 17.0344 513.659 17.0344 515.019 17.0344" stroke="black" strokeWidth="4" strokeLinecap="round"

initial={{pathLength: 0}}
animate={{pathLength: 1}}
transition={{
    duration: 1,
    ease: "linear"
}}

/>
</motion.svg>
                     </div>
                </div>
            </div>
            <div className=" flex-1 h-screen">
                {loading && <Skeleton></Skeleton>}
                
                {!loading && error && <div className="flex flex-col justify-center items-center select-none ">
                    <ErrorCard></ErrorCard>
                    { retry && <RotateCcw onClick={getSpacePreview} className="hover:scale-125 active:scale-115 scale-120"></RotateCcw>}
                </div>}
                {!loading && _data && 
                <InvitePreview spaceName={_data.name} image={_data.map.map.thumbnail} members={_data.cohosts.length+ _data.members.length + 1} onClick={()=>{
                    router.push(`/space/${_data.id}`);
                }}></InvitePreview>
                }
                
            </div>
          
        </div>
    )
    
}



function SeperatedText({text, className}:{text:string, className?:string}){
    return (
        <div>
            {text.split("").map((char,idx)=>{
                return(
                    <span key={idx}
                    className={cn(" inline-block hover:scale-120", className)}
                    >
                        {char}
                    </span>
                )
            })}
        </div>
    )
}


function ErrorCard(){
    return (
        <div className="w-full h-full flex justify-center items-center flex-col">
            <Image src={Sorry} alt={"sorry"} width={500}></Image>
        </div>
    )
}