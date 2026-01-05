import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: ({ email, password }) => {
    const body = new URLSearchParams()
    body.append('username', email)
    body.append('password', password)
    return api.post('/auth/login', body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
  }
}

export const userAPI = {
  me: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data)
}

export const landAPI = {
  list: (params) => api.get('/lands', { params }),
  get: (id) => api.get(`/lands/${id}`),
  my: () => api.get('/lands/my-lands'),
  create: (data) => api.post('/lands', data),
  update: (id, data) => api.put(`/lands/${id}`, data),
  remove: (id) => api.delete(`/lands/${id}`),
  uploadDoc: (landId, documentType, file) => {
    const fd = new FormData()
    fd.append('document_type', documentType)
    fd.append('file', file)
    return api.post(`/lands/${landId}/documents`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  }
}

export const adminAPI = {
  users: () => api.get('/admin/users'),
  createUser: (data, role) => api.post('/admin/users', data, { params: { role } }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  setRole: (id, role) => api.put(`/admin/users/${id}/role`, null, { params: { role } }),
  lands: () => api.get('/admin/lands'),
  deleteLand: (id) => api.delete(`/admin/lands/${id}`)
}

export const verificationAPI = {
  pending: () => api.get('/verification/pending'),
  approve: (id, notes) => api.put(`/verification/${id}/approve`, null, { params: { notes } }),
  reject: (id, notes) => api.put(`/verification/${id}/reject`, null, { params: { notes } })
}

export default api
