import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from "axios"

// Base API configuration
const API_BASE_URL =  process.env.NEXT_PUBLIC_API_BASE_URL
console.log("API Base URL:", API_BASE_URL)
const API_TIMEOUT = 120000 // 120 seconds

// Create Axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error: AxiosError) => {
        // Handle common errors (404, 500, etc.)
        if (error.response) {
            const { status } = error.response

            if (status === 404) {
                console.error("Resource not found.")
            } else if (status >= 500) {
                console.error("Server error. Please try again later.")
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error("No response received from server. Please check your internet connection.")
        } else {
            // Something else happened while setting up the request
            console.error("Error setting up request:", error.message)
        }

        return Promise.reject(error)
    },
)

export { axiosInstance }
