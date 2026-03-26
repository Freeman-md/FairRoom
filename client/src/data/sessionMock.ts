import { users } from "./mockData";

export const CURRENT_USER_ID = "9b3f5d2e-4b8e-4a16-9e1f-2baf3a9e9d01";

export const currentUser = users.find((u) => u.id === CURRENT_USER_ID) ?? users[0];