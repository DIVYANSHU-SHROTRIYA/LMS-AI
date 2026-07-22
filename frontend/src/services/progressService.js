import api from './api'

export const markLessonComplete = (courseId, lessonId, data) => api.put(`/progress/${courseId}/lessons/${lessonId}`, data)
export const getCourseProgress  = (courseId)                 => api.get(`/progress/${courseId}`)
