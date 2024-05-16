import {
  VSCodeButton,
  VSCodeCheckbox,
  VSCodeDivider,
} from "@vscode/webview-ui-toolkit/react";
import { FormField } from "../FormField";
import { FormSelect } from "../FormSelect";
import { TopBar } from "./TopBar";
import { Field, Form, useForm, useFormState } from "react-final-form";
import { AssetsList } from "../UnAuthenticated/AssetsList";
import { useFigma } from "../../hooks/useFigma";
import { useEffect, useMemo, useState } from "react";
import { useStoreContext } from "../../store";
import { useMessengerActions } from "../../hooks/useMessengerActions";
import { EXPORT_FORMATS, SCALES } from "../../constants";
import setFieldTouched from "final-form-set-field-touched";

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
  const [searchResults, setSearchResults] = useState<any[] | undefined>();
  const [selectedAssets, setSelectedAssets] = useState<Record<string, any>>({});
  const [status, setStatus] = useState<string>();
  const { error, toast, preserveConfig, getPreservedConfig } =
    useMessengerActions();

  const [intialValues, setInitialValues] = useState<FormValues>({
    isAssetsContainerExport: true,
    assetRegex: "",
    containerName: "",
    exportFormat: "SVG",
    exportPath: "",
    exportScale: "1",
    pageName: "",
    fileId: "",
  });

  const { token } = useStoreContext();

  const onSubmit = async (values: FormValues) => {
    setStatus("searching");
    try {
      const data = await searchForAssets({
        assetsRegex: values.assetRegex,
        containerName: values.containerName,
        page: values.pageName,
        fileId: values.fileId,
      });
      setStatus("idle");
      preserveConfig(values);
      if (!data.length) {
        toast("No assets found!");
      }
      setSelectedAssets({});
      setSearchResults(data);
    } catch (err: any) {
      setStatus("idle");
      if (err.response) {
        return error(err.response.data.err);
      }
      error("Something went wrong!");
    }
  };

  const selectsCount = useMemo(
    () => Object.keys(selectedAssets).length,
    [selectedAssets]
  );

  const handleExportAssets = async (values: FormValues) => {
    setStatus("exporting");
    const assets = selectsCount
      ? Object.values(selectedAssets)
      : searchResults || [];
    try {
      await exportAssets({
        config: {
          fileId: values.fileId,
          format: values.exportFormat,
          path: values.exportPath,
          token: token!,
          page: values.pageName,
          scale: +values.exportScale,
        },
        assets,
      });
      setStatus("idle");
    } catch (err: any) {
      if (err.response) {
        return error(err.response.data.err);
      }
      error("Something went wrong while exporing your assets!");
    }
  };

  useEffect(() => {
    (async () => {
      const config = await getPreservedConfig();
      if (config) setInitialValues(config);
    })();
  }, [getPreservedConfig, setInitialValues]);
  return (
    <div className="h-screen px-5 relative flex flex-col">
      <div className="flex-1">
        <Form<FormValues>
          initialValues={intialValues}
          onSubmit={onSubmit}
          mutators={{
            //@ts-expect-error
            setFieldTouched,
          }}
          subscription={{ values: true }}
          render={({ handleSubmit, values }) => {
            return (
              <>
                <TopBar />
                <Field
                  validate={composeValidators(required)}
                  name="fileId"
                  render={({ input, meta }) => {
                    return (
                      <FormField
                        {...input}
                        label="Figma File Id"
                        containerClassName="my-3"
                        value={input.value}
                        onInput={input.onChange}
                        info="The file ID in Figma URLs is after '/design/'. For example, '/design/<fileId>/'."
                        placeholder="Example: pbN8Lkhra1IEMgFA0nRoQf"
                        error={meta.error && meta.touched ? meta.error : null}
                      />
                    );
                  }}
                />
                <VSCodeDivider role="separator" />

                <form
                  className={
                    !values.fileId
                      ? "opacity-40 select-none pointer-events-none"
                      : ""
                  }
                  onSubmit={handleSubmit}
                >
                  <div className="grid  grid-cols-1 mt-3 gap-x-4 md:grid-cols-2">
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
                            error={
                              meta.error && meta.touched ? meta.error : null
                            }
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
                            containerClassName="mb-2"
                            value={input.value}
                            label="Export Path"
                            placeholder="./src/assets/icons"
                            onInput={input.onChange}
                            error={
                              meta.error && meta.touched ? meta.error : null
                            }
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
                            items={EXPORT_FORMATS}
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
                            items={SCALES}
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
                                label="Container Name"
                                info="Extract all assets within the container, which can include group frames, etc."
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
                                label="Search"
                                info="Search and filter assets using regex."
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
                      onClick={() => {
                        if (values.exportPath) handleExportAssets(values);
                      }}
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
                          {selectsCount
                            ? `Export ${selectsCount}`
                            : "Export All"}
                        </>
                      )}
                    </VSCodeButton>
                  </div>
                </form>
              </>
            );
          }}
        ></Form>
      </div>
      {searchResults?.length && (
        <AssetsList
          setSelectedAssets={setSelectedAssets}
          selectedAssets={selectedAssets}
          data={searchResults}
        />
      )}
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

export type FormValues = {
  pageName: string;
  exportPath: string;
  exportFormat: string;
  exportScale: string;
  isAssetsContainerExport: boolean;
  assetRegex: string;
  containerName: string;
  fileId: string;
};
type ValidatorFunction = (value: any) => string | undefined;
