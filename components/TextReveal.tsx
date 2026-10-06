"use client";

import { motion } from "framer-motion";
import { easeOut } from "@/lib/animations";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  mode?: "words" | "lines";
  trigger?: "view" | "mount";
}

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  as: Tag = "span",
  mode = "words",
  trigger = "view",
}: Props) {
  const parts = mode === "lines" ? text.split("\n") : text.split(" ");
  const MotionTag = motion[Tag];

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07, delayChildren: delay },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: easeOut },
    },
  };

  const motionProps =
    trigger === "mount"
      ? { initial: "hidden" as const, animate: "visible" as const }
      : {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once: true, margin: "-40px" as const },
        };

  if (mode === "lines") {
    return (
      <MotionTag variants={container} {...motionProps} className={className}>
        {parts.map((line, i) => (
          <motion.span
            key={i}
            variants={item}
            className="block"
          >
            {line}
          </motion.span>
        ))}
      </MotionTag>
    );
  }

  return (
    <MotionTag variants={container} {...motionProps} className={className}>
      {parts.map((word, i) => (
        <motion.span key={i} variants={item} className="inline-block mr-[0.28em] last:mr-0">
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
