import { initializeApp, getApps } from 'firebase/app'
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  User,
  ConfirmationResult,
  updatePassword
} from 'firebase/auth'
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot
} from 'firebase/firestore'
import type { UserProfile } from './auth-types'

// Simple client-side SHA-256 for passcode
async function hashPasscode(passcode: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(passcode);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const firebaseConfig = {
  apiKey: "AIzaSyCOjcfWiAuwF9i6C_saGiftmAGArCGb9mI",
  authDomain: "to-do-66590.firebaseapp.com",
  databaseURL: "https://to-do-66590-default-rtdb.firebaseio.com",
  projectId: "to-do-66590",
  storageBucket: "to-do-66590.firebasestorage.app",
  messagingSenderId: "346536505268",
  appId: "1:346536505268:web:4da9177f569be7e8328ce1",
  measurementId: "G-CG7NE15FXK",
}

// Initialize Firebase (avoid duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()

// Check if username exists
export async function checkUsernameExists(username: string): Promise<boolean> {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('user_name', '==', username.toLowerCase()))
  const querySnapshot = await getDocs(q)
  return !querySnapshot.empty
}

// Create user profile in Firestore
export async function createUserProfile(uid: string, profile: Omit<UserProfile, 'created_at'>): Promise<void> {
  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, {
    ...profile,
    user_name: profile.user_name.toLowerCase(),
    phone_number: profile.phone_number || '',
    model: 'free',
    // breathing defaults mirror theme defaults until user customizes
    breathMode: profile.themeMode || 'solid',
    breathSolid: profile.solidColor || '#4fc3ff',
    breathGradientStart: profile.gradientStart || '#4fc3ff',
    breathGradientEnd: profile.gradientEnd || '#8b5cf6',
    breathGradientDirection: profile.gradientDirection || 'to-br',
    themeMode: profile.themeMode || 'solid',
    solidColor: profile.solidColor || '#4fc3ff',
    gradientStart: profile.gradientStart || '#4fc3ff',
    gradientEnd: profile.gradientEnd || '#8b5cf6',
    gradientDirection: profile.gradientDirection || 'to-br',
    created_at: serverTimestamp()
  })
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid)
  const docSnap = await getDoc(userRef)
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile
  }
  return null
}

export function subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void): () => void {
  const userRef = doc(db, 'users', uid)
  return onSnapshot(userRef, (docSnap) => {
    callback(docSnap.exists() ? (docSnap.data() as UserProfile) : null)
  })
}

// Look up a user by username (for public profile sharing)
export async function getUserByUsername(username: string): Promise<{ uid: string; profile: UserProfile } | null> {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('user_name', '==', username.toLowerCase()))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const docSnap = snap.docs[0]
  return { uid: docSnap.id, profile: docSnap.data() as UserProfile }
}

// Verify passcode for a given uid (used by public profile gate too)
export async function verifyPasscodeForUid(uid: string, passcode: string): Promise<{ success: boolean; error?: string }> {
  return verifyPasscode(uid, passcode)
}

// Register with email and password
export async function registerWithEmail(
  email: string, 
  password: string, 
  name: string, 
  username: string
): Promise<{ success: boolean; error?: string; uid?: string }> {
  try {
    // Check if username exists
    const usernameExists = await checkUsernameExists(username)
    if (usernameExists) {
      return { success: false, error: 'Username already exists. Please choose a different one.' }
    }

    // Create Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    // Create Firestore document
    await createUserProfile(uid, {
      user_name: username,
      name,
      email,
      model: 'free'
    })

    return { success: true, uid }
  } catch (error: any) {
    let errorMessage = 'Registration failed. Please try again.'
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email is already registered. Please login instead.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.'
    }
    return { success: false, error: errorMessage }
  }
}

// Login with email and password
export async function loginWithEmail(
  email: string, 
  password: string
): Promise<{ success: boolean; error?: string; uid?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, uid: userCredential.user.uid }
  } catch (error: any) {
    let errorMessage = 'Login failed. Please try again.'
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.'
    }
    return { success: false, error: errorMessage }
  }
}

