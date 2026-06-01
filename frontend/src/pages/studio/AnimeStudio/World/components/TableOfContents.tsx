import React from "react";
import { List, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { worldStyles as s } from "../worldStyles";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const headings = React.useMemo(() => {
    if (!content) return [];
    // Extract ## level headings (standard for the studio's generated lore)
    return content
      .split("\n")
      .filter((line) => line.startsWith("## "))
      .map((line) => {
        // Strip markdown bold/italic syntax from the text for clean display
        const text = line
          .replace(/#/g, "")
          .replace(/\*/g, "")
          .replace(/_/g, "")
          .trim();
        // Create an ID that matches what ReactMarkdown custom components will generate
        const id = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
        return { text, id };
      });
  }, [content]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className={cn(s.content.tocContainer, "space-y-6 pt-2")}>
      <div className="flex items-center gap-2 px-1">
        <div className="w-1 h-3 bg-studio/40 rounded-full" />
        <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <List className="w-3 h-3 text-studio" /> Quick Navigation
        </h4>
      </div>

      <div className="relative pl-1 py-1">
        {/* Interactive Vertical Trail */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-studio/40 via-studio/10 to-transparent" />

        <ul className="space-y-4">
          {headings.map((heading, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative flex items-start gap-4"
            >
              {/* Active/Hover Indicator Dot */}
              <div className="relative mt-1.5 flex items-center justify-center">
                <div className="absolute w-1 h-1 rounded-full bg-studio/20 group-hover:scale-[3] group-hover:bg-studio/40 transition-all duration-500" />
                <div className="relative w-1 h-1 rounded-full bg-studio shadow-[0_0_8px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-300" />
              </div>

              <a
                href={`#${heading.id}`}
                onClick={(e) => handleScroll(e, heading.id)}
                className="flex flex-col gap-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-600 group-hover:text-studio/60 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest transition-colors">
                    {heading.text}
                  </span>
                </div>

                {/* Animated Underline */}
                <div className="h-px w-0 bg-gradient-to-r from-studio/40 to-transparent group-hover:w-full transition-all duration-700" />
              </a>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto pr-1">
                <ChevronRight className="w-3 h-3 text-studio/40" />
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
