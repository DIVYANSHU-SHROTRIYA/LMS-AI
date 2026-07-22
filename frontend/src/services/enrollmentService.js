import api from './api'

export const enrollCourse       = (courseId) => api.post(`/enrollments/${courseId}`)
export const getMyEnrollments   = ()         => api.get('/enrollments/my')
export const getEnrollment      = (courseId) => api.get(`/enrollments/${courseId}`)
export const getCourseStudents  = (courseId) => api.get(`/enrollments/course/${courseId}/students`)
