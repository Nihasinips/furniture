import { User } from "@prisma/client";

export type SafeUser= Omit<User,
"createdAt" | "updateAt" | "emailverified"
> & {
    createdAt:string;
    updateAt:string;
    emailverified:string | null;
};