"use client"
import {motion} from "motion/react";



const SHIMMER_GRADIENT = "linear-gradient(90deg, #d4d4d4 0%, #bfbcba 50%, #d4d4d4 100%)";

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <motion.div
            aria-hidden
            className={className}
            style={{
                background: SHIMMER_GRADIENT,
                backgroundSize: "300% 100%",
                borderRadius: 6,
                willChange: "background-position",
                ...style,
            }}
            animate={{ backgroundPosition: ["-150% 0%", "150% 0%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
    );
}

export default function Skeleton(){
    return(
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-[80%] h-[85%]  flex justify-center items-center">
                    <div className="w-[90%] h-[90%]  flex flex-col gap-6 justify-center items-center -translate-y-11">
                        <Shimmer className="w-70 h-70 bg-neutral-400 skeleton">

                        </Shimmer>
                        <Shimmer className="bg-neutral-400 w-90 h-40 skeleton">

                        </Shimmer>
                    </div>
            </div>
        </div>
    )
}