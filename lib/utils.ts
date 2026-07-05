import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNaira(value: number, isMillions: boolean = false) {
  const rawValue = isMillions ? value * 1_000_000 : value;
  if (rawValue >= 1_000_000_000) {
    return `₦${(rawValue / 1_000_000_000).toFixed(1)}B`;
  }
  return `₦${(rawValue / 1_000_000).toFixed(1)}M`;
}
