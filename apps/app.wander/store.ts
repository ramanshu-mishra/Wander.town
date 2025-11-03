import {create} from "zustand"
import { combinedInterface, userInterface } from "@repo/interface"


interface userDetailsInterface{
    userDetails: combinedInterface|null,
    setUserDetails : (details:combinedInterface)=>void
}
export const useUserDetails = create<userDetailsInterface>((set)=>({
    userDetails: null ,
    setUserDetails: (details:combinedInterface)=>set(()=>({
        userDetails : details
    }))
    
}))