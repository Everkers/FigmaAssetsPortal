import { Messenger } from "vscode-messenger";
import { NOTIFICATION_TYPES } from "./constants";
import { ExtensionContext, OutputChannel, window } from "vscode";
export class MessengerProvider {
  private messenger: Messenger;
  private context: ExtensionContext;
  private outputChannel: OutputChannel;

  constructor(
    messenger: Messenger,
    context: ExtensionContext,
    outputChannel: OutputChannel
  ) {
    this.messenger = messenger;
    this.context = context;
    this.outputChannel = outputChannel;
  }
  public invokeListeners() {
    this.messenger.onRequest(NOTIFICATION_TYPES["getToken"], async () => {
      const token = await this.context.globalState.get("token");
      return token;
    });

    this.messenger.onRequest(
      NOTIFICATION_TYPES["setToken"],
      async (t: string) => {
        await this.context.globalState.update("token", t);
        return t;
      }
    );
    this.messenger.onNotification(
      NOTIFICATION_TYPES["toast"],
      (message: string) => {
        window.showInformationMessage(message);
      }
    );
    this.messenger.onNotification(
      NOTIFICATION_TYPES["error"],
      (message: string) => {
        window.showErrorMessage(message);
      }
    );
  }
}
