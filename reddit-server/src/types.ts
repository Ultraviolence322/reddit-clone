import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Session } from "express-session";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>,
  req: Request & {headers: Headers & {cookie: string}} & {session: Session & {forgetPassword: any}};
  res: Response;
}