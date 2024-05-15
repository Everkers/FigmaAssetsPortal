import {
  VSCodeBadge,
  VSCodeCheckbox,
  VSCodeButton,
} from "@vscode/webview-ui-toolkit/react";

export interface AssetsListProps {
  data: any;
  setSelectedAssets: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  selectedAssets: Record<string, any> | undefined;
}

export const AssetsList: React.FC<AssetsListProps> = ({
  data,
  selectedAssets,
  setSelectedAssets,
}) => {
  const handleClearSelection = () => {
    setSelectedAssets({});
  };
  return (
    <div className="mt-1 flex flex-col flex-[2] overflow-hidden">
      <div className="flex items-center">
        <h1 className="text-[15px] mb-1">Assets List</h1>
        <VSCodeButton
          onClick={handleClearSelection}
          className="ml-auto"
          disabled={!Object.keys(selectedAssets || {}).length}
          appearance="secondary"
        >
          Clear Selections
        </VSCodeButton>
      </div>
      <div className="b-green-100 flex-1 py-3 overflow-hidden h-full overflow-y-auto">
        <div className="grid cursor-pointer gap-5 grid-cols-2">
          {data?.map((item: any, index: number) => (
            <div
              onClick={() =>
                setSelectedAssets((prev: any) => {
                  if (prev?.[index]) {
                    const copyObj = { ...prev };
                    delete copyObj[index];
                    return copyObj;
                  }
                  return {
                    ...prev,
                    [index]: item,
                  };
                })
              }
              key={item.id}
              className="border-solid border border-border-color py-2 px-3 rounded-md"
            >
              <div className="flex items-center">
                <VSCodeBadge>{item.type}</VSCodeBadge>
                <VSCodeCheckbox
                  checked={!!selectedAssets?.[index]}
                  className="ml-auto"
                />
              </div>
              <h3 className="mt-1">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
