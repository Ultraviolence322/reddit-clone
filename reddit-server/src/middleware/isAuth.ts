import { MyContext } from "src/types";
import { getUserIdFromCookie } from "../utils/getUserIdFromCookie";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({context}, next) => {
  const originalUserID = getUserIdFromCookie(context.req)

  if(!originalUserID) {
    throw new Error("not authenticated")
  }

  return next()
}