"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CertificationItem } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"

interface CertificationsSectionProps {
  data: CertificationItem[]
  onChange: (data: CertificationItem[]) => void
}

export function CertificationsSection({
  data,
  onChange,
}: CertificationsSectionProps) {
  const addItem = () => {
    onChange([
      ...data,
      { id: `cert-${Date.now()}`, name: "", issuer: "", date: "" },
    ])
  }

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, updates: Partial<CertificationItem>) => {
    onChange(data.map((item, i) => (i === index ? { ...item, ...updates } : item)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Certifications</h3>
        <Button variant="ghost" size="sm" onClick={addItem} className="gap-1">
          <Plus className="size-3" />
          Add
        </Button>
      </div>

      {data.map((item, idx) => (
        <div key={item.id} className="flex items-end gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">
                Certification
              </label>
              <Input
                value={item.name}
                onChange={(e) => updateItem(idx, { name: e.target.value })}
                placeholder="AWS Solutions Architect"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Issuer</label>
              <Input
                value={item.issuer}
                onChange={(e) => updateItem(idx, { issuer: e.target.value })}
                placeholder="Amazon Web Services"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Date</label>
              <Input
                value={item.date}
                onChange={(e) => updateItem(idx, { date: e.target.value })}
                placeholder="2023"
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => removeItem(idx)}
            className="mb-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ))}
    </div>
  )
}
