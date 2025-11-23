import React from "react"
import MomentForm from "../../_components/MomentForm"
import prisma from "../../../../../prisma/client"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import authOptions from "@/app/auth/authOptions"

interface Props {
  params: { id: string }
}

const EditMoment = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    // يا تسوين redirect لتسجيل الدخول:
    redirect("/api/auth/signin")
    // أو لو تبين تعاملها كأنها مو موجودة:
    // notFound()
  }

  const momentId = parseInt(params.id)

  const moment = await prisma.moment.findFirst({
    where: {
      id: momentId,
      userId: session.user.id // 🔹 اهم نقطة
    },
    include: {
      group: true
    }
  })

  if (!moment) {
    // يا اما مو موجودة، يا اما مو حقته
    notFound()
  }

  return <MomentForm moment={moment} />
}

export default EditMoment
