import { useMutation ,useQuery } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";
import { TapPayRequest } from "../Types/TapPayType";
const api = new ApiService();


export const useTapCheckout = () => {
  return useMutation({
    mutationFn: (payload: TapPayRequest) =>
      api.post("/pay_checkout", payload), // بنده على السيرفر بتاعي مش Tap مباشرة
    onSuccess: (res) => {
      const data = res;
      console.error(data.transaction.url)
      // ✅ اعمل redirect لو Tap رجعلك لينك للـ transaction
      if (data.transaction?.url) {
        window.location.href = data.transaction.url;
      }
    },
  });
};


export const useCheckPayStatus = (transaction_id: string) => {
  return useQuery({
    queryKey: ["payment-status", transaction_id],
    queryFn: () =>
      api.post("/pay_check", { transaction_id }), // يبعت ID للباك إند
    enabled: !!transaction_id,
    refetchInterval: 5000, // لو عايز يشايك كل 5 ثواني
  });
};