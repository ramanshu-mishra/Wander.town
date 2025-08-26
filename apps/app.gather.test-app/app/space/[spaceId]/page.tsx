"use client";

import { useParams } from "next/navigation";
import { useFetchData } from "@/hooks/fetchData";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Room } from "@/app/room/room";
import { positionInterface, SpaceInterface } from "@repo/interface/interface";
import { usePosition } from "@/app/store";
import Sprite from "@/app/sprites";


interface dataInterface {
    token:string,
    spaceData: SpaceInterface
}
export default  function Space(){
    const router = useRouter();
    const {spaceId} = useParams();
    const [jwt, setJwt] = useState();
    const {loading,error,data,fetchData} = useFetchData();
   
    useEffect(()=>{
        fetchData(`http://localhost:3000/space/${spaceId}`);
    },[]);

    useEffect(()=>{
        if(data ){
            console.log(data);
            // @ts-ignore
            const token = data?.token;
            // @ts-ignore 
            const client = new Room(data.spaceData);
            client.init_client(token);
            setJwt(token);

        }
        else if(error){
            document.cookie = document.cookie.split(";").filter((c)=>{
                const cookie = c.split("=")[0];
                if(cookie != "connect.sid"){
                    router.push("/");
                }
            }).join();
        }
    }, [data, error]);

   console.log(spaceId);  
   const {positions} = usePosition();
   useEffect(()=>{
    
   }, [positions])
    return (
    
        <div>
            {loading && <div className="h-full w-full flex justify-center items-center">Loading</div>}
            {data && <div>
                {/* <h1>token: {jwt}</h1> */}
                {
                   Object.keys(positions).map((key,idx)=>{
                    return (
                        // @ts-ignore
                        <Sprite key={idx} userid={data.userId}></Sprite>
                    )
                   })
                }
                </div>}
        </div>
    )
}