
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
      importance_level:"medium"|"low"|"high"
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

export const useGetActionDataByID=(payload:{id: number, admin_id: number})=>{
  return useQuery({
    queryKey: ["action_data", payload.id, payload.admin_id],
    queryFn: () =>
      api
        .post("/get_action_data_by_id", payload)
        .then((res) => res),
    enabled: !!payload.id && !!payload.admin_id,
  });
}

export const useAddActionDetails = () => {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (payload: { id: number; action_img?: any; comment: string }) => {
      const formData = new FormData();
      let meta = { ...payload };

      try {
        // ====== Handle Action Image (same logic as your assets hook) ======
        if (payload.action_img) {
          // حالة 1: File أو Blob
          if (
            typeof payload.action_img !== "string" &&
            (payload.action_img instanceof Blob ||
              (payload.action_img as Blob).type?.startsWith("image/"))
          ) {
            formData.append("action_img", payload.action_img, "action.webp");
            meta = { ...payload, action_img: "action_img" };
          }

          // حالة 2: Base64
          else if (
            typeof payload.action_img === "string" &&
            payload.action_img.startsWith("data:image")
          ) {
            const blob = await fetch(payload.action_img).then((r) => r.blob());
            formData.append("action_img", blob, "action.webp");
            meta = { ...payload, action_img: "action_img" };
          }

          // حالة 3: URL عادي
          else if (typeof payload.action_img === "string") {
            meta = { ...payload, action_img: payload.action_img };
          }
        }

        // ====== باقي البيانات ======
        formData.append("meta", JSON.stringify(meta));

        // ====== API Call ======
        const res = await api.updateFormData("/add_action_details", formData);
        return res;
      } catch (err) {
        console.error("❌ Error adding action details:", err);
        throw err;
      }
    },

    onError: (error) => {
      console.error("❌ Error adding action details:", error);
    },
  });
};

export const useGetActionDetails = (payload:{id: number, admin_id: number}) => {
  return useQuery({
    queryKey: ["action_details", payload.id, payload.admin_id],
    queryFn: () =>
      api
        .post("/get_action_details", payload)
        .then((res) => res),
    enabled: !!payload.id && !!payload.admin_id,
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
