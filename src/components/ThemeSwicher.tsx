// // src/components/ThemeSwitcher.tsx (Client Component)
// 'use client';

// import { useTheme } from 'next-themes';
// import { useEffect, useState } from 'react';

// function ThemeSwitcher() {
//   const [mounted, setMounted] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const { theme, setTheme } = useTheme();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return null;
//   }

//   const handleThemeChange = (newTheme: string) => {
//     setTheme(newTheme);
//     setDropdownOpen(false); // Close dropdown after selection
//   };

//   return (
//     <div className="relative">
//       {/* Dropdown toggle button */}
//       <button
//         onClick={() => setDropdownOpen(!dropdownOpen)}
//         className="px-4 py-2 bg-gray-200 rounded-md"
//       >
//         {theme ? `Theme: ${theme}` : 'Select Theme'}
//       </button>

//       {/* Dropdown menu */}
//       {dropdownOpen && (
//         <div className="absolute mt-2 bg-white border rounded-md shadow-lg">
//           <div className="p-2">
//             <label className="block">
//               <input
//                 type="radio"
//                 name="theme"
//                 value="system"
//                 checked={theme === 'system'}
//                 onChange={() => handleThemeChange('system')}
//               />
//               System
//             </label>
//             <label className="block">
//               <input
//                 type="radio"
//                 name="theme"
//                 value="light"
//                 checked={theme === 'light'}
//                 onChange={() => handleThemeChange('light')}
//               />
//               Light
//             </label>
//             <label className="block">
//               <input
//                 type="radio"
//                 name="theme"
//                 value="dark"
//                 checked={theme === 'dark'}
//                 onChange={() => handleThemeChange('dark')}
//               />
//               Dark
//             </label>
//             <label className="block">
//               <input
//                 type="radio"
//                 name="theme"
//                 value="ocean"
//                 checked={theme === 'ocean'}
//                 onChange={() => handleThemeChange('ocean')}
//               />
//               Ocean
//             </label>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ThemeSwitcher;

// src/components/ThemeSwitcher.tsx (Client Component)
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, themes } = useTheme(); // 'themes' will list themes from 'themes' prop if passed to ThemeProvider

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="system">System</option>
      {/* Assuming you defined 'dark' and 'ocean' themes in your CSS */}
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="ocean">Ocean</option>
      {/* Or use themes prop if you passed it to ThemeProvider */}
      {/* {themes.map(t => <option key={t} value={t}>{t}</option>)} */}
    </select>
  );
}

export default ThemeSwitcher;