import type { RegisteredAccount } from "@/types/auth";
import { STORAGE_KEY_ACCOUNTS } from "@/lib/constants";
import { readJson, writeJson } from "@/lib/storage/localStorage";
import { createId } from "@/lib/id";

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function getRegisteredAccounts(): RegisteredAccount[] {
  const accounts = readJson<RegisteredAccount[]>(STORAGE_KEY_ACCOUNTS);
  return Array.isArray(accounts) ? accounts : [];
}

export function findAccountByUsername(
  username: string,
): RegisteredAccount | undefined {
  const normalized = normalizeUsername(username);
  return getRegisteredAccounts().find(
    (account) => account.usernameLower === normalized,
  );
}

export function isUsernameTaken(username: string): boolean {
  return Boolean(findAccountByUsername(username));
}

/** Creates or replaces the account for a username. */
export function saveRegisteredAccount(
  account: Omit<RegisteredAccount, "id"> & { id?: string },
): RegisteredAccount {
  const storedAccount: RegisteredAccount = {
    ...account,
    id: account.id ?? createId("acc"),
  };

  const others = getRegisteredAccounts().filter(
    (existing) => existing.usernameLower !== storedAccount.usernameLower,
  );

  writeJson(STORAGE_KEY_ACCOUNTS, [...others, storedAccount]);

  return storedAccount;
}
