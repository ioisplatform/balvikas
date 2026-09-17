import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { UserProfile } from "../types";

const LOCAL_STORAGE_USER_KEY = "iois_user";
const LOCAL_STORAGE_MEMBERS_KEY = "iois_registered_members";
const LOCAL_STORAGE_CLOUD_KEY = "iois_users_cloud";

/**
 * Saves or updates a registered user in Firestore and LocalStorage
 */
export async function syncUserToCloudAndLocal(user: UserProfile): Promise<void> {
  // 1. Always save to LocalStorage immediately
  try {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));

    // Update members list
    const existingStr = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY) || localStorage.getItem(LOCAL_STORAGE_CLOUD_KEY);
    let members: UserProfile[] = [];
    if (existingStr) {
      try {
        const parsed = JSON.parse(existingStr);
        if (Array.isArray(parsed)) members = parsed;
      } catch {}
    }
    const idx = members.findIndex((m) => m.uniqueId === user.uniqueId || m.mobile === user.mobile);
    if (idx >= 0) {
      members[idx] = { ...members[idx], ...user };
    } else {
      members.push(user);
    }
    localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(members));
    localStorage.setItem(LOCAL_STORAGE_CLOUD_KEY, JSON.stringify(members));
  } catch (err) {
    console.warn("LocalStorage sync notice:", err);
  }

  // 2. Persist to Firestore if available
  try {
    if (db && user.uniqueId) {
      const userRef = doc(db, "users", user.uniqueId);
      await setDoc(userRef, {
        uniqueId: user.uniqueId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        planId: user.planId || "bal_vikas_10",
        planName: user.planName || "डिजिटल बाल विकास सम्पूर्ण किट",
        planPrice: user.planPrice || 10,
        paymentStatus: user.paymentStatus || "verified",
        classGrade: user.classGrade || "Class 1",
        sponsorId: user.sponsorId || "IOIS999VK01",
        city: user.city || "Bihar",
        designation: user.designation || "Verified Student Member",
        registeredAt: user.registeredAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
  } catch (firestoreErr) {
    console.warn("Firestore user sync notice (offline or rule check):", firestoreErr);
  }
}

/**
 * Searches for a user across LocalStorage and Firestore
 * Matches by uniqueId (e.g. IOIS10RK01, IOIS10AS02), mobile number, or email
 */
export async function findUserInCloudOrLocal(
  identifier: string,
  password?: string
): Promise<UserProfile | null> {
  const clean = identifier.trim().toLowerCase();
  const digitsOnly = identifier.replace(/\D/g, "");

  // 1. Check current logged in user in LocalStorage
  try {
    const currentStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (currentStr) {
      const u = JSON.parse(currentStr) as UserProfile;
      if (
        u.uniqueId?.toLowerCase() === clean ||
        u.email?.toLowerCase() === clean ||
        u.mobile === clean ||
        (digitsOnly && u.mobile?.includes(digitsOnly))
      ) {
        if (!password || !u.password || u.password === password) {
          return { ...u, paymentStatus: "verified" };
        }
      }
    }
  } catch {}

  // 2. Check cached members list in LocalStorage
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY) || localStorage.getItem(LOCAL_STORAGE_CLOUD_KEY);
    if (stored) {
      const list = JSON.parse(stored);
      if (Array.isArray(list)) {
        const found = list.find((m: UserProfile) =>
          m.uniqueId?.toLowerCase() === clean ||
          m.email?.toLowerCase() === clean ||
          m.mobile === clean ||
          (digitsOnly.length >= 10 && m.mobile?.includes(digitsOnly))
        );
        if (found) {
          if (!password || !found.password || found.password === password) {
            return { ...found, paymentStatus: "verified" };
          }
        }
      }
    }
  } catch {}

  // 3. Query Firestore 'users' collection
  try {
    if (db) {
      // Direct doc get if identifier is likely a uniqueId (e.g. starts with IOIS)
      if (identifier.toUpperCase().startsWith("IOIS")) {
        const docSnap = await getDoc(doc(db, "users", identifier.toUpperCase()));
        if (docSnap.exists()) {
          const d = docSnap.data() as UserProfile;
          return { ...d, paymentStatus: "verified" };
        }
      }

      // Query by mobile
      if (digitsOnly.length >= 10) {
        const qMobile = query(collection(db, "users"), where("mobile", "==", digitsOnly));
        const snapMobile = await getDocs(qMobile);
        if (!snapMobile.empty) {
          const d = snapMobile.docs[0].data() as UserProfile;
          return { ...d, paymentStatus: "verified" };
        }
      }

      // Query by email
      if (clean.includes("@")) {
        const qEmail = query(collection(db, "users"), where("email", "==", clean));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          const d = snapEmail.docs[0].data() as UserProfile;
          return { ...d, paymentStatus: "verified" };
        }
      }
    }
  } catch (fErr) {
    console.warn("Firestore query notice:", fErr);
  }

  // 4. Default Seed Member (Rahul Kumar IOIS10RK01) fallback
  if (
    clean === "iois10rk01" ||
    clean === "9876543210" ||
    clean === "rahul@iois.in"
  ) {
    if (!password || password === "Password@123") {
      return {
        uniqueId: "IOIS10RK01",
        name: "Rahul Kumar",
        email: "rahul@iois.in",
        mobile: "9876543210",
        planId: "bal_vikas_10",
        planName: "डिजिटल बाल विकास सम्पूर्ण किट",
        planPrice: 10,
        referralCode: "IOISVIP",
        sponsorId: "IOIS999VK01",
        city: "Patna, Bihar",
        designation: "Verified Elite Member",
        paymentStatus: "verified",
        referralEarnings: 21,
        twoFactorEnabled: false,
        registeredAt: "2025-01-01T00:00:00.000Z",
        devices: [],
        progress: {
          hindiProgress: 55,
          englishProgress: 70,
          mathProgress: 60,
          drawingCount: 5,
          quizzesCompleted: 12,
          quizAccuracy: 92,
          studyTimeMinutes: 180,
          streakDays: 5,
          badges: ["badge_starter", "badge_varnamala", "badge_math_star"],
          savedDrawings: [],
          classGrade: "Class 2",
        },
      };
    }
  }

  return null;
}

