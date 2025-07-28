
import React, { useEffect } from "react";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";

interface AnimatedCounterProps {
    from?: number;
    to: number;
    prefix?: string;
    suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ from = 0, to, prefix = "", suffix = "" }) => {
    const count = useMotionValue(from);
    const rounded = useTransform(
        count,
        (latest) => `${prefix}${Math.round(latest).toLocaleString()}${suffix}`
    );

    useEffect(() => {
        const controls = animate(count, to, { duration: 1.5, ease: "easeOut" });
        return controls.stop;
    }, [to, count]); // from is only an initial value

    return <motion.span>{rounded}</motion.span>;
};

export default AnimatedCounter;
