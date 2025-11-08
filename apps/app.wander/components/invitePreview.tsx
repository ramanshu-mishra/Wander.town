import Image from "next/image"
import Button from "./Button"


export default function InvitePreview({image, onClick, spaceName,members}: {image:string, onClick?: ()=>void, spaceName: string, members:number}){


    
    return(
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-[80%] h-[85%]  flex justify-center items-center">
                    <div className="w-[90%] h-[90%]  flex flex-col gap-6 justify-center items-center -translate-y-11">
                        {/* Image wrapper must be relative, have explicit height, and overflow-hidden for Next/Image fill to behave */}
                        <div
                          className="w-80 h-70 relative bg-neutral-400 rounded-lg overflow-hidden skeleton"
                          
                        >
                            <Image
                                src={image}
                                alt="img"
                                fill
                                className="object-cover"
                                
                            />
                        </div>

                        <div className="bg-blue-400 w-120 h-40 skeleton rounded-2xl flex justify-center items-center shadow-neutral-300 shadow-2xl">
                            <div className=" w-[90%] h-[90%]   flex flex-col justify-center items-center">
                                <div className=" w-full h-20 text-bold overflow-x-auto flex justify-center items-center text-2xl font-semibold text-neutral-50">
                                    {spaceName}
                                </div>
                                <div className="self-end text-white text-sm font-medium">{members} {members == 1 ? "member" :"members"}</div>
                                <Button className="py-1 px-10 " onClick={onClick}>JOIN</Button>
                            </div>
                            
                        </div>
                    </div>
            </div>
        </div>
    )
}