"use client"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useCallback } from "react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const navLinks = [
    { href: "#", label: "Our story" },
    { href: "#", label: "Membership" },
    { href: "#", label: "Write" },
    { href: "#", label: "Sign in" }
  ]

  const footerLinks = ["Help", "Status", "About", "Careers", "Blog", "Privacy", "Terms"]

  return (
    <main className="min-h-screen bg-[#F6F2EE] text-slate-900 antialiased overflow-hidden flex flex-col">
      {/* Navbar */}
      <header className="w-full fixed top-0 left-0 right-0 z-50 bg-[#F6F2EE] backdrop-blur-md border-b border-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-serif font-bold text-slate-900">Inkspire</div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {navLinks.map((link) => (
              <Link 
                key={link.label}
                href={link.href} 
                className="text-slate-700 hover:text-slate-900 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            
            {/* CTA Button */}
            <Link
              href="#"
              className="bg-black text-white rounded-full px-4 py-2 text-sm hover:bg-slate-800 transition-colors duration-200 font-medium"
            >
              Get started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col space-y-1.5 w-6 h-6 focus:outline-none"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-slate-900 block transition-all"
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-slate-900 block transition-all"
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-slate-900 block transition-all"
            />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-[#F6F2EE] backdrop-blur-lg border-b border-slate-200/60 overflow-hidden"
            >
              <motion.nav
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col space-y-6 px-6 py-8"
              >
                {navLinks.map((link) => (
                  <Link 
                    key={link.label}
                    href={link.href} 
                    className="text-slate-700 hover:text-slate-900 text-lg font-medium transition-colors duration-200 py-2"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile CTA Button */}
                <Link
                  href="#"
                  className="bg-black text-white rounded-full px-6 py-3 text-center font-medium hover:bg-slate-800 transition-colors duration-200 mt-4"
                  onClick={closeMenu}
                >
                  Get started
                </Link>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section
        className="flex-grow flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-start 
                   max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-0 gap-8 sm:gap-10 lg:gap-12 
                   text-center lg:text-left min-h-[calc(100vh-80px)] mt-16 lg:mt-0"
      >
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col justify-center px-2 sm:px-0"
        >
          <h1 className="font-serif text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-tight tracking-tight mb-4 sm:mb-6">
            Brilliant stories & ideas
          </h1>
          <p className="max-w-md sm:max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl md:text-2xl lg:text-xl mb-6 sm:mb-8 text-slate-700 leading-relaxed">
            A space for thinkers, storytellers, and creators to share what truly matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
            <Link
              href="#"
              className="inline-block bg-black text-white rounded-full px-8 py-4 text-base sm:text-lg font-medium hover:bg-slate-800 transition w-full sm:w-auto text-center"
            >
              Start reading
            </Link>
            <Link href="#" className="text-base sm:text-lg text-slate-700 hover:underline mt-2 sm:mt-0">
              Explore topics →
            </Link>
          </div>
        </motion.div>

        {/* Animated Illustration - Hidden on mobile */}
        <motion.div
          className="relative hidden lg:flex justify-center lg:justify-end w-full lg:w-1/2"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <img
            src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png"
            alt="Illustration"
            className="w-[16rem] sm:w-[20rem] md:w-[24rem] lg:w-[30rem] xl:w-[30rem] h-auto object-contain"
            loading="lazy"
          />

          {/* Floating light animation */}
          <motion.div
            className="absolute top-16 right-10 w-3 h-3 bg-yellow-400 rounded-full blur-[2px]"
            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-slate-600 flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <span key={link} className="cursor-pointer hover:text-slate-900 transition-colors">
              {link}
            </span>
          ))}
        </div>
      </footer>
    </main>
  )
}