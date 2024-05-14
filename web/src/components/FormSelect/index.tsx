import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";

export interface FormSelectProps extends VSCodeDropdownProps {
  error?: string;
  label?: string;
  info?: string;
  items: ExtractProps<typeof VSCodeOption>[];
  containerClassName?: string;
}
export const FormSelect: React.FC<FormSelectProps> = ({
  error,
  label,
  info,
  items,
  containerClassName,
  ...props
}) => {
  return (
    <div className={containerClassName || ""}>
      {label && <span className="mb-1 block">{label}</span>}
      <VSCodeDropdown className={`w-full ${props.className}`} {...props}>
        {items?.length &&
          items.map((item) => (
            <VSCodeOption {...item}>{item.label}</VSCodeOption>
          ))}
      </VSCodeDropdown>
      <div className="mt-1">
        {info && !error ? (
          <div className="flex items-center opacity-70 space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <p className="text-xs ">{info}</p>
          </div>
        ) : null}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
};

type VSCodeDropdownProps = ExtractProps<typeof VSCodeDropdown>;

type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends React.ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps;
