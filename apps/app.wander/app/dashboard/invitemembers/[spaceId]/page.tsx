"use client"
import { useFetchData } from "@/hooks/useFetchData";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ErrorToast from "../../components/ErrorToast";
import Button from "@/components/Button";
import { cn } from "@/utils/cn";

interface linkInterface{
    link: string
}

export default function Page(){
    const router = useRouter();
    const params = useParams();
    const spaceId = params?.spaceId;
    const {data,loading,error,fetchData,reset,status} = useFetchData();
    const [_data,setData] = useState<linkInterface|null>(null);
    const [e,setError] = useState<Error|null>(null);
    const [active,setActive] = useState(false);

    async function getLink(){
        try{
        const link = await fetchData(`${process.env.NEXT_PUBLIC_AuthServer}/getJoinLink/${spaceId}`, 
            {
                credentials: "include"
            }
        );

        if(status?.ok){
            setData(link);
            setActive(true);
        }
        
        }
        catch(e){
            toast(<ErrorToast></ErrorToast>)
            setError(e instanceof Error ? e : new Error("Unexpected Error"));
        }
        finally{
            reset();
        }
    }



    useEffect(()=>{
        getLink();
    }, []);

    useEffect(()=>{
        if(error){
            setError(e);
        }
    },[error]);

    return(
        <div className=" flex flex-col items-center justify-center min-h-screen gap-4">
          
            <div className="text-[4rem] font-normal tracking-widest select-none">WANDER </div>
            <div>
                Invite your friends
                <div className="flex justify-center items-center bg-gradient-to-b from-blue-100 to-blue-300 p-4 ">   
                    <div className="flex justify-between">
                        {loading && <div>loading...</div>}
                        {!loading && _data && <div>
                            {_data.link}
                            </div>}
                        {e && <div>
                            <div className="flex justify-center items-center active:scale-95  w-fit px-2 py-2" onClick={()=>{
                                getLink();
                            }}>Retry</div>
                            </div>}
                    </div>
                </div>
                <Button onClick={()=>{
                    if(active)
                    router.push(`/dashboard/space/${spaceId}`);
                }} className={cn(active? "bg-blue-300 cursor-not-allowed text-neutral-600" : "bg-blue-600 cursor-pointer text-neutral-50")}>Join Space</Button>
            </div>
            <ToastContainer autoClose={1500} draggable={false} position="bottom-right"></ToastContainer>
        </div>
    )
}