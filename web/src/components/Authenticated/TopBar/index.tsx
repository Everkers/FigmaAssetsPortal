import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useStoreContext } from "../../../store";
import { useMessengerActions } from "../../../hooks/useMessengerActions";

export interface TopBarProps {}
export const TopBar: React.FC<TopBarProps> = () => {
  const { dispatch } = useStoreContext();
  const { setToken } = useMessengerActions();
  const handleClearToken = () => {
    dispatch?.({
      payload: null,
      type: "setToken",
    });
    setToken("");
  };
  return (
    <div className="flex">
      <h1>Start Importing Assets</h1>
      <VSCodeButton
        onClick={handleClearToken}
        title="Logout"
        className="ml-auto"
        appearance="icon"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      </VSCodeButton>
    </div>
  );
};
