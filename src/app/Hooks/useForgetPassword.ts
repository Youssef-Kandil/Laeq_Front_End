import { useMutation } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

// === Get Forget Password Question by Email ===
export const useCheckEmail = () => {
    return useMutation({
      mutationFn: (payload: { email: string }) =>
        api.post("/check_email", payload).then((res) => res),
    });
  };



// === Update Password ===
export const useUpdateForgetPassword = () => {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      api.update("/update_password", payload).then((res) => res),
  });
};
