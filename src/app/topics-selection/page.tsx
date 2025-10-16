"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "../../../lib/firebase"
import { Check } from "lucide-react"

export default function TopicsSelection() {
  // ✅ Explicitly type this as string[]
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/")
      }
    })
    return () => unsubscribe()
  }, [router])

  // ✅ Type topic as string
  const allTopics: string[] = [
    "Programming", "Data Science", "Technology", "Self Improvement", "Writing",
    "Relationships", "Machine Learning", "Productivity", "Politics", "Cryptocurrency",
    "Psychology", "Money", "Business", "Python", "Health", "Science", "Mental Health",
    "Life", "Software Development", "Startup", "Design", "JavaScript", "Artificial Intelligence",
    "Culture", "Software Engineering", "Blockchain", "Coding", "Entrepreneurship", "React",
    "UK", "Education", "History", "Number", "Web Development", "Work", "Ultralife",
    "Society", "Deep Learning", "Marketing", "Books", "HR", "Social Media", "Leadership",
    "Android", "Apple", "Women"
  ]

  // ✅ Add type annotation to `topic`
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  const handleContinue = async () => {
    if (selectedTopics.length >= 5) {
      setIsLoading(true)
      try {
        // Here you can save to Firebase
        console.log("Selected topics:", selectedTopics)

        router.push("./dashboard")
      } catch (error) {
        console.error("Error saving topics:", error)
        alert("Error saving topics. Please try again.")
      } finally {
        setIsLoading(false)
      }
    } else {
      alert("Please select at least 5 topics to continue")
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F2EE] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-white rounded-3xl shadow-lg p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">
            What are you interested in?
          </h1>
          <p className="text-lg text-slate-600">
            Choose three or more.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
          {allTopics.map((topic: string) => {
            const isSelected = selectedTopics.includes(topic)
            return (
              <motion.button
                key={topic}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTopic(topic)}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${isSelected
                    ? "bg-black text-white border-black"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }
                `}
              >
                <span className="font-medium text-sm">{topic}</span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Selected Count & Continue Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <div className="text-slate-600">
            {selectedTopics.length >= 5 ? (
              <span className="text-green-600 font-medium">✓ Ready to continue</span>
            ) : (
              <span>
                Select {5 - selectedTopics.length} more topic
                {5 - selectedTopics.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: selectedTopics.length >= 5 ? 1.02 : 1 }}
            whileTap={{ scale: selectedTopics.length >= 5 ? 0.98 : 1 }}
            onClick={handleContinue}
            disabled={selectedTopics.length < 5 || isLoading}
            className={`
              px-8 py-3 rounded-full font-medium transition-all duration-200
              ${selectedTopics.length >= 5
                ? "bg-black text-white hover:bg-slate-800 cursor-pointer"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }
            `}
          >
            {isLoading ? "Saving..." : "Continue to Dashboard"}
          </motion.button>
        </div>
      </motion.div>
    </main>
  )
}
