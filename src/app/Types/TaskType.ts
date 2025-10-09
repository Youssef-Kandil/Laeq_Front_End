export interface AssignTaskPayload{
        admin_id: number;
        user_id: number;
        template_id: number;
        company_id: number;
        site_id: number;
        status?: string; // ممكن تخليها اختيارية لو default "pending"
}