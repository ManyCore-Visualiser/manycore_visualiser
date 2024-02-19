import { invoke } from "@tauri-apps/api";
import { SVGResponseT, SVGT } from "../types/svg";
import { AppState } from "../App";
import { BaseResponseT } from "../types/baseResponse";
import { open } from "@tauri-apps/api/dialog";
import {
  AttributesGroupT,
  AttributesResponseT,
  ProcessedAttributesGroupT,
  ProcessedAttributesT,
} from "../types/configuration";

async function openFilePickerDialog(ctx: AppState) {
  const file = await open({
    filters: [{ name: "", extensions: ["xml"] }],
  });

  if (file) {
    startProcessing(file as string, ctx);
  }
}

function startProcessing(filePath: string, ctx: AppState) {
  ctx.setProcessingInput(true);
  ctx.setTransform(undefined);
  invoke<BaseResponseT>("parse", { filePath }).then((res) => {
    if (res.status === "ok") {
      getSVG(ctx.setSVG);
      getAttributes(ctx.setAttributes);
    } else {
      // TODO: Propagate error
    }
    ctx.setProcessingInput(false);
  });
}

function getSVG(
  setSVG: React.Dispatch<React.SetStateAction<SVGT>>,
  configuration?: any
) {
  invoke<SVGResponseT>("get_svg", { configuration }).then((res) => {
    if (res.status === "ok") {
        console.log(res)
      setSVG(res.svg!);
    } else {
      // TODO: Propagate error
      console.log("Error")
    }
  });
}

function populateAttributesGroup(
  group: AttributesGroupT
): ProcessedAttributesGroupT {
  return Object.entries(group).reduce((acc, [key, type]) => {
    acc[key] = {
      // Skip @ at index 0
      display: key.charAt(1).toLocaleUpperCase() + key.slice(2),
      type,
    };

    return acc;
  }, {} as ProcessedAttributesGroupT);
}

function getAttributes(
  setAttributes: React.Dispatch<
    React.SetStateAction<ProcessedAttributesT | undefined>
  >
) {
  invoke<AttributesResponseT>("get_attributes").then((res) => {
    if (res.status === "ok" && res.attributes) {
      const processedAttributes: ProcessedAttributesT = {
        core: populateAttributesGroup(res.attributes.core),
        router: populateAttributesGroup(res.attributes.router),
      };

      setAttributes(processedAttributes);
    } else {
      // TODO: Propagate error
    }
  });
}

export { openFilePickerDialog, startProcessing, getSVG };
