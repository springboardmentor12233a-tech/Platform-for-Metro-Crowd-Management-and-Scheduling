import {
  LayoutDashboard,
  Activity,
  BrainCircuit,
  BarChart3,
  CalendarClock,
  Bell,
  History,
  Settings,
  MapPinned,
  Users,
} from "lucide-react";

export const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Admin", "Operator", "Analyst", "Member"],
  },
  {
    title: "Crowd Monitoring",
    path: "/crowd",
    icon: Activity,
    roles: ["Admin", "Operator", "Analyst"],
  },
  {
    title: "Prediction",
    path: "/prediction",
    icon: BrainCircuit,
    roles: ["Admin", "Operator", "Analyst"],
  },
  {
    title: "Forecast",
    path: "/forecast",
    icon: BarChart3,
    roles: ["Admin", "Operator", "Analyst"],
  },
  {
    title: "Prediction History",
    path: "/prediction-history",
    icon: History,
    roles: ["Admin", "Operator", "Analyst"],
  },
  {
    title: "Smart Schedule",
    path: "/smart-schedule",
    icon: CalendarClock,
    roles: ["Admin", "Operator"],
  },
  {
    title: "AI Alerts",
    path: "/alerts",
    icon: Bell,
    roles: ["Admin", "Operator", "Analyst"],
  },
  {
    title: "Stations",
    path: "/stations",
    icon: MapPinned,
    roles: ["Admin"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["Admin"],
  },
  {
    title: "User Management",
    path: "/users",
    icon: Users,
    roles: ["Admin"],
  },
];