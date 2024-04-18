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
 * Applies the current matrix to an SVG element.
 * @param svg The target SVG element.
 */
function applyMatrix(svg: SVGSVGElement) {
  svg.style.transform = `matrix3d(${matrix.scale}, 0, 0, 0, 0, ${matrix.scale}, 0, 0, 0, 0, 1, 0, ${matrix.tx}, ${matrix.ty}, 0, 1)`;
}

// Zoom handler
function zoom(ev: WheelEvent) {
  ev.preventDefault();
  const { svg } = getDOMElements(ev);

  let zoomDirection;

  // Scroll down
  if (ev.deltaY > 0) {
    zoomDirection = zoomOut;
  } else {
    // Scroll up
    zoomDirection = zoomIn;
  }

  const { x, y } = svg.getBoundingClientRect();
  const dx = (ev.clientX - x) * (zoomDirection - 1);
  const dy = (ev.clientY - y) * (zoomDirection - 1);

  matrix.scale *= zoomDirection;
  matrix.tx -= dx;
  matrix.ty -= dy;

  applyMatrix(svg);
}

// Pan handler
function move(ev: MouseEvent) {
  ev.preventDefault();
  if (motion) {
    const { svg } = getDOMElements(ev);

    const dx = ev.clientX - from.x;
    const dy = ev.clientY - from.y;
    matrix.tx += dx;
    matrix.ty += dy;

    from.x = ev.clientX;
    from.y = ev.clientY;

    applyMatrix(svg);
  }
}

// Mouse down handler
function enableMotion(ev: MouseEvent) {
  from.x = ev.clientX;
  from.y = ev.clientY;

  motion = true;
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
 * @param svg The target SVG element.
 * @returns The untouched matrix.
 */
function resetMatrix(svg: SVGSVGElement): MatrixT {
  const matrixBackup = { ...matrix };

  matrix.scale = 1;
  matrix.ty = 0;
  matrix.tx = 0;

  applyMatrix(svg);

  return matrixBackup;
}

/**
 * Restores the provided matrix by replacing the current one.
 * @param oldMatrix The matrix to be restored.
 * @param svg The target SVG element.
 */
function restoreMatrix(oldMatrix: MatrixT, svg: SVGSVGElement) {
  matrix.scale = oldMatrix.scale;
  matrix.tx = oldMatrix.tx;
  matrix.ty = oldMatrix.ty;

  applyMatrix(svg);
}

export { registerPanZoom, cleanUpPanZoom, resetMatrix, restoreMatrix };
