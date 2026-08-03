import {
  Settings,
  User,
  Shield,
  Bell,
  Brain,
  Train,
  Palette,
  KeyRound,
} from "lucide-react";

const items = [
  {
    id: "general",
    label: "General",
    icon: Settings,
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "ai",
    label: "AI Settings",
    icon: Brain,
  },
  {
    id: "metro",
    label: "Metro Operations",
    icon: Train,
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
  },
  {
    id: "api",
    label: "API Keys",
    icon: KeyRound,
  },
];

export default function SettingsSidebar({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="space-y-2">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={18} />

              {item.label}
            </button>
          );
        })}

      </div>

    </div>
  );
}