"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { ExperienceItem, ExperienceOptimization } from "@/lib/types"
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ArrowRight,
} from "lucide-react"

interface ExperienceSectionProps {
  data: ExperienceItem[]
  onChange: (data: ExperienceItem[]) => void
  optimizations?: ExperienceOptimization[]
}

export function ExperienceSection({
  data,
  onChange,
  optimizations,
}: ExperienceSectionProps) {
  const addItem = () => {
    onChange([
      ...data,
      {
        id: `exp-${Date.now()}`,
        company: "",
        title: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        bullets: [""],
      },
    ])
  }

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, updates: Partial<ExperienceItem>) => {
    onChange(
      data.map((item, i) => (i === index ? { ...item, ...updates } : item))
    )
  }

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= data.length) return
    const next = [...data]
    ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
    onChange(next)
  }

  const addBullet = (itemIndex: number) => {
    const item = data[itemIndex]
    updateItem(itemIndex, { bullets: [...item.bullets, ""] })
  }

  const removeBullet = (itemIndex: number, bulletIndex: number) => {
    const item = data[itemIndex]
    updateItem(itemIndex, {
      bullets: item.bullets.filter((_, i) => i !== bulletIndex),
    })
  }

  const updateBullet = (
    itemIndex: number,
    bulletIndex: number,
    value: string
  ) => {
    const item = data[itemIndex]
    updateItem(itemIndex, {
      bullets: item.bullets.map((b, i) => (i === bulletIndex ? value : b)),
    })
  }

  const getBulletMapping = (experienceId: string, bulletIndex: number) => {
    if (!optimizations) return null
    const opt = optimizations.find((o) => o.experienceId === experienceId)
    if (!opt) return null
    return opt.bulletMappings.find((m) => m.bulletIndex === bulletIndex) ?? null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Experience</h3>
        <Button variant="ghost" size="sm" onClick={addItem} className="gap-1">
          <Plus className="size-3" />
          Add
        </Button>
      </div>

      {data.map((item, itemIdx) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <GripVertical className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {item.company || `Position ${itemIdx + 1}`}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => moveItem(itemIdx, -1)}
                disabled={itemIdx === 0}
              >
                <ChevronUp className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => moveItem(itemIdx, 1)}
                disabled={itemIdx === data.length - 1}
              >
                <ChevronDown className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => removeItem(itemIdx)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Company</label>
              <Input
                value={item.company}
                onChange={(e) =>
                  updateItem(itemIdx, { company: e.target.value })
                }
                placeholder="Company Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Role</label>
              <Input
                value={item.title}
                onChange={(e) => updateItem(itemIdx, { title: e.target.value })}
                placeholder="Job Title"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Location</label>
              <Input
                value={item.location}
                onChange={(e) =>
                  updateItem(itemIdx, { location: e.target.value })
                }
                placeholder="City, State"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Start</label>
                <Input
                  value={item.startDate}
                  onChange={(e) =>
                    updateItem(itemIdx, { startDate: e.target.value })
                  }
                  placeholder="Jan 2020"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">End</label>
                <Input
                  value={item.endDate}
                  onChange={(e) =>
                    updateItem(itemIdx, { endDate: e.target.value })
                  }
                  placeholder="Present"
                  disabled={item.current}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">
              Accomplishments (CARL Framework)
            </label>
            {item.bullets.map((bullet, bIdx) => {
              const mapping = getBulletMapping(item.id, bIdx)
              return (
                <div key={bIdx} className="space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="mt-2.5 text-xs text-muted-foreground">
                      •
                    </span>
                    <Textarea
                      value={bullet}
                      onChange={(e) =>
                        updateBullet(itemIdx, bIdx, e.target.value)
                      }
                      placeholder="Spearheaded... resulting in..."
                      className="min-h-15 resize-y text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeBullet(itemIdx, bIdx)}
                      className="mt-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                  {mapping && (
                    <div className="ml-5 space-y-1.5 rounded-md bg-white/5 px-3 py-2">
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="mt-0.5 size-3 shrink-0 text-[#a4f5a6]" />
                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {mapping.requirementMatched}
                          </span>
                          {mapping.explanation && <> — {mapping.explanation}</>}
                        </p>
                      </div>
                      {mapping.skills && mapping.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pl-4">
                          {mapping.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-[9px] font-normal"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addBullet(itemIdx)}
              className="gap-1 text-xs"
            >
              <Plus className="size-3" />
              Add bullet
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
