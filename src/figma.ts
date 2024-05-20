import { FigmaExporter } from "figma-export-assets";
import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import * as FigmaWrapper from "figma-js";

import { mkdirp } from "mkdirp";
import { workspace } from "vscode";

export interface FigmaConfig {
  page: string;
  fileId: string;
  format: string;
  path: string;
  token: string;
  scale: number;
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

  private *walkNodes(root: any, value: string) {
    const pageChilds = root.children.find(
      (item: any) => item.name === this.config.page
    );
    if (!pageChilds) {
      return;
    }
    const frontier: any[] = [pageChilds];
    while (frontier.length > 0) {
      const node = frontier.pop()!;
      if ("children" in node) {
        frontier.push(...node.children);
      }
      if (node.name.toLowerCase().indexOf(value.toLocaleLowerCase()) !== -1) {
        yield node;
      }
    }
  }
  public async search(value: string) {
    const client = FigmaWrapper.Client({
      personalAccessToken: this.config.token || "",
    });
    const file = await client.file(this.config.fileId);
    const nodes = Array.from(this.walkNodes(file.data.document, value));
    return nodes.flat();
  }

  private async saveFile(file: any, index: number, p?: string) {
    const imagePath = path.resolve(
      workspace.workspaceFolders![0].uri.fsPath,
      p || this.config.path,
      `${file.name}_${index}.${file.format}`
    );

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
  public async exportAssets(assets: any[], format?: string, path?: string) {
    const exportedAssets = await this.client.exportAssets(
      assets,
      format?.toLowerCase() || this.config.format.toLowerCase(),
      this.config.scale
    );
    exportedAssets.map(async (asset, index) => {
      await this.saveFile(asset, index, path);
    });
    await Promise.all(exportedAssets);
    return true;
  }
}
