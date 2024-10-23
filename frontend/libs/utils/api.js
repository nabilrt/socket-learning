import axios from "../config/axios-config";

export const loginUser = async (data) => {
  try {
    const response = await axios.post("/user/login", data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const registerUser = async (data) => {
  try {
    const response = await axios.post("/user/add-user", data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const forgetPassword = async (data) => {
  try {
    const response = await axios.post("/user/forgotPassword", data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const userDetails = async () => {
  try {
    const response = await axios.get("/user/me");
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllConversations = async () => {
  try {
    const response = await axios.get("/inbox/conversations");
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllConversationMessages = async (id) => {
  try {
    const response = await axios.get("/inbox/messages/" + id);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const sendUserMessages = async (data) => {
  try {
    const response = await axios.post("/inbox/message", data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllUsers = async (searchQuery) => {
  try {
    const response = await axios.get(`/user/users?search=${searchQuery}`);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createConversation = async (data) => {
  try {
    const response = await axios.post("/inbox/conversation", data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const uploadAvatarForUser = async (data) => {
  try {
    const response = await axios.post("/user/upload-avatar", data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
