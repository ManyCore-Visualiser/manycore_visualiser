import TwotoneMemory from "./icons/TwotoneMemory";
import "./icons/TwotoneMemory/style.css";

const Loading: React.FunctionComponent = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-zinc-950/90 flex flex-col text-indigo-400 z-50">
      <div className="m-auto w-1/2">
        <TwotoneMemory
          width={"50%"}
          height={"100%"}
          className="mx-auto memory-loading-animation"
        />
        <p className="font-roboto text-center mt-4 lg:text-lg xl:text-xl 2xl:text-2xl w-full">
          Processing input file
        </p>
      </div>
    </div>
  );
};

export default Loading;
