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
  UserProfile
} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCvYZO1VogD70_13G_JHNUoE63DbsLvj_o",
  authDomain: "medium-751a1.firebaseapp.com",
  projectId: "medium-751a1",
  storageBucket: "medium-751a1.firebasestorage.app",
  messagingSenderId: "1047704282497",
  appId: "1:1047704282497:web:5ee50f28fd1eaa9415f480",
  measurementId: "G-YW60EFWL6W"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

setPersistence(auth, browserLocalPersistence)

// ✅ User data save karne ka function
export const saveUserDataToLocalStorage = (user: User): void => {
  const userData = {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? "",
    photoURL: user.photoURL ?? "",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }

  localStorage.setItem(`user_${user.uid}`, JSON.stringify(userData))
  localStorage.setItem("currentUser", JSON.stringify(userData))
}

// ✅ User data update karne ka function
export const updateUserLocalStorage = (user: User, updates: Record<string, unknown>): void => {
  const existingData = JSON.parse(localStorage.getItem(`user_${user.uid}`) || "{}")
  const updatedData = { ...existingData, ...updates }
  localStorage.setItem(`user_${user.uid}`, JSON.stringify(updatedData))
  localStorage.setItem("currentUser", JSON.stringify(updatedData))
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime

    if (isNewUser) {
      saveUserDataToLocalStorage(user)
      localStorage.setItem(`user_${user.uid}_profile_completed`, "false")
      localStorage.setItem(`user_${user.uid}_topics_selected`, "false")
    } else {
      updateUserLocalStorage(user, { lastLogin: new Date().toISOString() })
      localStorage.setItem(`user_${user.uid}_profile_completed`, "true")
    }

    return result
  } catch (error) {
    console.error("Google sign in error:", error)
    throw error
  }
}

export const updateUserProfile = async (profileData: UserProfile) => {
  const user = auth.currentUser
  if (user) {
    await updateProfile(user, profileData)
    updateUserLocalStorage(user, profileData)
    return user
  }
  throw new Error("No user logged in")
}

export const signOutUser = async (): Promise<void> => {
  localStorage.removeItem("currentUser")
  await signOut(auth)
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

export const getUserFromLocalStorage = (): Record<string, unknown> | null => {
  const userData = localStorage.getItem("currentUser")
  return userData ? JSON.parse(userData) : null
}

export const getUserData = (uid: string): Record<string, unknown> | null => {
  const userData = localStorage.getItem(`user_${uid}`)
  return userData ? JSON.parse(userData) : null
}
