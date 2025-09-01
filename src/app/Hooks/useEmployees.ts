import { useQuery,useMutation ,QueryClient} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

import { employeeType } from '../Types/usersType';

const api = new ApiService();

export const useEmployees = (admin_id: number) => {
  return useQuery({
    queryKey: ["employees", admin_id],
    queryFn: () =>
      api
        .post("/get_all_emps_created_by_admin", { admin_id })
        .then((res) => res),
    enabled: !!admin_id, // يمنع التشغيل لو admin_id فاضي
  });
};

export const useCreateEmployee = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (payload: employeeType) =>
      api.post("/add_new_emp", payload).then((res) => res),
    onSuccess: (data) => {
      // خزّن الداتا في الكاش
      queryClient.setQueryData(["employees"], data);
    },
  });
};