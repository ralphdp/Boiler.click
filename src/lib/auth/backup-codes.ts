import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Verify a backup code and mark it as used
 * @returns true if valid and unused, false otherwise
 */
export async function verifyBackupCode(userId: string, code: string): Promise<boolean> {
  try {
    const backupCode = await prisma.backupCode.findFirst({
      where: {
        userId,
        code: code.toUpperCase(),
        used: false,
      },
    });

    if (!backupCode) {
      return false;
    }

    // Mark as used
    await prisma.backupCode.update({
      where: { id: backupCode.id },
      data: { used: true },
    });

    return true;
  } catch (error) {
    console.error("Error verifying backup code:", error);
    return false;
  }
}

