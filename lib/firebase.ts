import { initializeApp, getApps } from 'firebase/app'
import { getDatabase, ref, set, get, onValue, DatabaseReference } from 'firebase/database'
import type { AppData, Category } from './types'

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
const database = getDatabase(app)

// Helper to get paths for a user
function getCategoriesPath(userId: string): string {
  return `users/${userId}/categories`
}

function getOrderPath(userId: string): string {
  return `users/${userId}/categoryOrder`
}

export function getCategoriesRef(userId: string): DatabaseReference {
  return ref(database, getCategoriesPath(userId))
}

export function getOrderRef(userId: string): DatabaseReference {
  return ref(database, getOrderPath(userId))
}

export async function saveCategoriesToFirebase(userId: string, categories: Record<string, Category>): Promise<void> {
  try {
    await set(ref(database, getCategoriesPath(userId)), categories)
  } catch (error) {
    console.error('Error saving categories to Firebase:', error)
    throw error
  }
}

export async function saveCategoryOrderToFirebase(userId: string, order: string[]): Promise<void> {
  try {
    await set(ref(database, getOrderPath(userId)), order)
  } catch (error) {
    console.error('Error saving category order to Firebase:', error)
    throw error
  }
}

export async function saveDataToFirebase(userId: string, data: AppData): Promise<void> {
  try {
    await set(ref(database, getCategoriesPath(userId)), data.categories)
    if (data.categoryOrder) {
      await set(ref(database, getOrderPath(userId)), data.categoryOrder)
    }
  } catch (error) {
    console.error('Error saving to Firebase:', error)
    throw error
  }
}

export async function loadDataFromFirebase(userId: string): Promise<AppData> {
  try {
    const [categoriesSnapshot, orderSnapshot] = await Promise.all([
      get(ref(database, getCategoriesPath(userId))),
      get(ref(database, getOrderPath(userId)))
    ])
    
    const categories = categoriesSnapshot.exists() ? categoriesSnapshot.val() : {}
    const categoryOrder = orderSnapshot.exists() ? orderSnapshot.val() : []
    
    return { categories, categoryOrder }
  } catch (error) {
    console.error('Error loading from Firebase:', error)
    return { categories: {}, categoryOrder: [] }
  }
}

export function subscribeToData(userId: string, callback: (data: AppData) => void): () => void {
  let categories: Record<string, Category> = {}
  let categoryOrder: string[] = []
  let categoriesLoaded = false
  let orderLoaded = false

  const notifyIfReady = () => {
    if (categoriesLoaded && orderLoaded) {
      callback({ categories, categoryOrder })
    }
  }

  const unsubscribeCategories = onValue(ref(database, getCategoriesPath(userId)), (snapshot) => {
    categories = snapshot.exists() ? snapshot.val() : {}
    categoriesLoaded = true
    notifyIfReady()
  }, (error) => {
    console.error('Firebase categories subscription error:', error)
    categoriesLoaded = true
    notifyIfReady()
  })

  const unsubscribeOrder = onValue(ref(database, getOrderPath(userId)), (snapshot) => {
    categoryOrder = snapshot.exists() ? snapshot.val() : []
    orderLoaded = true
    notifyIfReady()
  }, (error) => {
    console.error('Firebase order subscription error:', error)
    orderLoaded = true
    notifyIfReady()
  })
  
  return () => {
    unsubscribeCategories()
    unsubscribeOrder()
  }
}

export { database }
