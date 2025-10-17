"use client"
import Button from "@/components/Button"
import {useRouter} from "next/navigation"

export default function Navbar({className}:{className?:string}){
  const router= useRouter();
  return(
    <div className={`w-full flex justify-between ${className}`}>
        <div className="mx-10 my-4 py-2 px-4 select-none">Wander</div>
        <div>
            <Button onClick={()=>{
              router.push("http://localhost:3003")
            }} className="mx-10 my-4">Login</Button>
        </div>
    </div>
  )
}


