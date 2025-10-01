import { useMutation } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

// === Get Forget Password Question by Email ===
export const useForgetPasswordQuestion = () => {
    return useMutation({
      mutationFn: (payload: { email: string }) =>
        api.post("/get_forget_password_question_by_email", payload).then((res) => res),
    });
  };

// === Check Answer ===
export const useCheckForgetPasswordAnswer = () => {
  return useMutation({
    mutationFn: (payload: { answer: string }) =>
      api.post("/check_answer", payload).then((res) => res),
  });
};

// === Update Password ===
export const useUpdateForgetPassword = () => {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      api.update("/update_password", payload).then((res) => res),
  });
};
