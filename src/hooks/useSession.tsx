import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth, configured } from "../firebase";
import { errorMessage } from "../utils/errors";
const SessionContext = createContext<string | null>(null);
export function SessionProvider({
  uid,
  children,
}: PropsWithChildren<{ uid: string }>) {
  return (
    <SessionContext.Provider value={uid}>{children}</SessionContext.Provider>
  );
}
export function useUserId(): string {
  const uid = useContext(SessionContext);
  if (!uid) throw new Error("SessionProvider is required.");
  return uid;
}
export function useSession() {
  const [uid, setUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!configured) return;
    let active = true;
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setUid(user.uid);
          setError(null);
        } else
          signInAnonymously(auth).catch((e: unknown) => {
            if (active) setError(errorMessage(e));
          });
      },
      (e) => {
        if (active) setError(errorMessage(e));
      },
    );
    return () => {
      active = false;
      unsubscribe();
    };
  }, [attempt]);
  const retry = () => {
    setError(null);
    setAttempt((value) => value + 1);
  };
  return { uid, error, configured, retry };
}
