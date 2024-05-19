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
  ConfigurationT,
  ProcessedAttributesGroupT,
  ProcessedAttributesT,
} from "../types/configuration";
import { SVGResponseT, SVGT, SVGUpdateResponseT } from "../types/svg";

async function loadNewSystem(ctx: AppState) {
  open({
    filters: [{ name: "ManyCore XML", extensions: ["xml"] }],
  })
    .then((file) => {
      if (!file) {
        // User cancelled
        return;
      }
      if (typeof file == "string") {
        startProcessing(file, ctx);
      } else {
        toast.error("You can only select one input file.", { duration: 10000 });
      }
    })
    .catch((e) => {
      toast.error(`Could not open selected file: ${e}`, { duration: 10000 });
    });
}

function startProcessing(filePath: string, ctx: AppState) {
  ctx.setProcessingInput(true);
  invoke<BaseResponseT>("parse", { filePath }).then((res) => {
    if (res.status === "ok") {
      getSVG(ctx.setSVG);
      getAttributes(ctx.setAttributes);

      toast.success(res.message);
    } else {
      toast.error(res.message, { duration: 10000 });
    }
    ctx.setProcessingInput(false);
  });
}

async function getBaseConfiguration() {
  return await invoke<BaseConfigurationResponseT>("get_base_configuration");
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
          const timestamp = new Date().toISOString();
          ctx.setSVGStyle({ timestamp, content: res.update.style });
          ctx.setSVGInformation({
            timestamp,
            content: res.update.informationGroup,
          });
          ctx.setSVGTasks({ timestamp, content: res.update.tasksGroup })
          ctx.setSVGViewbox({ timestamp, content: res.update.viewBox });
        }
      }

      toast.success(res.message);
    } else {
      toast.error(res.message, { duration: 10000 });
    }
  });
}

function getSortedUpdatedAttributes(
  prev: ProcessedAttributesGroupT,
  curr: ProcessedAttributesGroupT
) {
  const prevKeys = Object.keys(prev);

  const currKeys = Object.keys(curr);

  const newKeys = new Set([...prevKeys, ...currKeys].sort());

  const ret: ProcessedAttributesGroupT = {};

  for (const key of newKeys) {
    if (curr[key] && prev[key] && prev[key].type === curr[key].type) {
      ret[key] = { ...prev[key], new: false };
    } else if (curr[key]) {
      ret[key] = { ...curr[key] };
      ret[key].new = true;
    }
  }

  return ret;
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

      setAttributes((previousAttributes) => {
        const core = getSortedUpdatedAttributes(
          previousAttributes?.core ?? {},
          res.attributes?.core ?? {}
        );

        const router = getSortedUpdatedAttributes(
          previousAttributes?.router ?? {},
          res.attributes?.router ?? {}
        );

        const channel = getSortedUpdatedAttributes(
          previousAttributes?.channel ?? {},
          res.attributes?.channel ?? {}
        );

        return {
          core,
          router,
          channel,
          observedAlgorithm: res.attributes?.observedAlgorithm,
          algorithms: res.attributes?.algorithms ?? [],
        };
      });
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

export {
  editSystem,
  getSVG,
  loadNewSystem,
  startProcessing,
  updateSVG,
  getBaseConfiguration,
};
