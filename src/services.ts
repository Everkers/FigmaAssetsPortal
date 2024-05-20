import { ExtensionContext } from "vscode";

type Config = {
  assetRegex: string;
  containerName: string;
  exportFormat: string;
  exportPath: string;
  exportScale: string;
  fileId: string;
  isAssetsContainerExport: string;
  pageName: string;
};

export class Services {
  context: ExtensionContext;
  constructor(context: ExtensionContext) {
    this.context = context;
  }

  public async getPreservedConfig() {
    const config = await this.context.globalState.get<Config>("config");
    return config;
  }
  public async getToken() {
    const t = await this.context.globalState.get<string>("token");
    return t;
  }
}
