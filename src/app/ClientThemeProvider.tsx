"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";

interface ClientThemeProviderProps {
  children: React.ReactNode;
}

export function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
