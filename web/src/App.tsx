import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { AuthenticatedUser } from "./components/Authenticated";
import { UnAuthenticatedUser } from "./components/UnAuthenticated";
import { ContextProvider, useStoreContext } from "./store";

const AppConsumer: React.FC<{}> = () => {
  const { token, status } = useStoreContext();
  return (
    <div>
      {status === "loading" ? (
        <VSCodeProgressRing className="mx-auto my-10" />
      ) : (
        <>{!token ? <UnAuthenticatedUser /> : <AuthenticatedUser />}</>
      )}
    </div>
  );
};

function App() {
  return (
    <ContextProvider>
      <AppConsumer />
    </ContextProvider>
  );
}
export default App;
