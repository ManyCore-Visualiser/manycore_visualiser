import { ComponentType, SVGProps } from "react";

type ControlButtonT = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  action: () => void;
  disabled: boolean;
  children?: JSX.Element[] | JSX.Element;
};

const ControlButton: React.FunctionComponent<ControlButtonT> = ({
  Icon,
  action,
  disabled,
  children,
}) => {
  return (
    <div className="ml-5 lg:ml-6 xl:ml-7 relative">
      <button
        className={`relative rounded-full shadow-md shadow-black/25 ${
          disabled
            ? "bg-zinc-200 text-zinc-700"
            : "bg-indigo-200 text-indigo-700 hover:scale-110 hover:-translate-y-1"
        } p-4 lg:p-5 xml:p-6 scale-100 translate-y-0 transition-all duration-300 group z-50`}
        onClick={action}
        disabled={disabled}
      >
        <Icon className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 animate-none group-hover:animate" />
      </button>
      {children}
    </div>
  );
};

export default ControlButton;
