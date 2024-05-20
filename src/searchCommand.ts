import {
  ExtensionContext,
  QuickPick,
  QuickPickItem,
  window,
  Disposable,
} from "vscode";
import { Figma } from "./figma";
import { Services } from "./services";
import { debounce } from "./utils/debounce";

export class AssetsSearch {
  private quickPick: QuickPick<QuickPickItem>;
  private readonly FORMATS = ["PNG", "SVG", "JPG"];
  //@ts-expect-error
  private figma: Figma;
  private services: Services;
  private selectedIcon: any;
  private selectedFormat: string = "";
  private selectedExportPath: string = "";

  private disposables: Disposable[] = [];

  private STEPS_FN = {
    2: this.selectFormat,
    3: this.export,
  };

  constructor(context: ExtensionContext) {
    this.services = new Services(context);

    this.quickPick = window.createQuickPick();
    this.quickPick.placeholder = "Search for an asset";
    this.quickPick.title = "Search for an asset";
    this.quickPick.totalSteps = 3;
    this.quickPick.step = 1;

    // intial search events
    this.disposables = [
      this.quickPick.onDidChangeValue(debounce(this.search.bind(this), 300)),
      this.quickPick.onDidChangeSelection((selection) => {
        this.selectedIcon = {
          name: selection[0].label,
          id: selection[0].description,
        };
        this.handleNextStep();
      }),
    ];
    this.quickPick.show();
  }

  private async export() {
    this.quickPick.title = "Select export path";
    this.quickPick.placeholder = "./assets/icons";
    const config = await this.services.getPreservedConfig();
    this.quickPick.value = config?.exportPath || "";

    this.disposables.push(
      this.quickPick.onDidChangeValue((value) => {
        if (value) {
          this.quickPick.items = [
            {
              label: value,
              description: "Export to the spicified path",
            },
          ];
        }
      }),
      this.quickPick.onDidChangeSelection(async (selection) => {
        this.selectedExportPath = selection[0].label;
        this.quickPick.busy = true;
        await this.figma.exportAssets(
          [this.selectedIcon],
          this.selectedFormat,
          this.selectedExportPath
        );
        this.quickPick.busy = false;
        window.showInformationMessage("Your icon have been exported!");
        this.quickPick.dispose();
        this.quickPick.hide();
      })
    );
  }

  public async init() {
    const config = await this.services.getPreservedConfig();
    const token = await this.services.getToken();
    if (config && token) {
      this.figma = new Figma({
        fileId: config.fileId,
        path: config.exportPath,
        format: config.exportFormat,
        page: config.pageName,
        scale: +config.exportScale,
        token: token,
      });
    }
  }

  private clearDisposables() {
    this.disposables.forEach((d) => d.dispose());
  }

  private async selectFormat() {
    const config = await this.services.getPreservedConfig();

    this.quickPick.title = "Select export format";

    const formats: QuickPickItem[] = this.FORMATS.map((format) => ({
      label: format,
      picked: config?.exportFormat === format,
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
    const token = await this.services.getToken();
    const config = await this.services.getPreservedConfig();

    if (!config || !token) {
      return window.showErrorMessage(
        "Please make sure to add your figma cofiguration"
      );
    }
    if (!value) {
      return;
    }

    this.quickPick.busy = true;
    const results = await this.figma.search(value);
    this.quickPick.busy = false;
    const items = this.convertToQuickPickItems(results);
    this.quickPick.items = items;
  }
  private convertToQuickPickItems(figmaNodes: any[]): QuickPickItem[] {
    return figmaNodes.map((item) => ({
      label: item.name,
      description: item.id,
    }));
  }
}
