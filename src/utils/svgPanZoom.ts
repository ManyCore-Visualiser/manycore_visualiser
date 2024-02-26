// Tracks whether SVG was grabbed or not
var motion = false;

// Initial pan coordinate
const from = { x: 0, y: 0 };

// Current group transform matrix
// | a c tx |
// | b d ty |
// | 0 0 1  |
// As we have a square:
// a = d = scale
// https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
// In practice we use matrix3d: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d
// as it tricks the webview into using the GPU to render the animation. Logic is the same.
const matrix = {
  scale: 1,
  tx: 0,
  ty: 0,
};

// Ratios to avoid drifting while panning/zooming
const ratios = {
  xRatio: 1,
  yRatio: 1,
};

// Scale constants
const zoomIn = 1.1;
const zoomOut = 1 / 1.1;

/**
 * Grabs the main group of the SVG and the SVG itself from event target.
 *
 * @param ev Any event.
 * @returns \{element: the element, g: the group}.
 * @throws A generic error if the target is not an element or it doesn't contain an SVG group.
 */
function getDOMElements(ev: Event) {
  if (ev.target instanceof Element) {
    const g = ev.target.querySelector("g");

    if (!g) {
      throw new Error("Could not grab main SVG group from event target");
    }

    return { element: ev.target as SVGSVGElement, g };
  }

  throw new Error("Event target is not a valid element");
}

/**
 * Applies the current matrix to an SVG group element.
 * @param g The target SVG group element.
 */
function applyMatrix(g: SVGGElement) {
  g.style.transform = `matrix3d(${matrix.scale}, 0, 0, 0, 0, ${matrix.scale}, 0, 0, 0, 0, 1, 0, ${matrix.tx}, ${matrix.ty}, 0, 1)`;
}

/**
 * Calculates the ratio between the SVG viewbox and the group dimensions.
 * These values help to avoid the group drifting when zooming/panning.
 *
 * @param viewBoxWidth SVG viewbox width.
 * @param viewBoxHeight SVG viewbox height.
 * @param width SVG group width.
 * @param height SVG group height.
 * @returns \{xRatio: Scale adjusted x ratio, yRatio: Scale adjusted y ratio}
 */
function updateRatios(element: SVGSVGElement, g: SVGGElement) {
  const { width: viewBoxWidth, height: viewBoxHeight } =
    element.viewBox.baseVal;
  const { width, height } = g.getBoundingClientRect();

  ratios.xRatio = (viewBoxWidth * matrix.scale) / width;
  ratios.yRatio = (viewBoxHeight * matrix.scale) / height;
}

// Zoom handler
function zoom(ev: WheelEvent) {
  ev.preventDefault();
  const { element, g } = getDOMElements(ev);

  let zoomDirection;

  // Scroll down
  if (ev.deltaY > 0) {
    zoomDirection = zoomOut;
  } else {
    // Scroll up
    zoomDirection = zoomIn;
  }

  const { x, y } = g.getBoundingClientRect();

  matrix.scale = matrix.scale * zoomDirection;

  // Mouse coordinates relative to SVG group
  const mx = ev.clientX - x;
  const my = ev.clientY - y;
  // As we zoom into/away from a point we need to translate
  // the the group according to the newly scaled coordinates.
  const dx = mx - mx * zoomDirection;
  const dy = my - my * zoomDirection;

  matrix.tx += dx * ratios.xRatio;
  matrix.ty += dy * ratios.yRatio;

  applyMatrix(g);

  updateRatios(element, g);
}

// Pan handler
function move(ev: MouseEvent) {
  ev.preventDefault();
  if (motion) {
    const { g } = getDOMElements(ev);

    const dx = ev.clientX - from.x;
    const dy = ev.clientY - from.y;
    matrix.tx += dx * ratios.xRatio;
    matrix.ty += dy * ratios.yRatio;

    from.x = ev.clientX;
    from.y = ev.clientY;

    applyMatrix(g);
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
function registerPanZoom(svg: SVGSVGElement) {
  const g = svg.querySelector("g");

  if (!g) {
    throw new Error("The provided SVG does not contain a main group");
  }

  svg.addEventListener("mousedown", enableMotion, { passive: false });
  svg.addEventListener("mouseup", blockMotion, { passive: false });
  svg.addEventListener("mousemove", move, { passive: false });
  svg.addEventListener("wheel", zoom, { passive: false });

  applyMatrix(g);
  updateRatios(svg, g);
}

/**
 * Removes all the registered handlers for zooming and panning.
 * @param svg The target SVG element.
 */
function cleanUpPanZoom(svg: SVGSVGElement) {
  motion = false;

  svg.removeEventListener("mousedown", enableMotion);
  svg.removeEventListener("mouseup", blockMotion);
  svg.removeEventListener("mousemove", move);
  svg.removeEventListener("wheel", zoom);
}

export { registerPanZoom, cleanUpPanZoom };
