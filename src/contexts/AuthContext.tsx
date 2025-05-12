
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "candidate";
  username?: string;
  phone?: string;
  organization?: string;
  createdAt: string;
  lastLogin: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, username: string, phone?: string, organization?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Store registered users in localStorage
const REGISTERED_USERS_KEY = "registered_users";

// Helper to get registered users
const getRegisteredUsers = (): Record<string, {user: User, password: string}> => {
  const users = localStorage.getItem(REGISTERED_USERS_KEY);
  return users ? JSON.parse(users) : {};
};

// Helper to save registered users
const saveRegisteredUser = (email: string, userData: {user: User, password: string}) => {
  const users = getRegisteredUsers();
  users[email] = userData;
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth data
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check demo accounts first
      if (email === "admin@example.com" && password === "password") {
        const userData: User = {
          id: "admin-1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          username: "admin",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Logged in as Admin successfully");
        return true;
      } 
      else if (email === "user@example.com" && password === "password") {
        const userData: User = {
          id: "user-1",
          name: "Test Candidate",
          email: "user@example.com",
          role: "candidate",
          username: "testuser",
          phone: "555-123-4567",
          organization: "Test Organization",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Logged in successfully");
        return true;
      } 
      
      // Check for registered users
      const registeredUsers = getRegisteredUsers();
      const registeredUser = registeredUsers[email];
      
      if (registeredUser && registeredUser.password === password) {
        // Update last login time
        const updatedUserData = {
          ...registeredUser.user,
          lastLogin: new Date().toISOString()
        };
        setUser(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        
        // Also update in registered users storage
        registeredUsers[email] = {
          user: updatedUserData,
          password: password
        };
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
        
        toast.success("Logged in successfully");
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    username: string, 
    phone?: string, 
    organization?: string
  ): Promise<boolean> => {
    console.log("Registration attempt:", { name, email, username });
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (!name || !email || !password || !username) {
        toast.error("All required fields must be filled");
        return false;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if the email is already taken (demo accounts)
      if (email === "admin@example.com" || email === "user@example.com") {
        toast.error("Email already taken");
        return false;
      }
      
      // Check if username already exists in registered users
      const registeredUsers = getRegisteredUsers();
      
      const usernameTaken = Object.values(registeredUsers).some(
        ({ user }) => user.username?.toLowerCase() === username.toLowerCase()
      );
      
      if (username.toLowerCase() === "admin" || username.toLowerCase() === "testuser" || usernameTaken) {
        toast.error("Username already taken");
        return false;
      }
      
      // Check if email already exists in registered users
      if (registeredUsers[email]) {
        toast.error("Email already registered");
        return false;
      }
      
      // Create new user
      const userData: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        username,
        phone,
        organization,
        role: "candidate", // New users are candidates by default
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      // Save to registered users
      saveRegisteredUser(email, {
        user: userData,
        password: password
      });
      
      console.log("User registered:", userData);
      
      // Log the user in
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Registration successful");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        toast.error("You must be logged in to update your profile");
        return false;
      }
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // If this is a registered user, update their data in the registered users storage
      const registeredUsers = getRegisteredUsers();
      if (user.email && registeredUsers[user.email]) {
        registeredUsers[user.email].user = updatedUser;
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
      }
      
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to update profile");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
