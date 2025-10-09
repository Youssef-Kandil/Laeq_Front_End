import { useQuery ,useQueryClient ,useMutation} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();
import { QuestionType } from "../Types/checklistTypes";


// === GET Questions by Templates ID ===
export const useGetQuestionsByTemplatesId = (template_id: number) => {
  return useQuery({
    queryKey: ["questions", template_id], 
    queryFn: () => api.post("/get_checklists_temp_questions", { template_id }),
    enabled: !!template_id, 
    select: (res) => res[0].questions 
  });
};

export const useEditQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newQuestioon:QuestionType) =>
      api.update("/edit_checklists_temp_questions", newQuestioon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] }); // تحديث القائمة
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newQuestioon: {id:number}) =>
      api.delete("/delete_checklists_temp_questions", newQuestioon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] }); // تحديث القائمة
    },
  });
};