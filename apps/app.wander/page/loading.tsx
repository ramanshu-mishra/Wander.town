"use client";
import {motion} from "motion/react";

export default function Loading(){
    return (
        <div className="h-screen w-screen flex justify-center items-center bg-black">
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes shimmer {
                    0%, 100% { 
                        background-position: 200% center;
                        text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                    }
                    50% { 
                        background-position: -200% center;
                        text-shadow: 0 0 40px rgba(255, 255, 255, 0.8);
                    }
                }
                
                .shiny-text {
                    font-size: 4rem;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    background: linear-gradient(90deg, #fff 0%, #fff 25%, #aaa 50%, #fff 75%, #fff 100%);
                    background-size: 200% center;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 3s ease-in-out infinite, float 3s ease-in-out infinite;
                }
            `}</style>
            <motion.div 
                className="shiny-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                WANDER
            </motion.div>
        </div>
    )
}