// Login with Google
export async function loginWithGoogle(): Promise<{ success: boolean; error?: string; uid?: string; isNewUser?: boolean }> {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const uid = result.user.uid
    
    // Check if user profile exists
    const profile = await getUserProfile(uid)
    
    if (!profile) {
      // New user - need to complete registration
      return { success: true, uid, isNewUser: true }
    }
    
    return { success: true, uid, isNewUser: false }
  } catch (error: any) {
    let errorMessage = 'Google sign-in failed. Please try again.'
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in was cancelled.'
    }
    return { success: false, error: errorMessage }
  }
}

// Setup phone verification
let confirmationResult: ConfirmationResult | null = null

export async function setupRecaptcha(containerId: string): Promise<RecaptchaVerifier> {
  const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    }
  })
  return recaptchaVerifier
}

export async function sendPhoneOTP(
  phoneNumber: string, 
  recaptchaVerifier: RecaptchaVerifier
): Promise<{ success: boolean; error?: string }> {
  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    return { success: true }
  } catch (error: any) {
    let errorMessage = 'Failed to send OTP. Please try again.'
    if (error.code === 'auth/invalid-phone-number') {
      errorMessage = 'Invalid phone number format. Include country code (e.g., +1234567890).'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many attempts. Please try again later.'
    } else if (error.code === 'auth/captcha-check-failed') {
      errorMessage = 'reCAPTCHA verification failed. Please refresh and try again.'
    } else if (error.code === 'auth/missing-phone-number') {
      errorMessage = 'Please enter a valid phone number.'
    } else if (error.code === 'auth/quota-exceeded') {
      errorMessage = 'SMS quota exceeded. Please try again later.'
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Phone authentication is not enabled in Firebase Console.'
    } else if (error.code === 'auth/billing-not-enabled') {
      errorMessage = 'Phone auth requires Firebase Blaze plan. Please upgrade in Firebase Console.'
    } else if (error.message?.includes('400') || error.message?.includes('billing')) {
      errorMessage = 'Phone auth requires Firebase Blaze plan. Please upgrade in Firebase Console.'
    }
    return { success: false, error: errorMessage }
  }
}

export async function verifyPhoneOTP(
  otp: string
): Promise<{ success: boolean; error?: string; uid?: string; isNewUser?: boolean }> {
  try {
    if (!confirmationResult) {
      return { success: false, error: 'Please request OTP first.' }
    }
    
    const result = await confirmationResult.confirm(otp)
    const uid = result.user.uid
    
    // Check if user profile exists
    const profile = await getUserProfile(uid)
    
    if (!profile) {
      return { success: true, uid, isNewUser: true }
    }
    
    return { success: true, uid, isNewUser: false }
  } catch (error: any) {
    let errorMessage = 'Invalid OTP. Please try again.'
    if (error.code === 'auth/code-expired') {
      errorMessage = 'OTP has expired. Please request a new one.'
    }
    return { success: false, error: errorMessage }
  }
}

// Complete registration for Google/Phone users
export async function completeRegistration(
  uid: string,
  name: string,
  username: string,
  email: string = ''
): Promise<{ success: boolean; error?: string }> {
  try {
    const usernameExists = await checkUsernameExists(username)
    if (usernameExists) {
      return { success: false, error: 'Username already exists. Please choose a different one.' }
    }

    await createUserProfile(uid, {
      user_name: username,
      name,
      email: email || auth.currentUser?.email || auth.currentUser?.phoneNumber || '',
      phone_number: auth.currentUser?.phoneNumber || '',
      model: 'free'
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to complete registration. Please try again.' }
  }
}

// Upgrade to paid
export async function upgradeToPaid(uid: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      model: 'paid'
    })
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to upgrade. Please try again.' }
  }
}

// Logout
export async function logout(): Promise<void> {
  await signOut(auth)
}

// Subscribe to auth state
export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser
}

