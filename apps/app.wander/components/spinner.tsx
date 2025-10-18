import { motion } from "motion/react"

interface SpinnerProps {
  width?: number|string;
  color?: string;
}

export default function Spinner({ width = 40, color = "#000000" }: SpinnerProps) {
  return (
    <motion.div
      style={{
        width,
        height: width,
        border: `4px solid ${color}`,
        borderTop: `4px solid transparent`,
        borderRadius: "50%",
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}