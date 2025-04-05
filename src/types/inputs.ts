export interface InputsTypes {
  getValue: (value: string) => void;
  title: string;
  extraClass?: string;
  name: string;
  placeHolder?: string;
  value?: string;
  type: string;
  min?: number;
  max?: number;
  error?: string;
  options?: SelectOptions[];
}
export interface SelectOptions {
  label: string;
  value: string;
  disabled?: boolean;
  selected?: boolean;
}
