"use client";

import { type SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "All",
  className = "",
  ...props
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`appearance-none bg-white/5 border border-white/10 rounded-lg px-3 py-2 pr-8 text-sm text-white focus:ring-2 focus:ring-[#f05555] focus:border-transparent outline-none transition-shadow cursor-pointer bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3E%3Cpath d='M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z'/%3E%3C/svg%3E")`,
      }}
      {...props}
    >
      <option value="" className="bg-[#1a2332] text-white">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#1a2332] text-white">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
