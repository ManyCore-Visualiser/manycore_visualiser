import { invoke } from "@tauri-apps/api";
import {
  SVGResponseT,
  SVGT,
  SVGUpdateResponseT,
  SVGUpdateT,
} from "../types/svg";
import { AppState } from "../App";
import { BaseResponseT } from "../types/baseResponse";
import { open } from "@tauri-apps/api/dialog";
import {
  AttributesResponseT,
  Configuration,
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

function getSVG(setSVG: React.Dispatch<React.SetStateAction<SVGT>>) {
  invoke<SVGResponseT>("get_svg").then((res) => {
    if (res.status === "ok") {
      setSVG(res.svg!);
    } else {
      // TODO: Propagate error
      console.log(`Error: ${res.message}`);
    }
  });
}

function updateSVG(
  configuration: Configuration,
  setSVGStyle: React.Dispatch<React.SetStateAction<SVGUpdateT>>,
  setSVGInformation: React.Dispatch<React.SetStateAction<SVGUpdateT>>,
  setSVGViewbox: React.Dispatch<React.SetStateAction<SVGUpdateT>>
) {
  invoke<SVGUpdateResponseT>("update_svg", { configuration }).then((res) => {
    if (res.status === "ok" && res.update) {
      setSVGStyle(res.update.style);
      setSVGInformation(res.update.informationGroup);
      setSVGViewbox(res.update.viewBox);
    } else {
      // TODO: Propagate error
      console.log(`Error: ${res.message}`);
    }
  });
}

function getAttributes(
  setAttributes: React.Dispatch<
    React.SetStateAction<ProcessedAttributesT | undefined>
  >
) {
  invoke<AttributesResponseT>("get_attributes").then((res) => {
    if (res.status === "ok" && res.attributes) {
      if (!res.attributes.observedAlgorithm) {
        res.attributes.algorithms = res.attributes.algorithms.filter(
          (algorithm) => algorithm !== "Observed"
        );
      }

      setAttributes(res.attributes);
    } else {
      // TODO: Propagate error
    }
  });
}

function editSystem(ctx: AppState) {
  ctx.setEditing(true);
  invoke<SVGResponseT>("initiate_edit")
    .then((res) => {
      if (res.status === "ok") {
        // Reset all customisations
        ctx.setSVGViewbox(null);
        ctx.setSVGStyle(null);
        ctx.setSVGInformation(null);

        // Apply new SVG
        ctx.setSVG(res.svg!);
        // Get updated attributes
        getAttributes(ctx.setAttributes);
      } else {
        // TODO: Propagate error
      }
    })
    .finally(() => {
      ctx.setEditing(false);
    });
}

export { openFilePickerDialog, startProcessing, getSVG, updateSVG, editSystem };
