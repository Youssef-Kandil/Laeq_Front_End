import { useQuery} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

// === GET plans ===
export const usePaymentPlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      try {
        const res = await api.get("/get_all_plans");
        if (!res) throw new Error("No response from server");
        return res;
      } catch (err) {
        // ارمي الخطأ عشان React Query تعرف فيه مشكلة
        throw err;
      }
    },
    retry: false, // تمنع إعادة المحاولة التلقائية
  });
};


