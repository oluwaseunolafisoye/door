"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { ProjectItem } from "@/lib/types"
import { Plus, Trash2, ChevronUp, ChevronDown, ExternalLink } from "lucide-react"

interface ProjectsSectionProps {
  data: ProjectItem[]
  onChange: (data: ProjectItem[]) => void
}

export function ProjectsSection({ data, onChange }: ProjectsSectionProps) {
  const addItem = () => {
    onChange([
      ...data,
      {
        id: `proj-${Date.now()}`,
        name: "",
        description: "",
        technologies: "",
        bullets: [""],
      },
    ])
  }

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, updates: Partial<ProjectItem>) => {
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

  const updateBullet = (itemIdx: number, bIdx: number, value: string) => {
    const item = data[itemIdx]
    updateItem(itemIdx, {
      bullets: item.bullets.map((b, i) => (i === bIdx ? value : b)),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Projects</h3>
        <Button variant="ghost" size="sm" onClick={addItem} className="gap-1">
          <Plus className="size-3" />
          Add
        </Button>
      </div>

      {data.map((item, idx) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {item.name || `Project ${idx + 1}`}
            </span>
            <div className="flex items-center gap-0.5">
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

          {/* Row 1: Name + URL link | Technologies */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-end gap-2">
              <div className="flex-1 space-y-1">
                <label className="text-xs text-muted-foreground">
                  Project Name
                </label>
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(idx, { name: e.target.value })}
                  placeholder="My Project"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs text-muted-foreground">URL</label>
                <div className="flex items-center gap-1.5">
                  <Input
                    value={item.url ?? ""}
                    onChange={(e) => updateItem(idx, { url: e.target.value })}
                    placeholder="https://..."
                  />
                  {item.url && (
                    <a
                      href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded p-1.5 text-white/30 transition-colors hover:bg-white/10 hover:text-[#a4f5a6]"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-1 sm:w-44">
              <label className="text-xs text-muted-foreground">
                Technologies
              </label>
              <Input
                value={item.technologies}
                onChange={(e) =>
                  updateItem(idx, { technologies: e.target.value })
                }
                placeholder="React, Node.js"
              />
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Description
            </label>
            <Textarea
              value={item.description}
              onChange={(e) =>
                updateItem(idx, { description: e.target.value })
              }
              placeholder="Brief description of the project..."
              className="min-h-16 resize-y text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Key Points</label>
            {item.bullets.map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-start gap-2">
                <span className="mt-2.5 text-xs text-muted-foreground">•</span>
                <Textarea
                  value={bullet}
                  onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                  placeholder="Describe what you built or achieved..."
                  className="min-h-12.5 resize-y text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeBullet(idx, bIdx)}
                  className="mt-1.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addBullet(idx)}
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
