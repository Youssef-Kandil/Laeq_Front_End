export interface RolePayload {
    id?:number;
    role_name:string;
    description:string;
    admin_id:number;
    permissionsIds:number[];
}