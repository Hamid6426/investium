"use client";

import { useTheme } from "next-themes";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div className="flex">
      {/* Toggle Switch for sm+ */}
      {/* <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`w-12 h-6 rounded-full hidden sm:flex items-center p-1 cursor-pointer transition-colors duration-300 ${
          isDark ? "bg-muted" : "bg-card"
        }`}
      >
        <div
          className={`h-4 w-4 rounded-full shadow-md transform transition-transform duration-300 ${
            isDark ? "translate-x-6 bg-primary" : "translate-x-0 bg-primary"
          }`}
        ></div>
      </button> */}

      {/* Icon Toggle for xs */}
      {/* <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="transition-colors flex flex-col justify-center items-center p-2 sm:hidden cursor-pointer duration-300 text-paragraph"
      >
        <div>
          {isDark ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
        </div>
      </button> */}
 
       <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="transition-colors flex flex-col justify-center items-center p-2 cursor-pointer duration-300 text-paragraph"
      >
        <div>
          {isDark ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
        </div>
      </button>
    </div>
  );
}
