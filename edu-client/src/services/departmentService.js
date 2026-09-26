import axiosPrivate from "../api/axios";


const DEPARTMENTS_ENDPOINT = `/Departments`;

export const getDepartments = () => axiosPrivate.get(DEPARTMENTS_ENDPOINT); 

export const getDepartmentById = (id) => axiosPrivate.get(`${DEPARTMENTS_ENDPOINT}/${id}`); 

export const createDepartment = (department) =>
axiosPrivate.post(DEPARTMENTS_ENDPOINT, department); 

export const updateDepartment = (id, department) =>
axiosPrivate.put(`${DEPARTMENTS_ENDPOINT}/${id}`, department); 

export const deleteDepartment = (id) => axiosPrivate.delete(`${DEPARTMENTS_ENDPOINT}/${id}`); 