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
    redirect("/api/auth/signin")
  }

  // 👇 هنا نعرّفه بشكل آمن
  const userId = (session.user as any).id

  const momentId = parseInt(params.id)

  const moment = await prisma.moment.findFirst({
    where: {
      id: momentId,
      userId // 👈 بدل session.user.id
    },
    include: {
      group: true
    }
  })

  if (!moment) {
    notFound()
  }

  return <MomentForm moment={moment} />
}

export default EditMoment
