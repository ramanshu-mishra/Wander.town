import {cn} from "@/utils/cn"
import {motion} from "motion/react";

interface ButtonInterface {
className ?:string,
variant ?:string,
children ?: React.ReactNode,
onClick ?: ()=>void
}
export default function Button(props:ButtonInterface){

    const variants:Record<string,string> = {
        "default" : "px-4 py-2 rounded-xl bg-neutral-50 active:scale-95 select-none",
        "nav": "px-4 py-2 rounded-xl bg-blue-500 active:scale-95 select-none"
    }
    return(
        <motion.div onClick={props.onClick} className={cn(props.variant ? variants[props.variant] : variants.default,props.className)}
        whileTap={{
            scale: 0.95,
            transitionDuration: 0.3
        }}
        whileHover={{
            scale: 1.05,
            transitionDuration: 0.3
        }}
        >
            {props.children}
        </motion.div>
    )
}