-- CreateTable
CREATE TABLE "valorant_player_imports" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT,
    "riotId" TEXT,
    "region" TEXT,
    "rank" TEXT,
    "mainAgent" TEXT,
    "headshotRate" DOUBLE PRECISION,
    "kdRatio" DOUBLE PRECISION,
    "matchesPlayed" INTEGER,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "valorant_player_imports_pkey" PRIMARY KEY ("id")
);
