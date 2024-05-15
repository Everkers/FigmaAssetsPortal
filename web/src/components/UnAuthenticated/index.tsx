import {
  VSCodeTextField,
  VSCodeLink,
  VSCodeButton,
  VSCodeProgressRing,
} from "@vscode/webview-ui-toolkit/react";

import { useMessengerActions } from "../../hooks/useMessengerActions";
import { useState } from "react";
import { useStoreContext } from "../../store";
import { getFigmaUser } from "../../actions";

export const UnAuthenticatedUser: React.FC<{}> = () => {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { setToken: addToken, error, toast } = useMessengerActions();
  const { dispatch } = useStoreContext();

  const handleSetToken = async () => {
    try {
      setLoading(true);
      const user = await getFigmaUser(token);
      const t = (await addToken(token)) as string;
      dispatch!({
        payload: t,
        type: "setToken",
      });
      setLoading(false);
      toast(`Authenticated as ${user.data.handle}. Welcome!`);
    } catch (err) {
      setLoading(false);
      error(
        "Your Figma API token has expired or lacks the necessary permissions for accessing files."
      );
    }
  };

  return (
    <div className="px-5">
      <div className="mb-2">
        <h1>Account Authentication</h1>
        <p className="opacity-70 text-xs -mt-px">
          Get started by using your Figma token. Learn how to generate a token{" "}
          <VSCodeLink href="https://www.figma.com/developers/api#access-tokens">
            here
          </VSCodeLink>
        </p>
      </div>
      <div>
        <span>Figma API Token</span>
        <div className="flex mt-1 transition-all duration-300 ">
          <VSCodeTextField
            onInput={(e: any) => setToken(e.target.value)}
            className="w-full mr-1"
            placeholder="xxxxx"
          />
          {loading ? (
            <VSCodeProgressRing className="w-5 ml-3" />
          ) : (
            <VSCodeButton
              disabled={token.length < 45 || token.length > 45}
              onClick={handleSetToken}
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
                <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" />
                <path d="m2 22 3-3" />
                <path d="M7.5 13.5 10 11" />
                <path d="M10.5 16.5 13 14" />
                <path d="m18 3-4 4h6l-4 4" />
              </svg>
            </VSCodeButton>
          )}
        </div>
        {(token && token.length < 45) || token.length > 45 ? (
          <p className="mt-1 text-xs text-red-500">
            Make sure to insert a valid figma token
          </p>
        ) : null}
      </div>
    </div>
  );
};
