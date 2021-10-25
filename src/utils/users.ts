type User = {
  email: string;
  password: string;
  admin: boolean;
  name?: string;
  major?: string;
  booked: boolean;
  reservations?: number;
  extensions?: number;
  strikes?: number;
  softban: boolean;
  date: number;
};

export const users: User[] = [
  {
    email: "ibrahimfud00@zedat.fu-berlin.de",
    password: "testuser00",
    admin: true,
    name: "Ibrahim Furkan Demirbilek",
    major: "Betriebswirtschaftslehre",
    booked: false,
    reservations: 0,
    extensions: 0,
    strikes: 0,
    softban: false,
    date: Date.now(),
  },
  {
    email: "testuser00@zedat.fu-berlin.de",
    password: "testuser00",
    admin: false,
    name: "Felix Yongbok",
    major: "Informatik",
    booked: false,
    reservations: 0,
    extensions: 0,
    strikes: 0,
    softban: false,
    date: Date.now(),
  },
  {
    email: "testuser01@zedat.fu-berlin.de",
    password: "testuser00",
    admin: false,
    name: "Ryunjin",
    major: "Medieninformatik",
    booked: false,
    reservations: 0,
    extensions: 0,
    strikes: 0,
    softban: false,
    date: Date.now(),
  },
];
