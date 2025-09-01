import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

// === GET Check lists ===
export const useCheckList = () => {
  return useQuery({
    queryKey: ["checkLists"],
    queryFn: () => api.get("/get_checklists"),
  });
};


// === CREATE Check list ===
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newChecklist: {checklist_title:string,admin_id:number}) =>
      api.post("/add_checklists", newChecklist),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkLists"] }); // تحديث القائمة
    },
  });
};