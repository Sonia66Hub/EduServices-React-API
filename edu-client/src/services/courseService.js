import { axiosPrivate } from "../api/axios";


const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5088/api";


const COURSES_ENDPOINT = `${BASE_API_URL}/Courses`;

export const getCourses = () => axiosPrivate.get(COURSES_ENDPOINT);

export const getCourseById = (id) => axiosPrivate.get(`${COURSES_ENDPOINT}/${id}`);

export const createCourse = (data) => axiosPrivate.post(COURSES_ENDPOINT, data);

export const updateCourse = (id, data) => axiosPrivate.put(`${COURSES_ENDPOINT}/${id}`, data);

export const deleteCourse = (id) => axiosPrivate.delete(`${COURSES_ENDPOINT}/${id}`);