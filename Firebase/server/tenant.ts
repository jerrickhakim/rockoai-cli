import "server-only";

import { auth, db } from "./firebase";

import { verifyApiAccessForTenant } from "./auth";
import { any } from "zod";

interface TenantData {
  id: string;
  [key: string]: any;
}

interface UserData {
  uid: string;
  displayName: string | null;
  role: "admin" | "teamMember";
  avatar: string | null;
}

export async function getTenant(name: string, id: string): Promise<TenantData> {
  const ref = await db.collection(name).doc(id).get();
  return { ...ref.data(), id: ref.id };
}

export async function getCurrentUserForTenant(
  tenant: string,
  tenantDataId: string,
  userId: string,
): Promise<UserData> {
  const access = await verifyApiAccessForTenant(tenant, tenantDataId, "admin");

  if (!access) {
    throw new Error("Unauthorized");
  }

  const ref = await db.collection(tenant).doc(tenantDataId).get();

  if (!ref.exists) {
    throw new Error("Tenant does not exist");
  }

  const userRef = await db
    .collection(`${tenant}/${tenantDataId}/users`)
    .doc(userId)
    .get();

  if (!userRef.exists) {
    throw new Error("User does not exist");
  }

  const userData = userRef.data();
  const firebaseUser = await auth.getUser(userId);

  if (!firebaseUser) {
    throw new Error("Firebase user does not exist");
  }

  return {
    uid: userId,
    displayName: firebaseUser.displayName!,
    role: userData?.admin ? "admin" : "teamMember",
    avatar: firebaseUser?.photoURL || null,
  };
}

export async function getCurrentUsersForTenant(
  tenant: string,
  tenantDataId: string,
): Promise<UserData[]> {
  const ref = await db.collection(tenant).doc(tenantDataId).get();

  if (!ref.exists) {
    throw new Error("Tenant does not exist");
  }

  const tenantData = ref.data();
  const userIds = Object.keys(tenantData?.users || {});

  const userPromises = userIds.map(async (userId) => {
    try {
      const userRef = await db
        .collection(`${tenant}/${tenantDataId}/users`)
        .doc(userId)
        .get();

      if (!userRef.exists) return null;
      const userData = userRef.data();
      let firebaseUser;

      try {
        firebaseUser = await auth.getUser(userId);
      } catch (error) {
        return null;
      }

      if (!firebaseUser) return null;
      return {
        uid: userId,
        displayName: firebaseUser.displayName,
        role: userData?.admin ? "admin" : "teamMember",
        avatar: firebaseUser.photoURL,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  });
  const tenantDataUsers = (await Promise.all(userPromises)).filter(
    (user) => user !== null,
  );

  return tenantDataUsers as UserData[];
}

export const getTenantById = async (
  tenant: string,
  id: string,
): Promise<TenantData> => {
  try {
    const ref = db.collection(tenant).doc(id);
    const doc = await ref.get();
    return doc.exists
      ? ({ ...doc.data(), id: doc.id } as TenantData)
      : ({} as TenantData);
  } catch (error) {
    console.error("Error getting tenant:", error);
    return {} as TenantData;
  }
};

/**
 * Fetches user details for a list of user IDs within a tenant
 * @param userIds - Array of user IDs to fetch details for
 * @returns Promise resolving to array of user objects containing displayName, uid, and photoURL
 * @example
 * import {getUsersForTenant} from "@/server/auth"
 * const users = await getUsersForTenant(["uid1", "uid2", "uid3"]);
 * console.log(users);
 */

interface CustomUserRecord {
  displayName: string | undefined;
  uid: string;
  photoURL: string | null;
}

export const getUsersForTenant = async (
  userIds: string[],
): Promise<CustomUserRecord[]> => {
  const users = await Promise.all(
    userIds.map(async (uid) => {
      try {
        const user = await auth.getUser(uid);
        return {
          uid: uid,
          displayName: user.displayName,
          photoURL: user?.photoURL || null,
        };
      } catch (error) {
        console.error(`❌ Error fetching user ${uid}:`, error);
        return null; // Remove any null values
      }
    }),
  );

  return users.filter((user): user is CustomUserRecord => user !== null);
};
