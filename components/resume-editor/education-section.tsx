"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { EducationItem } from "@/lib/types"
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react"

interface EducationSectionProps {
  data: EducationItem[]
  onChange: (data: EducationItem[]) => void
}

export function EducationSection({ data, onChange }: EducationSectionProps) {
  const addItem = () => {
    onChange([
      ...data,
      {
        id: `edu-${Date.now()}`,
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
      },
    ])
  }

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, updates: Partial<EducationItem>) => {
    onChange(data.map((item, i) => (i === index ? { ...item, ...updates } : item)))
  }

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= data.length) return
    const next = [...data]
    ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Education</h3>
        <Button variant="ghost" size="sm" onClick={addItem} className="gap-1">
          <Plus className="size-3" />
          Add
        </Button>
      </div>

      {data.map((item, idx) => (
        <div key={item.id} className={`space-y-3 rounded-lg border border-white/10 bg-white/5 p-4 ${item.hidden ? "opacity-40" : ""}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {item.institution || `Education ${idx + 1}`}
              {item.hidden && <span className="ml-1.5 text-white/20">(hidden)</span>}
            </span>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => updateItem(idx, { hidden: !item.hidden })}
                title={item.hidden ? "Show in PDF" : "Hide from PDF"}
              >
                {item.hidden ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => moveItem(idx, -1)}
                disabled={idx === 0}
              >
                <ChevronUp className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => moveItem(idx, 1)}
                disabled={idx === data.length - 1}
              >
                <ChevronDown className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => removeItem(idx)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Institution</label>
              <Input
                value={item.institution}
                onChange={(e) => updateItem(idx, { institution: e.target.value })}
                placeholder="University Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Degree</label>
              <Input
                value={item.degree}
                onChange={(e) => updateItem(idx, { degree: e.target.value })}
                placeholder="Bachelor of Science"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">
                Field of Study
              </label>
              <Input
                value={item.field}
                onChange={(e) => updateItem(idx, { field: e.target.value })}
                placeholder="Computer Science"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Start</label>
                <Input
                  value={item.startDate}
                  onChange={(e) => updateItem(idx, { startDate: e.target.value })}
                  placeholder="2016"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">End</label>
                <Input
                  value={item.endDate}
                  onChange={(e) => updateItem(idx, { endDate: e.target.value })}
                  placeholder="2020"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">GPA</label>
              <Input
                value={item.gpa ?? ""}
                onChange={(e) => updateItem(idx, { gpa: e.target.value })}
                placeholder="3.8/4.0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Honors</label>
              <Input
                value={item.honors ?? ""}
                onChange={(e) => updateItem(idx, { honors: e.target.value })}
                placeholder="Cum Laude"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Description</label>
            <Textarea
              value={item.description ?? ""}
              onChange={(e) => updateItem(idx, { description: e.target.value })}
              placeholder="Notable achievements, relevant coursework, thesis..."
              className="min-h-18 resize-y text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
