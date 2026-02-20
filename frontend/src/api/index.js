import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const fetchExperts = (params) => API.get('/experts', { params });
export const fetchExpert = (id) => API.get(`/experts/${id}`);
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const fetchMyBookings = (email) => API.get(`/bookings?email=${email}`);

export default API;
