
export interface laeq_user{
    id:number;
    // ==== users Table info ===
    email:string;
    password:string;
    role:"laeq";
    // ==== users Table info ===
    user_id:number;
    full_name:string;
}


export interface adminType{
     // ==== users Table info ===
    email:string;
    password:string;
    role:"admin";
    // ==== users Table info ===
    user_id:number;
    plan_id:number;

    full_name:string;
    phone:string;
    register_with_google:number|boolean;
    start_date:string;
    end_date:string;
    plan_type:string;
    
}

export interface employeeType{
    // ==== users Table info ===
    email:string;
    password:string;
    role:"employee";
    // ==== users Table info ===

    user_id?:number
    admin_id:number;
    role_id:number;
    company_id:number;
    site_id:number;
    department_id?:number

    full_name:string;
    job_title:string;
    phone:string;
    is_active:number;
}

export interface userType{
    email:string;
    password:string;
    role:"laeq"|"admin"|"employee";
}