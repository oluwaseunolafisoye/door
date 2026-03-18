"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SkillCategory } from "@/lib/types"
import { Plus, Trash2, X } from "lucide-react"
import { useState } from "react"

interface SkillsSectionProps {
  data: SkillCategory[]
  onChange: (data: SkillCategory[]) => void
}

export function SkillsSection({ data, onChange }: SkillsSectionProps) {
  const [newSkills, setNewSkills] = useState<Record<string, string>>({})

  const addCategory = () => {
    onChange([
      ...data,
      { id: `skill-${Date.now()}`, category: "", items: [] },
    ])
  }

  const removeCategory = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateCategory = (index: number, category: string) => {
    onChange(
      data.map((item, i) => (i === index ? { ...item, category } : item)),
    )
  }

  const addSkill = (catIndex: number) => {
    const value = newSkills[data[catIndex].id]?.trim()
    if (!value) return
    onChange(
      data.map((item, i) =>
        i === catIndex ? { ...item, items: [...item.items, value] } : item,
      ),
    )
    setNewSkills((prev) => ({ ...prev, [data[catIndex].id]: "" }))
  }

  const removeSkill = (catIndex: number, skillIndex: number) => {
    onChange(
      data.map((item, i) =>
        i === catIndex
          ? { ...item, items: item.items.filter((_, si) => si !== skillIndex) }
          : item,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Skills</h3>
        <Button variant="ghost" size="sm" onClick={addCategory} className="gap-1">
          <Plus className="size-3" />
          Add Category
        </Button>
      </div>

      {data.map((cat, catIdx) => (
        <div key={cat.id} className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2">
            <Input
              value={cat.category}
              onChange={(e) => updateCategory(catIdx, e.target.value)}
              placeholder="e.g. Programming Languages"
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => removeCategory(catIdx)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {cat.items.map((skill, sIdx) => (
              <Badge key={sIdx} variant="secondary" className="gap-1 pr-1">
                {skill}
                <button
                  onClick={() => removeSkill(catIdx, sIdx)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                >
                  <X className="size-2.5" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newSkills[cat.id] ?? ""}
              onChange={(e) =>
                setNewSkills((prev) => ({
                  ...prev,
                  [cat.id]: e.target.value,
                }))
              }
              placeholder="Add a skill..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addSkill(catIdx)
                }
              }}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSkill(catIdx)}
            >
              Add
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
