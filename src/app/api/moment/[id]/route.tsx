import { momentSchema } from "@/app/validationSchema"
import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../../prisma/client"
import { getServerSession } from "next-auth"
import authOptions from "@/app/auth/authOptions"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({}, { status: 401 })
  }

  const body = await request.json()
  const validation = momentSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 })
  }

  const momentId = parseInt(params.id)
  const userId = session.user.id

  // ✅ تأكد إن اللحظة تابعة لليوزر
  const existingMoment = await prisma.moment.findFirst({
    where: {
      id: momentId,
      userId,
    },
  })

  if (!existingMoment) {
    return NextResponse.json({ error: "غير موجوده أو غير تابعة لك" }, { status: 404 })
  }

  // ✅ لو فيه groupId: نربطها بمجموعة موجودة وتابعة لنفس اليوزر
  if (body.groupId) {
    const groupId = parseInt(body.groupId)

    const existingGroup = await prisma.group.findFirst({
      where: {
        id: groupId,
        userId,
      },
    })

    if (!existingGroup) {
      return NextResponse.json(
        { error: "المجموعة غير موجودة أو غير تابعة لك" },
        { status: 400 }
      )
    }

    const updatedMoment = await prisma.moment.update({
      where: {
        id: momentId,
      },
      data: {
        content: body.content,
        category: body.category,
        groupId: groupId,
      },
    })

    return NextResponse.json(updatedMoment, { status: 200 })
  }

  // ✅ لو فيه name: ننشئ مجموعة جديدة لليوزر ونربط اللحظة فيها
  if (body.name) {
    const userId = session.user.id

    const newGroup = await prisma.group.create({
      data: {
        name: body.name,
        userId,
      },
    })

    const updatedMoment = await prisma.moment.update({
      where: {
        id: momentId,
      },
      data: {
        content: body.content,
        category: body.category,
        groupId: newGroup.id,
      },
    })

    return NextResponse.json(updatedMoment, { status: 200 })
  }

  // ✅ بدون مجموعة: نخلي groupId = null لكن برضه نحدّث اللحظة حق نفس اليوزر
  const updatedMoment = await prisma.moment.update({
    where: {
      id: momentId,
    },
    data: {
      content: body.content,
      category: body.category,
      groupId: null,
    },
  })

  return NextResponse.json(updatedMoment, { status: 200 })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 })
  }

  const momentId = parseInt(params.id)
  const userId = session.user.id

  const existingMoment = await prisma.moment.findFirst({
    where: {
      id: momentId,
      userId,
    },
  })

  if (!existingMoment) {
    return NextResponse.json({ error: "غير موجوده أو غير تابعة لك" }, { status: 404 })
  }

  await prisma.moment.delete({
    where: {
      id: momentId,
    },
  })

  return NextResponse.json({ message: "تم حذف اللحظة بنجاح." }, { status: 200 })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({}, { status: 401 })
  }

  const momentId = parseInt(params.id)
  const userId = session.user.id

  const moment = await prisma.moment.findFirst({
    where: {
      id: momentId,
      userId,
    },
  })

  if (!moment) {
    return NextResponse.json({ error: "غير موجوده أو غير تابعة لك" }, { status: 404 })
  }

  return NextResponse.json(moment, { status: 200 })
}
