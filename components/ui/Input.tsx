"use client";

import { type InputHTMLAttributes } from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export function Input({
  value,
  onChange,
  onClear,
  placeholder,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Search icon */}
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#717171]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#EBEBEB] rounded-lg pl-9 pr-8 py-2 text-sm text-[#484848] placeholder:text-[#717171] focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent outline-none transition-shadow"
        {...props}
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-[#717171] hover:text-[#222222] hover:bg-[#F2F2F2] transition-colors"
          aria-label="Clear"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
