// src/context/ThemeContext.js
import React, { createContext, useContext, useState } from "react";

// ============================================
// 1. COLOR PALETTE
// ============================================
const LIGHT_COLORS = {
  bg: "#F8FAFC",
  bgSecondary: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#64748B",
  accent: "#38BDF8",
  accentLight: "#E0F2FE",
  danger: "#F97316",
  border: "#E2E8F0",
};

const DARK_COLORS = {
  bg: "#0F172A",
  bgSecondary: "#1E293B",
  text: "#F8FAFC",
  textSecondary: "#CBD5E1",
  accent: "#38BDF8",
  accentLight: "#1E3A4C",
  danger: "#F97316",
  border: "#334155",
};

// ============================================
// 2. CREATE CONTEXT
// ============================================
const ThemeContext = createContext(null);

// ============================================
// 3. THEME PROVIDER COMPONENT
// ============================================
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Get current colors based on mode
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const value = {
    isDarkMode,
    toggleTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// ============================================
// 4. CUSTOM HOOK
// ============================================
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme harus digunakan dalam ThemeProvider!");
  }
  return context;
};