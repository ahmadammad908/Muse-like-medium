"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, updateUserProfile } from "../../../lib/firebase"
import { motion } from "framer-motion"

export default function ProfileCompletion() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/")
      } else {
        setEmail(user.email || "")
        if (user.displayName) {
          setFullName(user.displayName)
        }
      }
    })

    return () => unsubscribe()
  }, [router])

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    await updateUserProfile({
      displayName: fullName
    })

    const user = auth.currentUser
    if (user) {
      localStorage.setItem(`user_${user.uid}_profile_completed`, 'true')

      console.log("Profile completed:", {
        fullName,
        email,
        uid: user.uid
      })
    }

    router.push("/topics-selection")
  } catch (error) {
    console.error("Error saving profile:", error)
    alert("Error completing profile. Please try again.")
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-black mb-2">Inkspire</h1>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-normal text-black mb-2">
              Welcome to Inkspire!
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Finish creating your account so that you can upgrade to membership.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Your full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Email
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded bg-gray-50 text-gray-600">
                {email || "email@example.com"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email: {email || "email@example.com"}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!fullName || isLoading}
              className="w-full bg-black text-white rounded-full py-3 font-normal hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-base"
            >
              {isLoading ? "Creating Account..." : "Create account"}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our{" "}
              <button type="button" className="underline hover:text-gray-700">Terms of Service</button>{" "}
              and{" "}
              <button type="button" className="underline hover:text-gray-700">Privacy Policy</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}