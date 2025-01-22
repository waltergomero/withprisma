import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient()

//import prisma from "@/lib/prisma"

const userData: Prisma.UserCreateInput[] = [
  {
    first_name: "Walter",
    last_name: "Gomero",
    email: "walter.gomero@gmail.com",
    password:"$2a$10$Qzn/y07Pqvx5v4YWtLsKtumnsvprvZ71cMUyz3z0kmmU0a.stunDC",
    isadmin: true,
    isactive: true,
    provider: "credentials",
    type: "credentials",
    created_by: "walter.gomero@gmail.com",
    updated_by: "walter.gomero@gmail.com"
  },

]

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u })
  }
}

main()