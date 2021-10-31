-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "major" TEXT,
    "booked" BOOLEAN NOT NULL,
    "tableIdentifier" TEXT,
    "mostUsedLibrary" TEXT,
    "mostUsedTable" TEXT,
    "reservations" INTEGER,
    "extensions" INTEGER,
    "strikes" INTEGER,
    "softban" BOOLEAN NOT NULL,
    "date" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Library" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adress" TEXT NOT NULL,
    "secondAdress" TEXT,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "floor" TEXT[],

    CONSTRAINT "Library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "libraryName" TEXT NOT NULL,
    "floor" TEXT NOT NULL,
    "booked" BOOLEAN NOT NULL,
    "userId" TEXT,
    "time" DOUBLE PRECISION,
    "extendedTime" BOOLEAN NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Library_section_key" ON "Library"("section");

-- CreateIndex
CREATE UNIQUE INDEX "Library_name_key" ON "Library"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Table_identifier_key" ON "Table"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Table_userId_key" ON "Table"("userId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_libraryName_fkey" FOREIGN KEY ("libraryName") REFERENCES "Library"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
