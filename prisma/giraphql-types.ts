import type { Prisma, Session, User, Library, Table } from "/Users/ibrahim-furkandemirbilek/Desktop/TypeScriptMobile/fu-bib-backend/node_modules/@prisma/client";
export default interface PrismaTypes {
    Session: {
        Shape: Session;
        Include: Prisma.SessionInclude;
        Where: Prisma.SessionWhereUniqueInput;
        Fields: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
        };
    };
    User: {
        Shape: User;
        Include: Prisma.UserInclude;
        Where: Prisma.UserWhereUniqueInput;
        Fields: "Session";
        ListRelations: "Session";
        Relations: {
            Session: {
                Shape: Session[];
                Types: PrismaTypes["Session"];
            };
        };
    };
    Library: {
        Shape: Library;
        Include: Prisma.LibraryInclude;
        Where: Prisma.LibraryWhereUniqueInput;
        Fields: "Table";
        ListRelations: "Table";
        Relations: {
            Table: {
                Shape: Table[];
                Types: PrismaTypes["Table"];
            };
        };
    };
    Table: {
        Shape: Table;
        Include: Prisma.TableInclude;
        Where: Prisma.TableWhereUniqueInput;
        Fields: "library";
        ListRelations: never;
        Relations: {
            library: {
                Shape: Library;
                Types: PrismaTypes["Library"];
            };
        };
    };
}