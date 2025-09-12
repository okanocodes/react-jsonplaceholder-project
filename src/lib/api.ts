// src/api.ts
import axios from "axios";

const API_BASE = "https://jsonplaceholder.typicode.com";

// Types

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body?: string;
}

// User API
export const getUsers = async (): Promise<User[]> => {
  const res = await axios.get<User[]>(`${API_BASE}/users`);
  return res.data.map((user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
  }));
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const res = await axios.post<User>(`${API_BASE}/users`, user);
  return res.data;
};

export const updateUser = async (
  id: number,
  user: Partial<User>
): Promise<User> => {
  const res = await axios.put<User>(`${API_BASE}/users/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/users/${id}`);
};

// Post API
export const getPosts = async (): Promise<Post[]> => {
  const res = await axios.get<Post[]>(`${API_BASE}/posts`);
  return res.data;
};

export const createPost = async (post: Omit<Post, "id">): Promise<Post> => {
  const res = await axios.post<Post>(`${API_BASE}/posts`, post);
  console.log("Created Post:", res.data);
  return res.data;
};

export const updatePost = async (
  id: number,
  post: Partial<Post>
): Promise<Post> => {
  const res = await axios.put<Post>(`${API_BASE}/posts/${id}`, post);
  return res.data;
};

export const deletePost = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/posts/${id}`);
};
