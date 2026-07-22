import api from './api'

export const generateCertificate  = (courseId)       => api.post(`/certificates/generate/${courseId}`)
export const getMyCertificates    = ()               => api.get('/certificates/my')
export const verifyCertificate    = (certificateId)  => api.get(`/certificates/verify/${certificateId}`)
