import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  interested: 'Interested',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
}

export const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  interested: 'bg-orange-100 text-orange-800 border-orange-200',
  quoted: 'bg-purple-100 text-purple-800 border-purple-200',
  won: 'bg-green-100 text-green-800 border-green-200',
  lost: 'bg-gray-100 text-gray-600 border-gray-200',
}

export const LEAD_STATUSES = ['new', 'contacted', 'interested', 'quoted', 'won', 'lost']

export function estimatePoolCost(lotSizeSqFt: number, zipCode: string): number {
  // Base cost per sqft varies by region
  const sunBeltStates = ['AZ', 'FL', 'TX', 'NV', 'CA', 'GA']
  const basePerSqFt = 75 // base $75/sqft for pool area
  const poolSize = Math.min(Math.max(lotSizeSqFt * 0.15, 400), 1200) // 15% of lot, 400-1200 sqft
  return Math.round(poolSize * basePerSqFt / 1000) * 1000
}

export function estimateHomeValueLift(homeValue: number, poolCost: number): number {
  // Pools typically add 5-8% to home value in Sun Belt
  const liftPercentage = 0.065
  return Math.round(homeValue * liftPercentage / 1000) * 1000
}
