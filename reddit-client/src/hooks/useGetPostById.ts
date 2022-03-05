import { usePostQuery } from "../generated/graphql"
import { useGetIntId } from "../utils/useGetIntId"

export const useGetPostById = () => {
  const idToFetch = useGetIntId()
  return usePostQuery({
    pause: idToFetch === -1,
    variables: {
      id: idToFetch
    }
  })
}
