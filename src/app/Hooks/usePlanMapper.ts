import { useMemo } from "react";

const featureKeyMap: Record<string, string> = {
  "Access to training programs": "Access_to_training_programs",
  "Daily monitoring sheets": "Daily_monitoring_sheets",
  "Arabic language support": "Arabic_language_support",
  "Branches included": "max_branches",
  "Users included": "max_users",
  "Custom checklist fee": "max_custom_checklists",
  "corrective action features": "max_Corrective_action",
  "Free onsite inspections": "free_onsite_inspections"
};

// القيم الافتراضية كلها بصفر
const defaultLimits: Record<string, number> = {
  Access_to_training_programs: 0,
  Daily_monitoring_sheets: 0,
  Arabic_language_support: 0,
  max_companies: 0,
  max_site: 0,
  max_users: 0,
  max_custom_checklists: 0,
  max_Corrective_action: 0,
  free_onsite_inspections: 0
};

// Pure function version for use outside React render cycle
export function mapPlanToLimits(plan: Plan): Record<string, number> {
  const result: Record<string, number> = { ...defaultLimits };
  if (plan?.plan_features) {
    plan.plan_features.forEach((f: PlanFeature) => {
      const mappedKey = featureKeyMap[f.feature_name];
      if (mappedKey) {
        result[mappedKey] = Number(f.feature_value) || 0;
      }
    });
  }
  return result;
}

type PlanFeature = {
  feature_name: string;
  feature_value: string | number;
  type:string
};

type Plan = {
  id:number;
  title: string;
  price: number;
  duration:string;
  is_yearly: number; // 1 = yearly, 0 = monthly
  plan_features: PlanFeature[],
};

export function usePlanMapper(plan: Plan) {
  return useMemo(() => {
    return mapPlanToLimits(plan);
  }, [plan]);
}
