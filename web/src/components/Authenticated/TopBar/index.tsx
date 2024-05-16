import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useStoreContext } from "../../../store";
import { useMessengerActions } from "../../../hooks/useMessengerActions";
import { useForm } from "react-final-form";

export interface TopBarProps {}
export const TopBar: React.FC<TopBarProps> = () => {
  const { dispatch } = useStoreContext();
  const { setToken, preserveConfig } = useMessengerActions();
  const form = useForm();
  const handleClearToken = () => {
    dispatch?.({
      payload: null,
      type: "setToken",
    });
    setToken("");
  };

  const handleClearForm = () => {
    preserveConfig(null);
    form.reset();
    Object.keys(form.getState().values || {}).forEach((field) => {
      form.mutators.setFieldTouched(field, false);
    });
  };
  return (
    <div className="flex items-center ">
      <h1 className="flex-1">Start Importing Assets</h1>
      <div className="flex justify-end items-center space-x-2">
        <VSCodeButton
          onClick={handleClearForm}
          title="Clear Form"
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
            <path d="M11 12H3" />
            <path d="M16 6H3" />
            <path d="M16 18H3" />
            <path d="m19 10-4 4" />
            <path d="m15 10 4 4" />
          </svg>
        </VSCodeButton>
        <VSCodeButton
          onClick={handleClearToken}
          title="Logout"
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
    </div>
  );
};
