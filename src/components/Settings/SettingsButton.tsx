type SettingsButtonT = {
  text: string;
  action: () => void;
};

const SettingsButton: React.FunctionComponent<SettingsButtonT> = ({
  text,
  action,
}) => {
  return (
    <button
      className={`block py-2 bg-indigo-300 text-indigo-700 text-center text-2xl rounded-md mx-auto w-full font-semibold`}
      onClick={action}
    >
      {text}
    </button>
  );
};

export default SettingsButton;
