import type { GridProps } from "@cloudscape-design/components";

export const formGridDefinition = [
  { colspan: { default: 12, xxs: 12, xs: 9, s: 9, m: 10, l: 10, xl: 10 } },
  { colspan: { default: 12, xxs: 12, xs: 3, s: 3, m: 2, l: 2, xl: 2 } },
] as const satisfies GridProps["gridDefinition"];

export const getFieldGridDefinition = (
  fieldNumber: number,
): GridProps.ElementDefinition[] =>
  Array.from({ length: fieldNumber }, () => ({
    colspan: { default: 6, xxs: 4, xs: 4, s: 3, m: 2, l: 2, xl: 2 },
  }));
