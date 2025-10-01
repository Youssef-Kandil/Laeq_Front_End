import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";
interface Field{
  question_id?:number;
  type:string;
  options?: { id?: string | number; label: string; value: string | number }[];
};

 interface Question{
  template_id?:number;
  question_title:string;
  fields:Field[]
};

const api = new ApiService();

// === GET Check lists ===
export const useCheckList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (getCheckList: {admin_id:number}) =>
      api.post("/get_checklists", getCheckList),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkLists"] }); // تحديث القائمة
    },
  });
};


// === CREATE Check list ===
export const useCreateCheckList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newChecklist: {checklist_title:string,admin_id:number,owner:string}) =>
      api.post("/add_checklists", newChecklist),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkLists"] }); // تحديث القائمة
    },
  });
};

export const useDeleteCheckList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newChecklist: {id:number}) =>
      api.delete("/delete_checklists", newChecklist),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkLists"] }); // تحديث القائمة
    },
  });
};


// === CREATE Check list - Template ===
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newChecklist: {checklist_id:number,template_title:string,questions:Question[]}) =>
      api.post("/add_checklists_Temp", newChecklist),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkLists"] }); // تحديث القائمة
    },
  });
};

