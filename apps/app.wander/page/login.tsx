"use client"
import Image from "next/image"
import googleLogo from "@/public/assets/google.png"
import Button from '@repo/ui/Button'
export default function Login(){
    return (
        <div className=" flex flex-col items-center justify-center min-h-screen gap-4">
          
            <div className="text-[4rem] font-normal tracking-widest select-none">WANDER </div>
            <div>
                <div className="font-poppins font-bold text-neutral-700">LogIn to your Wander account</div>
                <div className="flex flex-col gap-4  justify-center items-center">
                         <Button className="flex items-center tracking-wide bg-neutral-50 "><Image src={googleLogo} alt="googleLogo" width={25}></Image> Continue with Google</Button>
                         <div>or</div>
                         <div className="flex flex-col">
                            <input type="text" placeholder="Enter your UserName"></input>
                            <input type="text" placeholder="Enter your password"></input>
                            <div>LogIn with Username</div>
                         </div>
                </div>
               
            </div>
        </div>
    )
}