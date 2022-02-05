import { Session } from "express-session";

export type MyContext = {
  req: Request & {headers: Headers & {cookie: string}} & {session: Session & {forgetPassword: any}};
  res: Response;
}