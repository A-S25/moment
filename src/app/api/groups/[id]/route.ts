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

  try {
    const groupId = parseInt(params.id)
    const { name } = await request.json()

    

    // ✅ تأكد أن المجموعة تابعة لليوزر الحالي
    const existingGroup = await prisma.group.findFirst({
      where: {
        id: groupId,
        userId: session.user.id
      }
    })

    if (!existingGroup) {
      return NextResponse.json(
        { error: "المجموعة غير موجودة أو لا تملك صلاحية لتعديلها." },
        { status: 404 }
      )
    }

    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: { name }
    })

    return NextResponse.json(updatedGroup, { status: 200 })
  } catch (error: any) {
    if (error.code === "P2002") {
      // ✅ مع @@unique([userId, name]) الرسالة هذه تصير منطقية
      return NextResponse.json(
        { error: "عندك مجموعة بنفس الاسم. جرّبي اسم مختلف." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث المجموعة." },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({}, { status: 401 })
  }

  try {
    const groupId = parseInt(params.id)

    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        userId: session.user.id // ✅ مهم
      },
      include: {
        moments: {
          where: {
            userId: session.user.id // زيادة أمان
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

    if (!group) {
      return NextResponse.json(
        { error: "المجموعة غير موجودة أو غير تابعة لك." },
        { status: 404 }
      )
    }

    return NextResponse.json(group, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب تفاصيل المجموعة." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "غير مصرح لك بتنفيذ هذا الإجراء." },
      { status: 401 }
    )
  }

  try {
    const groupId = parseInt(params.id)

    // ✅ تأكد أنها تابعة لليوزر
    const existingGroup = await prisma.group.findFirst({
      where: {
        id: groupId,
        userId: session.user.id
      }
    })

    if (!existingGroup) {
      return NextResponse.json(
        { error: "المجموعة غير موجودة أو غير تابعة لك." },
        { status: 404 }
      )
    }

    await prisma.group.delete({
      where: { id: groupId }
      // onDelete: Cascade في Prisma schema بيهتم بحذف اللحظات
    })

    return NextResponse.json(
      { message: "تم حذف المجموعة وجميع اللحظات التابعة لها." },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف المجموعة." },
      { status: 500 }
    )
  }
}
