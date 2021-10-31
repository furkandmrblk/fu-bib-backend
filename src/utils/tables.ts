type Table = {
  identifier: string;
  libraryName: string;
  booked: boolean;
  floor: string;
  userId: string | null;
  time: string | null;
  extendedTime: boolean;
};

export const tables: Table[] = [
  {
    identifier: "A001",
    libraryName: "Bibliotheksbereich 1: Universitätsbibliothek",
    floor: "EG",
    booked: false,
    userId: null,
    time: null,
    extendedTime: false,
  },
];
