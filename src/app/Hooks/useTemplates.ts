import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

interface options{
  label:string;
  value:string;
}
export interface Field{
  question_id:number;
  type:string;
  options?:options[];
};

export interface Question{
  id?:number,
  template_id:number;
  question_title:string;
  fields:Field[]
};

export interface Template{
  id?:number,
  checklist_id:number;
  template_title:string;
  questions?:Question[]

}; 


// === GET Templates by Checklist ID ===
export const useGetTemplatesByChecklistId = (checklist_id: number) => {
  return useQuery({
    queryKey: ["templates", checklist_id], 
    queryFn: () => api.post("/get_checklists_Temp", { checklist_id }),
    enabled: !!checklist_id, 
    select: (res) => res 
  });
};

export const useGetMutationTemplatesByChecklistId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checklistID:{checklist_id: number}) =>
      api.post("/get_checklists_Temp", checklistID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] }); // تحديث القائمة
    },
  });
};

// === GET Templates by Checklist ID ===
export const useGetTemplateDataByID = (template_id: number) => {
  return useQuery({
    queryKey: ["templates", template_id], 
    queryFn: () => api.post("/get_checklists_Temp_data", { template_id }),
    enabled: !!template_id, 
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


// === Update Check list - Template ===
export const useEditTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTemplate:Template) =>
      api.update("/edit_checklist_Temp", newTemplate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] }); // تحديث القائمة
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTemplate: {id:number}) =>
      api.delete("/delete_checklists_Temp", newTemplate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] }); // تحديث القائمة
    },
  });
};