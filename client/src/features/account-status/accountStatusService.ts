import { fairroomApi } from "@/api/fairroomApi";

export async function loadAccountStatusOverview() {
  const [accountStatus, accountActivities] = await Promise.all([
    fairroomApi.getAccountStatus(),
    fairroomApi.getAccountActivities(),
  ]);

  return {
    accountStatus,
    accountActivities,
  };
}
