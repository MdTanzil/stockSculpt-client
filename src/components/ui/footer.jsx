/* eslint-disable react/prop-types */
import { Github, Hexagon, Twitter } from "lucide-react";

export function Footer({
  logo = <Hexagon className="h-10 w-10" />,
  brandName = "StockSculpt",
  socialLinks = [
    {
      icon: <Twitter className="h-5 w-5" />,
      href: "https://twitter.com/StockSculpt",
      label: "Twitter",
    },
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/StockSculpt",
      label: "GitHub",
    },
  ],
  mainLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/pricing", label: "Pricing" },
    { href: "/features", label: "Features" },
    { href: "/support", label: "Support" },
  ],
  legalLinks = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
  ],
  copyright = {
    text: "© 2025 StockSculpt",
    license: "All rights reserved.",
  },
}) {
  return (
    <footer className="pb-6 pt-16 lg:pb-8 lg:pt-10 bg-[#445760] text-white">
      <div className="px-4 lg:px-8">
        <div className="border-t mt-6 pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-1 mx-2 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end">
              {legalLinks.map((link, i) => (
                <li key={i} className="my-1 mx-3 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 text-sm leading-6 text-muted-foreground whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <div>{copyright.text}</div>
            {copyright.license && <div>{copyright.license}</div>}
          </div>
        </div>
      </div>
    </footer>
  );
}
