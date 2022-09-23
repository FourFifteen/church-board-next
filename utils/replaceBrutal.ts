import pipe from "lodash/fp/pipe"

export const replaceBrutal = (str?: string) =>
  !str ? null : str.replace(/brutal-/g, "")

export const getBrutalBorder = pipe(replaceBrutal, (str?: string) =>
  str ? `${str}.400` : null,
)
