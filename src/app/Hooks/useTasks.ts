// src/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();


export const useTasks = (args: { id: number; role: "admin" | "user" }) => {
    return useQuery({
      queryKey: ["tasks", args],
      queryFn: () => {
        if (args.role === "admin") {
          return api.post("/getTaskByAdminID", { admin_id: args.id }).then((res) => res);
        }
        return api.post("/getTaskByUSERID", { user_id: args.id }).then((res) => res);
      },
      enabled: !!args.id && !!args.role,
    });
  };

// === Fetch Tasks Created By Admin ===
export const useAdminTasks = (admin_id: number) => {
  return useQuery({
    queryKey: ["tasks", "admin", admin_id],
    queryFn: () =>
      api.post("/getTaskByAdminID", { admin_id }).then((res) => res),
    enabled: !!admin_id, // ميشتغلش غير لو admin_id موجود
  });
};

// === Fetch Tasks Assigned To User ===
export const useUserTasks = (user_id: number) => {
  return useQuery({
    queryKey: ["tasks", "user", user_id],
    queryFn: () =>
      api.post("/getTaskByUSERID", { user_id }).then((res) => res),
    enabled: !!user_id,
  });
};

// === Assign Task To User ===
// === Assign Multiple Tasks To User ===
export const useAssignTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      admin_id: number;
      user_id: number;
      template_id: number;
      company_id: number;
      site_id: number;
      status?: string; // ممكن تخليها اختيارية لو default "pending"
    }[]) =>
      api
        .post("/assignTaskToUserByAdminID", payload) // هنا هيبعت array
        .then((res) => res.data),

    onSuccess: () => {
      // invalidate tasks queries علشان يعيد الفetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// === Update Task Status ===
export const useGetTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { task_id: number }) =>
      api.post("/getTaskStatusByID", payload).then((res) => res),

    onSuccess: (_, variables) => {
      // invalidate tasks queries للادمن أو اليوزر على حسب
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "admin", variables.task_id] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "user", variables.task_id] });
    },
  });

};

// === Update Task Status ===
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { task_id: number; status: string }) =>
      api.update("/updateTaskStatusByID", payload).then((res) => res),

    onSuccess: (_, variables) => {
      // invalidate tasks queries للادمن أو اليوزر على حسب
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "admin", variables.task_id] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "user", variables.task_id] });
    },
  });
};

// === Update Task Score ===
export const useUpdateTaskScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { task_id: number; score: string }) =>
      api.update("/updateTaskScoreByID", payload).then((res) => res),

    onSuccess: (_, variables) => {
      // invalidate tasks queries للادمن أو اليوزر على حسب
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "admin", variables.task_id] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "user", variables.task_id] });
    },
  });
};


// === Delete inspector_requests ===
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: number }) =>
      api.delete("/delete_task", payload).then((res) => res),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

