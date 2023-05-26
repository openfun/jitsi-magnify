export type Maybe<T> = T | undefined;

export type Nullable<T> = T | null;

export interface SelectOption {
  value?: string;
  label: string;
  disabled?: boolean;
}
