import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();
export async function GET(request: Request) {
  try {
    const sides = await prismaClient.side.findFirst({
      where: {
        id: 1,
      },
    });
    return new Response(
      JSON.stringify({
        heads: sides?.heads || 0,
        tails: sides?.tails || 0,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching heads count:", error);
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
