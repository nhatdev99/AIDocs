"use client";

import {
  FileText,
  BarChart3,
  Upload,
  Home,
  File,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Upload Files", href: "/upload", icon: Upload },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "PDFs", href: "/pdfs", icon: File },
  { name: "Excel", href: "/excel", icon: BarChart3 },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps = {}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">AI Docs</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col px-4 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                      )}
                    >
                      <Icon
                        className={cn(
                          pathname === item.href
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300",
                          "h-6 w-6 shrink-0"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="flex-shrink-0 p-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
