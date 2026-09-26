
import { axiosPrivate } from "../api/axios";


const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5088/api";


const ENROLLMENTS_ENDPOINT = `${BASE_API_URL}/Enrollments`;

export const getEnrollments = () => axiosPrivate.get(ENROLLMENTS_ENDPOINT);

export const getEnrollmentById = (id) => axiosPrivate.get(`${ENROLLMENTS_ENDPOINT}/${id}`);

export const createEnrollment = (data) => axiosPrivate.post(ENROLLMENTS_ENDPOINT, data);

export const updateEnrollment = (id, data) => axiosPrivate.put(`${ENROLLMENTS_ENDPOINT}/${id}`, data);

export const deleteEnrollment = (id) => axiosPrivate.delete(`${ENROLLMENTS_ENDPOINT}/${id}`);