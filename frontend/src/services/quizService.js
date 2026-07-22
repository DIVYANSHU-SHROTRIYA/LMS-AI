import api from './api'

export const createQuiz         = (data)          => api.post('/quizzes', data)
export const getCourseQuizzes   = (courseId)      => api.get(`/quizzes/course/${courseId}`)
export const getQuiz            = (id)            => api.get(`/quizzes/${id}`)
export const updateQuiz         = (id, data)      => api.put(`/quizzes/${id}`, data)
export const deleteQuiz         = (id)            => api.delete(`/quizzes/${id}`)
export const submitQuiz         = (id, data)      => api.post(`/quizzes/${id}/submit`, data)
export const getMyAttempts      = (quizId)        => api.get(`/quizzes/${quizId}/attempts`)
export const getCourseAttempts  = (courseId)      => api.get(`/quizzes/course/${courseId}/attempts`)
