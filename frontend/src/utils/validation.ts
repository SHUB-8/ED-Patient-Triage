// Utility functions for input validation

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number" };
  }
  
  return { isValid: true, message: "" };
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateHospital = (hospital: string): boolean => {
  return hospital.trim().length >= 3;
};

export const validateRole = (role: string): boolean => {
  const validRoles = ["RECEPTIONIST", "NURSE", "ADMIN"];
  return validRoles.includes(role);
};