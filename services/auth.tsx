// This is a carbon copy of https://github.com/luiz-chagas/react-auth-service/blob/main/src/services/auth.tsx

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
  FC,
} from "react";
import { User } from "../types/entities/User"
import { DocDatabaseService } from "./database";
import { Service } from "./rootService"

// AuthProviders we want to support
export type AuthProviders = "Email" | "Google" | "Facebook";

// This is what external adapters have to implement
// Make sure this interface will fulfill all the needs of the application
export interface AuthService extends Service {
  getUser: () => Promise<User | null>;
  onUserChanged: (callback: UserChangedEventCallback) => UnsubscribeFn;
  signIn: (provider: AuthProviders) => Promise<void>;
  signOut: () => Promise<void>;
  // Other functions to consider: signUp, updateUser, deleteAccount, resetPassword, setUpMFA, etc
}
type UnsubscribeFn = () => void;

export const AuthErrors = {
  ServiceNotSetUp: "Auth Service has not been set up",
  InvalidProdiver: "Provider not supported",
};

type UserChangedEventCallback = (x: User | null) => void;

// This is what our React components/hooks will consume
interface AuthServiceContext {
  currentUser: User | null;
  isLoading: boolean;
  signIn: (provider: AuthProviders) => Promise<void>;
  signOut: () => Promise<void>;
}

// We need to set up a default context
const AuthContext = createContext<AuthServiceContext>({
  signIn: async () => {
    throw Error(AuthErrors.ServiceNotSetUp);
  },
  signOut: async () => {
    throw Error(AuthErrors.ServiceNotSetUp);
  },
  currentUser: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const makeAuthContextProvider = (
  authServiceProvider: AuthService,
) => {
  authServiceProvider.init();

  const Provider: FC<PropsWithChildren<unknown>> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = authServiceProvider.onUserChanged((maybeUser) => {
        setIsLoading(false);
        setUser(maybeUser);
      });
      // Return unsubscribe function to be called in case this context ever gets unmounted
      return unsubscribe;
    }, []);

    useEffect(() => {
      authServiceProvider.getUser().then((maybeUser) => {
        setIsLoading(false);
        setUser(maybeUser);
      });
    }, []);

    const value: AuthServiceContext = useMemo(
      () => ({
        currentUser: user,
        isLoading: isLoading,
        signIn: (provider) => {
          setIsLoading(true);
          return authServiceProvider.signIn(provider);
        },
        signOut: authServiceProvider.signOut,
      }),
      [isLoading, user]
    );

    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  };

  return Provider;
};
