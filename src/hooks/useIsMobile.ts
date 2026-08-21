import { useEffect, useState } from "react"

export function useIsMobile(breakpointPx: number = 767): boolean {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(`(max-width: ${breakpointPx}px)`).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [breakpointPx])
  return isMobile
}
