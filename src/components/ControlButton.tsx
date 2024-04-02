import { ComponentType, SVGProps } from "react";

type ControlButtonT = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  action: () => void;
  disabled: boolean;
};

const ControlButton: React.FunctionComponent<ControlButtonT> = ({
  Icon,
  action,
  disabled,
}) => {
  return (
    <button
      className={`rounded-full shadow-md shadow-black/25 ${
        disabled
          ? "bg-zinc-200 text-zinc-700"
          : "bg-indigo-200 text-indigo-700 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
      } p-4 lg:p-5 xml:p-6 ml-5 lg:ml-6 xl:ml-7 scale-100 translate-y-0 transition-all duration-300 group`}
      onClick={action}
      disabled={disabled}
    >
      {/* TODO: Implement animations */}
      <Icon className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 animate-none group-hover:animate" />
    </button>
  );
};

export default ControlButton;
