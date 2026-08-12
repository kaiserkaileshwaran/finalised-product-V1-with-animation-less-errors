import { initializeApp, getApps } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth"
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment,
  arrayUnion,
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDrvKjPFbk9Fq_egC6MhFwV684iScmN6i4",
  authDomain: "blog-e4a6b.firebaseapp.com",
  databaseURL: "https://blog-e4a6b-default-rtdb.firebaseio.com",
  projectId: "blog-e4a6b",
  storageBucket: "blog-e4a6b.firebasestorage.app",
  messagingSenderId: "408653025519",
  appId: "1:408653025519:web:027f0bc003d611dc85cb1a",
  measurementId: "G-5Y3DNX72MG",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
export const db = getFirestore(app)

const googleProvider = new GoogleAuthProvider()

// User profile interface for Firestore
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  bio?: string
  skills: string[]
  completedPaths: string[]
  completedLessons: string[]
  achievements: UserAchievement[]
  certificates: UserCertificate[]
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalXp: number
  level: number
  subscription: "free" | "pro"
  createdAt: Date
  updatedAt: Date
}

export interface UserAchievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  unlockedAt: Date
}

export interface UserCertificate {
  id: string
  pathId: string
  pathName: string
  issuedAt: Date
  verificationId: string
  holderName: string
  completionDate: string
}

// Auth functions
export const signInWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password)
  await updateStreak(result.user.uid)
  return result
}

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName })
  await createUserProfile(result.user, displayName)
  return result
}

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)
  const userDoc = await getDoc(doc(db, "users", result.user.uid))
  if (!userDoc.exists()) {
    await createUserProfile(result.user, result.user.displayName || "User")
  } else {
    await updateStreak(result.user.uid)
  }
  return result
}

export const signOutUser = () => signOut(auth)

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email)

// Firestore functions
export const createUserProfile = async (user: FirebaseUser, displayName: string) => {
  const userRef = doc(db, "users", user.uid)
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email || "",
    displayName,
    photoURL: user.photoURL || undefined,
    bio: "",
    skills: [],
    completedPaths: [],
    completedLessons: [],
    achievements: [
      {
        id: "first-steps",
        name: "First Steps",
        description: "Welcome to Blueprint! Your journey begins.",
        icon: "rocket",
        rarity: "common",
        unlockedAt: new Date(),
      },
    ],
    certificates: [],
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: new Date().toISOString().split("T")[0],
    totalXp: 50,
    level: 1,
    subscription: "free",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await setDoc(userRef, profile)
  return profile
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, "users", uid))
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile
  }
  return null
}

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, { ...updates, updatedAt: new Date() })
}

export const updateStreak = async (uid: string) => {
  const userRef = doc(db, "users", uid)
  const userDoc = await getDoc(userRef)
  
  if (userDoc.exists()) {
    const userData = userDoc.data() as UserProfile
    const today = new Date().toISOString().split("T")[0]
    const lastActive = userData.lastActiveDate
    
    if (lastActive === today) return // Already active today
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]
    
    let newStreak = userData.currentStreak
    if (lastActive === yesterdayStr) {
      newStreak += 1
    } else {
      newStreak = 1
    }
    
    await updateDoc(userRef, {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, userData.longestStreak),
      lastActiveDate: today,
      updatedAt: new Date(),
    })
  }
}

export const completeLesson = async (uid: string, lessonId: string, xpGained: number) => {
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, {
    completedLessons: arrayUnion(lessonId),
    totalXp: increment(xpGained),
    updatedAt: new Date(),
  })
  
  // Check for level up
  const userDoc = await getDoc(userRef)
  if (userDoc.exists()) {
    const userData = userDoc.data() as UserProfile
    const newLevel = Math.floor(userData.totalXp / 500) + 1
    if (newLevel > userData.level) {
      await updateDoc(userRef, { level: newLevel })
      return { levelUp: true, newLevel }
    }
  }
  return { levelUp: false }
}

export const generateCertificate = async (
  uid: string,
  pathId: string,
  pathName: string,
  holderName: string
): Promise<UserCertificate> => {
  const verificationId = `BP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  
  const certificate: UserCertificate = {
    id: `cert-${Date.now()}`,
    pathId,
    pathName,
    issuedAt: new Date(),
    verificationId,
    holderName,
    completionDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }
  
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, {
    certificates: arrayUnion(certificate),
    completedPaths: arrayUnion(pathId),
    updatedAt: new Date(),
  })
  
  // Also store certificate in a separate collection for verification
  const certRef = doc(db, "certificates", verificationId)
  await setDoc(certRef, {
    ...certificate,
    uid,
    createdAt: serverTimestamp(),
  })
  
  return certificate
}

export const verifyCertificate = async (verificationId: string) => {
  const certDoc = await getDoc(doc(db, "certificates", verificationId))
  if (certDoc.exists()) {
    return certDoc.data()
  }
  return null
}

export const unlockAchievement = async (uid: string, achievement: UserAchievement) => {
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, {
    achievements: arrayUnion(achievement),
    totalXp: increment(achievement.rarity === "legendary" ? 500 : achievement.rarity === "epic" ? 200 : achievement.rarity === "rare" ? 100 : 50),
    updatedAt: new Date(),
  })
}

// Auth state observer
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
