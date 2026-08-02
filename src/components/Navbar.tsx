import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { BRAND_NAME } from "../config";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/tiers", label: "System Tiers" },
  { to: "/consultation", label: "Consultation" },
  { to: "/gallery", label: "Customer Builds" },
  { to: "/support", label: "Support" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentPath = location.pathname === "/success" ? "/consultation" : location.pathname;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink-950/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center group" aria-label={`${BRAND_NAME} home`} onClick={() => setMobileOpen(false)}>
          <Logo size={30} />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                currentPath === link.to
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
              {currentPath === link.to && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent-cyan rounded-full shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            onClick={() => navigate({ to: "/consultation" })}
            className="btn-primary text-xs px-5 py-2.5"
          >
            Start Your Build
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-300 p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-ink-900/95 backdrop-blur-xl border-b border-white/[0.06] animate-fade-in-down">
          <div className="px-6 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === link.to
                    ? "text-white bg-white/[0.05]"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate({ to: "/consultation" });
              }}
              className="btn-primary w-full mt-2 text-xs"
            >
              Start Your Build
            </button>
          </div>
        </div>
      )}
    </header>
  );
}