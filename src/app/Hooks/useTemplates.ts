import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();


// === GET Templates by Checklist ID ===
export const useGetTemplatesByChecklistId = (checklist_id: number) => {
  return useQuery({
    queryKey: ["templates", checklist_id], 
    queryFn: () => api.post("/get_checklists_Temp", { checklist_id }),
    enabled: !!checklist_id, 
    select: (res) => res 
  });
};