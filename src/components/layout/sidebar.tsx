"use client";

import {
  FileText,
  BarChart3,
  Upload,
  Home,
  File,
  Search,
  Clock,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const navigation = [
  {
    id: 1,
    name: "Trang chủ",
    href: "/",
    icon: Home,
    badge: () => <span className="inline-flex items-center rounded-full bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 inset-ring inset-ring-pink-400/20">Best</span>,
    description: "Trang tổng quan của ứng dụng AI Docs"
  },
  {
    id: 2,
    name: "Phân tích SEO",
    href: "/seo",
    icon: Search,
    badge: () => <span className="inline-flex items-center rounded-full bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 inset-ring inset-ring-pink-400/20">New</span>,
    description: "Phân tích SEO của trang web"
  },
  {
    id: 3,
    name: "Tải file lên",
    href: "/upload",
    icon: Upload,
    badge: () => <span className="inline-flex items-center rounded-full bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 inset-ring inset-ring-pink-400/20">Demo</span>,
    description: "Tải file lên để phân tích"
  },
  {
    id: 4,
    name: "Tài liệu Word",
    href: "/documents",
    icon: FileText,
    badge: () => <span className="inline-flex items-center rounded-full bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 inset-ring inset-ring-pink-400/20">OK</span>,
    description: "Tài liệu Word"
  },
  {
    id: 5,
    name: "Tài liệu PDF",
    href: "/pdfs",
    icon: File,
    badge: () => <span className="inline-flex items-center rounded-full bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 inset-ring inset-ring-pink-400/20">Beta</span>,
    description: "Tài liệu PDF"
  },
  {
    id: 6,
    name: "Tài liệu Excel",
    href: "/excel",
    icon: BarChart3,
    badge: () => <span className="inline-flex items-center rounded-full bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 inset-ring inset-ring-pink-400/20">OK</span>,
    description: "Tài liệu Excel"
  },
  {
    id: 7,
    name: "Update Log",
    href: "/updates",
    icon: Clock,
    badge: () => <span className="inline-flex items-center rounded-full bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 inset-ring inset-ring-green-400/20">Log</span>,
    description: "Lịch sử cập nhật và cải thiện"
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-min-screen w-64 flex-col bg-gray-50 dark:bg-gray-900 overflow-y-auto " style={{scrollbarWidth: 'none'}}>
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
                    <button
                      key={item.id}
                      onClick={() => router.push(item.href)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer",
                        pathname === item.href
                          ? "bg-slate-200 border border-blue-200 text-slate-800 dark:text-blue-200 dark:bg-slate-950 dark:border-slate-800"
                          : "text-muted-foreground hover:text-foreground dark:hover:text-blue-200 dark:hover:bg-slate-950 dark:hover:border-slate-800"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-muted-foreground dark:text-gray-600 truncate mb-2">
                            {item.description}
                          </div>
                          {item.badge()}
                        </div>
                        {pathname === item.href && (
                          <div className="w-2 h-2 bg-slate-800 rounded-full" />
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            <Separator />
            {/* Chuyển donate về đây */}
            <div className="w-full bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg p-4 mt-4 shadow-md">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">💝</span>
                  <h3 className="text-sm font-semibold">Ủng hộ tôi</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Nếu công cụ này hữu ích với bạn
                </p>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
                  onClick={() => {
                    router.push("/donate")
                  }}
                >
                  <span className="text-xs">❤️ Donate</span>
                </Button>
              </div>
            </div>

          </li>
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className=" p-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
