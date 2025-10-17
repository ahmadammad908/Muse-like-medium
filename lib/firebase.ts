import { initializeApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  signOut,
  setPersistence,
  browserLocalPersistence,
  User,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCvYZO1VogD70_13G_JHNUoE63DbsLvj_o",
  authDomain: "medium-751a1.firebaseapp.com",
  projectId: "medium-751a1",
  storageBucket: "medium-751a1.firebasestorage.app",
  messagingSenderId: "1047704282497",
  appId: "1:1047704282497:web:5ee50f28fd1eaa9415f480",
  measurementId: "G-YW60EFWL6W",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

setPersistence(auth, browserLocalPersistence)

// ✅ Type-safe sign-in
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result
  } catch (error) {
    console.error("Google sign in error:", error)
    throw error
  }
}

// ✅ Explicit type for profile data
export const updateUserProfile = async (
  profileData: { displayName?: string; photoURL?: string }
): Promise<User> => {
  const user = auth.currentUser
  if (user) {
    await updateProfile(user, profileData)
    return user
  }
  throw new Error("No user logged in")
}

// ✅ Sign out function
export const signOutUser = async (): Promise<void> => {
  await signOut(auth)
}

// ✅ Explicit type for callback
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// ✅ Get current user (type-safe)
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}
