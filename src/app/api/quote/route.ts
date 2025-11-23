import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { Category } from '@prisma/client'; // enumاستيراد الـ 

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category'); // query paramsجلب تصنيف اللحظة من الـ

  // enumتحقق أن التصنيف هو واحد من القيم المعروفة في الـ 
  if (!category || !Object.values(Category).includes(category as Category)) {
    return NextResponse.json({ error: 'تصنيف غير موجود أو غير صحيح' }, { status: 400 });
  }

  try {
    // البحث عن جميع الاقتباسات المرتبطة بالتصنيف
    const quotes = await prisma.quote.findMany({
      where: { category: category as Category }, // enumتأكد من تمرير التصنيف كـ 
    });

    if (!quotes.length) {
      return NextResponse.json({ message: 'لا توجد اقتباسات لهذا التصنيف' }, { status: 404 });
    }

    // اختيار اقتباس عشوائي
    // سيختلف في كل مرة، وبالتالي الاختيار العشوائي للاقتباس يتغير quotes.length يولد رقمًا جديدًا في كل مرة، فالناتج الذي نضربه في .Math.random()    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
 
    return NextResponse.json({ quote: randomQuote }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الاقتباس' }, { status: 500 });
  }
}