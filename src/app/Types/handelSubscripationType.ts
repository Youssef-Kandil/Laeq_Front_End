


export interface NewSubscripationType{
  transaction_id:string;
  operationType?: "renew" | "upgrade";
}

export interface BaseSubscripationType extends NewSubscripationType {
  transaction_id:string;
  operationType?: "renew" | "upgrade";
  admin_id: number;
  amount: number;
  start_date: string;
  end_date: string;
  plan_id: number;
}




export interface UpgradeSubscripationType extends BaseSubscripationType{
  plan_type:string;
  max_companies:number,
  max_site:number,
  max_users:number,
  max_custom_checklists:number,
  max_Corrective_action:number,
  free_onsite_inspections:number,
  Arabic_language_support:number,
  Access_to_training_programs:number,
  Daily_monitoring_sheets:number,
}

export interface HandelSubscripationType extends BaseSubscripationType {
  plan_type?: string;
  max_companies?:number,
  max_site?:number,
  max_users?:number,
  max_custom_checklists?:number,
  max_Corrective_action?:number,
  free_onsite_inspections?:number,
  Arabic_language_support?:number,
  Access_to_training_programs?:number,
  Daily_monitoring_sheets?:number, 
}