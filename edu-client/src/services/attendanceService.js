import { axiosPrivate } from "../api/axios";


const BASE_API_URL = import.meta.env.VITE_API_URL; 


const ATTENDANCE_ENDPOINT = "/Attendances";


export const getAttendances = () => axiosPrivate.get(ATTENDANCE_ENDPOINT);

export const getAttendanceById = (id) => axiosPrivate.get(`${ATTENDANCE_ENDPOINT}/${id}`);

export const createAttendance = (data) => axiosPrivate.post(ATTENDANCE_ENDPOINT, data);

export const updateAttendance = (id, data) => axiosPrivate.put(`${ATTENDANCE_ENDPOINT}/${id}`, data);

export const deleteAttendance = (id) => axiosPrivate.delete(`${ATTENDANCE_ENDPOINT}/${id}`);


const attendanceService = {
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};

export default attendanceService;