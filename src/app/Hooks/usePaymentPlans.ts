import { useMutation, useQuery} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

interface plan_features{
  feature_value:string;
  feature_id:number;
}

export interface planType{
  id?:number;
  title:string;
  price:string;
  // duration:string;
  // is_yearly:number;
  plan_features:plan_features[];
}

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
export const useGetPaymentPlanData = (id:number) => {
  return useQuery({
    queryKey: ["plans",id],
    queryFn: async () => {
      try {
        const res = await api.post("/get_plan_data_by_id",{id});
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


export const useUpdatePlane = () => {
  return useMutation({
    mutationFn: (payload:planType) =>
      api.update("/edit_plan", payload).then((res) => res),
  });
};


