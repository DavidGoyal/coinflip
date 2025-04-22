import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();
export async function GET(request: Request) {
  try {
    const bets = await prismaClient.bets.findMany({
      take: 20,
      orderBy: {
        id: "desc",
      },
    });
    return new Response(JSON.stringify(bets), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching bets:", error);
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
