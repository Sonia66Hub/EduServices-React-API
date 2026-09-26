import { axiosPrivate } from "../api/axios"; 



const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5088/api";


const SUBJECTS_ENDPOINT = `${BASE_API_URL}/Subjects`;

export const getSubjects = () => axiosPrivate.get(SUBJECTS_ENDPOINT);

export const getSubjectById = (id) => axiosPrivate.get(`${SUBJECTS_ENDPOINT}/${id}`);

export const createSubject = (data) => axiosPrivate.post(SUBJECTS_ENDPOINT, data);

export const updateSubject = (id, data) => axiosPrivate.put(`${SUBJECTS_ENDPOINT}/${id}`, data);

export const deleteSubject = (id) => axiosPrivate.delete(`${SUBJECTS_ENDPOINT}/${id}`);