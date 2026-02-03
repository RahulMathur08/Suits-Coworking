"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

interface SidebarItem {
  name: string;
  href: string;
  icon: string;
  roles?: string[];
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems: SidebarItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "📊",
      roles: ["admin", "member"],
    },
    {
      name: "User Management",
      href: "/dashboard/users",
      icon: "👥",
      roles: ["admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role || ""),
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">CM</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Coworking</h1>
            <p className="text-gray-400 text-sm">Management System</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm">
                {user?.role === "admin" ? "👨‍💼" : "👤"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {filteredMenuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={() => {
              logout();
              router.push("/");
              toast.success("Logged out successfully!");
            }}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
          >
            <span className="mr-3 text-lg">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
