// src/utils/auth.js
import API_URL from "../config";

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem(`${API_URL}:refreshToken`);

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Token refreshed successfully:", data);
      localStorage.setItem(`${API_URL}:accessToken`, data.access);

      if (data.refresh) {
        localStorage.setItem(`${API_URL}:refreshToken`, data.refresh);
      }
    } else if (response.status === 401) {
      // Handle unauthorized refresh token error
      console.error("Refresh token is invalid or expired");
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem(`${API_URL}:accessToken`);
      localStorage.removeItem(`${API_URL}:refreshToken`);
    } else {
      console.error(
        "Failed to refresh token:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error refreshing token:", error.message);
  }
};
