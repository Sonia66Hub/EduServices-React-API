import { axiosPrivate } from "../api/axios"; 


const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5088/api";


const TEACHERS_ENDPOINT = `${BASE_API_URL}/Teachers`;


export const getTeachers = () => axiosPrivate.get(TEACHERS_ENDPOINT);

export const getTeacher = (id) => axiosPrivate.get(`${TEACHERS_ENDPOINT}/${id}`);

export const createTeacher = (formData) => axiosPrivate.post(TEACHERS_ENDPOINT, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const updateTeacher = (id, formData) => axiosPrivate.put(`${TEACHERS_ENDPOINT}/${id}`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const deleteTeacher = (id) => axiosPrivate.delete(`${TEACHERS_ENDPOINT}/${id}`);