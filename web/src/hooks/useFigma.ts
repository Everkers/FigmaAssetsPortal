import * as Figma from "figma-js";
import { useMemo } from "react";
import { useStoreContext } from "../store";
import RegexParser from "regex-parser";
import { ExportParams, useMessengerActions } from "./useMessengerActions";
export const useFigma = () => {
  const { token } = useStoreContext();
  const { exportAssets: _exportAssets } = useMessengerActions();

  const figmaAPIClient = useMemo(
    () =>
      Figma.Client({
        personalAccessToken: token || "",
      }),
    [token]
  );

  function* walkNodes(
    root: any,
    containerName: string | undefined,
    regex: RegExp | undefined,
    page: string
  ) {
    const pageChilds = root.children.find(
      (item: any) => item.name.toLowerCase() === page.trim().toLowerCase()
    );
    if (!pageChilds) return;
    const frontier: any[] = [pageChilds];
    while (frontier.length > 0) {
      const node = frontier.pop()!;
      if ("children" in node) {
        frontier.push(...node.children);
      }
      if (
        containerName &&
        !regex &&
        node.name.toLowerCase() === containerName.trim().toLowerCase() &&
        node.children?.length
      ) {
        yield node.children;
      } else if (!containerName && regex && regex.test(node.name)) {
        yield node;
      }
    }
  }

  const searchForAssets = async ({
    containerName,
    assetsRegex,
    fileId,
    page,
  }: {
    containerName: string | undefined;
    assetsRegex: string | undefined;
    fileId: string;
    page: string;
  }) => {
    const regex = assetsRegex ? RegexParser(assetsRegex) : undefined;
    const file = await figmaAPIClient.file(fileId);
    const nodes = Array.from(
      walkNodes(file.data.document, containerName, regex, page)
    );
    return nodes.flat();
  };

  const exportAssets = async (params: ExportParams) => {
    return await _exportAssets(params);
  };
  return { searchForAssets, exportAssets };
};
