import { getServerSession } from "next-auth"
import prisma from "../../../prisma/client"
import AllMoments from "./_components/AllMoments"
import authOptions from "../auth/authOptions"

const Moments = async () => {
  // const moments = await prisma.moment.findMany({
  //   orderBy: {
  //     createdAt: "desc"
  //   }
  // })
  // const session = await getServerSession(authOptions)

  return <AllMoments />
}

export default Moments
