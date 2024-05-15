import { useCallback } from "react";
import { EXTENSION_ID, NOTIFICATION_TYPES } from "../constants";
import type { MessageParticipant, MessengerAPI } from "vscode-messenger-common";
import { useStoreContext } from "../store";
import { FormValues } from "../components/Authenticated";

const DEFAULT_OPTIONS: MessageParticipant = {
  type: "extension",
  extensionId: EXTENSION_ID,
};

export interface ExportParams {
  config: {
    page: string;
    fileId: string;
    format: string;
    path: string;
    token: string;
    scale: number;
  };
  assets: any[];
}

export const useMessengerActions = (_messenger?: MessengerAPI) => {
  const store = useStoreContext();
  const messenger = _messenger || store.messenger;

  const toast = useCallback(
    (message: string) => {
      messenger?.sendNotification(
        NOTIFICATION_TYPES["toast"],
        DEFAULT_OPTIONS,
        message
      );
    },
    [messenger]
  );

  const error = useCallback(
    (message: string) => {
      messenger?.sendNotification(
        NOTIFICATION_TYPES["error"],
        DEFAULT_OPTIONS,
        message
      );
    },
    [messenger]
  );
  const setToken = useCallback(
    async (token: string) => {
      return await messenger?.sendRequest(
        NOTIFICATION_TYPES["setToken"],
        DEFAULT_OPTIONS,
        token
      );
    },
    [messenger]
  );

  const getToken = useCallback(async () => {
    return await messenger?.sendRequest(
      NOTIFICATION_TYPES["getToken"],
      DEFAULT_OPTIONS
    );
  }, [messenger]);

  const preserveConfig = useCallback(
    async (config: FormValues) => {
      return await messenger?.sendRequest<FormValues, FormValues>(
        NOTIFICATION_TYPES["preserveConfig"],
        DEFAULT_OPTIONS,
        config
      );
    },
    [messenger]
  );

  const getPreservedConfig = useCallback(async () => {
    return await messenger?.sendRequest<FormValues, FormValues>(
      NOTIFICATION_TYPES["getPreservedConfig"],
      DEFAULT_OPTIONS
    );
  }, [messenger]);

  const exportAssets = useCallback(
    async (params: ExportParams) => {
      return await messenger?.sendRequest(
        NOTIFICATION_TYPES["exportAssets"],
        DEFAULT_OPTIONS,
        params
      );
    },
    [messenger]
  );

  return {
    setToken,
    getToken,
    toast,
    error,
    exportAssets,
    getPreservedConfig,
    preserveConfig,
  };
};
