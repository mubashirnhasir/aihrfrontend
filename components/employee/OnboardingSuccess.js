"use client";
import { useRouter } from "next/navigation";
import ProductLogo from "@/public/icons/productLogo";

export default function OnboardingSuccess({ employeeName = "Waqas" }) {
  const router = useRouter();

  const handleExploreDashboard = () => {
    router.push("/employee/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Animation */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="relative">
                {/* Confetti/Celebration Icon */}
                <div className="text-4xl animate-bounce">🎉</div>
                <div className="absolute -top-2 -right-2 text-yellow-400 animate-pulse">✨</div>
                <div className="absolute -bottom-1 -left-2 text-blue-400 animate-pulse">🎊</div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Synapt HR!
            </h1>
            <h2 className="text-xl font-semibold text-purple-600 mb-4">
              Yayy!! You have onboarded Successfully {employeeName}!
            </h2>
          </div>

          {/* Success Details */}
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-600 text-lg">✅</span>
                <span className="text-green-800 font-medium">Onboarding Complete!</span>
              </div>
              <p className="text-green-700 text-sm mt-2">
                Your profile has been successfully created and all information has been saved.
              </p>
            </div>

            <div className="text-gray-600 text-sm space-y-2">
              <p>🏢 You now have full access to the employee portal</p>
              <p>📊 Your dashboard is ready with personalized features</p>
              <p>🔔 You'll receive important notifications and updates</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleExploreDashboard}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Explore Dashboard</span>
            <span className="text-lg">→</span>
          </button>

          {/* Footer */}          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <ProductLogo />
              <span className="text-sm font-medium">SynaptHR</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Need help? Contact HR at support@synapt.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
