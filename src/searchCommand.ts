import {
  ExtensionContext,
  QuickPick,
  QuickPickItem,
  window,
  Disposable,
  commands,
} from "vscode";
import { Figma } from "./figma";
import { Services } from "./services";
import { debounce } from "./utils/debounce";
import { Config } from "cosmiconfig/dist/types";
import { EXTENSION_ID } from "./constants";

export class AssetsSearch {
  private quickPick: QuickPick<QuickPickItem>;
  private readonly FORMATS = ["PNG", "SVG", "JPG"];
  //@ts-expect-error
  private figma: Figma;
  private services: Services;
  private selectedIcons: any[] = [];
  private selectedFormat: string = "";
  private selectedExportPath: string = "";
  //@ts-expect-error
  private storage: {
    config: Config;
    token: string;
  } = {};

  private disposables: Disposable[] = [];

  private STEPS_FN = {
    2: this.selectFormat,
    3: this.export,
  };

  constructor(context: ExtensionContext) {
    this.services = new Services(context);

    this.quickPick = window.createQuickPick();
    this.quickPick.placeholder = "Search for assets";
    this.quickPick.title = "Assets Search";
    this.quickPick.totalSteps = 3;
    this.quickPick.step = 1;
    this.quickPick.canSelectMany = true;
    this.quickPick.ignoreFocusOut = true;

    // intial search events
    this.disposables = [
      this.quickPick.onDidChangeValue(debounce(this.search.bind(this), 300)),
      this.quickPick.onDidChangeSelection((selection) => {
        if (selection.length) {
          const items = selection.map((item) => ({
            name: item.label,
            id: item.description,
          }));
          this.selectedIcons = items;
        } else {
          this.selectedIcons = [];
        }
      }),
      this.quickPick.onDidAccept(() => {
        if (this.selectedIcons.length) {
          this.handleNextStep();
          this.quickPick.canSelectMany = false;
        } else {
          window.showInformationMessage(
            "Please select at least one asset before continuing."
          );
        }
      }),
    ];
  }

  private async export() {
    this.quickPick.title = "Export Path";
    this.quickPick.placeholder = "./assets/icons";
    const config = this.storage.config;
    this.quickPick.value = config?.exportPath || "";

    this.disposables.push(
      this.quickPick.onDidChangeValue((value) => {
        if (value) {
          this.quickPick.items = [
            {
              label: value,
              description: "Export to this path",
            },
          ];
        }
      }),
      this.quickPick.onDidChangeSelection((selection) => {
        this.selectedExportPath = selection[0].label;
        if (selection[0].label) {
          this.handleExportAssets();
        }
      })
    );
  }

  private async handleExportAssets() {
    try {
      this.quickPick.busy = true;
      this.quickPick.enabled = false;
      await this.figma.exportAssets(
        this.selectedIcons,
        this.selectedFormat,
        this.selectedExportPath
      );
      this.quickPick.enabled = true;
      this.quickPick.busy = false;
      window.showInformationMessage(
        "Your assets have been successfully exported!"
      );
      this.quickPick.dispose();
      this.quickPick.hide();
    } catch (err) {
      this.quickPick.busy = false;
      window
        .showErrorMessage(
          "There was an issue with exporting your assets. Please try again.",
          "Try Again"
        )
        .then((res) => {
          if (res === "Try Again") {
            this.handleExportAssets();
          }
        });
      throw err;
    }
  }

  public async init() {
    const config = await this.services.getPreservedConfig();
    const token = await this.services.getToken();
    if (!token) {
      return window
        .showInformationMessage(
          "To use this feature, please authenticate with your Figma token.",
          "Add Token"
        )
        .then((res) => {
          if (res === "Add Token") {
            commands.executeCommand(`workbench.view.extension.${EXTENSION_ID}`);
          }
        });
    }
    if (config && config.pageName && config.fileId && token) {
      this.quickPick.show();
      this.storage.config = config;
      this.figma = new Figma({
        fileId: config.fileId,
        path: config.exportPath,
        format: config.exportFormat,
        page: config.pageName,
        scale: +config.exportScale,
        token: token,
      });
    } else {
      this.quickPick.dispose();
      window
        .showInformationMessage(
          "Please configure your Figma file settings first.",
          "Add Configuration"
        )
        .then((res) => {
          if (res === "Add Configuration") {
            commands.executeCommand(`workbench.view.extension.${EXTENSION_ID}`);
          }
        });
    }
  }

  private clearDisposables() {
    this.disposables.forEach((d) => d.dispose());
  }

  private async selectFormat() {
    this.quickPick.title = "Export Format";
    this.quickPick.placeholder = "Search for an export format";

    const formats: QuickPickItem[] = this.FORMATS.map((format) => ({
      label: format,
      picked: this.storage.config?.exportFormat === format,
    }));
    this.quickPick.items = formats;

    this.disposables.push(
      this.quickPick.onDidChangeSelection((selection) => {
        this.selectedFormat = selection[0].label;
        this.handleNextStep();
      })
    );
  }

  private handleNextStep() {
    if (this.quickPick.step! < this.quickPick.totalSteps!) {
      this.quickPick.items = [];
      this.quickPick.value = "";
      this.clearDisposables();
      //@ts-expect-error
      this.STEPS_FN[this.quickPick.step! + 1].bind(this)();
      this.quickPick.step = this.quickPick.step! + 1;
    }
  }

  private async search(value: string) {
    if (!value) {
      return;
    }
    try {
      this.quickPick.busy = true;
      const results = await this.figma.search(value);
      this.quickPick.busy = false;
      const items = this.convertToQuickPickItems(results);
      this.quickPick.items = items;
    } catch (err) {
      window.showInformationMessage(
        "No assets found. Please verify your configuration settings."
      );
      this.quickPick.busy = false;
    }
  }
  private convertToQuickPickItems(figmaNodes: any[]): QuickPickItem[] {
    return figmaNodes.map((item) => ({
      label: item.name,
      description: item.id,
    }));
  }
}
