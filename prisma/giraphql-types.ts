import type { Prisma, User, Library, Table } from "/Users/ibrahim-furkandemirbilek/Desktop/TypeScriptMobile/fu-bib-backend/node_modules/@prisma/client";
export default interface PrismaTypes {
    User: {
        Shape: User;
        Include: never;
        Where: Prisma.UserWhereUniqueInput;
        Fields: never;
        ListRelations: never;
        Relations: {};
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