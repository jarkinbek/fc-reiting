"use client"

import { Search, Filter, ChevronDown, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchForm() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Поиск игрока"
          className="bg-zinc-900/80 border-zinc-700 rounded-lg pl-10 pr-4 py-6 w-full text-white placeholder:text-zinc-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
        >
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
        <Button
          variant="outline"
          className="border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Сортировка
        </Button>
      </div>
    </div>
  )
}
