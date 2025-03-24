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
        heads: sides?.heads,
        tails: sides?.tails,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
