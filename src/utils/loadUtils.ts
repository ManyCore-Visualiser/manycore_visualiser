import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import React from "react";
import toast from "react-hot-toast";
import { AppState } from "../App";
import { BaseResponseT } from "../types/baseResponse";
import {
  AttributesResponseT,
  BaseConfigurationResponseT,
  BaseConfigurationT,
  ConfigurableBaseConfigurationT,
  ConfigurationT,
  ProcessedAttributesT,
} from "../types/configuration";
import { SVGResponseT, SVGT, SVGUpdateResponseT } from "../types/svg";

async function openFilePickerDialog(ctx: AppState) {
  const file = await open({
    filters: [{ name: "ManyCore XML", extensions: ["xml"] }],
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
      getBaseConfiguration(ctx.setConfigurableBaseConfiguration);
      getSVG(ctx.setSVG);
      getAttributes(ctx.setAttributes);

      toast.success(res.message);
    } else {
      toast.error(res.message, { duration: 10000 });
    }
    ctx.setProcessingInput(false);
  });
}

function getBaseConfiguration(
  setConfigurableBaseConfiguration: React.Dispatch<
    React.SetStateAction<ConfigurableBaseConfigurationT | undefined>
  >
) {
  invoke<BaseConfigurationResponseT>("get_base_configuration").then((res) => {
    // This can only succeed
    setConfigurableBaseConfiguration(res.baseConfiguration);
  });
}

function getSVG(setSVG: React.Dispatch<React.SetStateAction<SVGT>>) {
  invoke<SVGResponseT>("get_svg").then((res) => {
    if (res.status === "ok") {
      setSVG(res.svg!);

      toast.success(res.message);
    } else {
      toast.error(res.message, { duration: 10000 });
    }
  });
}

function updateSVG(
  baseConfiguration: BaseConfigurationT,
  configuration: ConfigurationT,
  ctx: AppState
) {
  invoke<SVGUpdateResponseT>("update_svg", {
    configuration,
    baseConfiguration,
  }).then((res) => {
    if (res.status === "ok") {
      if (res.update) {
        // Was this a full update?
        if (res.update.svg) {
          // If it was, replace whole SVG
          ctx.setSVG({
            content: res.update.svg,
            timestamp: new Date().toUTCString(),
          });
        } else {
          // If it wasn't just plug in the new data
          ctx.setSVGStyle(res.update.style);
          ctx.setSVGInformation(res.update.informationGroup);
          ctx.setSVGViewbox(res.update.viewBox);
        }
      }

      toast.success(res.message);
    } else {
      toast.error(res.message, { duration: 10000 });
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
      toast.success(res.message);
    } else {
      toast.error(res.message, { duration: 10000 });
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

        toast.success(res.message);
      } else {
        toast.error(res.message, { duration: 10000 });
      }
    })
    .finally(() => {
      ctx.setEditing(false);
    });
}

export { editSystem, getSVG, openFilePickerDialog, startProcessing, updateSVG };
