import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();
export async function GET(request: Request) {
  try {
    const sides = await prismaClient.streaks.findMany({
      where: {
        OR: [{ winStreak: { gt: 1 } }, { lossStreak: { gt: 1 } }],
      },
      take: 20,
      orderBy: {
        id: "desc",
      },
    });
    return new Response(JSON.stringify(sides), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching streak:", error);
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
