type Table = {
  identifier: string;
  libraryName: string;
  booked: boolean;
  userId: string | null;
  time: string | null;
};

export const tables: Table[] = [
  {
    identifier: "A001",
    libraryName: "Bibliotheksbereich 1: Universitätsbibliothek",
    booked: false,
    userId: null,
    time: null,
  },
];
