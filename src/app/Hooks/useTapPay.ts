import { useMutation  } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";
import { TapPayRequest } from "../Types/TapPayType";
import { HandelSubscripationType } from "../Types/handelSubscripationType";
const api = new ApiService();


export const useTapCheckout = () => {
  return useMutation({
    mutationFn: async (payload: TapPayRequest) => {
      try {
        const res = await api.post("/pay_checkout", payload);
        if (!res.transaction) throw new Error("No transaction returned");
        return res;
      } catch (err) {
        console.error("Checkout error:", err);
        throw err; // خلي React Query تعرف إنه فيه خطأ
      }
    },
    onSuccess: (res) => {
      const url = res.transaction?.url;
      if (url) {
        // ✅ redirect آمن للـ transaction URL
        window.location.href = url;
      } else {
        console.warn("No transaction URL returned");
      }
    },
    onError: (err) => {
      // هنا ممكن تعرض toast أو modal للمستخدم
      console.error("Mutation failed:", err);
    },
  });
};


export const useHandelPayStatus = () => {
  return useMutation({
    mutationFn: async (payload: HandelSubscripationType) => {
      try {
        const res = await api.post("/pay_check", payload);
        if (!res) throw new Error("No response from server");
        return res;
      } catch (err) {
        console.error("Check payment status error:", err);
        throw err; // ده هيوصل React Query إنه فيه error
      }
    },
    // onSuccess: (data) => {
    //   console.log("✅ Payment status:", data);
    // },
    onError: (error) => {
      console.error("❌ Payment status check failed:", error);
    },
  });
};
