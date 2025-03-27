import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeSince(objectId: string) {
  const timestamp = parseInt(objectId.substring(0, 8), 16);
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const seconds = Math.floor((Number(now) - Number(date)) / 1000);

  let interval = seconds / 31536000; // Years
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }

  interval = seconds / 2592000;  // Months
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }

    interval = seconds / 604800; // Weeks
  if(interval > 1){
    return Math.floor(interval) + " weeks ago";
  }
  
  interval = seconds / 86400; // Days
  if (interval >= 1) {
    return Math.floor(interval) + " days ago";
  }


  return "less than a day";
}