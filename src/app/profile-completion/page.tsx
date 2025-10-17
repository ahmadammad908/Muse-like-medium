"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { auth, updateUserProfile } from "../../../lib/firebase"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { motion } from "framer-motion"
import { User } from "firebase/auth"


export default function ProfileCompletion() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [googlePhoto, setGooglePhoto] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const router = useRouter()
  const db = getFirestore()

  // ✅ Load user data and refresh Google photo - IMPROVED
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/")
      } else {
        const currentUser = auth.currentUser
        if (currentUser) {
          setEmail(currentUser.email || "")
          setFullName(currentUser.displayName || "")
          
          // ✅ Check if this is a new user (just signed up)
          const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime
          setIsNewUser(isNewUser)
          
          // ✅ FIX: Better Google photo handling for new users
          if (currentUser.photoURL) {
            let photoUrl = currentUser.photoURL
            // Convert to higher resolution and ensure proper format
            if (photoUrl.includes('googleusercontent.com')) {
              photoUrl = photoUrl.replace(/=s\d+-c$/, '=s400-c')
            }
            setGooglePhoto(photoUrl)
            setProfileImage(photoUrl)
          } else if (isNewUser) {
            // ✅ New user but photoURL not available yet - wait and retry
            console.log("New user detected, waiting for photoURL...")
            
            // Retry after a short delay
            setTimeout(async () => {
              await currentUser.reload()
              const refreshedUser = auth.currentUser
              if (refreshedUser?.photoURL) {
                let refreshedPhotoUrl = refreshedUser.photoURL
                if (refreshedPhotoUrl.includes('googleusercontent.com')) {
                  refreshedPhotoUrl = refreshedPhotoUrl.replace(/=s\d+-c$/, '=s400-c')
                }
                setGooglePhoto(refreshedPhotoUrl)
                setProfileImage(refreshedPhotoUrl)
                console.log("Google photo loaded after retry:", refreshedPhotoUrl)
              }
            }, 1000)
          }
        }
      }
    })
    
    return () => unsubscribe()
  }, [router])

  // ✅ Get Google photo with retry mechanism
 const fetchGooglePhoto = async (user: User, retries = 3): Promise<string | null> => {
  for (let i = 0; i < retries; i++) {
    await user.reload()
    const currentUser = auth.currentUser
    if (currentUser?.photoURL) {
      let photoUrl = currentUser.photoURL
      if (photoUrl.includes('googleusercontent.com')) {
        photoUrl = photoUrl.replace(/=s\d+-c$/, '=s400-c')
      }
      return photoUrl
    }
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)))
  }
  return null
}

  // ✅ Handle manual image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileImage(reader.result as string)
    }
    reader.onerror = () => {
      alert("Error reading file. Please try another image.")
    }
    reader.readAsDataURL(file)
  }

  // ✅ Reset to Google photo
  const resetToGooglePhoto = async () => {
    if (googlePhoto) {
      setProfileImage(googlePhoto)
    } else {
      // Try to fetch Google photo if not available
      const user = auth.currentUser
      if (user) {
        const photo = await fetchGooglePhoto(user)
        if (photo) {
          setGooglePhoto(photo)
          setProfileImage(photo)
        }
      }
    }
  }

  // ✅ Remove profile image
  const removeProfileImage = () => {
    setProfileImage(null)
  }

  // ✅ Check if image is base64
  const isBase64Image = (str: string | null): boolean => {
    if (!str) return false
    return str.startsWith('data:image/')
  }

  // ✅ Final submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!fullName.trim()) {
      alert("Please enter your full name")
      return
    }

    setIsLoading(true)

    try {
      const user = auth.currentUser
      if (!user) {
        router.push("/")
        return
      }

      // ✅ Ensure we have the latest Google photo for new users
      let finalGooglePhoto = googlePhoto
      if (!finalGooglePhoto && isNewUser) {
        finalGooglePhoto = await fetchGooglePhoto(user)
        if (finalGooglePhoto) {
          setGooglePhoto(finalGooglePhoto)
        }
      }

      // Determine which photo to use
      let finalProfileImage = profileImage
      
      // If user removed image and we have Google photo, use Google photo
      if (!finalProfileImage && finalGooglePhoto) {
        finalProfileImage = finalGooglePhoto
      }

      // Prepare user data for Firestore
      const userData = {
        uid: user.uid,
        fullName: fullName.trim(),
        email: user.email || email,
        profileImage: finalProfileImage || "",
        fromGoogle: !!finalGooglePhoto,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // ✅ Save user to Firestore
      await setDoc(doc(db, "users", user.uid), userData)

      // ✅ FIX: Update profile in Firebase Auth - Handle base64 images properly
      let photoURLForAuth = finalProfileImage
      
      // Agar base64 image hai, toh Firebase Auth ke liye use mat karo
      // Sirf valid URLs (Google photos) use karo Firebase Auth main
      if (isBase64Image(finalProfileImage)) {
        photoURLForAuth = finalGooglePhoto || user.photoURL // Use Google photo if available
      }

      // Only update if display name changed or we have a valid URL (not base64)
      if (user.displayName !== fullName.trim() || 
          (photoURLForAuth && !isBase64Image(photoURLForAuth) && user.photoURL !== photoURLForAuth)) {
        await updateUserProfile({
          displayName: fullName.trim(),
          photoURL: photoURLForAuth || user.photoURL,
        })
      }

      // ✅ Save user profile data in localStorage for quick access
      localStorage.setItem(`user_${user.uid}_profile_data`, JSON.stringify({
        fullName: fullName.trim(),
        email: user.email || email,
        profileImage: finalProfileImage || "", // Base64 bhi save karo localStorage main
        fromGoogle: !!finalGooglePhoto,
        uid: user.uid
      }))

      // Save completion flag
      localStorage.setItem(`user_${user.uid}_profile_completed`, "true")
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
          <p className="text-gray-600">Complete your profile</p>
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
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-3">
              <label htmlFor="profilePic" className="cursor-pointer group relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 group-hover:border-gray-400 transition-colors">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : !googlePhoto && isNewUser ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500 text-xs">
                      <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-1"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-black/40 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  Change Photo
                </div>
              </label>
              
              <input
                id="profilePic"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              
              <div className="flex gap-3">
                {/* Reset to Google Photo Button (only show if user has Google photo and changed the image) */}
                {googlePhoto && profileImage !== googlePhoto && (
                  <button
                    type="button"
                    onClick={resetToGooglePhoto}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Use Google Photo
                  </button>
                )}
                
                {/* Remove photo button (only show if user has an image) */}
                {profileImage && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
              
              {googlePhoto && profileImage === googlePhoto && (
                <p className="text-xs text-green-600">Using your Google profile photo</p>
              )}
              
              {!googlePhoto && isNewUser && (
                <p className="text-xs text-yellow-600">Loading Google photo...</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Your full name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors text-gray-900 placeholder-gray-500"
                required
                minLength={2}
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be displayed on your profile
              </p>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Email
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded bg-gray-50 text-gray-600">
                {email || "Loading..."}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email from your Google account
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!fullName.trim() || isLoading}
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