import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../prisma/client"
import { momentSchema } from "@/app/validationSchema"
import { getServerSession } from "next-auth"
import authOptions from "@/app/auth/authOptions"

export async function POST(request: NextRequest) {
  // searchParams/headers/bodyيتعامل مع مايتم ارساله من المستخدم في ال NextRequest
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({}, { status: 401 })
  }
  const body = await request.json()
  const validation = momentSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 })
  }

  if (body.groupId) {
    // إضافة اللحظة إلى مجموعة موجودة
    const newMoment = await prisma.moment.create({
      data: {
        content: body.content,
        category: body.category,
        groupId: parseInt(body.groupId)
      }
    });
    return NextResponse.json(newMoment, { status: 201 });
  } 
  
  if (body.name) {
    // إنشاء مجموعة جديدة وإضافة اللحظة إليها
    const newGroup = await prisma.group.create({
      data: {
        name: body.name
      }
    });

    const newMoment = await prisma.moment.create({
      data: {
        content: body.content,
        category: body.category,
        groupId: newGroup.id
      }
    });

    return NextResponse.json(newMoment, { status: 201 });
  }
  

  // moment its table in db in prisma
  // content and category are columns/fields in moment table in db
  // .create its prisma method to create new moment
  // this line to stored it into db
  /*
   prisma.moment.create({})
   (الفائدة: يخلي الكود يتواصل مع قاعدة البيانات ويحفظ البيانات اللي أرسلها المستخدم (مثلا التصنيف
   بدونه: البيانات تضل في الكود فقط، وما تقدر تستخدمها لاحقًا أو تعرضها لأي مستخدم
*/

  // إذا لم يتم تحديد مجموعة موجودة أو اسم مجموعة جديدة، يتم فقط إضافة اللحظة دون مجموعة

  const newMoment = await prisma.moment.create({
    data: {
      content: body.content,
      category: body.category
    }
  })

  // to return it to frontend
  return NextResponse.json(newMoment, { status: 201 })
}



export async function GET(request: NextRequest) {

  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({}, { status: 401 })
  }

  const moments = await prisma.moment.findMany({
    orderBy: {
      createdAt: "desc" 
    }
  })

  return NextResponse.json(moments, { status: 200 })
}

