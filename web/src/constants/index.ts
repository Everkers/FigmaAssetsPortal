import type { NotificationType } from "vscode-messenger-common";

type Types =
  | "toast"
  | "setToken"
  | "getToken"
  | "error"
  | "exportAssets"
  | "preserveConfig"
  | "getPreservedConfig";
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
  exportAssets: {
    method: "exportAssets",
  },
  preserveConfig: {
    method: "preserveConfig",
  },
  getPreservedConfig: {
    method: "getPreservedConfig",
  },
};

export const EXTENSION_ID = "assets-portal-figma";

export const EXPORT_FORMATS = [
  {
    value: "PNG",
    label: "PNG",
  },
  {
    value: "SVG",
    label: "SVG",
    checked: true,
  },
  {
    value: "JPG",
    label: "JPG",
  },
];

export const SCALES = [
  {
    value: "1",
    label: "1x",
  },
  {
    value: "2",
    label: "2x",
  },
  {
    value: "3",
    label: "3x",
  },
];
