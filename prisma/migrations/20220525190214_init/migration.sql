-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Todo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Todo" ("createdAt", "done", "id", "text", "userId") SELECT "createdAt", "done", "id", "text", "userId" FROM "Todo";
DROP TABLE "Todo";
ALTER TABLE "new_Todo" RENAME TO "Todo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
