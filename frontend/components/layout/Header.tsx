'use client';

import {
  Bell,
  Search,
  CircleUserRound
} from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
  userEmail: string;
}

export default function Header({
  title,
  subtitle,
  userEmail
}: HeaderProps) {
  return (

    <header className="bg-slate-900 border-b border-slate-800 px-8 py-5">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            {title}
          </h1>

          <p className="text-slate-400 mt-1">
            {subtitle}
          </p>

        </div>

        <div className="flex items-center gap-5">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              placeholder="Search..."
              className="bg-slate-800 rounded-lg pl-10 pr-4 py-2 w-64 outline-none border border-slate-700"
            />

          </div>

          <Bell className="cursor-pointer hover:text-cyan-400" />

          <CircleUserRound size={34} />

          <div>

            <p className="font-semibold">
              {userEmail}
            </p>

            <p className="text-xs text-slate-400">
              Administrator
            </p>

          </div>

        </div>

      </div>

    </header>

  );
}