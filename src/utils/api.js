import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000/api", 
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

export default api;
