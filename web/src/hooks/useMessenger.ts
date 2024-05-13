import { useEffect, useMemo } from "react";
import { Messenger } from "vscode-messenger-webview";

export const useMessenger = () => {
  const messenger = useMemo(() => new Messenger(window.vscode), []);
  useEffect(() => {
    if (messenger) messenger.start();
  }, [messenger]);

  return messenger;
};
