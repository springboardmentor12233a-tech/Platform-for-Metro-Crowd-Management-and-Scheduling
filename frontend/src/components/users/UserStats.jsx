import React from "react";
import {
  Users,
  ShieldCheck,
  UserCog,
  BarChart3,
  User,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    key: "total",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Admins",
    key: "Admin",
    icon: ShieldCheck,
    color: "text-red-600",
  },
  {
    title: "Operators",
    key: "Operator",
    icon: UserCog,
    color: "text-blue-500",
  },
  {
    title: "Analysts",
    key: "Analyst",
    icon: BarChart3,
    color: "text-purple-600",
  },
  {
    title: "Members",
    key: "Member",
    icon: User,
    color: "text-green-600",
  },
];

export default function UserStats({ users }) {
  const counts = {
    total: users.length,
    Admin: users.filter((u) => u.role === "Admin").length,
    Operator: users.filter((u) => u.role === "Operator").length,
    Analyst: users.filter((u) => u.role === "Analyst").length,
    Member: users.filter((u) => u.role === "Member").length,
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {counts[item.key]}
                </h2>
              </div>

              <div
                className={`rounded-xl bg-gray-100 p-3 dark:bg-gray-800 ${item.color}`}
              >
                <Icon size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}