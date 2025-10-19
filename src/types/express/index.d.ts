// import { IUser } from "../../modules/user/user.interface";

import { Prisma } from "../../generated/prisma";

const prisma = new Prisma();

declare global {
  namespace Express {
    interface Request {
      user?: typeof prisma.user;
    }
  }
}
