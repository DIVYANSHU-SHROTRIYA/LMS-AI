import api from './api'

export const chatWithAI      = (data) => api.post('/ai/chat', data)
export const analyseWeakTopics = (courseId) => api.post('/ai/weak-topics', { courseId })
