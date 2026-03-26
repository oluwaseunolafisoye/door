"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowRight, Trash2, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { Doc, Id } from "@/convex/_generated/dataModel"

export default function HistoryPage() {
  const router = useRouter()
  const applications = useQuery(api.applications.list)
  const removeApp = useMutation(api.applications.remove)
  const [deletingId, setDeletingId] = useState<Id<"applications"> | null>(null)

  const handleDelete = async () => {
    if (!deletingId) return
    await removeApp({ id: deletingId })
    setDeletingId(null)
  }

  const glassCard = "bg-white/5 border-white/10 backdrop-blur-sm"

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">History</h1>
        <p className="text-sm text-white/50">
          All your tailored applications in one place.
        </p>
      </div>

      {applications === undefined ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl opacity-20" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="rounded-full bg-white/10 p-5">
            <Inbox className="size-8 text-white/30" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">No applications yet</p>
            <p className="text-xs text-white/50">
              Upload a CV from the dashboard to get started.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
          >
            Go to Dashboard
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((app: Doc<"applications">) => (
              <Card key={app._id} className={cn("group relative", glassCard)}>
                <CardContent className="flex h-full flex-col justify-between p-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px]",
                          app.status === "completed" &&
                            "bg-[#a4f5a6]/20 text-[#a4f5a6]",
                          app.status === "processing" &&
                            "bg-amber-500/20 text-amber-400",
                          app.status === "failed" &&
                            "bg-destructive/20 text-red-400"
                        )}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                      <p className="text-[10px] text-white/30">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <h3 className="text-sm leading-snug font-medium text-white">
                      {app.jobTitle}
                    </h3>
                    <p className="text-xs text-white/50">{app.company}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setDeletingId(app._id)}
                      className="text-white/30 hover:bg-white/10 hover:text-red-400"
                    >
                      <Trash2 className="size-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs text-white/50 hover:bg-white/10 hover:text-white"
                      onClick={() => router.push(`/application/${app._id}`)}
                    >
                      Open
                      <ArrowRight className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null) }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Application</DialogTitle>
                <DialogDescription>
                  This will permanently delete the tailored CV and cover letter.
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeletingId(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
