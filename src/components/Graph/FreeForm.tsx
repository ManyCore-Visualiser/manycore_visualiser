import { useCallback, useEffect, useRef, useState } from "react";
import { Point } from "../../types/freeForm";
import { useAppContext } from "../../App";

type FreeFormProps = {
  svgRef: React.MutableRefObject<SVGSVGElement | undefined>;
};

/**
 * Calculates a point given the event and container data.
 * @param clientX Event X.
 * @param clientY Event Y.
 * @param containerData Container bounding box.
 * @returns A point or undefined if the container data is invalid.
 */
function calculatePoint(
  clientX: number,
  clientY: number,
  containerData: DOMRect | undefined
): Point | undefined {
  if (containerData) {
    const { x, y, width, height } = containerData;

    const px = (100 * (clientX - x)) / width;
    const py = (100 * (clientY - y)) / height;

    return { x: px, y: py, clientX, clientY };
  }

  return undefined;
}

function calculateDeltas(
  x: number,
  y: number,
  altKey: boolean,
  points: Point[]
): [number, number, Point] {
  let prevPoint;

  // Allow user to select alignment first first or last point
  if (altKey) {
    prevPoint = points[0];
  } else {
    prevPoint = points[points.length - 1];
  }

  // Calculate closest coordinate
  let dx = Math.abs(prevPoint.clientX - x);
  let dy = Math.abs(prevPoint.clientY - y);

  return [dx, dy, prevPoint];
}

const FreeForm: React.FunctionComponent<FreeFormProps> = ({ svgRef }) => {
  const { freeFormPoints: points, setFreeFormPoints: setPoints } =
    useAppContext();
  const [containerData, setContainerData] = useState<DOMRect>();
  const [drag, setDrag] = useState<Point | undefined>();
  const freeFormRef = useRef<HTMLDivElement>(null);
  const hLine = useRef<HTMLDivElement>(null);
  const vLine = useRef<HTMLDivElement>(null);
  const lineSize = "0.125rem";

  function handleLines(ev: React.MouseEvent<HTMLDivElement>) {
    if (hLine.current && vLine.current && points.length > 0) {
      if (ev.shiftKey) {
        const point = calculatePoint(ev.clientX, ev.clientY, containerData);

        if (point) {
          const [dx, dy, prevPoint] = calculateDeltas(
            ev.clientX,
            ev.clientY,
            ev.altKey,
            points
          );

          if (dx < dy) {
            hLine.current.classList.remove("hidden");
            vLine.current.classList.remove("hidden");

            vLine.current.style.left = `calc(${prevPoint.x}% - ${lineSize})`;
            hLine.current.style.top = `calc(${point.y}% - ${lineSize})`;
          } else {
            vLine.current.classList.remove("hidden");
            hLine.current.classList.remove("hidden");

            hLine.current.style.top = `calc(${prevPoint.y}% - ${lineSize})`;
            vLine.current.style.left = `calc(${point.x}% - ${lineSize})`;
          }
        }
      } else {
        hLine.current.classList.add("hidden");
        vLine.current.classList.add("hidden");
      }
    }
  }

  // This is called any time the free form component is mounted
  const freeFormRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (svgRef.current && node) {
      const mainGroup = svgRef.current.getElementById("mainGroup");
      if (mainGroup) {
        // We are going to copy the main group's bounding box
        const domRect = mainGroup.getBoundingClientRect();

        setContainerData(domRect);

        // We are copying the main group's bounding box onto our free form container
        const { top, left, width, height } = domRect;
        node.style.top = `${top}px`;
        node.style.left = `${left}px`;
        node.style.width = `${width}px`;
        node.style.height = `${height}px`;
      }
    }
  }, []);

  useEffect(() => {
    // Format clip path
    if (freeFormRef.current) {
      if (points.length > 0) {
        const pathEntries = [];

        for (let i = 0; i < points.length; i++) {
          const { x, y } = points[i];

          pathEntries.push(`${x}% ${y}%`);
        }
        freeFormRef.current.style.clipPath = `polygon(${pathEntries.join(
          ", "
        )})`;
      } else {
        freeFormRef.current.style.clipPath = "";
      }
    }
  }, [points]);

  // Adds a point to state
  function addPoint(ev: React.MouseEvent<HTMLDivElement>) {
    ev.preventDefault();

    let x = ev.clientX;
    let y = ev.clientY;

    // Determine if user is asking for a straight line
    if (ev.shiftKey && points.length > 0) {
      const [dx, dy, prevPoint] = calculateDeltas(x, y, ev.altKey, points);
      if (dx < dy) {
        x = prevPoint.clientX;
      } else {
        y = prevPoint.clientY;
      }
    }

    const point = calculatePoint(x, y, containerData);

    if (point) {
      setPoints([...points, point]);
    }
  }

  return (
    <div
      ref={freeFormRefCallback}
      className="absolute hover:cursor-cell"
      onClick={addPoint}
      onMouseMove={handleLines}
    >
      <div
        className="hidden absolute w-full h-1 freeFormLine freeFormLineH z-40"
        ref={hLine}
      />
      <div
        className="hidden absolute w-1 h-full freeFormLine freeFormLineV z-50"
        ref={vLine}
      />
      <div
        className="relative w-full h-full bg-gray-500/40"
        ref={freeFormRef}
      ></div>
      {points.map(({ x, y }, i) => (
        <div
          draggable
          key={`point-${i}`}
          style={{
            top: `calc(${y}% - 1rem)`,
            left: `calc(${x}% - 1rem)`,
          }}
          className="absolute rounded-full w-8 h-8 bg-indigo-500 hover:cursor-move"
          onDrag={(ev) => {
            // On Drag End reports incorrect values so we track the drag throughout and use the last value.
            ev.preventDefault();
            setDrag(calculatePoint(ev.clientX, ev.clientY, containerData));
          }}
          onDragEnd={(ev) => {
            ev.preventDefault();

            // If we stored a valid point, replace the current point
            if (drag) {
              const newPoints = [...points];
              newPoints[i] = drag;

              setPoints(newPoints);
            }

            setDrag(undefined);
          }}
          onContextMenu={(ev) => {
            // Right click to delete
            ev.preventDefault();

            const newPoints = [...points];
            newPoints.splice(i, 1);

            setPoints(newPoints);
          }}
        />
      ))}
    </div>
  );
};

export default FreeForm;
