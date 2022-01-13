import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>,
  req: Request & {headers: Headers & {cookie: string}};
  res: Response;
}