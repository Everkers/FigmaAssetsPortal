import * as vscode from "vscode";
import { Messenger } from "vscode-messenger";
import { MessengerProvider } from "./messenger";
import { EXTENSION_ID } from "./constants";
import { AssetsSearch } from "./searchCommand";
export function activate(context: vscode.ExtensionContext) {
  const messenger = new Messenger({ debugLog: true });
  const outputChannel = vscode.window.createOutputChannel(EXTENSION_ID);

  const provider = new CustomViewProvider(context, messenger);
  const messengerProvider = new MessengerProvider(
    messenger,
    context,
    outputChannel
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CustomViewProvider.viewType,
      provider
    ),
    vscode.commands.registerCommand("figma.quickpick", () => {
      new AssetsSearch(context).init();
    })
  );
  messengerProvider.invokeListeners();
}

class CustomViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "assets-portal-figma";

  private _view?: vscode.WebviewView;
  private messenger: Messenger;
  constructor(
    private readonly context: vscode.ExtensionContext,
    messenger: Messenger
  ) {
    this.messenger = messenger;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this.context.extensionUri],
    };

    this.messenger.registerWebviewView(webviewView);
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "web", "dist", "index.js")
    );

    // Do the same for the stylesheet.
    const stylesUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "web", "dist", "index.css")
    );

    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <link rel="stylesheet" href="${stylesUri}" />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <script>
          const vscode = acquireVsCodeApi();
          window.vscode = vscode
        </script>
        <script src="${scriptUri}"></script>
      </body>
    </html>`;
  }
}

export function deactivate() {}
