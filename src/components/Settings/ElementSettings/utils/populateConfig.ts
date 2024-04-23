import { UseFormSetValue } from "react-hook-form";
import { FieldNameT, FieldT, FormValues } from "../..";
import {
  BooleanArgumentT,
  ColouredTextArgumentT,
  ConfigurationVariantsT,
  CoordinatesArgumentT,
  FillArgumentT,
  ItemConfigurationT,
  RoutingArgumentT,
  TextArgumentT,
} from "../../../../types/configuration";
import { DisplayMapDispatchActionT } from "../../../../types/displayMap";
import { findIndex } from "../../utils/populateFromConfiguration";

function populateText(
  array: FieldT[],
  attribute: string,
  variant: ConfigurationVariantsT,
  setValue: UseFormSetValue<FormValues>,
  entry: TextArgumentT,
  dispatchDisplayMap?: React.Dispatch<DisplayMapDispatchActionT>
) {
  const index = findIndex(array, attribute);
  if (index !== -1) {
    setValue(`${variant}.${index}.${attribute}`, true, {
      shouldDirty: true,
    });

    setValue(
      `${variant}.${index}.${attribute}-colour`,
      entry.colour ?? "#000000",
      {
        shouldDirty: true,
      }
    );

    if (dispatchDisplayMap && entry.type === "Text") {
      dispatchDisplayMap({
        attribute: `${variant}-${attribute}`,
        display: entry.display,
      });
    }
  }
}

function populateBoolean(
  array: FieldT[],
  attribute: string,
  variant: ConfigurationVariantsT,
  setValue: UseFormSetValue<FormValues>,
  entry: BooleanArgumentT
) {
  const index = findIndex(array, attribute);
  if (index !== -1) {
    setValue(`${variant}.${index}.${attribute}`, entry.value, {
      shouldDirty: true,
    });
  }
}

function populateColours(
  entry: ColouredTextArgumentT | FillArgumentT | RoutingArgumentT,
  setValue: UseFormSetValue<FormValues>,
  base: FieldNameT
) {
  for (let i = 0; i < 4; i++) {
    setValue(`${base}-${i}c`, entry.colours[i], {
      shouldDirty: true,
    });
    setValue(`${base}-${i}v`, entry.bounds[i], {
      shouldDirty: true,
    });
  }
}

function populateNumber(
  array: FieldT[],
  attribute: string,
  variant: ConfigurationVariantsT,
  setValue: UseFormSetValue<FormValues>,
  entry: ColouredTextArgumentT | FillArgumentT,
  dispatchDisplayMap?: React.Dispatch<DisplayMapDispatchActionT>
) {
  const index = findIndex(array, attribute);
  if (index !== -1) {
    const base: FieldNameT = `${variant}.${index}.${attribute}`;
    setValue(base, true, { shouldDirty: true });
    setValue(`${base}-select`, entry.type, {
      shouldDirty: true,
    });
    populateColours(entry, setValue, base);

    if (dispatchDisplayMap && entry.type === "ColouredText") {
      dispatchDisplayMap({
        attribute: `${variant}-${attribute}`,
        display: entry.display,
      });
    }
  }
}

function populateCoordinates(
  array: FieldT[],
  attribute: string,
  variant: ConfigurationVariantsT,
  setValue: UseFormSetValue<FormValues>,
  entry: CoordinatesArgumentT
) {
  const index = findIndex(array, attribute);
  if (index !== -1) {
    setValue(`${variant}.${index}.${attribute}`, entry.orientation, {
      shouldDirty: true,
    });
  }
}

function populateRouting(
  array: FieldT[],
  attribute: string,
  variant: ConfigurationVariantsT,
  setValue: UseFormSetValue<FormValues>,
  entry: RoutingArgumentT,
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>
) {
  const index = findIndex(array, attribute);
  if (index !== -1) {
    const base: FieldNameT = `${variant}.${index}.${attribute}`;
    const algoName: FieldNameT = `${base}-algo-select`;
    const loadName: FieldNameT = `${base}-load`;
    const loadSelectName: FieldNameT = `${loadName}-select`;

    setValue(algoName, entry.algorithm, { shouldDirty: true });
    setValue(loadSelectName, entry.loadConfiguration, { shouldDirty: true });
    populateColours(entry, setValue, loadName);

    dispatchDisplayMap({
      attribute: `${variant}-${attribute}`,
      display: entry.display,
    });
  }
}

export default function populateConfig(
  array: FieldT[],
  variant: ConfigurationVariantsT,
  setValue: UseFormSetValue<FormValues>,
  configuration: ItemConfigurationT,
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>
) {
  Object.entries(configuration).forEach(([attribute, entry]) => {
    switch (entry.type) {
      case "Boolean":
        populateBoolean(array, attribute, variant, setValue, entry);
        break;
      case "ColouredText":
        populateNumber(
          array,
          attribute,
          variant,
          setValue,
          entry,
          dispatchDisplayMap
        );
        break;
      case "Coordinates":
        populateCoordinates(array, attribute, variant, setValue, entry);
        break;
      case "Fill":
        populateNumber(array, attribute, variant, setValue, entry);
        break;
      case "Routing":
        populateRouting(
          array,
          attribute,
          variant,
          setValue,
          entry,
          dispatchDisplayMap
        );
        break;
      case "Text":
        populateText(
          array,
          attribute,
          variant,
          setValue,
          entry,
          dispatchDisplayMap
        );
        break;
    }
  });
}
