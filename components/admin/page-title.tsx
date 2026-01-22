import type React from "react"
import { Separator } from "@/components/ui/separator"

interface AdminPageTitleProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function AdminPageTitle({ title, description, actions }: AdminPageTitleProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <Separator className="bg-zinc-800" />
    </div>
  )
}
