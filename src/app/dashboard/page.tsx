"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, signOutUser } from "../../../lib/firebase"
import { motion } from "framer-motion"
import { LogOut, User, Settings } from "lucide-react"

interface UserData {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/")
      } else {
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOutUser()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navigateToProfile = () => {
    router.push("/profile")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F2EE] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#F6F2EE]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-slate-900">Inkspire</div>

          <div className="flex items-center gap-4">
            <button
              onClick={navigateToProfile}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-slate-700">
                Welcome, <strong>{user?.displayName || "User"}</strong>!
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
            Welcome to your Dashboard, {user?.displayName}!
          </h1>
          <p className="text-slate-600 mb-8">
            This is your personalized space. Your name &quot;{user?.displayName}&quot; is successfully updated in the system.
          </p>

          {/* User Info Card */}
          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500">Full Name</label>
                <p className="text-lg font-medium">{user?.displayName || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Email</label>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={navigateToProfile}
              className="bg-black text-white rounded-xl p-6 text-left hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
              <p className="text-slate-300">Update your personal information</p>
            </button>

            <button className="bg-slate-100 rounded-xl p-6 text-left hover:bg-slate-200 transition-colors">
              <User className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Your Stories</h3>
              <p className="text-slate-600">View and manage your published stories</p>
            </button>

            <button className="bg-slate-100 rounded-xl p-6 text-left hover:bg-slate-200 transition-colors">
              <Settings className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-slate-600">Customize your reading experience</p>
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}