// Update user profile
export async function updateUserProfile(
  uid: string,
  currentUsername: string,
  newUsername: string,
  newName: string,
  newPhone: string = '',
  themeSettings?: Partial<UserProfile>
): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedNewUsername = newUsername.toLowerCase();
    if (formattedNewUsername !== currentUsername.toLowerCase()) {
      const exists = await checkUsernameExists(formattedNewUsername);
      if (exists) {
        return { success: false, error: 'Username is already taken.' };
      }
    }
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      name: newName,
      user_name: formattedNewUsername,
      phone_number: newPhone,
      ...(themeSettings ? {
        themeMode: themeSettings.themeMode,
        solidColor: themeSettings.solidColor,
        gradientStart: themeSettings.gradientStart,
        gradientEnd: themeSettings.gradientEnd,
        gradientDirection: themeSettings.gradientDirection,
      } : {})
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update profile. Please try again.' };
  }
}

export async function updateUserThemeSettings(uid: string, themeSettings: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', uid)
    const patch: any = {}
    if (themeSettings.themeMode) patch.themeMode = themeSettings.themeMode
    if (themeSettings.solidColor) patch.solidColor = themeSettings.solidColor
    if (themeSettings.gradientStart) patch.gradientStart = themeSettings.gradientStart
    if (themeSettings.gradientEnd) patch.gradientEnd = themeSettings.gradientEnd
    if (themeSettings.gradientDirection) patch.gradientDirection = themeSettings.gradientDirection
    if ((themeSettings as any).appTheme) patch.appTheme = (themeSettings as any).appTheme
    // If user updates global theme, keep breathing defaults in sync unless breathing-specific fields are provided
    if (themeSettings.themeMode) patch.breathMode = (themeSettings as any).breathMode || themeSettings.themeMode
    if (themeSettings.solidColor) patch.breathSolid = (themeSettings as any).breathSolid || themeSettings.solidColor
    if (themeSettings.gradientStart) patch.breathGradientStart = (themeSettings as any).breathGradientStart || themeSettings.gradientStart
    if (themeSettings.gradientEnd) patch.breathGradientEnd = (themeSettings as any).breathGradientEnd || themeSettings.gradientEnd
    if (themeSettings.gradientDirection) patch.breathGradientDirection = (themeSettings as any).breathGradientDirection || themeSettings.gradientDirection
    // breathing settings (optional)
    if ((themeSettings as any).breathMode) patch.breathMode = (themeSettings as any).breathMode
    if ((themeSettings as any).breathSolid) patch.breathSolid = (themeSettings as any).breathSolid
    if ((themeSettings as any).breathGradientStart) patch.breathGradientStart = (themeSettings as any).breathGradientStart
    if ((themeSettings as any).breathGradientEnd) patch.breathGradientEnd = (themeSettings as any).breathGradientEnd
    if ((themeSettings as any).breathGradientDirection) patch.breathGradientDirection = (themeSettings as any).breathGradientDirection

    await updateDoc(userRef, patch)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to save theme settings.' }
  }
}

export async function setUserPassword(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'User not logged in' };
    await updatePassword(user, password);
    return { success: true };
  } catch (error: any) {
    if (error.code === 'auth/requires-recent-login') {
      return { success: false, error: 'Security constraint: Please log out and back in to set a password.' };
    }
    return { success: false, error: 'Failed to set password.' };
  }
}

export async function setupPasscode(uid: string, passcode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const hash = await hashPasscode(passcode);
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { passcodeHash: hash });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to set up passcode.' };
  }
}

export async function verifyPasscode(uid: string, passcode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) return { success: false, error: 'User not found.' };
    
    const data = docSnap.data();
    if (!data.passcodeHash) return { success: false, error: 'Passcode not set up.' };
    
    const hash = await hashPasscode(passcode);
    if (hash === data.passcodeHash) {
      return { success: true };
    } else {
      return { success: false, error: 'Incorrect passcode.' };
    }
  } catch (error) {
    return { success: false, error: 'Failed to verify passcode.' };
  }
}

export { auth, db }
