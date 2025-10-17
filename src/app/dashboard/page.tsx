"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, signOutUser } from "../../../lib/firebase"
import { motion } from "framer-motion"
import type { User } from "firebase/auth"
import Image from "next/image"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [userTopics, setUserTopics] = useState<string[]>([])
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/")
      } else {
        setUser(user)
        
        // ✅ FIRST: Check localStorage for custom profile image (highest priority)
        const storedProfile = localStorage.getItem(`user_${user.uid}_profile_data`)
        if (storedProfile) {
          const profileData = JSON.parse(storedProfile)
          if (profileData.profileImage) {
            setProfileImage(profileData.profileImage)
            return // Custom image mil gayi, Firebase Auth check karne ki zaroorat nahi
          }
        }

        // ✅ SECOND: Fallback to Firebase Auth photoURL
        if (user.photoURL) {
          let photoUrl = user.photoURL
          // Ensure we have the proper Google Photos URL format
          if (photoUrl.includes('googleusercontent.com')) {
            photoUrl = photoUrl.replace(/=s\d+-c$/, '=s400-c') // Set to 400px size
          }
          setProfileImage(photoUrl)
        }
        
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
        <motion.div
          className="w-16 h-16 border-[5px] border-black border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    )
  }

  // ✅ Check if image is base64 for proper Next.js Image handling
  const isBase64Image = (str: string | null): boolean => {
    if (!str) return false
    return str.startsWith('data:image/')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-slate-900">Inkspire</div>
          
          <div className="flex items-center space-x-4">
            {/* ✅ Profile Image with Display Name */}
            <div className="flex items-center space-x-3">
              {profileImage ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200"
                >
                  {/* ✅ Use regular img tag for base64 images, Next.js Image for URLs */}
                  {isBase64Image(profileImage) ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setProfileImage(null)}
                    />
                  ) : (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      onError={() => setProfileImage(null)}
                      priority
                    />
                  )}
                </motion.div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-200">
                  <span className="text-sm font-medium text-gray-600">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
              )}
              
              <span className="text-slate-700 font-medium">
                {user.displayName || "User"}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="bg-black text-white rounded-full px-4 py-2 text-sm hover:bg-slate-800 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ✅ Welcome Section with Profile */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-6 bg-gradient-to-r from-slate-50 to-white p-6 rounded-2xl border border-gray-200">
            {/* ✅ Large Profile Image */}
            <div className="flex-shrink-0">
              {profileImage ? (
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {/* ✅ Use regular img tag for base64 images, Next.js Image for URLs */}
                  {isBase64Image(profileImage) ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setProfileImage(null)}
                    />
                  ) : (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      onError={() => setProfileImage(null)}
                      priority
                    />
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                Welcome back, {user.displayName || "Writer"}! ✨
              </h1>
              <p className="text-slate-600 text-lg">
                Ready to explore some brilliant stories and ideas?
              </p>
            </div>
          </div>
        </motion.section>

        {/* ✅ User's Topics Section */}
        {userTopics.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-4">
              Your Interests
            </h2>
            <div className="flex flex-wrap gap-3">
              {userTopics.map((topic, index) => (
                <motion.span
                  key={topic}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {topic}
                </motion.span>
              ))}
            </div>
          </motion.section>
        )}

        {/* ✅ Dashboard Content */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Example Dashboard Cards */}
          {[
            {
              title: "Your Stories",
              description: "Continue writing your next masterpiece",
              count: 3,
              color: "from-blue-50 to-cyan-50"
            },
            {
              title: "Saved Articles",
              description: "Stories you've bookmarked for later",
              count: 12,
              color: "from-green-50 to-emerald-50"
            },
            {
              title: "Following",
              description: "Writers you're following",
              count: 8,
              color: "from-purple-50 to-pink-50"
            }
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${card.color} p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {card.title}
              </h3>
              <p className="text-slate-600 mb-4">
                {card.description}
              </p>
              <div className="text-2xl font-bold text-slate-900">
                {card.count}
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ✅ Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-6">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Write a Story", icon: "✍️" },
              { label: "Explore Topics", icon: "🔍" },
              { label: "Edit Profile", icon: "👤" },
              { label: "Settings", icon: "⚙️" }
            ].map((action,) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 bg-white border border-gray-300 rounded-xl px-6 py-4 hover:border-black transition-colors group"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium text-slate-900 group-hover:text-black">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
}