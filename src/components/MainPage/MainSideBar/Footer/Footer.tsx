"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-fillStrong text-labelNeutral rounded-2xl p-5 text-center w-[290px] mx-auto translate-x-[-8px]">
      <p>@gather_here</p>
      <div className="footer-links mt-2 space-x-2">
        <Link href="/privacy-policy" className="md:hover:text-primary cursor-pointer">
          개인정보처리방침
        </Link>
        <span>|</span>
        <Link href="/terms-of-service" className="md:hover:text-primary cursor-pointer">
          이용약관
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
