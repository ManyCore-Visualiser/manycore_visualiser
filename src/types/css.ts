export interface CSSPropertiesWithProperties extends React.CSSProperties {
  [key: `--${string}`]: string | number;
}
