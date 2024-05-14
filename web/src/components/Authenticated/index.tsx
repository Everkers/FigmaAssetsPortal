import { VSCodeButton, VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { FormField } from "../FormField";
import { FormSelect } from "../FormSelect";
import { TopBar } from "./TopBar";
import { Field, Form, useForm, useFormState } from "react-final-form";

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
          console.log(value.target.checked);
          form.change("isAssetsContainerExport", value.target.checked);
        }}
        className="ml-auto"
      />
    </div>
  );
};
export const AuthenticatedUser: React.FC<{}> = () => {
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

  return (
    <div>
      <TopBar />
      <Form<FormValues>
        initialValues={{
          isAssetsContainerExport: true,
          assetRegex: "",
          containerName: "",
          exportFormat: "SVG",
          exportPath: "",
          exportScale: "1",
          pageName: "",
        }}
        onSubmit={(data) => {
          console.log(data);
        }}
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
                <div className="col-span-full grid grid-cols-1 md:grid-cols-2 md: gap-x-4">
                  <Field
                    validate={composeValidators(required)}
                    name="containerName"
                    render={({ input, meta }) => {
                      return (
                        <FormField
                          {...input}
                          label="Container"
                          placeholder="Home Icons"
                          disabled={!values.isAssetsContainerExport}
                          onInput={input.onChange}
                          error={
                            meta.error &&
                            meta.touched &&
                            values.isAssetsContainerExport
                              ? meta.error
                              : null
                          }
                        />
                      );
                    }}
                  />
                  <Field
                    name="assetRegex"
                    validate={composeValidators(required)}
                    render={({ input, meta }) => {
                      return (
                        <FormField
                          {...input}
                          label="Asset Regex"
                          disabled={values.isAssetsContainerExport}
                          placeholder="/icons-x/"
                          onInput={input.onChange}
                          error={
                            meta.error &&
                            meta.touched &&
                            !values.isAssetsContainerExport
                              ? meta.error
                              : null
                          }
                        />
                      );
                    }}
                  />
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <VSCodeButton onClick={handleSubmit} className="w-full">
                  Search for assets
                </VSCodeButton>
                <VSCodeButton className="w-full" appearance="secondary">
                  Export All
                </VSCodeButton>
              </div>
            </form>
          );
        }}
      ></Form>
    </div>
  );
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
