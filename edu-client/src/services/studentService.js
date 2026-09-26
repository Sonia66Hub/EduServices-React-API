import { axiosPrivate } from "../api/axios";


const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5088/api";


const STUDENTS_ENDPOINT = `${BASE_API_URL}/Students`;

export const getStudents = () => axiosPrivate.get(STUDENTS_ENDPOINT);

export const getStudentById = (id) => axiosPrivate.get(`${STUDENTS_ENDPOINT}/${id}`);


export const createStudent = (data) => {
  return axiosPrivate.post(STUDENTS_ENDPOINT, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const updateStudent = (id, data) => {
  return axiosPrivate.put(`${STUDENTS_ENDPOINT}/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteStudent = (id) => axiosPrivate.delete(`${STUDENTS_ENDPOINT}/${id}`);