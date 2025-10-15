
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

// === Add New Action ===
export const useAddAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      action_title: string;
      status: string;
      company_id: number;
      site_id: number;
      admin_id: number;
      created_by: number;
      assigned_to: number;
    //   fieldID: number;
    //   created_at?: string | Date;
    }) => api.post("/add_new_action", payload).then((res) => res),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actions"] });
    },
  });
};



// === Fetch Actions By ID ===
export const useActions = (args: { id: number;user_id:number; role: "admin" | "user" }) => {
    return useQuery({
      queryKey: ["actions", args],
      queryFn: () => {
        if (args.role === "admin") {
          return api
            .post("/get_all_actions_by_admin_id", { admin_id: args.id ,user_id:args.user_id })
            .then((res) => res);
        }
        return api
          .post("/get_all_actions_assigned_to_user", { user_id: args.id })
          .then((res) => res);
      },
      enabled: !!args.id && !!args.role,
    });
  };

// === Fetch Actions By Admin ID ===
export const useAdminActions = (admin_id: number) => {
  return useQuery({
    queryKey: ["actions", "admin", admin_id],
    queryFn: () =>
      api.post("/get_all_actions_by_admin_id", { admin_id }).then((res) => res),
    enabled: !!admin_id,
  });
};

// === Fetch Actions Assigned To User ===
export const useUserActions = (user_id: number) => {
  return useQuery({
    queryKey: ["actions", "user", user_id],
    queryFn: () =>
      api
        .post("/get_all_actions_assigned_to_user", { user_id })
        .then((res) => res),
    enabled: !!user_id,
  });
};

// === Assign Action To User ===
export const useAssignAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { action_id: number; user_id: number }) =>
      api.post("/assign_action_to_user", payload).then((res) => res),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actions"] });
    },
  });
};

// === Update Action Status ===
export const useUpdateActionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { action_id: number; status: string }) =>
      api.update("/update_action_Status", payload).then((res) => res),

    onSuccess: (_, variables) => {
      // invalidate queries
      queryClient.invalidateQueries({ queryKey: ["actions"] });
      queryClient.invalidateQueries({
        queryKey: ["actions", "admin", variables.action_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["actions", "user", variables.action_id],
      });
    },
  });
};

// === Delete Action ===
export const useDeleteAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: number }) =>
      api.delete("/delete_action", payload).then((res) => res),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actions"] });
    },
  });
};
