import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"


// for reference --->
/*
    clsx --> combines talwind classes conditionally;
    twmwerge --> resolves tailwind conflicts 
*/

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}