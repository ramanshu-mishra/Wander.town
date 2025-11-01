import {cn} from "@/utils/cn"

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
        <div onClick={props.onClick} className={cn(props.variant ? variants[props.variant] : variants.default,props.className)}>
            {props.children}
        </div>
    )
}