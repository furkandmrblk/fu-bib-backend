import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/auth";
import { users } from "../src/utils/users";
import { libraries } from "../src/utils/libraries";

const prisma = new PrismaClient();

async function main() {
  // Libraries
  for (const library in libraries) {
    if (Object.prototype.hasOwnProperty.call(libraries, library)) {
      await prisma.library.create({
        data: {
          name: libraries[library].name,
          section: libraries[library].section,
          adress: libraries[library].address,
          secondAdress: libraries[library].secondAddress,
          email: libraries[library].email,
          website: libraries[library].website,
          floor: libraries[library].floor,
        },
      });
    }
  }

  // Tables
  for (let i = 0; i < 25; i++) {
    await prisma.table.create({
      data: {
        identifier: `A-${i}`,
        libraryName: "Bibliotheksbereich 1: Universitätsbibliothek",
        order: i,
        floor: "EG",
        booked: false,
        userId: null,
        time: null,
      },
    });
  }

  for (let i = 0; i < 20; i++) {
    await prisma.table.create({
      data: {
        identifier: `A2-${i}`,
        libraryName: "Bibliotheksbereich 1: Universitätsbibliothek",
        order: i,
        floor: "1.OG",
        booked: false,
        userId: null,
        time: null,
      },
    });
  }

  for (let i = 0; i < 25; i++) {
    await prisma.table.create({
      data: {
        identifier: `B-${i}`,
        libraryName: "Bibliotheksbereich 1: Campusbibliothek",
        order: i,
        floor: "EG",
        booked: false,
        userId: null,
        time: null,
      },
    });
  }

  for (let i = 0; i < 20; i++) {
    await prisma.table.create({
      data: {
        identifier: `B2-${i}`,
        libraryName: "Bibliotheksbereich 1: Campusbibliothek",
        order: i,
        floor: "1.OG",
        booked: false,
        userId: null,
        time: null,
      },
    });
  }

  // Users
  for (const user in users) {
    if (Object.prototype.hasOwnProperty.call(users, user)) {
      await prisma.user.create({
        data: {
          email: users[user].email,
          password: await hashPassword(users[user].password),
          admin: false,
          reservations: users[user].reservations,
          extensions: users[user].extensions,
          strikes: users[user].strikes,
          booked: users[user].booked,
          tableIdentifier: null,
          softban: users[user].softban,
          date: users[user].date,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect;
  });
