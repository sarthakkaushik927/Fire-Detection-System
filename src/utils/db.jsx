// src/utils/db.js
import { openDB } from 'idb'

const DB_NAME = 'FireWatchDB'
const STORE_NAME = 'drone_images'

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Create a store with auto-incrementing IDs
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    },
  })
}

export const saveImage = async (base64Data, metadata = {}) => {
  const db = await initDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const timestamp = new Date().toISOString()
  
  await tx.store.add({
    image: base64Data,
    timestamp,
    ...metadata // e.g., location: { lat, lon }
  })
  await tx.done
  return true
}

export const getImages = async () => {
  const db = await initDB()
  return db.getAll(STORE_NAME)
}

export const deleteImage = async (id) => {
  const db = await initDB()
  return db.delete(STORE_NAME, id)
}