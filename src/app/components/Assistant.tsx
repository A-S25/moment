"use client";

import { ChatBubbleIcon } from "@radix-ui/react-icons";
import useAssistantStore from "../store/assistantStore";

const Assistant: React.FC = () => {
  const { isOpen, currentQuestion, toggleAssistant, getNewQuestion } =
    useAssistantStore();

  return (
    <div>
      {/* أيقونة المساعد */}
      <div
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-800 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-purple-700"
      >
        <ChatBubbleIcon className="w-6 h-6" />
      </div>

      {/* نافذة المساعد */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800"> لا تعرف من أين تبدأ؟ </h4>
          <div className="mt-4 mb-7"> انقر على <span className="text-purple-600">سؤال جديد</span> للحصول على اقتراح يساعدك على التدوين</div>
          <p className="text-gray-600 bg-gray-100 my-6 rounded-full px-4 py-2 ">{currentQuestion}</p>
          <button
            onClick={getNewQuestion}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            سؤال جديد
          </button>
        </div>
      )}
    </div>
  );
};

export default Assistant;
