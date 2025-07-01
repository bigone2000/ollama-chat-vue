import axios from 'axios'
import type { ModelMetadata } from '@/type/index'
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
const getModels = async () => {
  try {
    const models: ModelMetadata[] = (await apiClient.get('api/models')).data
    return models
  } catch (error) {
    console.error(error)
    throw error
  }
}
const sendHistoryMessages = async (formData: FormData) => {
  try {
    return await apiClient.post('/api/generate', formData)
  } catch (error) {
    console.error(error)
    throw error
  }
}
export { getModels, sendHistoryMessages }
