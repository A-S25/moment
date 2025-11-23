import AllMoments from "./_components/AllMoments"

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
