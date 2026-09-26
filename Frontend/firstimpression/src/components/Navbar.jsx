import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { routes } from "../routes/routes";
import { useSelector } from "react-redux";
import logo from "../assets/promotional/Firstimpression_icon_logo_copy.png";

const Navbar = ({ isSplashFinished = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useSelector((state)=>state.auth.user);

  useEffect(() => {
    const handleScroll = () => {
      // Change state if scrolled down more than 20px
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-24 w-full shrink-0">
      <motion.nav
        initial={false}
        animate={
          isSplashFinished ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
        }
        transition={{
          duration: 0.8,
          delay: isSplashFinished ? 0.3 : 0,
          ease: "easeOut",
        }}
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          isScrolled
            ? "bg-[var(--bg-surface)]/90 backdrop-blur-md shadow-sm border-b border-[var(--border-subtle)]"
            : "bg-transparent"
        }`}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 h-24 flex items-center justify-between">
          {/* Left Logo Area */}
          <Link
            to={routes.HOME}
            className={`flex items-center gap-2 transition-opacity duration-500 cursor-pointer ${
              isSplashFinished ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={logo}
              alt="FirstImpression"
              className="h-8 sm:h-9 object-contain"
            />
            <div className="flex items-center font-bold tracking-tight text-[var(--text-primary)] text-xl sm:text-2xl">
              <span className="text-[var(--theme-red-start)]">first</span>
              <span className="ml-0.5">impression</span>
            </div>
          </Link>
          {/* Middle Links */}
          <div className="hidden md:flex items-center gap-10 font-medium text-[15px] text-[var(--text-secondary)]">
            <HashLink
              smooth
              to={routes.TEMPLATES}
              className="hover:text-[var(--theme-red-hover)] transition-colors">
              Templates
            </HashLink>
            <HashLink
              to={routes.FEATURES}
              className="hover:text-[var(--theme-red-hover)] transition-colors">
              Features
            </HashLink>
            
            <HashLink
              to={routes.ABOUT_US}
              className="hover:text-[var(--theme-red-hover)] transition-colors">
              About us
            </HashLink>
          </div>
          {/* Right Button */}
          {!user && (
            <div className="flex items-center gap-4">
              <HashLink
                smooth
                to={routes.SIGNIN}
                className="hidden sm:block text-[var(--text-secondary)] font-medium hover:text-[var(--theme-red-hover)] transition-colors">
                Sign in
              </HashLink>
              <HashLink
                smooth
                to={routes.SIGNUP}
                className={`
              h-11 px-6 rounded-full font-semibold flex items-center justify-center shrink-0 transition-all duration-300
              ${
                isScrolled
                  ? "bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] text-[var(--text-inverse)] hover:shadow-md hover:-translate-y-0.5"
                  : "bg-gray-900 text-[var(--text-inverse)] hover:bg-gray-800 hover:-translate-y-0.5"
              }
            `}>
                Get Started
              </HashLink>
            </div>
          )}

          {user && (
            <HashLink
              smooth
              to={routes.DASHBOARD}
              className={`
              h-11 px-6 rounded-full font-semibold flex items-center justify-center shrink-0 transition-all duration-300
              ${
                isScrolled
                  ? "bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] text-[var(--text-inverse)] hover:shadow-md hover:-translate-y-0.5"
                  : "bg-gray-900 text-[var(--text-inverse)] hover:bg-gray-800 hover:-translate-y-0.5"
              }
            `}>
              Craft My Resume
            </HashLink>
          )}
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
