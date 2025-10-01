import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

// === Delete checklists_Temp ===
// export const useDeleteChecklists_Temp = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: { id: number }) =>
//       api.delete("/delete_task", payload).then((res) => res),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["checklists_Temp"] });
//     },
//   });
// };

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newChecklist: {id:number}) =>
      api.delete("/delete_checklists_Temp", newChecklist),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Templates"] }); // تحديث القائمة
    },
  });
};