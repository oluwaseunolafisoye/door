"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ProfileData } from "@/lib/types"

interface ProfileSectionProps {
  data: ProfileData
  onChange: (data: ProfileData) => void
}

export function ProfileSection({ data, onChange }: ProfileSectionProps) {
  const update = (field: keyof ProfileData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold tracking-tight">Profile</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Full Name</label>
          <Input
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Job Title</label>
          <Input
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Senior Software Engineer"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Email</label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Phone</label>
          <Input
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 555-0123"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Location</label>
          <Input
            value={data.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">LinkedIn</label>
          <Input
            value={data.linkedin}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div className="col-span-full space-y-1">
          <label className="text-xs text-muted-foreground">Website</label>
          <Input
            value={data.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="johndoe.dev"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">
          Professional Summary
        </label>
        <Textarea
          value={data.summary}
          onChange={(e) => update("summary", e.target.value)}
          placeholder="A brief summary highlighting your key qualifications..."
          className="min-h-20 resize-y text-sm"
        />
      </div>
    </div>
  )
}
