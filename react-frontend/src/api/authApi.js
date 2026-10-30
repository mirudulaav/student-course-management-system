import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});

export async function registerStudent(studentData) {
    const response = await apiClient.post("/auth/register", studentData);
    return response.data;
}

export async function loginStudent(credentials) {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
}

export default apiClient;