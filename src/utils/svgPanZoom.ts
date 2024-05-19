// Tracks whether SVG was grabbed or not
var motion = false;

// Initial pan coordinate
const from = { x: 0, y: 0 };

export type MatrixT = {
  scale: number;
  tx: number;
  ty: number;
};

// Current group transform matrix
// | a c tx |
// | b d ty |
// | 0 0 1  |
// As we have a square:
// a = d = scale
// https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
// In practice we use matrix3d: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d
// as it tricks the webview into using the GPU to render the animation. Logic is the same.
const matrix: MatrixT = {
  scale: 1,
  tx: 0,
  ty: 0,
};

// Scale constants
const zoomIn = 1.1;
const zoomOut = 1 / 1.1;

/**
 * Grabs the main group of the SVG and the SVG itself from event target.
 *
 * @param ev Any event.
 * @returns \{svg: the svg element, g: the group}.
 * @throws A generic error if the target is not an element or it doesn't contain an SVG group.
 */
function getDOMElements(ev: Event) {
  if (ev.currentTarget instanceof HTMLDivElement) {
    const svg = ev.currentTarget.querySelector("svg");

    if (!svg) {
      throw new Error("Could not grab SVG from event target");
    }

    const g = svg.getElementById("mainGroup") as SVGGElement | null;

    if (!g) {
      throw new Error("Could not grab SVG main group from SVG");
    }

    return { svg, g };
  }

  throw new Error("Event target is not a valid element");
}

/**
 * Applies the current matrix to an SVG group.
 * @param g The target SVG element.
 */
function applyMatrix(g: SVGGElement) {
  g.style.transform = `matrix3d(${matrix.scale}, 0, 0, 0, 0, ${matrix.scale}, 0, 0, 0, 0, 1, 0, ${matrix.tx}, ${matrix.ty}, 0, 1)`;
}

/**
 * Calculates the ratio between screen pixels and SVG coordinates space.
 * @param svg The SVG element.
 * @param g The main group within the SVG element.
 * @returns The x and y ratio between the two.
 */
function calculateRatios(svg: SVGSVGElement, g: SVGGElement): { ratioX: number, ratioY: number } {
  const { width: svgW, height: svgH } = svg.viewBox.baseVal;
  const { width: onScreenW, height: onScreenH } = g.getBoundingClientRect();
  const ratioX = (svgW * matrix.scale) / onScreenW;
  const ratioY = (svgH * matrix.scale) / onScreenH;

  return { ratioX, ratioY };
}

// Zoom handler
function zoom(ev: WheelEvent) {
  ev.preventDefault();
  const { svg, g } = getDOMElements(ev);

  let zoomDirection;

  // Scroll down
  if (ev.deltaY > 0) {
    zoomDirection = zoomOut;
  } else {
    // Scroll up
    zoomDirection = zoomIn;
  }

  const { x, y } = g.getBoundingClientRect();
  const { ratioX, ratioY } = calculateRatios(svg, g);

  const dx = (ev.clientX - x) * (zoomDirection - 1);
  const dy = (ev.clientY - y) * (zoomDirection - 1);

  matrix.tx -= dx * ratioX;
  matrix.ty -= dy * ratioY;
  matrix.scale *= zoomDirection;

  applyMatrix(g);
}

// Pan handler
function move(ev: MouseEvent) {
  ev.preventDefault();
  if (motion) {
    const { svg, g } = getDOMElements(ev);

    const { ratioX, ratioY } = calculateRatios(svg, g);

    const dx = ev.clientX - from.x;
    const dy = ev.clientY - from.y;
    matrix.tx += dx * ratioX;
    matrix.ty += dy * ratioY;

    from.x = ev.clientX;
    from.y = ev.clientY;

    applyMatrix(g);
  }
}

// Mouse down handler
function enableMotion(ev: MouseEvent) {
  // Only trigger on left button
  if (ev.buttons === 1) {
    from.x = ev.clientX;
    from.y = ev.clientY;

    motion = true;
  }
}

// Mouse up handler
function blockMotion() {
  motion = false;
}

/**
 * Registers all required event handlers for zooming and panning.
 * @param svg The target SVG element.
 */
function registerPanZoom(graphParent: HTMLDivElement) {
  graphParent.addEventListener("mousedown", enableMotion, { passive: false });
  graphParent.addEventListener("mouseup", blockMotion, { passive: false });
  graphParent.addEventListener("mousemove", move, { passive: false });
  graphParent.addEventListener("wheel", zoom, { passive: false });
}

/**
 * Removes all the registered handlers for zooming and panning.
 * @param svg The target SVG element.
 */
function cleanUpPanZoom(graphParent: HTMLDivElement) {
  motion = false;

  graphParent.removeEventListener("mousedown", enableMotion);
  graphParent.removeEventListener("mouseup", blockMotion);
  graphParent.removeEventListener("mousemove", move);
  graphParent.removeEventListener("wheel", zoom);
}

/**
 * Resets the current matrix and returns the matrix prior to modification.
 * @param mainGroup The SVG element's main group.
 * @returns The untouched matrix.
 */
function resetMatrix(mainGroup: SVGGElement): MatrixT {
  const matrixBackup = { ...matrix };

  matrix.scale = 1;
  matrix.ty = 0;
  matrix.tx = 0;

  applyMatrix(mainGroup);

  return matrixBackup;
}

/**
 * Restores the provided matrix by replacing the current one.
 * @param oldMatrix The matrix to be restored.
 * @param mainGroup The SVG element's main group.
 */
function restoreMatrix(oldMatrix: MatrixT, mainGroup: SVGGElement) {
  matrix.scale = oldMatrix.scale;
  matrix.tx = oldMatrix.tx;
  matrix.ty = oldMatrix.ty;


  applyMatrix(mainGroup);
}

export { registerPanZoom, cleanUpPanZoom, resetMatrix, restoreMatrix };
