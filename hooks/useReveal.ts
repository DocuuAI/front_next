import { useInView } from "framer-motion";
import { useRef } from "react";

export function useReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return {
    ref,
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
  };
}