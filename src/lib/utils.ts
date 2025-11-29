import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a CSS clamp() value for responsive typography
 * @param minSize - Minimum size (in rem)
 * @param vwSize - Viewport width percentage
 * @param maxSize - Maximum size (in rem)
 * @returns CSS clamp() string
 */
export function clampSize(minSize: number, vwSize: number, maxSize: number): string {
  return `clamp(${minSize}rem, ${vwSize}vw, ${maxSize}rem)`
}
