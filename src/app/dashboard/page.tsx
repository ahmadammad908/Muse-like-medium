"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, signOutUser } from "../../../lib/firebase"
// import { motion } from "framer-motion"
import type { User } from "firebase/auth"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [userTopics, setUserTopics] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/")
      } else {
        setUser(user)

        const profileCompleted = localStorage.getItem(`user_${user.uid}_profile_completed`)
        if (profileCompleted !== "true") {
          router.push("/profile-completion")
          return
        }

        const topics = localStorage.getItem(`user_${user.uid}_topics`)
        if (topics) {
          setUserTopics(JSON.parse(topics))
        }
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOutUser()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-slate-900">Inkspire</div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-700">Welcome, {user.displayName || "User"}</span>
            <button
              onClick={handleSignOut}
              className="bg-black text-white rounded-full px-4 py-2 text-sm hover:bg-slate-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      {/* ... rest of your JSX */}
    </div>
  )
}
