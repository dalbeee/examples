import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  User,
  getIdTokenResult,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { v4 } from "uuid";

import { auth, firestore } from "./firebase";

const googleProvider = new GoogleAuthProvider();

type UserWithClaims = User & {
  profile?: {
    createdAt: Date;
    updatedAt: Date;
    email: string;
    id: string;
    devices: string[];
    tier: { grade: string; expiredAt: Date | null };
  };
  claims?: Record<string, string>;
};

const useHooks = () => {
  const [user, setUser] = useState<UserWithClaims | null>(null);

  useEffect(() => {
    console.log("[AuthProvider] user :: ", user);
  }, [user]);

  const initDeviceId = () => {
    const existId = window.localStorage.getItem("deviceId");
    if (existId) return;

    const id = v4();
    window.localStorage.setItem("deviceId", id);
  };

  useEffect(() => {
    initDeviceId();
  }, []);

  useLayoutEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      const userDetailDoc = doc(firestore, "users", currentUser.uid);
      const userDetailUnsubscribe = onSnapshot(userDetailDoc, async (doc) => {
        const data = doc.data();
        const profile = data as UserWithClaims["profile"];
        const claims = (await currentUser
          .getIdToken(true)
          .then(() =>
            getIdTokenResult(currentUser)
          )) as UserWithClaims["claims"];
        setUser({
          ...currentUser,
          profile,
          claims,
        });
      });

      return userDetailUnsubscribe;
    });
    return unsubscribe;
  }, []);

  const handleSignIn = () => {
    console.log("[AuthProvider] handleSignIn");
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log("[AuthProvider] handleSignIn :: ", result);
        return;
      })
      .catch((error) => {
        console.error("[AuthProvider] handleSignIn :: ", error);
      });
  };

  const handleSignOut = async () => {
    console.log("[AuthProvider] handleSignOut");
    await signOut(auth);
    setUser(null);
  };

  return { user, handleSignIn, handleSignOut };
};

type Hooks = ReturnType<typeof useHooks>;

const Context = createContext({} as Hooks);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const hooks = useHooks();
  return <Context.Provider value={hooks}>{children}</Context.Provider>;
};

const useAuth = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth };
export default AuthProvider;
