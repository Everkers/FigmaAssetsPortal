import type { NotificationType } from "vscode-messenger-common";

type Types = "toast" | "setToken" | "getToken" | "error";
export const NOTIFICATION_TYPES: Record<Types, NotificationType<string>> = {
  toast: {
    method: "toast",
  },
  error: {
    method: "error",
  },
  setToken: {
    method: "setToken",
  },
  getToken: {
    method: "getToken",
  },
};

export const EXTENSION_ID = "figma.importer.view";
