// src/types.ts

import { LucideIcon } from "lucide-react";

// src/types.ts
export interface School {
  id: number;
  name: string;
  address: string;
  logo: string;
  goal: number;
  funded: number;
  percentage: number;
  category: string;
  description?: string;
  panelGridConfigs?: PanelGridConfig[]; // <--- NEW: Array of configurations for 's' grids
}


// New type for specific school donors
export interface SchoolDonor {
  id: string; // Unique ID for the donation/donor entry
  donorName: string;
  amount: number;
  date: string; // Consider using Date object for real applications
  schoolId: number; // Foreign key to link to the School
  avatar?: string; // Optional: URL or emoji for donor avatar
  message?: string; // Optional: A short message from the donor
}


export interface RecentActivity {
  donor: string;
  amount: number;
  school: string;
  time: string;
}

export interface AnimatedValues {
  [key: number]: number;
}

export interface IsVisibleState {
  [key: string]: boolean;
}

export interface SolarPanelType {
  id: string;             // Globally unique panel ID, e.g., "s1-main_array-r0c0"
  gridId: string;         // Identifies which PanelGridConfig this panel belongs to
  row: number;            // Row index within its specific grid (relative to its gridId)
  col: number;            // Column index within its specific grid (relative to its gridId)
  isDonated: boolean;
  donorName?: string;
  donationAmount?: number;
  logo?: string;           // Emoji or character(s)
  isSelected?: boolean;    // For UI selection state
}
export interface PanelGridConfig {
  gridId: string;         // Unique identifier for this specific grid section (e.g., "main_array", "roof_section_A")
  gridTitle?: string;      // Optional title to display above this grid section
  rows: number;
  cols: number;
}
export type Role = 'PUBLIC' | 'USER' | 'ADMIN';

export interface AuthenticatedUser {
  id: string;
  name?: string;
  email: string;
  role: Role;
  // In a real scenario, you might have an access token here
  // token?: string;
}
export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  children?: NavItem[];
}
