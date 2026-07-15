// client/src/utils/session.js
import API_BASE_URL from '../config';

export const getUserId = async (retryCount = 0) => {
  // Try to get from localStorage first
  let userId = localStorage.getItem("vaishworld_userId");
  
  if (userId) {
    return userId;
  }
  
  // If not, create a new user
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/create`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }
    
    const data = await res.json();
    if (data.userId) {
      localStorage.setItem("vaishworld_userId", data.userId);
      return data.userId;
    }
  } catch (err) {
    console.error("Failed to create user:", err);
    
    // Retry once if we haven't already
    if (retryCount < 1) {
      console.log("Retrying user creation...");
      return getUserId(retryCount + 1);
    }
  }
  
  return null;
};

export const clearUserSession = () => {
  localStorage.removeItem("vaishworld_userId");
};

export const checkUserExists = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/${userId}`);
    return res.ok;
  } catch {
    return false;
  }
};