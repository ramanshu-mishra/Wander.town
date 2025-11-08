import {create} from "zustand"
import { combinedInterface  } from "@repo/interface"
import {UserInterface, spawnPoints, userAndPositionInterface } from "./interfaces/interface";


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

interface userProfileInterace{
    active:boolean,
    setActive: (x:boolean)=>void;
}

export const useUserProfile = create<userProfileInterace>((set)=>({
    active: false,
    setActive: (x:boolean)=>set(()=>({
        active: x
    }))
}));


interface SpaceDetailsInterface{
    users: Record<string,userAndPositionInterface>,
    moveUser: (userId:string,position:spawnPoints)=>void,
    addUser: (user:UserInterface, spawnPoint: spawnPoints)=>void,
    removeUser: (userId:string)=>void
}

export const useSpaceDetails = create<SpaceDetailsInterface>((set)=>({
    users: {},

    moveUser: (userId:string, position:spawnPoints)=>set((state)=>{
       const updatedUsers = {...state.users, [userId] : {...state.users[userId], position: position}}
       return { users: updatedUsers };
    }),

    addUser: (user:UserInterface, spawnPoint: spawnPoints)=>set((state)=>{
        const updatedUsers = {...state.users, [user.id]: {...user, position: spawnPoint}}
        return {users: updatedUsers};
    }),

    removeUser: (userId:string)=>set((state)=>{
        const updatedUsers = {...state.users};
        delete updatedUsers[userId];
        return {users: updatedUsers};
    })
}))
   