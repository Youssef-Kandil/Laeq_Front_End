import { useQueryClient,useMutation} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";
import { siteType } from "../Types/CompanyType";


const api = new ApiService();


// === CREATE NEW COMPANY BY ADMIN ID ===
export const useCreateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSite: siteType) =>
      api.post("/add_new_site", newSite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site"] }); // تحديث القائمة
    },
  });
};

// === Edite COMPANY BY ADMIN ID ===
export const useUpdateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCompany: siteType) =>
      api.update("/edit_site", newCompany),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] }); // تحديث القائمة
    },
  });
};

// === Delete Site ===
export const useDeleteSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: number }) =>
      api.delete("/delete_site", payload).then((res) => res),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });
};

