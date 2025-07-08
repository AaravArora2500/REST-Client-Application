import axios from 'axios';

const API = axios.create({
  baseURL: "https://rest-client-application-1.onrender.com",
});

// Create a log
export const sendRequestLog = async (data) => {
  const res = await API.post('/history', data);
  return res.data;
};

// Get all logs (paginated)
export const getHistory = async (page = 1, limit = 10) => {
  const res = await API.get(`/history?page=${page}&limit=${limit}`);
  return res.data; 
};

// Get single log
export const getOneLog = async (id) => {
  const res = await API.get(`/history/${id}`);
  return res.data;
};

// Update log
export const updateLog = async (id, data) => {
  const res = await API.put(`/history/${id}`, data);
  return res.data;
};

// Delete log
export const deleteLog = async (id) => {
  const res = await API.delete(`/history/${id}`);
  return res.data;
};
