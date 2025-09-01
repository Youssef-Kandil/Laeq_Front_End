import { useQuery } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();


// === GET Questions by Templates ID ===
export const useGetQuestionsByTemplatesId = (template_id: number) => {
  return useQuery({
    queryKey: ["questions", template_id], 
    queryFn: () => api.post("/get_checklists_temp_questions", { template_id }),
    enabled: !!template_id, 
    select: (res) => res[0].questions 
  });
};