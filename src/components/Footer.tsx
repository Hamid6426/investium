"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();

  const excludedBasePaths = ["/dashboard", "/admin", "/superadmin"];
  const shouldHideNavbar = excludedBasePaths.some((basePath) =>
    pathname.startsWith(basePath)
  );
  if (shouldHideNavbar) return null;

  return (
    <footer className="bg-card border-t border-accent">
      <div className="max-w-3xl mx-auto px-3 py-12">
        {/* Navigation */}

        {/* Brand or Call to Action */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="font-bold text-3xl text-primary">INVESTIUM</h3>
          <p className="text-lg text-center font-light">
            We have considered our solutions to support every stage of your
            growth and get the potential service
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center mt-8 font-bold">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <Link href="/about" className="hover:text-accent">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-accent">
            Contact Us
          </Link>
          <Link href="/privacy-policy" className="hover:text-accent">
            Privacy Policy
          </Link>
          <Link href="/disclaimer" className="hover:text-accent">
            Cookie Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-accent">
            Terms of Service
          </Link>
        </div>

        <div className="mt-8 text-center ">
          &copy; {new Date().getFullYear()} Investium. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
