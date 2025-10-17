"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "../../../lib/firebase"

export default function TopicsSelection() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/")
    })
    return () => unsubscribe()
  }, [router])

  const allTopics: string[] = [
    "Programming", "Data Science", "Technology", "Self Improvement", "Writing",
    "Relationships", "Machine Learning", "Productivity", "Politics", "Cryptocurrency",
    "Psychology", "Money", "Business", "Python", "Health", "Science", "Mental Health",
    "Life", "Software Development", "Startup", "Design", "JavaScript", "Artificial Intelligence",
    "Culture", "Software Engineering", "Blockchain", "Coding", "Entrepreneurship", "React",
    "UX", "Education", "History", "Humor", "Web Development", "Work", "Lifestyle",
    "Society", "Deep Learning", "Marketing", "Books", "NFT", "Social Media", "Leadership",
    "Android", "Apple", "Women", "Mindfulness", "Sexuality"
  ]

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    )
  }

  const handleContinue = async () => {
    if (selectedTopics.length >= 3) {
      setIsLoading(true)
      try {
        const user = auth.currentUser
        if (user) {
          localStorage.setItem(`user_${user.uid}_topics_selected`, "true")
          localStorage.setItem(`user_${user.uid}_topics`, JSON.stringify(selectedTopics))
        }
        router.push("/dashboard")
      } catch (error) {
        alert("Error saving topics. Please try again.")
      } finally {
        setIsLoading(false)
      }
    } else {
      alert("Please select at least 3 topics to continue")
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F2EE] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl rounded-3xl p-6 md:p-10 relative bg-white shadow-md"
      >
        <div className="text-center mb-8">
          <div className="flex flex-col items-center mb-3">
            {/* ✅ Enlarged, centered, and fitted image inside circle */}
            <div className="w-20 h-20 border border-black rounded-full flex items-center justify-center overflow-hidden">
              
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">
            What are you interested in?
          </h1>
          <p className="text-base md:text-lg text-slate-600">
            Choose three or more.
          </p>
        </div>

        {/* ✅ Topics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-28 md:mb-12">
          {allTopics.map((topic) => {
            const isSelected = selectedTopics.includes(topic)
            return (
              <motion.button
                key={topic}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleTopic(topic)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-black border-black text-white"
                    : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
                }`}
              >
                {topic}
              </motion.button>
            )
          })}
        </div>

        {/* ✅ Fixed Continue button on mobile */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 flex items-center justify-center md:static md:border-0 md:p-0 md:mt-6">
          <motion.button
            whileHover={{ scale: selectedTopics.length >= 3 ? 1.02 : 1 }}
            whileTap={{ scale: selectedTopics.length >= 3 ? 0.98 : 1 }}
            onClick={handleContinue}
            disabled={selectedTopics.length < 3 || isLoading}
            className={`w-full sm:w-auto px-8 py-3 rounded-full font-medium transition-all duration-200 ${
              selectedTopics.length >= 3
                ? "bg-black text-white hover:bg-slate-800"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Saving..." : "Continue"}
          </motion.button>
        </div>
      </motion.div>
    </main>
  )
}
