import { User } from ".prisma/client";

export const checkBooking = async (user: User) => {
  if (user.booked !== false) {
    throw new Error("Sie haben bereits einen Tisch gebucht.");
  }
  if (user.softban === true) {
    throw new Error(
      "Sie sind insgesamt 3 mal nicht zu Ihrer Reservierung angetreten. Ihr Account wurde vorübergehend gesperrt. Bitte melden Sie sich bei info@fu-bib.de für weitere Informationen."
    );
  }
};
