import { useMutation } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";
import { Answer ,report_payload } from "../Types/AnswerType";

const api = new ApiService();

export const useSubmitTemplateAnswers = () => {
  return useMutation({
    mutationFn: async (payload: report_payload) => {
      const formData = new FormData();

      // نعمل نسخة معدلة من الأسئلة كلها
      const updatedQuestions = payload.questions.map((question, qIndex) => {
        const updatedAnswers = question.answers.map((ans, aIndex) => {
          if ((ans.type === "images" || ans.type === "signature") && ans.value instanceof Blob) {
            const fileKey = `files-q${qIndex}-a${aIndex}`;
            const ext = ans.type === "signature" ? "webp" : "pdf";
            formData.append(fileKey, ans.value, `upload-${qIndex}-${aIndex}.${ext}`);

            // نخلي value = reference
            return { ...ans, value: fileKey };
          }
          return ans;
        });

        return { ...question, answers: updatedAnswers };
      });

      // نضيف الميتا كلها بعد ما خلصنا التعديل
      formData.append("meta", JSON.stringify({ ...payload, questions: updatedQuestions }));

      // ابعت الـ FormData
      const res = await api.postFormData("/add_temp_questions_answers", formData);
      return res;
    },

    onError: (error) => {
      console.error("Error submitting answers:", error);
    },
  });
};


export const useSubmitTemplateAnswers_OLD = () => {
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
