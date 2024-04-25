type SettingsButtonT = {
  text: string;
  action: () => void;
  large?: boolean;
};

const SettingsButton: React.FunctionComponent<SettingsButtonT> = ({
  text,
  action,
  large,
}) => {
  return (
    <button
      className={`block py-2 bg-indigo-300 text-indigo-700 text-center text-2xl rounded-md mx-auto ${
        large ? "w-1/2" : "w-1/3"
      } font-semibold hover:scale-110 duration-300 transition-transform`}
      onClick={action}
    >
      {text}
    </button>
  );
};

export default SettingsButton;
