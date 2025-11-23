import { z } from "zod"

export const momentSchema = z.object({
  content: z.string().min(1, "الحقل مطلوب"),
  category: z.enum(["HAPPY", "NORMAL"], {
    errorMap: () => ({ message: "هذا الحقل مطلوب" })
  }),
  groupId: z.string().optional(),
  newGroupName: z.string().optional(),
  name: z.string().optional() 
})