/**
 * Retrieves all registered users from Firestore and LocalStorage for Admin Panel
 */
export async function getAllUsersForAdmin(): Promise<UserProfile[]> {
  const usersMap = new Map<string, UserProfile>();

  // Always seed member
  const seedMember: UserProfile = {
    uniqueId: "IOIS10RK01",
    name: "Rahul Kumar",
    email: "rahul@iois.in",
    mobile: "9876543210",
    planId: "bal_vikas_10",
    planName: "डिजिटल बाल विकास सम्पूर्ण किट",
    planPrice: 10,
    referralCode: "IOISVIP",
    sponsorId: "IOIS999VK01",
    city: "Patna, Bihar",
    designation: "Verified Elite Member",
    paymentStatus: "verified",
    referralEarnings: 21,
    twoFactorEnabled: false,
    registeredAt: "2025-01-01T00:00:00.000Z",
    devices: [],
    progress: {
      hindiProgress: 55,
      englishProgress: 70,
      mathProgress: 60,
      drawingCount: 5,
      quizzesCompleted: 12,
      quizAccuracy: 92,
      studyTimeMinutes: 180,
      streakDays: 5,
      badges: ["badge_starter", "badge_varnamala", "badge_math_star"],
      savedDrawings: [],
      classGrade: "Class 2",
    },
  };
  usersMap.set(seedMember.uniqueId, seedMember);

  // 1. Read from LocalStorage members list
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY) || localStorage.getItem(LOCAL_STORAGE_CLOUD_KEY);
    if (stored) {
      const list = JSON.parse(stored);
      if (Array.isArray(list)) {
        list.forEach((u: UserProfile) => {
          if (u && u.uniqueId) {
            usersMap.set(u.uniqueId, { ...u });
          }
        });
      }
    }
  } catch (e) {
    console.warn("LocalStorage read error in getAllUsersForAdmin:", e);
  }

  // 2. Read single logged-in user if exists
  try {
    const single = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (single) {
      const u = JSON.parse(single) as UserProfile;
      if (u && u.uniqueId) {
        usersMap.set(u.uniqueId, { ...u });
      }
    }
  } catch {}

  // 3. Query Firestore 'users' collection
  try {
    if (db) {
      const colRef = collection(db, "users");
      const snap = await getDocs(colRef);
      snap.forEach((d) => {
        const data = d.data() as UserProfile;
        const uid = data.uniqueId || d.id;
        if (uid) {
          const existing = usersMap.get(uid);
          usersMap.set(uid, {
            ...existing,
            ...data,
            uniqueId: uid,
          });
        }
      });
    }
  } catch (fErr) {
    console.warn("Firestore read notice in getAllUsersForAdmin:", fErr);
  }

  return Array.from(usersMap.values());
}

/**
 * Updates a user's UTR payment status in LocalStorage and Firestore
 */
export async function updateUserPaymentStatus(
  uniqueId: string,
  status: "pending" | "verified"
): Promise<void> {
  // 1. Update in LocalStorage
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY) || localStorage.getItem(LOCAL_STORAGE_CLOUD_KEY);
    let list: UserProfile[] = [];
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) list = parsed;
      } catch {}
    }
    const idx = list.findIndex((m) => m.uniqueId === uniqueId);
    if (idx >= 0) {
      list[idx].paymentStatus = status;
      localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(list));
      localStorage.setItem(LOCAL_STORAGE_CLOUD_KEY, JSON.stringify(list));
    }

    // Check single user
    const single = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (single) {
      const u = JSON.parse(single);
      if (u.uniqueId === uniqueId) {
        u.paymentStatus = status;
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(u));
      }
    }
  } catch (err) {
    console.warn("LocalStorage update status error:", err);
  }

  // 2. Update in Firestore
  try {
    if (db && uniqueId) {
      const userRef = doc(db, "users", uniqueId);
      await setDoc(userRef, { paymentStatus: status, updatedAt: new Date().toISOString() }, { merge: true });
    }
  } catch (fErr) {
    console.warn("Firestore update status error:", fErr);
  }
}

