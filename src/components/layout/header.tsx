"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <Container
        as="nav"
        aria-label="Main"
        className="flex h-16 items-center justify-between gap-6"
      >
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-gray-900"
        >
          {siteConfig.name}
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "hover:text-primary-600 text-sm font-medium transition-colors",
                isActive(item.href) ? "text-primary-700" : "text-gray-700",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button href="/contact" size="sm" className="hidden sm:inline-flex">
            Get in touch
          </Button>
          <button
            type="button"
            className="rounded-md p-2 text-gray-700 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open main menu"
          >
            <Bars3Icon className="size-6" aria-hidden="true" />
          </button>
        </div>
      </Container>

      <Dialog open={mobileOpen} onClose={setMobileOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-gray-900/40" aria-hidden="true" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white px-6 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="font-display text-lg font-bold tracking-tight text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              {siteConfig.name}
            </Link>
            <button
              type="button"
              className="rounded-md p-2 text-gray-700"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <XMarkIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 text-base font-medium",
                  isActive(item.href)
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-900 hover:bg-gray-50",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button
              href="/contact"
              className="mt-4 w-full"
              onClick={() => setMobileOpen(false)}
            >
              Get in touch
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
