import api from './client';

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

const resource = (path) => ({
  list: (params = {}) => api.get(path, { params }),
  get: (id) => api.get(`${path}/${id}`),
  create: (payload) => api.post(path, payload),
  update: (id, payload) => api.put(`${path}/${id}`, payload),
  remove: (id) => api.delete(`${path}/${id}`),
});

export const usersApi = resource('/users');
export const rolesApi = resource('/roles');
export const categoriesApi = resource('/categories');
export const partiesApi = resource('/parties');
export const productionApi = resource('/production');
export const payrollApi = resource('/payroll');
export const paymentsApi = resource('/payments');
export const workApi = {
  ...resource('/work-allocations'),
  complete: (id) => api.post(`/work-allocations/${id}/complete`),
};
export const articlesApi = {
  ...resource('/articles'),
  create: (formData) => api.post('/articles', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/articles/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
export const dashboardApi = { get: () => api.get('/dashboard') };
export const reportsApi = { get: (params = {}) => api.get('/reports', { params }) };
export const challansApi = resource('/challans');
export const billsApi = resource('/bills');
export const backupApi = { list: () => api.get('/backup'), create: () => api.post('/backup') };
export const auditApi = resource('/audit-logs');
export const settingsApi = resource('/settings');
export const metaApi = { pages: () => api.get('/meta/pages') };
export const pdfApi = { payrollSlip: (id) => api.get(`/pdf/payroll/${id}`, { responseType: 'blob' }) };
