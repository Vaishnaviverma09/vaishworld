// client/src/utils/session.js
import API_BASE_URL from '../config';

export const getUserId = async () => {
  // Try to get from localStorage first
  let userId = localStorage.getItem("vaishworld_userId");
  
  if (userId) {
    return userId;
  }
  
  // If not, create a new user
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/create`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.userId) {
      localStorage.setItem("vaishworld_userId", data.userId);
      return data.userId;
    }
  } catch (err) {
    console.error("Failed to create user:", err);
  }
  
  return null;
};

export const clearUserSession = () => {
  localStorage.removeItem("vaishworld_userId");
};