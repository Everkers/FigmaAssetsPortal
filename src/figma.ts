import { FigmaExporter } from "figma-export-assets";
import fs from "node:fs";
import path from "node:path";
import axios from "axios";

import { mkdirp } from "mkdirp";
import { workspace } from "vscode";

export interface FigmaConfig {
  page: string;
  fileId: string;
  format: string;
  path: string;
  token: string;
  assets?: any[];
}
export class Figma {
  private client: FigmaExporter;
  private config: FigmaConfig;

  constructor(config: FigmaConfig) {
    this.client = new FigmaExporter({
      figmaPersonalToken: config.token,
      fileId: config.fileId,
      page: config.page,
      assetsPath: ".",
      format: config.format.toLowerCase(),
    });
    this.config = config;
  }

  private async saveFile(file: any, index: number) {
    const imagePath = path.resolve(
      workspace.workspaceFolders![0].uri.fsPath,
      this.config.path,
      `${file.name}_${index}.${file.format}`
    );

    console.log(file.name);
    const directory = path.dirname(imagePath);

    // Ensure directory exists
    if (!fs.existsSync(directory)) {
      mkdirp.sync(directory);
    }

    const writer = fs.createWriteStream(imagePath);

    const response = await axios.get(file.image, {
      responseType: "stream",
      headers: {
        "X-Figma-Token": this.config.token,
      },
    });
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }
  public async exportAssets(assets: any[]) {
    const exportedAssets = await this.client.exportAssets(
      assets,
      this.config.format.toLocaleLowerCase()
    );
    exportedAssets.map(async (asset, index) => {
      await this.saveFile(asset, index);
    });
    await Promise.all(exportedAssets);
    return true;
  }
}
