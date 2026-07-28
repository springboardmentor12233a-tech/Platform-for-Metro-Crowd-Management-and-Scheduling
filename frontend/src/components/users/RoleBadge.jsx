import React from "react";
import {
  ShieldCheck,
  UserCog,
  BarChart3,
  User,
} from "lucide-react";

const roleStyles = {
  Admin: {
    icon: ShieldCheck,
    className:
      "bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },

  Operator: {
    icon: UserCog,
    className:
      "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },

  Analyst: {
    icon: BarChart3,
    className:
      "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
  },

  Member: {
    icon: User,
    className:
      "bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
  },
};

export default function RoleBadge({ role }) {
  const config = roleStyles[role] || roleStyles.Member;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon size={14} />
      {role}
    </span>
  );
}