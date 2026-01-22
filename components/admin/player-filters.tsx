"use client"

import type React from "react"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { X } from "lucide-react"

interface PlayerFiltersProps {
  filters: {
    minAge: number
    maxAge: number
    minOverall: number
    maxOverall: number
    positions: string[]
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      minAge: number
      maxAge: number
      minOverall: number
      maxOverall: number
      positions: string[]
    }>
  >
}

export function PlayerFilters({ filters, setFilters }: PlayerFiltersProps) {
  const handleAgeChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      minAge: value[0],
      maxAge: value[1],
    }))
  }

  const handleOverallChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      minOverall: value[0],
      maxOverall: value[1],
    }))
  }

  const togglePosition = (position: string) => {
    setFilters((prev) => {
      if (prev.positions.includes(position)) {
        return {
          ...prev,
          positions: prev.positions.filter((p) => p !== position),
        }
      } else {
        return {
          ...prev,
          positions: [...prev.positions, position],
        }
      }
    })
  }

  const resetFilters = () => {
    setFilters({
      minAge: 0,
      maxAge: 100,
      minOverall: 0,
      maxOverall: 99,
      positions: [],
    })
  }

  // Позиции игроков
  const positions = [
    { id: "GK", name: "Вратарь" },
    { id: "CB", name: "Центральный защитник" },
    { id: "LB", name: "Левый защитник" },
    { id: "RB", name: "Правый защитник" },
    { id: "CDM", name: "Опорный полузащитник" },
    { id: "CM", name: "Центральный полузащитник" },
    { id: "CAM", name: "Атакующий полузащитник" },
    { id: "LM", name: "Левый полузащитник" },
    { id: "RM", name: "Правый полузащитник" },
    { id: "LW", name: "Левый вингер" },
    { id: "RW", name: "Правый вингер" },
    { id: "CF", name: "Оттянутый нападающий" },
    { id: "ST", name: "Центральный нападающий" },
  ]

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Расширенные фильтры</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-zinc-400 hover:text-white hover:bg-zinc-700"
        >
          Сбросить фильтры
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Фильтр по возрасту */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-zinc-300">Возраст</Label>
            <div className="text-sm text-zinc-400">
              {filters.minAge} - {filters.maxAge} лет
            </div>
          </div>
          <Slider
            defaultValue={[filters.minAge, filters.maxAge]}
            min={16}
            max={45}
            step={1}
            value={[filters.minAge, filters.maxAge]}
            onValueChange={handleAgeChange}
            className="py-4"
          />
        </div>

        {/* Фильтр по рейтингу */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-zinc-300">Общий рейтинг</Label>
            <div className="text-sm text-zinc-400">
              {filters.minOverall} - {filters.maxOverall}
            </div>
          </div>
          <Slider
            defaultValue={[filters.minOverall, filters.maxOverall]}
            min={0}
            max={99}
            step={1}
            value={[filters.minOverall, filters.maxOverall]}
            onValueChange={handleOverallChange}
            className="py-4"
          />
        </div>
      </div>

      {/* Фильтр по позициям */}
      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="positions" className="border-zinc-700">
          <AccordionTrigger className="text-zinc-300 hover:text-white">Позиции игроков</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {positions.map((position) => (
                <Badge
                  key={position.id}
                  variant="outline"
                  className={`cursor-pointer ${
                    filters.positions.includes(position.id)
                      ? "bg-green-900/30 text-green-400 border-green-700"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                  }`}
                  onClick={() => togglePosition(position.id)}
                >
                  {position.id}: {position.name}
                </Badge>
              ))}
            </div>
            {filters.positions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="text-sm text-zinc-400 mr-2">Выбранные позиции:</div>
                {filters.positions.map((position) => (
                  <Badge
                    key={position}
                    className="bg-green-900/30 text-green-400 border-green-700 flex items-center gap-1"
                  >
                    {position}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => togglePosition(position)} />
                  </Badge>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
