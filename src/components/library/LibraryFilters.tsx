import React from 'react';
import { Search, Filter, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface LibraryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function LibraryFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}: LibraryFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl backdrop-blur-md">
      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
        <Input 
          placeholder="Filter scripts by title, content or tone..." 
          className="pl-10 bg-zinc-950/50 border-zinc-800 focus:border-red-500/50 transition-all h-10 text-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <div className="flex items-center gap-2 bg-zinc-950/50 border border-zinc-800 p-1 rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8 rounded-md"
            onClick={() => onViewModeChange('grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8 rounded-md"
            onClick={() => onViewModeChange('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-[1px] bg-zinc-800 mx-1 hidden md:block" />

        <div className="flex items-center gap-2 min-w-[160px]">
          <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-10 bg-zinc-950/50 border-zinc-800 focus:ring-red-500/20">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="az">Name A-Z</SelectItem>
              <SelectItem value="length">Longest Scripts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="border-zinc-800 bg-zinc-950/50 h-10 px-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-900">
          <Filter className="w-3.5 h-3.5 mr-2" />
          Advanced
        </Button>
      </div>
    </div>
  );
}
