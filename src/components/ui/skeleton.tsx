
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/70", className)} // Slightly adjusted color and kept pulse
      {...props}
    />
  )
}

export { Skeleton }
