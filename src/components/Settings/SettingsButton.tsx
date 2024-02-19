type SettingsButtonT = {
  text: string;
  fullSize?: boolean;
  action: () => void;
};

const SettingsButton: React.FunctionComponent<SettingsButtonT> = ({
  text,
  fullSize,
  action,
}) => {
  return (
    <button
      className={`block py-2 bg-indigo-300 text-indigo-700 text-center text-2xl rounded-md ${
        fullSize ? "col-span-2" : "col-span-1"
      } mx-auto w-full`}
      onClick={action}
    >
      {text}
    </button>
  );
};

export default SettingsButton;
