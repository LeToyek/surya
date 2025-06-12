// src/app/providers.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
// Correct the import path for the type here
import { type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}