import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Messenger } from "vscode-messenger-webview";
import { useMessenger } from "../hooks/useMessenger";
import { useMessengerActions } from "../hooks/useMessengerActions";

export interface AppContext {
  dispatch: React.Dispatch<ReducerAction> | null;
  token: string | null;
  status: "loading" | "idle";
  messenger: Messenger | null;
}

type ReducerAction = {
  payload: any;
  type: "setToken" | "changeStatus";
};

export const storeReducer = (
  data: AppContext,
  action: ReducerAction
): AppContext => {
  switch (action.type) {
    case "setToken": {
      return {
        ...data,
        token: action.payload,
      };
    }
    case "changeStatus": {
      return {
        ...data,
        status: action.payload,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};

export const Context = createContext<AppContext>({
  status: "idle",
  token: null,
  messenger: null,
  dispatch: null,
});

export const useStoreContext = () => useContext(Context);

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const messenger = useMessenger();
  const _messenger = messenger ? messenger : new Messenger(window.vscode);
  const { getToken } = useMessengerActions(_messenger);

  const [value, dispatch] = useReducer(storeReducer, {
    messenger,
    status: "loading",
    token: null,
    dispatch: null,
  });

  const getPersistedToken = useCallback(async () => {
    dispatch({
      type: "changeStatus",
      payload: "loading",
    });
    const token = await getToken();
    if (token) {
      dispatch({
        type: "setToken",
        payload: token,
      });
    }
    dispatch({
      type: "changeStatus",
      payload: "idle",
    });
  }, [getToken]);

  useEffect(() => {
    getPersistedToken();
  }, [getPersistedToken]);

  return (
    <Context.Provider
      value={{
        ...value,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
