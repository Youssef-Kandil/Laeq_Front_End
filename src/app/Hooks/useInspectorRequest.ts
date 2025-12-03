import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

// === Get All Inspector Requests ===
export const useInspectorRequests = () => {
  return useQuery({
    queryKey: ["inspector_requests"],
    queryFn: () =>
      api.get("/get_all_inspector_requests").then((res) => res),
  });
};

// === Get Inspector Requests By Admin ID ===
export const useInspectorRequestsByAdmin = (admin_id: number) => {
  return useQuery({
    queryKey: ["inspector_requests", "admin", admin_id],
    queryFn: () =>
      api
        .post("/get_admin_inspector_requests", { admin_id })
        .then((res) => res),
    enabled: !!admin_id,
  });
};

// === Add New Inspector Request ===
export const useAddInspectorRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      admin_id: number;
      company_id: number;
      site_id: number;
      status: string;
    }) => api.post("/add_new_inspector_requests", payload).then((res) => res),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspector_requests"] });
    },
  });
};

// === Update Inspector Request Status ===
export const useUpdateInspectorRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { request_id: number; status: string }) =>
      api.update("/update_inspector_request_status", payload).then((res) => res),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspector_requests"] });
    },
  });
};

// === Delete inspector_requests ===
export const useDeleteInspector_request = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: number }) =>
      api.delete("/delete_inspector_request", payload).then((res) => res),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspector_requests"] });
    },
  });
};
