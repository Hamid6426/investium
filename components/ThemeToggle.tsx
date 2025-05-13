// components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex">
      <button
        onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
        className={`w-12 h-6 rounded-full hidden cursor-pointer sm:flex p-1 transition-colors duration-300 ${
          currentTheme === "dark" ? "bg-gray-800" : "bg-gray-200"
        }`}
      >
        <div
          className={`h-4 w-4 rounded-full shadow-md transform transition-transform duration-300 ${
            currentTheme === "dark" ? "translate-x-6 bg-sky-500" : "translate-x-0 bg-sky-500"
          }`}
        ></div>
      </button>

      <button
        onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
        className="transition-colors flex flex-col justify-center items-center p-2 sm:hidden cursor-pointer duration-300"
      >
        <div>
          {currentTheme === "dark" ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
        </div>
        <div className="text-xs">{currentTheme === "dark" ? "Dark" : "Light"}</div>
      </button>
    </div>
  );
}
