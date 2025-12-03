import { useMutation } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

// ========== Request OTP ==========
export const useRequestOTP = () => {
  return useMutation({
    mutationFn: (payload: { email: string }) =>
      api.post("/request_otp", payload).then((res) => res),
  });
};

// ========== Verify OTP ==========
export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      api.post("/verify_otp", payload).then((res) => res),
  });
};
