import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import React from "react";

type Mode = "light" | "dark";

const getInitial = (): Mode => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved as Mode;
  return "light";
};

function setHtmlDark(d: boolean) {
  document.documentElement.classList.toggle("dark", d);
  localStorage.setItem("theme", d ? "dark" : "light");
}

export default function ThemeToggle() {
  const [selected, setSelected] = React.useState<Mode>(getInitial);
  React.useEffect(() => setHtmlDark(selected === "dark"), [selected]);

  const isDark = selected === "dark";

  return (
    <div
      className="
        relative overflow-hidden rounded-full
        border border-black/10 dark:border-white/10
        h-[1.6em] w-[4.2em]
      "
      role="group"
      aria-label="Theme Toggle"
    >
      {/* Track mit vertikalem Verlauf + dünnem Divider */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <div className="h-full w-full
                        bg-[linear-gradient(to_right,#ffffff_0%,#f0ede5_45%,#07332f_55%,var(--dark-6)_100%)]" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[0.1em]
                        bg-gradient-to-b from-transparent via-black/15 to-transparent
                        dark:via-white/15" />
      </div>

      {/* Schieber mit kleiner Überlappung in em */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={`
          absolute top-0 bottom-0
          ${isDark ? "left-1/2 rounded-r-full rounded-l-none" : "left-0 rounded-l-full rounded-r-none"}
          w-[calc(50%+0.1em)] mx-[-0.05em]
          bg-gradient-to-r from-cyan-400 to-sky-500
          shadow-[0_2px_10px_rgba(0,0,0,.25)]
          pointer-events-none
        `}
      />

      {/* Klickflächen + Icons */}
      <div className="relative grid h-full grid-cols-2">
        <button
          type="button"
          onClick={() => setSelected("light")}
          aria-pressed={!isDark}
          className="grid place-items-center z-10"
          title="Light"
        >
          <FiSun className={`${isDark ? "text-emerald-500" : "text-white"} text-[0.9em]`} />
          <span className="sr-only">Light</span>
        </button>

        <button
          type="button"
          onClick={() => setSelected("dark")}
          aria-pressed={isDark}
          className="grid place-items-center z-10"
          title="Dark"
        >
          <FiMoon className={`${!isDark ? "text-[var(--light-6)]" : "text-white"} text-[0.9em]`} />
          <span className="sr-only">Dark</span>
        </button>
      </div>
    </div>
  );
}
