"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:rounded-[15px] group-[.toaster]:border-none group-[.toaster]:shadow-2xl font-inder",
          success: "!bg-[#3F6212] !text-[#FFF8E1]",
          error: "!bg-[#92400E] !text-[#FFF8E1]",
          loading: "!bg-[#F4B740] !text-[#4B2E05]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }