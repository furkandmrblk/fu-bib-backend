import { Table } from ".prisma/client";

type Library = {
  section: string;
  name: string;
  address: string;
  secondAddress?: string;
  email: string;
  secondEmail?: string;
  website?: string;
  floor?: string[];
  table?: Table[];
};

export const libraries: Library[] = [
  {
    section: "1.0",
    name: "Bibliotheksbereich 1: Universitätsbibliothek",
    address: "Garystr. 39 (Haupteingang), 14195 Berlin",
    email: "auskunft@ub.fu-berlin.de",
    floor: ["UG", "EG"],
  },
  {
    section: "1.1",
    name: "Bibliotheksbereich 1: Campusbibliothek",
    address: "Fabeckstr. 23-25, 14195 Berlin",
    email: "auskunft@campusbib.fu-berlin.de",
  },
  {
    section: "2.0",
    name: "Bibliotheksbereich 2: Rechtswissenschaft",
    address: "Van't-Hoff-Str. 8, 14195 Berlin",
    email: "bibliothek@rewiss.fu-berlin.de",
  },
  {
    section: "3.0",
    name: "Bibliotheksbereich 3: Wirtschaftswissenschaft",
    address: "Garystr. 21 Untergeschoss 14195 Berlin",
    email: "bibliothek@wiwiss.fu-berlin.de",
  },
  {
    section: "4.0",
    name: "Bibliotheksbereich 4: Sozialwissenschaften und Osteuropastudien",
    address:
      "Garystr. 55, 14195 Berlin (Leihstelle, Freihand, Offenes Magazin, Einzel- und Gruppenarbeitsplätze, Bibliotheksgarten)",
    secondAddress:
      "Ihnestr. 21, 14195 Berlin (Stiller Lesesaal, Semesterapparate, Zeitschriftenlesesaal, aktuelle Zeitungen, Auflichtscanner, Kopierer/Drucker, Computerarbeitsplätze)",
    email: "bibliothek@polsoz.fu-berlin.de",
  },
  {
    section: "4.1",
    name: "Bibliotheksbereich 4: John-F.-Kennedy-Institut für Nordamerikastudien",
    address: "Lansstr. 7-9, 14195 Berlin",
    email: "library@jfki.fu-berlin.de",
  },
  {
    section: "5.0",
    name: "Bibliotheksbereich 5: Philologische Bibliothek",
    address: "Habelschwerdter Allee 45, 14195 Berlin",
    email: "info@philbib.fu-berlin.de",
    secondEmail: "ausleihe@philbib.fu-berlin.de",
  },
  {
    section: "5.1",
    name: "Bibliotheksbereich 5: Institut für Theaterwissenschaft",
    address: "Grunewaldstr. 35, 12165 Berlin",
    email: "thewibib@zedat.fu-berlin.de",
  },
  {
    section: "6.0",
    name: "Bibliotheksbereich 6: Friedrich-Meinecke-Institut für Geschichtswissenschaften",
    address: "Koserstr. 20, 14195 Berlin",
    email: "ausleihe@geschkult.fu-berlin.de",
  },
  {
    section: "6.1",
    name: "Bibliotheksbereich 6: Kunsthistorisches Institut",
    address: "Koserstr. 20, 14195 Berlin",
    email: "ausleihe@geschkult.fu-berlin.de",
  },
  {
    section: "7.0",
    name: "Bibliotheksbereich 7: Veterinärmedizin",
    address: "Oertzenweg 19b, 14163 Berlin",
    email: "info-vetlibrary@fu-berlin.de",
  },
  {
    section: "8.0",
    name: "Bibliotheksbereich 8: Bibliothek am Botanischen Garten und Botanischen Museum",
    address:
      "Königin-Luise-Str. 6-8, 14195 Berlin (1. OG im Botanischen Museum)",
    email: "library@bgbm.org",
  },
  {
    section: "8.1",
    name: "Bibliotheksbereich 8: Bereichsbibliothek Biologie/Standort BGBM",
    address:
      "Königin-Luise-Str. 6-8, 14195 Berlin (1. OG im Botanischen Museum)",
    email: "library@bgbm.org",
  },
  {
    section: "9.0",
    name: "Bibliotheksbereich 9: Geowissenschaftliche Bibliothek",
    address: "Malteserstr. 74-100 Haus O, 12249 Berlin",
    email: "geolib@zedat.fu-berlin.de",
  },
  {
    section: "9.1",
    name: "Bibliotheksbereich 9: Bibliothek des Instituts für Meteorologie",
    address: "Carl-Heinrich-Becker Weg 6-10, 12165 Berlin",
    email: "bibliothek@met.fu-berlin.de",
  },
];
