import { UseFieldArrayReturn } from "react-hook-form";
import { FieldT, FormValues } from "../..";
import {
  ConfigurationVariantsT,
  ProcessedAttributesGroupContentT,
  ProcessedAttributesGroupT,
} from "../../../../types/configuration";

function addBolean(
  name: string,
  entry: ProcessedAttributesGroupContentT
): FieldT {
  return {
    [name]: false,
    attribute: name,
    display: entry.display,
    type: entry.type,
  };
}

function addCoordinates(
  name: string,
  entry: ProcessedAttributesGroupContentT
): FieldT {
  return {
    [name]: false,
    [`${name}-select`]: "T",
    attribute: name,
    display: entry.display,
    type: entry.type,
  };
}

function addNumber(
  name: string,
  entry: ProcessedAttributesGroupContentT
): FieldT {
  const field: FieldT = {
    [name]: false,
    [`${name}-select`]: "Text",
    attribute: name,
    display: entry.display,
    type: entry.type,
  };

  for (let i = 0; i < 4; i++) {
    field[`${name}-${i}c`] = "#000";
    field[`${name}-${i}v`] = 0;
  }

  return field;
}

function addRouting(
  name: string,
  entry: ProcessedAttributesGroupContentT
): FieldT {
  const field: FieldT = {
    [`${name}-algo-select`]: "None",
    [`${name}-load-select`]: "Percentage",
    attribute: name,
    display: entry.display,
    type: entry.type,
  };

  for (let i = 0; i < 4; i++) {
    field[`${name}-load-${i}c`] = "#000";
    field[`${name}-load-${i}v`] = 0;
  }

  return field;
}

function addText(
  name: string,
  entry: ProcessedAttributesGroupContentT
): FieldT {
  return {
    [name]: false,
    attribute: name,
    display: entry.display,
    type: entry.type,
  };
}

export default function addToElementSettings(
  attributes: ProcessedAttributesGroupT,
  array: UseFieldArrayReturn<FormValues, ConfigurationVariantsT>,
  previousData: FieldT[]
) {
  let prevTracker = 0;
  Object.entries(attributes).forEach(([attribute, entry], j) => {
    if (entry.new) {
      let field;
      switch (entry.type) {
        case "boolean":
          field = addBolean(attribute, entry);
          break;
        case "coordinates":
          field = addCoordinates(attribute, entry);
          break;
        case "number":
          field = addNumber(attribute, entry);
          break;
        case "routing":
          field = addRouting(attribute, entry);
          break;
        case "text":
          field = addText(attribute, entry);
          break;
      }
      if (
        previousData.length > prevTracker &&
        previousData[prevTracker].attribute === attribute
      ) {
        // Swap
        array.update(j, field);
        prevTracker += 1;
      } else {
        // Insert
        array.insert(j, field);
      }
    } else {
      prevTracker += 1;
    }
  });

  // Calculate to be removed ones
  const toBeRemoved = [];
  for (let i = 0; i < previousData.length; i++) {
    // Check if any of old fields are not present in new attributes.
    // If so, remember index and queue removal.
    if (!attributes[previousData[i].attribute]) toBeRemoved.push(i);
  }
  array.remove(toBeRemoved);
}
