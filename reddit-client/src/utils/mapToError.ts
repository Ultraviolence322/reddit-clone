import { ErrorField } from "../generated/graphql"

export default (error: ErrorField): Record<string, string> => {
  return {
    [error.field]: error.message
  }
}