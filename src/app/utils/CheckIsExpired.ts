import { getAdminAccountInfo } from "./getAccountInfo"; 


export function CheckIsExpired():boolean|string{

  const info = getAdminAccountInfo("AccountInfo");

    if (!info) {
      // is expired is true
      return "INFO IS NULL";
    }

    const endDate = info?.userDetails?.end_date
    ? new Date(info.userDetails.end_date).getTime()
    : null;

  const now = Date.now();

  const isExpired = endDate ? endDate < now : false;

  return isExpired
}