"use client"
import Link from "next/link"

export default function Home() {
  return (
    <div
      className="
        relative min-h-[calc(100vh-64px)] overflow-hidden
        bg-[#7f78dd]       /* خلفية الموبايل */
        md:bg-[#f2f7fb]    /* خلفية الديسكتوب */
      "
    >
      {/* الدائرة البنفسجية - ديسكتوب فقط */}
      <div
        className="pointer-events-none fixed -left-[40%] -top-[30%] w-[90rem] h-[55rem]
        rounded-full
        bg-[linear-gradient(45deg,#796fc1_0%,#838beb_100%)]
        hidden md:block"
      />

      {/* الكروت العائمة - ديسكتوب فقط */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {/* كرت 1 */}
        <div className="absolute left-[15%] top-[10%] w-72 rounded-2xl bg-white/80 shadow-lg p-4 border border-white/40 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>تدوين فوري</span>
            <span>الآن</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            يمكنك تدوين أي شعور أو فكرة خلال ثوانٍ معدودة، من دون خطوات معقّدة.
          </p>
        </div>

        {/* كرت 2 */}
        <div className="absolute left-[24%] top-[34%] w-72 rounded-2xl bg-white/80 shadow-lg p-4 border border-white/40 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>تنظيم تلقائي</span>
            <span>من دون مجهود</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            تُرتَّب لحظاتك تلقائيًا حسب النوع والمجموعة، لتبقى الصورة أوضح مع
            الوقت.
          </p>
        </div>

        {/* كرت 3 */}
        <div className="absolute left-[15%] top-[60%] w-72 rounded-2xl bg-white/80 shadow-lg p-4 border border-white/40 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>مجموعات مرنة</span>
            <span>حسب أسلوبك</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            يمكنك جمع اللحظات في مجموعات مخصّصة والعودة إليها بسهولة متى احتجت.
          </p>
        </div>
      </div>

      {/* ============== ديسكتوب ============== */}
      <div className="relative z-10 hidden md:flex md:items-center min-h-[calc(100vh-64px)] px-40">
        <div className="w-full text-right space-y-5">
          {/* بادج */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/80 border border-white/80 text-xs text-slate-500">
            <span>مساحتك الهادئة لكتابة لحظاتك</span>
          </div>

          {/* عنوان */}
          <h1 className="text-[2.8rem] font-bold text-[#2c2e38] leading-snug">
            اللحظات تذهب
            <br />
            <span className="text-[#796fc1]">والكلمات تُبقيها حَيّة</span>
          </h1>

          {/* CTA */}
          <Link
            href="/moments/new"
            className="inline-block px-10 py-3 rounded-xl font-semibold
              bg-[#796fc1] text-white shadow-md
              hover:bg-[#6a5ad9] hover:shadow-lg transition-all"
          >
            ابدأ تدوين لحظاتك الآن
          </Link>

          {/* المميزات – حقيقية وواضحة */}
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg text-[#5a4b7c]">
              كتابة بسيطة وسريعة
            </span>
            <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg text-[#5a4b7c]">
              تنظيم اللحظات في مجموعات
            </span>
            <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg text-[#5a4b7c]">
              الرجوع للحظات القديمة بسهولة
            </span>
          </div>
        </div>
      </div>

      {/* ============== موبايل ============== */}
      <div className="relative z-10 md:hidden">
        {/* هيرو بنفسجي مختصر */}
        <section className="px-6 pt-16 pb-10 text-right space-y-4">
          {/* بادج صغيرة */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 border border-white/40 text-xs text-white/90">
            مساحتك الهادئة لكتابة لحظاتك
          </div>

          {/* عنوان */}
          <h1 className="text-[2.1rem] font-bold text-white leading-snug">
            اللحظات تذهب
            <br />
            <span className="text-[#f7f3ff]">والكلمات تُبقيها حَيّة</span>
          </h1>

          {/* وصف قصير */}
          <p className="text-white/90 text-sm leading-relaxed">
            اكتب شعورك الآن… حتى لو كلمة واحدة فقط.
          </p>

          {/* CTA */}
          <Link
            href="/moments/new"
            className="block w-full text-center mt-2 px-10 py-3 rounded-xl font-semibold
              bg-white text-[#796fc1] shadow-md
              hover:bg-[#f3f0ff] hover:shadow-lg transition-all"
          >
            ابدأ تدوين لحظاتك الآن
          </Link>
        </section>

        {/* موجة + بانه الكروت + المميزات المختصرة */}
        <section className="relative">
          {/* الموجة */}
          <svg
            className="block w-full"
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,64C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>

          {/* القسم الأبيض */}
          <div className="bg-white px-6 pt-4 pb-12 shadow-[0_-6px_20px_rgba(0,0,0,0.12)]">
            {/* مميزات مختصرة تحت الهيرو */}
            <div className="mb-5 flex flex-wrap gap-2 justify-center text-[11px]">
              <span className="px-3 py-1 rounded-full bg-[#f3f0ff] text-[#6f60c8]">
                كتابة بسيطة وسريعة
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f3f0ff] text-[#6f60c8]">
                تنظيم اللحظات في مجموعات
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f3f0ff] text-[#6f60c8]">
                الرجوع للحظات القديمة بسهولة
              </span>
            </div>

            <p className="text-sm text-[#5a4b7c] text-right mb-4">
              خصائص تساعدك في كتابة لحظاتك
            </p>

            <div className="space-y-3">
              {/* كرت 1 — كتابة فورية */}
              <article className="rounded-2xl bg-white p-4 border border-[#e3ddff] shadow-sm">
                <div className="flex items-center justify-between mb-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-[#f3f0ff] text-[#6f60c8]">
                    كتابة فورية
                  </span>
                  <span className="text-slate-400">من دون تعقيد</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  يمكنك تدوين أي شعور أو فكرة خلال ثوانٍ معدودة.
                </p>
              </article>

              {/* كرت 2 — تنظيم تلقائي */}
              <article className="rounded-2xl bg-white p-4 border border-[#e3ddff] shadow-sm">
                <div className="flex items-center justify-between mb-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-[#f3f0ff] text-[#6f60c8]">
                    تنظيم تلقائي
                  </span>
                  <span className="text-slate-400">مرتب دائمًا</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  تُرتَّب لحظاتك حسب النوع والمجموعة لتبقى منظّمة وواضحة.
                </p>
              </article>

              {/* كرت 3 — مجموعات مرنة */}
              <article className="rounded-2xl bg-white p-4 border border-[#e3ddff] shadow-sm">
                <div className="flex items-center justify-between mb-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-[#f3f0ff] text-[#6f60c8]">
                    مجموعات مرنة
                  </span>
                  <span className="text-slate-400">حسب أسلوبك</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  يمكنك جمع اللحظات في مجموعات مخصّصة والعودة إليها متى احتجت.
                </p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
