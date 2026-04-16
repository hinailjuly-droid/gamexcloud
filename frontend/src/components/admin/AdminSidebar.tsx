"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Gamepad2, 
  BarChart3, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import Cookies from "js-cookie";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { name: "Games Manager", icon: Gamepad2, href: "/admin/games" },
    { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-primary-light border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <Link href="/admin/dashboard" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white" size={18} />
          </div>
          <span className="text-lg font-black tracking-tight text-white uppercase italic">
            Vault<span className="text-accent underline">Admin</span>
          </span>
        </Link>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                pathname === item.href 
                  ? "bg-accent text-white shadow-lg shadow-accent/20" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-gray-500 hover:text-white hover:bg-white/5 uppercase tracking-widest transition-all">
          <ExternalLink size={14} /> View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-xs font-black text-red-500 hover:bg-red-500/10 uppercase tracking-widest transition-all"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );
}
