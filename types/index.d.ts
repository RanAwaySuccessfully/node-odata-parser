export type FilterOp = "eq" | "in"

export type FilterPropertyTarget = {
  type: "property"
  name: string
}

export type FilterArrayTarget = {
  type: "array"
  value: string[]
}

export type FilterLiteralTarget = {
  type: "literal"
  value: string
}

export type FilterTarget = FilterPropertyTarget | FilterLiteralTarget | FilterArrayTarget

export type Filter = {
  type: FilterOp
  left: FilterTarget
  right: FilterTarget
}

export type AndFilter = {
  type: "and"
  left: Filter
  right: Filter
}

export function parse(query: string): {
  error?: string
  $filter?: Filter | AndFilter
}
