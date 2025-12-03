import {useQuery, useMutation ,useQueryClient} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";
import { RolePayload } from "../Types/RoleType";

const api = new ApiService();


// === GET Roles ===
export const useRole = (admin_id: number) => {
  return useQuery({
    queryKey: ["roles", admin_id],
    queryFn: () =>
      api.post(`/get_all_roles_created_by_admin`, { admin_id })
         .then(res => res),
    enabled: !!admin_id
  });
};


export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RolePayload) =>
      api.post("/add_new_role", payload).then((res) => res),

    onSuccess: (data, variables) => {
      // تحديث الكاش مباشرةً
      queryClient.setQueryData(["roles", variables], data);
    },
  });
};

// === Get Role Data By Role ID ===
export const useGetRoleDataByID = (id: number) => {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () =>
      api.post(`/get_role_data_by_id`, { id })
         .then(res => res),
    enabled: !!id
  });
};

// === Edit role ===
export const useEditRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RolePayload) =>
      api.update("/edit_role", payload).then((res) => res),

    onSuccess: (data, variables) => {
      // تحديث الكاش مباشرةً
      queryClient.setQueryData(["roles", variables], data);
    },
  });
};


// === Delete role ===
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: number }) =>
      api.delete("/delete_role", payload).then((res) => res),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};