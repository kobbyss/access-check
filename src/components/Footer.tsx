import { Mail, Github, Twitter } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BRAND_NAME, CONTACT_EMAIL } from "../config";
import Logo from "./Logo";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/tiers", label: "System Tiers" },
  { to: "/consultation", label: "Consultation" },
  { to: "/gallery", label: "Customer Builds" },
  { to: "/support", label: "Support" },
] as const;

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size={26} />
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Hand-built, performance-tuned PCs. Every system is stress-tested,
              component-matched, and assembled with obsessive attention to detail.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">
              Navigate
            </h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-400 hover:text-accent-cyan transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">
              Connect
            </h4>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent-cyan transition-colors mb-3"
            >
              <Mail className="w-4 h-4" />
              {CONTACT_EMAIL}
            </a>
            <div className="flex gap-3">
              {[Twitter, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 font-mono">
            Built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}