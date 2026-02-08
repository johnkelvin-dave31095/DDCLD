import { post } from "./http";

export type LoginResponse = {
  message: string;
  user_id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
};

export function login(email: string, password: string) {
  return post<LoginResponse>("/auth/login", {
    email,
    password,
  });
}
