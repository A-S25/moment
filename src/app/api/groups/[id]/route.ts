import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../../prisma/client"
import { getServerSession } from "next-auth"
import authOptions from "@/app/auth/authOptions"


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    const groupId = parseInt(params.id);
    const { name } = await request.json();

    // تحديث المجموعة
    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: { name },
    });

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error: any) {
    // التعامل مع الخطأ في حالة وجود الاسم مسبقًا
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "اسم المجموعة مستخدم بالفعل. يرجى اختيار اسم آخر." },
        { status: 400 }
      );
    }

    // أي خطأ آخر
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث المجموعة." },
      { status: 500 }
    );
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
      const group = await prisma.group.findUnique({
        where: { id: parseInt(params.id) },
        include: {
          moments: true, // اللحظات المرتبطة بالمجموعة
        },
      });
  
      if (!group) {
        return NextResponse.json({ error: "المجموعة غير موجودة" }, { status: 404 });
      }
  
      return NextResponse.json(group, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "حدث خطأ أثناء جلب تفاصيل المجموعة" }, { status: 500 });
    }
  }
  

  export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }
  
    try {
      const groupId = parseInt(params.id);
  
      // التحقق من وجود المجموعة
      const existingGroup = await prisma.group.findUnique({
        where: { id: groupId },
      });
  
      if (!existingGroup) {
        return NextResponse.json({ error: "المجموعة غير موجودة" }, { status: 404 });
      }
  
      // onDelete: Cascade حذف المجموعة (سيتم حذف اللحظات تلقائيًا عبر)
      await prisma.group.delete({
        where: { id: groupId },
      });
  
      return NextResponse.json(
        { message: "تم حذف المجموعة وجميع اللحظات التابعة لها بنجاح." },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "حدث خطأ أثناء حذف المجموعة." },
        { status: 500 }
      );
    }
  }
  
  