import { WebviewApi } from "vscode-webview";
declare global {
  interface Window {
    vscode: WebviewApi<{}>;
  }
}

export {};
