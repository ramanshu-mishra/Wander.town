"use client"

import { useFetchData } from "@/hooks/useFetchData";
import { userAndPositionInterface } from "@/interfaces/interface";
import { useSpaceDetails } from "@/store"

export default function Page(){

    const {users} = useSpaceDetails();
    const {loading,data,error,setData,reset} = useFetchData();
    


    return (
        <div className="h-screen w-screen flex select-none">
            <div className="w-15 h-full bg-neutral-200">

            </div>
            <div className="flex-1 h-full bg-neutral-50 justify-center items-center">
                {
                    Object.values(users).map((user,idx)=>{
                        return(
                            <User key={idx} userId={user.id}></User>
                        )
                    })
                }
            </div>
        </div>
    )
}   




function User({userId}: {userId: string}){

    const user = useSpaceDetails(state=>state.users[userId]);

    return (
        <div className="w-100 h-100 bg-red-400">
            
        </div>
    )
}