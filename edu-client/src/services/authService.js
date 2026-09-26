import axios from 'axios';


const API_URL = "http://localhost:5088/api";

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/Auth/login`, {
            email,
            password,
        });

        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        return {
            isAuthSuccessful: false,
            errorMessage: error.response?.data.errorMessage || "An error occurred during login.",
        };
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    login,
    logout,
    getCurrentUser,
};

export default authService;