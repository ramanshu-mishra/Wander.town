"use client"
import { useFetchData } from "@/hooks/useFetchData";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ErrorToast from "../../../../components/ErrorToast";
import Button from "@/components/Button";
import { cn } from "@/utils/cn";
import { FetchError } from "@repo/utils/FetchError";
import { Copy } from "lucide-react";

interface linkInterface{
    inviteLink: string
}

export default function Page(){
    const router = useRouter();
    const params = useParams();
    const spaceId = params?.spaceId;
    const {data,loading,error,fetchData,reset} = useFetchData();
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

        console.log(link);
        setData(link);
        }
        catch(e){
            if(e instanceof FetchError){
                toast(<ErrorToast message={e.json.message}></ErrorToast>)
            }
            else if(e instanceof Error){
                toast(<ErrorToast message={e.message}></ErrorToast>)
            }
            else toast(<ErrorToast></ErrorToast>)
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
        <div className=" flex flex-col items-center justify-center min-h-screen gap-4 ">
          
            <div className="text-[4rem] font-normal tracking-widest select-none">WANDER </div>
            <div className="flex justify-center flex-col items-center gap-4">
                Invite your friends
                <div className="flex justify-center items-center bg-gradient-to-b from-blue-100 to-blue-300 p-4 ">   
                    <div className="flex  ">
                        {loading && <div>loading...</div>}
                                                {!loading && _data && (
                                                    <div className="flex gap-4 justify-center items-center">
                                                    <div className="flex items-center gap-3 max-w-xl overflow-y-auto">
                                                        <div className="break-words select-all">{_data.inviteLink}</div>
                                                        
                                                    </div>
                                                    <div
                                                            onClick={async () => {
                                                                try {
                                                                    const link = _data.inviteLink;
                                                                    if (navigator.clipboard && navigator.clipboard.writeText) {
                                                                        await navigator.clipboard.writeText(link);
                                                                    } else {
                                                                        const ta = document.createElement("textarea");
                                                                        ta.value = link;
                                                                        document.body.appendChild(ta);
                                                                        ta.select();
                                                                        document.execCommand("copy");
                                                                        document.body.removeChild(ta);
                                                                    }
                                                                    toast("Link copied to clipboard");
                                                                } catch (err) {
                                                                    const message = err instanceof Error ? err.message : String(err);
                                                                    toast(<ErrorToast message={message} />);
                                                                }
                                                            }}
                                                            className="h-fit w-fit active:scale-95"
                                                        >
                                                            <Copy></Copy>
                                                        </div>
                                                        </div>
                                                )}
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
                }} className={cn(active? "bg-blue-300 cursor-not-allowed text-neutral-600" : "bg-blue-600 cursor-pointer text-neutral-50 w-fit")}>Join Space</Button>
            </div>
            <ToastContainer autoClose={1500} draggable={false} position="bottom-right"></ToastContainer>
        </div>
    )
}