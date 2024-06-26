import { Messenger } from "vscode-messenger";
import { NOTIFICATION_TYPES } from "./constants";
import { ExtensionContext, OutputChannel, window } from "vscode";
import { Figma, FigmaConfig } from "./figma";
import { Services } from "./services";

export class MessengerProvider extends Services {
  private messenger: Messenger;
  public context: ExtensionContext;
  private outputChannel: OutputChannel;

  constructor(
    messenger: Messenger,
    context: ExtensionContext,
    outputChannel: OutputChannel
  ) {
    super(context);

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

    this.messenger.onRequest(
      NOTIFICATION_TYPES["exportAssets"],
      async ({ assets, config }: { assets: any[]; config: FigmaConfig }) => {
        try {
          const figma = new Figma(config);
          await figma.exportAssets(assets!);
          window.showInformationMessage(
            "Your assets have been successfully exported!"
          );
          return true;
        } catch (err) {
          this.outputChannel.appendLine(JSON.stringify(err));
          throw err;
        }
      }
    );
    this.messenger.onNotification(
      NOTIFICATION_TYPES["toast"],
      (message: string) => {
        window.showInformationMessage(message);
      }
    );

    this.messenger.onRequest(
      NOTIFICATION_TYPES["preserveConfig"],
      async (config: any) => {
        await this.context.globalState.update("config", config);
        return config;
      }
    );
    this.messenger.onRequest(
      NOTIFICATION_TYPES["getPreservedConfig"],
      async () => this.getPreservedConfig()
    );

    this.messenger.onNotification(
      NOTIFICATION_TYPES["error"],
      (message: string) => {
        window.showErrorMessage(message);
      }
    );
  }
}
