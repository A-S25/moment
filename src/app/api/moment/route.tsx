import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../prisma/client"
import { momentSchema } from "@/app/validationSchema"
import { getServerSession } from "next-auth"
import authOptions from "@/app/auth/authOptions"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({}, { status: 401 })
  }

  const userId = (session.user as any).id
  if (!userId) {
    return NextResponse.json(
      { error: "User id is missing in session" },
      { status: 500 }
    )
  }

  const body = await request.json()
  const validation = momentSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 })
  }

  const { content, category, groupId, newGroupName, name } = validation.data
  const groupIdRaw = groupId
  const groupName = newGroupName ?? name // 👈 توحيد

  // 1) مجموعة موجودة
  if (groupIdRaw) {
    const parsedGroupId = parseInt(String(groupIdRaw))

    const existingGroup = await prisma.group.findFirst({
      where: {
        id: parsedGroupId,
        userId
      }
    })

    if (!existingGroup) {
      return NextResponse.json(
        { error: "المجموعة غير موجودة أو غير تابعة لك" },
        { status: 400 }
      )
    }

    const newMoment = await prisma.moment.create({
      data: {
        content,
        category,
        userId,
        groupId: parsedGroupId
      }
    })

    return NextResponse.json(newMoment, { status: 201 })
  }

  // 2) اسم مجموعة جديدة
  if (groupName) {
    const newGroup = await prisma.group.create({
      data: {
        name: groupName,
        userId
      }
    })

    const newMoment = await prisma.moment.create({
      data: {
        content,
        category,
        userId,
        groupId: newGroup.id
      }
    })

    return NextResponse.json(newMoment, { status: 201 })
  }

  // 3) بدون مجموعة
  const newMoment = await prisma.moment.create({
    data: {
      content,
      category,
      userId,
      groupId: null
    }
  })

  return NextResponse.json(newMoment, { status: 201 })
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({}, { status: 401 })
  }

  const userId = (session.user as any).id

  const moments = await prisma.moment.findMany({
    where: {
      userId // 🔹 أهم شيء هنا
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return NextResponse.json(moments, { status: 200 })
}
