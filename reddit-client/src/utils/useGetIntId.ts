import { useRouter } from "next/router";

export const useGetIntId = () => {
  const router = useRouter()
  const idToFetch = router.query.id ? +router.query.id : -1

  return idToFetch
};