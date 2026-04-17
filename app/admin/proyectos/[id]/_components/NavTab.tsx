"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface NavTabProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  notificationCount?: number;
  color: string;
}

export function NavTab({
  active,
  onClick,
  icon: Icon,
  label,
  notificationCount,
  color,
}: NavTabProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all group relative overflow-hidden ${active ? "bg-white/10 text-white" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
    >
      {active && (
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 bg-current ${color}`}
        />
      )}
      <Icon
        className={`w-5 h-5 ${active ? color : "group-hover:text-white transition-colors"}`}
      />
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
      {notificationCount !== undefined && notificationCount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
          {notificationCount}
        </span>
      )}
    </button>
  );
}
