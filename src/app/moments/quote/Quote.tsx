"use client"

import React, { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

export default function QuotePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuotePageContent />
    </Suspense>
  )
}

function QuotePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quote = searchParams.get("quote")
  const chosenCategory = searchParams.get("category")
  const [showInitialMessage, setShowInitialMessage] = useState(true)
  const [showQuote, setShowQuote] = useState(false)

  const handleShowQuote = () => {
    setShowInitialMessage(false)
    setShowQuote(true)

    // إعادة التوجيه بعد 9 ثوانٍ
    setTimeout(() => {
      router.push("/moments")
    }, 9000)
  }

  return (
    <div
      className={`relative flex flex-col justify-center items-center h-screen text-center overflow-hidden ${
        showQuote
          ? "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"
          : "bg-gray-100"
      }`}
    >
      {/* الخلفية عند عرض الاقتباس */}
      {showQuote && (
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute w-72 h-72 bg-gradient-to-r from-gray-200 to-blue-200 rounded-full blur-2xl opacity-20"
            animate={{ scale: [1, 1.1, 1] }}
            style={{ top: "20%", left: "10%" }}
          />
          <motion.div
            className="absolute w-60 h-60 bg-gradient-to-r from-gray-300 to-purple-200 rounded-full blur-2xl opacity-20"
            animate={{ scale: [1.1, 1.2, 1.1] }}
            style={{ bottom: "15%", right: "15%" }}
          />
        </div>
      )}

      {/* الرسالة الأولية */}
      {showInitialMessage && (
        <motion.div
          className="z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-lg text-gray-600 my-4">
            لحظتك تم حفظها! انقر على "عرض الاقتباس" لترى اقتباسًا مختارًا خصيصًا
            لنوع اللحظة
          </h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleShowQuote}
              className="bg-[#6200E8] text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              عرض الاقتباس
            </button>
            <button
              onClick={() => router.push("/moments")}
              className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </motion.div>
      )}

      {/* الاقتباس */}
      {showQuote && (
        <motion.div
          className="z-10 text-gray-800 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xl font-light text-gray-500"
          >
            لقد اخترت {chosenCategory === "HAPPY" ? "لحظة سعيدة" : "لحظة عادية"}
            ، وهذا الاقتباس يعكسها...
          </motion.h2>

          <motion.h1
            className="text-4xl leading-loose font-bold my-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-gray-600 to-purple-500"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              textShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
            }}
          >
            {quote}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="text-sm text-gray-400"
          >
            سيتم توجيهك للصفحة الرئيسية خلال ثواني...
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
