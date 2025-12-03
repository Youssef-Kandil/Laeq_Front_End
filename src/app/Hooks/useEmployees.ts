import { useQuery,useMutation ,QueryClient, useQueryClient} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

import { employeeType } from '../Types/usersType';

const api = new ApiService();

// === Get All Emp By Admin ID ===
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


// === Get Emp Data ===
export const useGetEmployeeDataByID = (id: number) => {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: () =>
      api
        .post("/get_emp_data_by_id", { id })
        .then((res) => res),
    enabled: !!id, // يمنع التشغيل لو admin_id فاضي
  });
};

// === Create Emp ===
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


// === Update Emp ===
export const useEditeEmployee = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (payload: employeeType) =>
      api.update("/edit_employee", payload).then((res) => res),
    onSuccess: (data) => {
      // خزّن الداتا في الكاش
      queryClient.setQueryData(["employees"], data);
    },
  });
};

// === Delete Emp ===
export const useDeleteEmp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: number }) =>
      api.delete("/delete_employees", payload).then((res) => res),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};