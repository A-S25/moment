import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  // مثال بسيط — انتي عدلي المحتوى
  await prisma.quote.createMany({
    data: [
      {
        content: "السعادة ليست شيئًا جاهزًا، إنها تأتي من أفعالك",
        category: "HAPPY"
      },
      {
        content:
          "الأوقات الهادئة تعلّمك أشياء لا تستطيع اللحظات الصاخبة أن تمنحك إياها",
        category: "NORMAL"
      },
      {
        content: "لا بأس في أن يكون اليوم عاديًا، أحيانًا الهدوء هو ما نحتاجه",
        category: "NORMAL"
      },
      { content: "السعادة ليست وجهة، بل رحلة تعيشها كل يوم", category: "HAPPY" }
    ]
  })

  console.log("Seed data inserted!")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
