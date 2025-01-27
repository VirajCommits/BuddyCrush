import axios from "axios";
const api = axios.create({
  // baseURL: "https://buddy-board-88fd54c902d8.herokuapp.com/api", 
  baseURL: "http://127.0.0.1:5000/api", 
  withCredentials: true, // To send cookies for session management
});
export const fetchProfile = () => api.get("/profile");
export const fetchGroups = () => api.get("/groups/discover");
export const createGroup = (data) => api.post("/groups/create", data);
export const joinGroup = (groupId) => api.post(`/groups/${groupId}/join`);
export const sendMessage = (groupId, message) =>
  api.post(`/groups/${groupId}/send-message`, { message });
export const fetchMessages = (groupId) => api.get(`/groups/${groupId}/messages`);
export const completeDailyTask = (groupId) =>
  api.post(`/groups/${groupId}/complete`);
export const fetchLeaderboard = (groupId) =>
  api.get(`/groups/${groupId}/leaderboard`);
export const fetchActivityFeed = (groupId) =>
  api.get(`/groups/${groupId}/activity`);
export const checkHabitCompletion = (groupId) =>
  api.get(`/groups/${groupId}/check-habit`); // Add this function

export default api;
