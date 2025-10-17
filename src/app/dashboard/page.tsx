"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Menu,
  X,
  Search,
  LogOut,
  Settings,
  PenLine,
  User,
  Home,
  BookMarked,
  FileText,
  BarChart2,
  Users,
  Plus,
} from "lucide-react"
import { auth, signOutUser } from "../../../lib/firebase"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [user, setUser] = useState<FirebaseUser | null>(null)

  const router = useRouter()

  // 🔥 Realtime Firebase user listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // ✅ Handle Sign Out + Redirect to landing page
  const handleSignOut = async () => {
    await signOutUser()
    setIsProfileMenuOpen(false)
    router.push("/") // 👈 Redirect to home/landing page
  }

  return (
    <>
      {/* ===== Navbar ===== */}
      <header className="w-full border-b border-gray-200 bg-white fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Medium</h1>
          </div>

          {/* Middle: Search Bar (Desktop Only) */}
          <div className="hidden sm:flex items-center flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* Right: Write + Profile + Mobile Search */}
          <div className="flex items-center space-x-4 relative">
            {/* Search icon visible only on mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Search className="w-6 h-6 text-gray-700" />
            </button>

            {/* Write Button (Desktop) */}
            <button className="hidden sm:inline-flex items-center space-x-2 border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100 transition">
              ✍️ <span>Write</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="relative focus:outline-none"
            >
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full border border-gray-300 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                  {user?.displayName?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </button>

            {/* ===== Profile Dropdown ===== */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                >
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-medium text-gray-900">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>

                  <div className="py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition">
                      <User className="w-4 h-4 mr-2" /> Profile
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition">
                      <PenLine className="w-4 h-4 mr-2" /> Write
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition">
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition text-red-500"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ===== Sidebar (Hamburger Menu) ===== */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 flex flex-col"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                <h2 className="text-xl font-serif font-bold text-gray-900">Medium</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Sidebar Menu with Lucide Icons */}
              <div className="flex flex-col px-6 py-6 space-y-6 text-[15px] text-gray-800">
                <button className="flex items-center space-x-3 hover:text-black transition">
                  <Home className="w-5 h-5 text-gray-700" />
                  <span>Home</span>
                </button>
                <button className="flex items-center space-x-3 hover:text-black transition">
                  <BookMarked className="w-5 h-5 text-gray-700" />
                  <span>Library</span>
                </button>
                <button className="flex items-center space-x-3 hover:text-black transition">
                  <User className="w-5 h-5 text-gray-700" />
                  <span>Profile</span>
                </button>
                <button className="flex items-center space-x-3 hover:text-black transition">
                  <FileText className="w-5 h-5 text-gray-700" />
                  <span>Stories</span>
                </button>
                <button className="flex items-center space-x-3 hover:text-black transition">
                  <BarChart2 className="w-5 h-5 text-gray-700" />
                  <span>Stats</span>
                </button>

                <div className="border-t border-gray-200 pt-6">
                  <button className="flex items-center space-x-3 hover:text-black transition mb-3">
                    <Users className="w-5 h-5 text-gray-700" />
                    <span>Following</span>
                  </button>
                  <button className="flex items-center space-x-3 hover:text-black transition mb-1 ">
                    <Plus className="w-5 h-5 text-gray-700" />
                    <span>Find writers and publications to </span>
                   
                    
                  </button>
                   <span className="pl-[32px]">follow</span>
                  
                  <p className="text-sm text-gray-600 underline cursor-pointer hover:text-black">
                    See suggestions
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== Mobile Search Overlay ===== */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <h2 className="text-xl font-serif font-bold text-gray-900">Medium</h2>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Search Box */}
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            </div>

            {/* Recent Searches */}
            <div className="px-4 py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Recent searches
              </h3>
              <p className="text-gray-600 text-sm">You have no recent searches</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-[64px]" />
    </>
  )
}
