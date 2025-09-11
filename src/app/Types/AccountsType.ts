
export interface AdminAccountInfo  {
  id: number;
  roll: "admin";
  userDetails: {
    end_date: string;
    full_name: string;
    id: number;
    phone: string;
    plan_type: string;
    start_date: string;
  };
};
export interface EmpAccountInfo  {
  id: number;
  roll: "employee";
  userDetails: {
    id: number;
    admin_id:number;
    full_name: string;
    phone: string;
  };
};
export interface AccountInfo  {
  id: number;
  role:  "admin"|"employee";
  email:string;
  userDetails: {
    full_name: string;
    id: number;
    phone: string;
    plan_id?: number;
    plan_type?: string;
    start_date?: string;
    end_date?: string;
    admin_id?:number;
    permissions?:string[]
    admin_account_limits?:{
      max_branches:number,
      max_users:number,
      max_custom_checklists:number,
      max_Corrective_action:number,
      free_onsite_inspections:number,
      Arabic_language_support:number,
      Access_to_training_programs:number,
      Daily_monitoring_sheets:number,
    }
  };
};


export interface AdminAccountPayload {
  email: string;
  password: string;
  role: string;
  full_name: string;
  phone: string;
  register_with_google:number;
  plan_id: number;
  plan_type: string;
  start_date: string; // أو Date
  end_date: string;   // أو Date
}
