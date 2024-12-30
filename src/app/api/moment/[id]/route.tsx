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

  if (!session) {
    return NextResponse.json({}, { status: 401 })
  }

  const body = await request.json()
  const validation = momentSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 })
  }
  const moment = await prisma.moment.findUnique({
    where: {
      id: parseInt(params.id)
    }
  })

  if (!moment) {
    return NextResponse.json({ error: "غير موجوده" }, { status: 404 })
  }

  //  نربط اللحظة بالمجموعة المحددة groupId،إذا تم تقديم

  if (body.groupId) {
    const updatedMoment = await prisma.moment.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        content: body.content,
        category: body.category,
        groupId: parseInt(body.groupId)
      }
    })

    return NextResponse.json(updatedMoment, { status: 200 })
  }

  // إذا تم تقديم اسم مجموعة جديدة، ننشئ المجموعة ونربط اللحظة بها
  if (body.name) {
    const newGroup = await prisma.group.create({
      data: {
        name: body.name
      }
    })

    const updatedMoment = await prisma.moment.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        content: body.content,
        category: body.category,
        groupId: newGroup.id
      }
    })

    return NextResponse.json(updatedMoment, { status: 200 })
  }

  // prisma.moment.update // .moment. here its table in db not variable in line 23
  const updatedMoment = await prisma.moment.update({
    where: {
      id: parseInt(params.id)
    },
    data: {
      content: body.content,
      category: body.category,
      groupId: null
    }
  })
  return NextResponse.json(updatedMoment, { status: 200 })
}




export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({}, { status: 401 })
  }

  const moment = await prisma.moment.findUnique({
    where: {
      id: parseInt(params.id)
    }
  })

  if (!moment) {
    return NextResponse.json({ error: "غير موجوده" }, { status: 404 })
  }

  const deletedMoment = await prisma.moment.delete({
    where: {
      id: parseInt(params.id)
    }
  })
  return NextResponse.json({})
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({}, { status: 401 })
  }
  const moment = await prisma.moment.findUnique({
    where: {
      id: parseInt(params.id)
    }
  })

  if (!moment) {
    return NextResponse.json({ error: "غير موجوده" }, { status: 404 })
  }
  return NextResponse.json(moment, { status: 200 })
}
