import {create} from "zustand"
import { userInterface } from "./interface"


interface userDetailsInterface{
    userDetails: userInterface|null,
    setUserDetails : (details:userInterface)=>void
}
export const useUserDetails = create<userDetailsInterface>((set)=>({
    userDetails: null ,
    setUserDetails: (details:userInterface)=>set(()=>({
        userDetails : details
    }))
    
}))