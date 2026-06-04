"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  dropdownClassName?: string;
  align?: "left" | "right";
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
  dropdownClassName,
  align = "left",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the selected option's label to display
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={cn(
          "w-full appearance-none bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/[0.06] transition-colors focus:ring-2 focus:ring-[#f05555]/40 focus:border-transparent outline-none cursor-pointer flex items-center justify-between gap-2 text-left",
          className
        )}
      >
        <span className="truncate">{displayLabel}</span>
        <svg
          className={cn(
            "h-4 w-4 shrink-0 text-white/40 transition-transform pointer-events-none",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-1 rounded-xl py-1 z-50 border border-white/[0.1] max-h-60 overflow-y-auto w-full min-w-max",
            align === "right" ? "right-0" : "left-0",
            dropdownClassName
          )}
          style={{
            background: "rgba(15, 22, 35, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          <div
            className="px-3 py-1.5 text-sm text-white/40 hover:bg-white/[0.05] cursor-pointer transition-colors"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
          >
            {placeholder}
          </div>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={cn(
                "px-3 py-1.5 text-sm cursor-pointer transition-colors hover:bg-white/[0.05]",
                opt.value === value ? "text-[#f05555] font-medium" : "text-white/60"
              )}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
