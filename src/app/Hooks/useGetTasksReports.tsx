import { useQuery } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

// ✅ هوك تقارير الأدمن
export const useAdminReports = (admin_id: number) => {
  return useQuery({
    queryKey: ["adminReports", admin_id],
    queryFn: () =>
      api.post("/get_admin_reports", { admin_id }).then((res) => res),
    enabled: !!admin_id, // ميفتحش الكويري غير لما يبقى فيه ID
  });
};

// ✅ هوك تقارير اليوزر
export const useUserReports = (submitted_by: string) => {
  return useQuery({
    queryKey: ["userReports", submitted_by],
    queryFn: () =>
      api.post("/get_user_reports", { submitted_by }).then((res) => res),
    enabled: !!submitted_by,
  });
};
