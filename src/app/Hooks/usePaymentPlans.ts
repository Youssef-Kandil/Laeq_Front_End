import { useQuery} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

// === GET plans ===
export const usePaymentPlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await api.get("/get_all_plans");
      return res; 
    },
  });
};
