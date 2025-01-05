import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend url
  withCredentials: true, // to send cookies for session management
});

export const fetchGroups = () => api.get("/groups/discover");
export const createGroup = (data) => api.post("/groups/create", data);
export const joinGroup = (groupId) => api.post(`/groups/${groupId}/join`);
export const sendMessage = (groupId, message) =>
  api.post(`/groups/${groupId}/send-message`, { message });
export const fetchMessages = (groupId) => api.get(`/groups/${groupId}/messages`);

export default api;
