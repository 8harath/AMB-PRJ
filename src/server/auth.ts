import "server-only";
import { cache } from "react";

export type AppSession = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

const DEFAULT_PUBLIC_USER_EMAIL = "public@allweone.app";
const DEFAULT_PUBLIC_USER_NAME = "Public Visitor";

const syncAppUser = cache(async (): Promise<AppSession> => {
  return {
    user: {
      id: "public-session",
      name: DEFAULT_PUBLIC_USER_NAME,
      email: DEFAULT_PUBLIC_USER_EMAIL,
    },
  };
});

export async function auth() {
  return syncAppUser();
}
