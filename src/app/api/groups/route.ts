import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../prisma/client"
import { getServerSession } from "next-auth"
import authOptions from "@/app/auth/authOptions"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({}, { status: 401 })
  }

  const { name } = await request.json()

  const newGroup = await prisma.group.create({
    data: { name: name.trim() }
  })

  return NextResponse.json(newGroup, { status: 201 })
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({}, { status: 401 })
  }

  // جلب أسماء المجموعات فقط
  const groups = await prisma.group.findMany({
    orderBy: {
      createdAt: "desc" // ترتيب المجموعات حسب تاريخ الإنشاء
    },
    include: {
      _count: {
        select: { moments: true } // حساب عدد اللحظات في كل مجموعة
      }
    }
  })

  return NextResponse.json(groups, { status: 200 })
}
