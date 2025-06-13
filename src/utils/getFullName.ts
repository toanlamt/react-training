import type { BasicInfo } from "../shared/types/userProfile";

export const getFullName = (profile: Pick<BasicInfo, 'first_name' | 'middle_name' | 'last_name'>): string => {
  return [profile.first_name, profile.middle_name, profile.last_name]
    .filter(Boolean)
    .join(" ");
};