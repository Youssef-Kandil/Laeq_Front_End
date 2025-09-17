import { useMutation } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";
import { Answer } from "../Types/AnswerType";

const api = new ApiService();

export const useSubmitTemplateAnswers = () => {
  return useMutation({
    mutationFn: async (answers: Answer[]) => {
      const formData = new FormData();

      const metaArray = answers.map((answer, index) => {
        if ((answer.type === "images" || answer.type === "signature") && answer.value instanceof Blob) {
          // const fileKey = `${answer.type}-${index}`;
          const fileKey = `files-${index}`;
          const ext = answer.type === "signature" ? "webp" : "pdf";
          formData.append(fileKey, answer.value, `upload-${index}.${ext}`);
          return { ...answer, value: fileKey }; // نخلي value = reference
        }
      
        return answer;
      });
      // ضيف الميتا كلها
      formData.append("meta", JSON.stringify(metaArray));

      // ابعت الـ FormData
      const res = await api.postFormData("/add_temp_questions_answers", formData);

      return res;
    },

    onError: (error) => {
      console.error("Error submitting answers:", error);
    },
  });
};
