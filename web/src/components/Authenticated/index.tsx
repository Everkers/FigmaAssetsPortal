import { VSCodeButton, VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { FormField } from "../FormField";
import { FormSelect } from "../FormSelect";
import { TopBar } from "./TopBar";
import { Field, Form, useForm, useFormState } from "react-final-form";
import { AssetsList } from "../UnAuthenticated/AssetsList";
import { useFigma } from "../../hooks/useFigma";
import { useMemo, useState } from "react";
import { useStoreContext } from "../../store";
import { useMessengerActions } from "../../hooks/useMessengerActions";

const CheckBox = () => {
  const form = useForm();
  const formState = useFormState({
    subscription: { values: true },
  });
  return (
    <div className="col-span-full mt-3 mb-1 flex items-center">
      <p>Filter By Assets Container</p>
      <VSCodeCheckbox
        checked={formState.values.isAssetsContainerExport}
        onChange={(value: any) => {
          const field = value.target.checked ? "assetRegex" : "containerName";
          form.change("isAssetsContainerExport", value.target.checked);
          form.change(field, "");
        }}
        className="ml-auto"
      />
    </div>
  );
};

export const AuthenticatedUser: React.FC<{}> = () => {
  const { searchForAssets, exportAssets } = useFigma();
  const [searchResults, setSearchResults] = useState<any>();
  const [selectedAssets, setSelectedAssets] = useState<Record<string, any>>({});
  const [status, setStatus] = useState<string>();
  const { error, toast } = useMessengerActions();
  const { token } = useStoreContext();

  const onSubmit = async (values: FormValues) => {
    setStatus("searching");
    const data = await searchForAssets({
      assetsRegex: values.assetRegex,
      containerName: values.containerName,
      page: values.pageName,
    });

    setStatus("idle");
    if (!data.length) {
      toast("No assets found!");
    }
    setSearchResults(data);
  };

  const selectsCount = useMemo(
    () => Object.keys(selectedAssets).length,
    [selectedAssets]
  );

  const handleExportAssets = async (values: FormValues) => {
    setStatus("exporting");
    const assets = selectsCount ? Object.values(selectedAssets) : searchResults;
    await exportAssets({
      fileId: "pbN8Lkhra1IEMgFA0nRoQf",
      format: values.exportFormat,
      path: values.exportPath,
      token: token!,
      assets,
      page: values.pageName,
    }).catch((err) => {
      setStatus("idle");
      console.error(err);
      error("Something went wrong while exporing your assets!");
    });
    setStatus("idle");
  };
  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex-1">
        <Form<FormValues>
          initialValues={{
            isAssetsContainerExport: true,
            assetRegex: "",
            containerName: "",
            exportFormat: "SVG",
            exportPath: "src",
            exportScale: "1",
            pageName: "Page 1",
          }}
          onSubmit={onSubmit}
          subscription={{ values: true }}
          render={({ handleSubmit, values }) => {
            return (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 mt-3 gap-x-4 md:grid-cols-2">
                  <Field
                    validate={composeValidators(required)}
                    name="pageName"
                    render={({ input, meta }) => {
                      return (
                        <FormField
                          {...input}
                          label="Page Name"
                          value={input.value}
                          onInput={input.onChange}
                          placeholder="Page 1"
                          error={meta.error && meta.touched ? meta.error : null}
                        />
                      );
                    }}
                  />
                  <Field
                    validate={composeValidators(required)}
                    name="exportPath"
                    render={({ input, meta }) => {
                      return (
                        <FormField
                          {...input}
                          value={input.value}
                          label="Export Path"
                          placeholder="./src/assets/icons"
                          onInput={input.onChange}
                          error={meta.error && meta.touched ? meta.error : null}
                        />
                      );
                    }}
                  />
                  <Field
                    name="exportFormat"
                    render={({ input }) => {
                      return (
                        <FormSelect
                          label="Export Format"
                          value={values.exportFormat}
                          items={[
                            {
                              value: "PNG",
                              label: "PNG",
                            },
                            {
                              value: "SVG",
                              label: "SVG",
                              checked: true,
                            },
                            {
                              value: "JPEG",
                              label: "JPEG",
                            },
                          ]}
                          onChange={(e: any) => {
                            input.onChange(e);
                          }}
                        />
                      );
                    }}
                  />

                  <Field
                    name="exportScale"
                    render={({ input }) => {
                      return (
                        <FormSelect
                          label="Export Scale"
                          value={values.exportScale}
                          items={[
                            {
                              value: "1",
                              label: "1",
                            },
                            {
                              value: "2",
                              label: "2",
                            },
                            {
                              value: "3",
                              label: "3",
                            },
                          ]}
                          onChange={(e: any) => {
                            input.onChange(e);
                          }}
                        />
                      );
                    }}
                  />
                  <CheckBox />
                  <div className="col-span-full">
                    {values.isAssetsContainerExport ? (
                      <Field
                        validate={composeValidators(required)}
                        name="containerName"
                        render={({ input, meta }) => {
                          return (
                            <FormField
                              {...input}
                              label="Container"
                              info="Extract all the assets within the container."
                              placeholder="Home Icons"
                              onInput={input.onChange}
                              error={
                                meta.error && meta.touched ? meta.error : null
                              }
                            />
                          );
                        }}
                      />
                    ) : (
                      <Field
                        name="assetRegex"
                        validate={composeValidators(required)}
                        render={({ input, meta }) => {
                          return (
                            <FormField
                              {...input}
                              label="Search with regex"
                              info="Extract all the assets that matches with your regex."
                              placeholder="/Icon\/\w+/g"
                              onInput={input.onChange}
                              error={
                                meta.error && meta.touched ? meta.error : null
                              }
                            />
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-2 space-y-2">
                  <VSCodeButton
                    disabled={status === "searching"}
                    type="submit"
                    className="w-full"
                  >
                    {status === "searching"
                      ? "Searching..."
                      : "Search for assets"}
                  </VSCodeButton>
                  <VSCodeButton
                    onClick={() => handleExportAssets(values)}
                    className="w-full"
                    disabled={
                      status === "exporting" ||
                      (!searchResults?.length && !selectsCount)
                    }
                    appearance="secondary"
                  >
                    {status === "exporting" ? (
                      "Exporting..."
                    ) : (
                      <>
                        {selectsCount ? `Export ${selectsCount}` : "Export All"}
                      </>
                    )}
                  </VSCodeButton>
                </div>
              </form>
            );
          }}
        ></Form>
      </div>
      <AssetsList
        setSelectedAssets={setSelectedAssets}
        selectedAssets={selectedAssets}
        data={searchResults}
      />
    </div>
  );
};

const required: ValidatorFunction = (value) =>
  value ? undefined : "Field is required";
const composeValidators =
  (...validators: ValidatorFunction[]): ValidatorFunction =>
  (value) => {
    const errors = validators
      .map((validator) => validator(value))
      .filter((error) => error !== undefined);
    return errors.length > 0 ? errors[0] : undefined;
  };

type FormValues = {
  pageName: string;
  exportPath: string;
  exportFormat: string;
  exportScale: string;
  isAssetsContainerExport: boolean;
  assetRegex: string;
  containerName: string;
};
type ValidatorFunction = (value: any) => string | undefined;
