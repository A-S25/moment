import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../prisma/client"
import { getServerSession } from "next-auth"
import authOptions from "@/app/auth/authOptions"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({}, { status: 401 })
  }

  const userId = (session.user as any).id

  const { name } = await request.json()

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "اسم المجموعة مطلوب." }, { status: 400 })
  }

  try {
    const newGroup = await prisma.group.create({
      data: {
        name: name.trim(),
        userId // 🔹 نربطها باليوزر
      }
    })

    return NextResponse.json(newGroup, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "عندك مجموعة بنفس الاسم." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء المجموعة." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({}, { status: 401 })
  }

  const userId = (session.user as any).id

  const groups = await prisma.group.findMany({
    where: {
      userId // 🔹 نجيب مجموعات هذا اليوزر فقط
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      _count: {
        select: { moments: true }
      }
    }
  })

  return NextResponse.json(groups, { status: 200 })
}
