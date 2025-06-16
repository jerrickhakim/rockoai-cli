import "server-only";

import { auth, db } from "./firebase";
import { cookies, headers } from "next/headers";
import { DecodedIdToken, UserRecord } from "firebase-admin/auth";
import { getUsersForTenant } from "./tenant";

export const verifySessionCookie = async (): Promise<DecodedIdToken> => {
  const session = (await cookies()).get("session")?.value;

  if (!session) {
    throw new Error("No session cookie found");
  }

  return await auth
    .verifySessionCookie(session)
    .then((decodedToken: DecodedIdToken) => {
      return decodedToken;
    })
    .catch((error) => {
      throw new Error("Invalid Token");
    });
};

export const verifyToken = async (token: string): Promise<DecodedIdToken> => {
  try {
    return await auth.verifyIdToken(token);
  } catch (error) {
    throw new Error(`Auth Error: Could not verify token ${error}`);
  }
};

export const createUser = async ({
  displayName,
  email,
  password,
}: {
  displayName: string;
  email: string;
  password: string;
}): Promise<{ user: UserRecord; token: string }> => {
  try {
    const user = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
      disabled: false,
    });

    const token = await auth.createCustomToken(user.uid);
    return { user, token };
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  }
};

export const getCurrentUser = async (): Promise<UserRecord | null> => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;

    const decoded = await auth.verifySessionCookie(session);
    const user = await auth.getUser(decoded.uid);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const getCurrentUserDetails = async (): Promise<UserRecord | null> => {
  try {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;

    const decoded = await auth.verifySessionCookie(session);
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    return userDoc.exists ? (userDoc.data() as any) : null;
  } catch (error) {
    console.error("Error getting user details:", error);
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<UserRecord> => {
  try {
    const user = await auth.getUserByEmail(email);
    return await auth.getUser(user.uid);
  } catch (error) {
    throw new Error("User with that email not found");
  }
};

export const verifyApiAccessForTenant = async (
  tenant: string,
  id: string,
  role: "admin" | "teamMember",
): Promise<string | false> => {
  let decodedToken: DecodedIdToken;

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  try {
    if (session) {
      decodedToken = await auth.verifySessionCookie(session);
    } else {
      const authHeader = (await headers()).get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) return false;

      const token = authHeader.split("Bearer ")[1];
      decodedToken = await verifyToken(token);
    }

    const uid = decodedToken.uid;
    const userRoleDoc = await db
      .collection(`/${tenant}/${id}/users`)
      .doc(uid)
      .get();
    if (!userRoleDoc.exists) return false;

    const roles = userRoleDoc.data() as {
      admin?: boolean;
      teamMember?: boolean;
    };

    if (role === "admin" && roles.admin) return uid;
    if (role === "teamMember" && (roles.teamMember || roles.admin)) return uid;

    throw new Error("Unauthorized");
  } catch (error) {
    throw new Error(`Auth Error: Could not verify tenant access ${error}`);
  }
};

export async function isSuperAdmin(uid: string): Promise<boolean> {
  try {
    const user = await auth.getUser(uid);
    return user.customClaims?.admin || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    throw new Error("Unable to check admin status");
  }
}

export const getCurrentUserRoleForTenant = async (
  path: string,
  tenantId: string,
): Promise<{ [key: string]: boolean }> => {
  const sessionCookie = (await cookies()).get("session")!.value;
  const decodedToken = await auth.verifySessionCookie(sessionCookie);
  const uid = decodedToken.uid;

  const tenantRef = db.collection(`data/${tenantId}/users`).doc(uid);
  const workplace = await tenantRef.get();
  const userRole = workplace.data() as { [key: string]: boolean };
  return userRole;
};

export const getTenants = async (path: string): Promise<any[]> => {
  try {
    if (!(await cookies()).has("session")) {
      return [];
    }

    const sessionCookie = (await cookies()).get("session")!.value;
    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    const workplaceRef = db.collection(path).where(`users.${uid}`, "==", true);

    const workplaces = await workplaceRef.get();

    const res = await Promise.all(
      workplaces.docs.map(async (doc) => {
        const userRole = await getCurrentUserRoleForTenant(path, doc.id);
        const workplace = doc.data();
        const users = await getUsersForTenant(Object.keys(workplace.users));
        return { ...workplace, id: doc.id, userRole: userRole, users: users };
      }),
    );

    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error("Error getting data: ", error);
    return [];
  }
};
