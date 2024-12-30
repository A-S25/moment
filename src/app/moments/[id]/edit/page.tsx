import React from "react"
import MomentForm from "../../_components/MomentForm"
import prisma from "../../../../../prisma/client"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string }
}

const EditMoment = async ({ params }: Props) => {
  const moment = await prisma.moment.findUnique({
    where: {
      id: parseInt(params.id)
    },
    include: {
      group: true, // جلب بيانات المجموعة المرتبطة باللحظة
    },
  })

  if (!moment) {
    notFound()
  }

  return <MomentForm moment={moment} />
}

export default EditMoment
