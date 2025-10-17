"use client"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useCallback, useEffect } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import { signInWithGoogle, auth } from "../../../lib/firebase"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, User } from "firebase/auth"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  // ✅ Firebase auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const profileCompleted = localStorage.getItem(`user_${user.uid}_profile_completed`)
        const topicsSelected = localStorage.getItem(`user_${user.uid}_topics_selected`)

        if (profileCompleted === "true" && topicsSelected === "true") {
          router.replace("/dashboard")
        } else if (profileCompleted === "false") {
          router.replace("/profile-completion")
        } else {
          router.replace("/topics-selection")
        }
      } else {
        setIsCheckingAuth(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), [])
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const openSignIn = useCallback(() => {
    setIsSignInOpen(true)
    setIsSignUp(true)
  }, [])
  const openSignInForm = useCallback(() => {
    setIsSignInOpen(true)
    setIsSignUp(false)
  }, [])
  const closeSignIn = useCallback(() => setIsSignInOpen(false), [])
  const switchToSignIn = useCallback(() => setIsSignUp(false), [])
  const switchToSignUp = useCallback(() => setIsSignUp(true), [])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const result = await signInWithGoogle()
      const user = result.user

      const isNewUser =
        user.metadata.creationTime === user.metadata.lastSignInTime ||
        !localStorage.getItem(`user_${user.uid}_profile_completed`)

      if (isNewUser) {
        localStorage.setItem(`user_${user.uid}_profile_completed`, "false")
        router.push("/profile-completion")
      } else {
        const topicsSelected = localStorage.getItem(`user_${user.uid}_topics_selected`)
        if (topicsSelected === "true") {
          router.push("/dashboard")
        } else {
          router.push("/topics-selection")
        }
      }
    } catch (error) {
      console.error("Google sign in error:", error)
      alert("Sign in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Stylish loader while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F2EE] text-slate-900">
        <motion.div
          className="w-16 h-16 border-[5px] border-black border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.h1
          className="mt-8 text-4xl font-serif font-semibold text-slate-800 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 0.8, 1], y: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Welcome ✨
        </motion.h1>
      </div>
    )
  }

  // ✅ Original design preserved
  const navLinks = [
    { href: "#", label: "Our story" },
    { href: "#", label: "Membership" },
    { href: "#", label: "Write" },
    { href: "#", label: "Sign in", onClick: openSignInForm }
  ]

  const footerLinks = ["Help", "Status", "About", "Careers", "Blog", "Privacy", "Terms", "Text to speech", "Teams"]

  const signUpOptions = [
    {
      id: "google",
      label: "Sign up with Google",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      ),
      onClick: handleGoogleSignIn
    },
  ]

  const signInOptions = [
    {
      id: "google-signin",
      label: "Sign in with Google",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      ),
      onClick: handleGoogleSignIn
    },
  ]

  return (
    <main className="min-h-screen bg-[#F6F2EE] text-slate-900 antialiased overflow-hidden flex flex-col">
      {/* Your existing JSX remains the same... */}
      {/* Navbar */}
      <header className="w-full fixed top-0 left-0 right-0 z-50 bg-[#F6F2EE] backdrop-blur-md border-b border-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-slate-900">Inkspire</div>

          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {navLinks.map((link) => (
              link.onClick ? (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  className="text-slate-700 hover:text-slate-900 transition-colors duration-200"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-slate-700 hover:text-slate-900 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              )
            ))}

            <button
              onClick={openSignIn}
              className="bg-black text-white rounded-full px-4 py-2 text-sm hover:bg-slate-800 transition-colors duration-200 font-medium"
            >
              Get started
            </button>
          </nav>

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
                  link.onClick ? (
                    <button
                      key={link.label}
                      onClick={() => {
                        closeMenu()
                        link.onClick()
                      }}
                      className="text-slate-700 hover:text-slate-900 text-lg font-medium transition-colors duration-200 py-2 text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-slate-700 hover:text-slate-900 text-lg font-medium transition-colors duration-200 py-2"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  )
                ))}

                <button
                  onClick={() => {
                    closeMenu()
                    openSignIn()
                  }}
                  className="bg-black text-white rounded-full px-6 py-3 text-center font-medium hover:bg-slate-800 transition-colors duration-200 mt-4"
                >
                  Get started
                </button>
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
            <button
              onClick={openSignIn}
              className="inline-block bg-black text-white rounded-full px-8 py-4 text-base sm:text-lg font-medium hover:bg-slate-800 transition w-full sm:w-auto text-center"
            >
              Start reading
            </button>
            <Link href="#" className="text-base sm:text-lg text-slate-700 hover:underline mt-2 sm:mt-0">
              Explore topics →
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative hidden lg:flex justify-center lg:justify-end w-full lg:w-1/2"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <Image
            src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png"
            alt="Illustration"
            width={480}
            height={360}
            className="w-[16rem] sm:w-[20rem] md:w-[24rem] lg:w-[30rem] xl:w-[30rem] h-auto object-contain"
            loading="lazy"
          />

          <motion.div
            className="absolute top-16 right-10 w-3 h-3 bg-yellow-400 rounded-full blur-[2px]"
            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      <footer className="border-t border-black mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-slate-600 flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <span key={link} className="cursor-pointer hover:text-slate-900 transition-colors">
              {link}
            </span>
          ))}
        </div>
      </footer>

      <AnimatePresence>
        {isSignInOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={closeSignIn}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-3xl ">
                    {isSignUp ? "Join Inkspire" : "Welcome Back"}
                  </h2>
                  <button
                    onClick={closeSignIn}
                    className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-white/80 text-lg">
                  {isSignUp 
                    ? "Discover stories, thinking, and expertise from writers on any topic." 
                    : "Continue your journey with brilliant stories and ideas."}
                </p>
              </div>

              <div className="p-8 space-y-4">
                {(isSignUp ? signUpOptions : signInOptions).map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={option.onClick}
                    disabled={isLoading}
                    className="flex items-center space-x-4 p-4 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-white transition-all duration-200 w-full text-left group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center w-6 h-6">
                      {option.icon}
                    </div>
                    <span className="text-slate-800 font-semibold flex-1 group-hover:text-slate-900">
                      {option.label}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors" />
                  </motion.button>
                ))}
              </div>

              <div className="p-6 bg-slate-50/80 border-t border-slate-200">
                <div className="text-center text-slate-600">
                  {isSignUp ? (
                    <>
                      Already have an account?{" "}
                      <button 
                        onClick={switchToSignIn}
                        className="text-slate-900 font-semibold hover:text-slate-700 underline transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <button 
                        onClick={switchToSignUp}
                        className="text-slate-900 font-semibold hover:text-slate-700 underline transition-colors"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-500 text-center mt-3">
                  By continuing, you agree to our{" "}
                  <button className="underline hover:text-slate-700">Terms of Service</button>{" "}
                  and{" "}
                  <button className="underline hover:text-slate-700">Privacy Policy</button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
} 