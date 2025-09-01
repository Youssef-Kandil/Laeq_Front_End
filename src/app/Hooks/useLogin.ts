import { useMutation ,QueryClient} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();
const queryClient = new QueryClient();

// === Admin Login ===
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      api.post("/login", credentials).then(res => res),
       onSuccess: (data) => {
         // خزّن الداتا في الكاش
            queryClient.setQueryData(["adminAccountInfo"], data);
       },
  });
};