import { useQuery } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

// === GET Report Details by Template ID ===
export const useGetReportDetails = (template_id: number,task_id:number) => {
  return useQuery({
    queryKey: ["reportDetails", template_id],
    queryFn: () =>
      api.post("/get_temp_questions_answers", { template_id,task_id }),
    enabled: !!template_id, // ميشتغلش غير لما يبقى في template_id
    select: (res) => res,   // هنا تقدر تختار اللي محتاجه من الـ response
  });
};
