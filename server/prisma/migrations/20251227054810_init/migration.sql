-- CreateTable
CREATE TABLE "valorant_players" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "riotId" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "mainAgent" TEXT NOT NULL,
    "headshotRate" DOUBLE PRECISION NOT NULL,
    "kdRatio" DOUBLE PRECISION NOT NULL,
    "matchesPlayed" INTEGER NOT NULL,

    CONSTRAINT "valorant_players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "valorant_players_riotId_key" ON "valorant_players"("riotId");
