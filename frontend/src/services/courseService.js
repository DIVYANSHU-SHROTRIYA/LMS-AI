import api from './api'

export const getAllCourses  = (params) => api.get('/courses', { params })
export const getCourse      = (id)     => api.get(`/courses/${id}`)
export const getMyCourses   = ()       => api.get('/courses/instructor/my')
export const createCourse   = (data)   => api.post('/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateCourse   = (id, data) => api.put(`/courses/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteCourse   = (id)     => api.delete(`/courses/${id}`)

// Sections
export const addSection     = (courseId, data)                      => api.post(`/courses/${courseId}/sections`, data)
export const updateSection  = (courseId, sectionId, data)           => api.put(`/courses/${courseId}/sections/${sectionId}`, data)
export const deleteSection  = (courseId, sectionId)                 => api.delete(`/courses/${courseId}/sections/${sectionId}`)

// Lessons
export const addLesson      = (courseId, sectionId, data)           => api.post(`/courses/${courseId}/sections/${sectionId}/lessons`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateLesson   = (courseId, sectionId, lessonId, data) => api.put(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteLesson   = (courseId, sectionId, lessonId)       => api.delete(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`)
