import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CurrentYear } from "@/components/layout/current-year";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-gray-300">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <Link
              href="/"
              className="font-display text-lg font-bold tracking-tight text-white"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-gray-400">
              {siteConfig.description}
            </p>
            <address className="mt-4 text-sm text-gray-400 not-italic">
              <div>{siteConfig.contact.address}</div>
              <div>
                <a
                  className="hover:text-white"
                  href={`mailto:${siteConfig.contact.email}`}
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div>
                <a
                  className="hover:text-white"
                  href={`tel:${siteConfig.contact.phone}`}
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
            </address>
          </div>

          {siteConfig.footerNav.map((col) => (
            <div key={col.title}>
              <h2 className="text-sm font-semibold text-white">{col.title}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-gray-400">
            &copy; <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href={siteConfig.social.twitter}
              className="text-sm text-gray-400 hover:text-white"
            >
              Twitter
            </a>
            <a
              href={siteConfig.social.linkedin}
              className="text-sm text-gray-400 hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
