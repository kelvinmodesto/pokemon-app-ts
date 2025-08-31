import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  ArrowLeft,
  Search,
  MapPin,
  Compass,
  Sparkles,
} from "lucide-react";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />

        {/* Floating elements */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            {i % 4 === 0 ? (
              <Sparkles className="w-4 h-4 text-blue-400" />
            ) : i % 4 === 1 ? (
              <MapPin className="w-3 h-3 text-purple-400" />
            ) : i % 4 === 2 ? (
              <Search className="w-3 h-3 text-pink-400" />
            ) : (
              <Compass className="w-4 h-4 text-indigo-400" />
            )}
          </div>
        ))}

        {/* Large decorative Pokeball */}
        <div className="absolute top-1/4 right-1/4 opacity-5 animate-spin">
          <div className="w-64 h-64 rounded-full border-8 border-gray-800 bg-gradient-to-b from-red-500 to-red-600 relative">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-800" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-800 rounded-full border-4 border-white" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <Card className="glass-card border-0 overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[20px] p-[2px]">
            <div className="w-full h-full bg-white/95 rounded-[18px]" />
          </div>

          <CardContent className="relative z-10 text-center p-12 space-y-8">
            {/* 404 with Pokemon styling */}
            <div className="space-y-4">
              <div className="relative inline-block">
                <h1 className="text-9xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                  404
                </h1>

                {/* Animated rings around 404 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-32 border-2 border-blue-300 rounded-full animate-ping opacity-20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-80 h-40 border-2 border-purple-300 rounded-full animate-ping opacity-20"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-gray-800">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Oops! You're Lost!
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-md mx-auto">
                  Looks like this Pokemon escaped! The page you're looking for
                  doesn't exist in our Pokedex.
                </p>
              </div>
            </div>

            {/* Illustrated Pokemon scene */}
            <div className="py-8">
              <div className="relative mx-auto w-48 h-48">
                {/* Tall grass illustration */}
                <div className="absolute bottom-0 left-0 right-0">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bottom-0 bg-gradient-to-t from-green-600 to-green-400 rounded-t-full animate-pulse"
                      style={{
                        left: `${i * 8 + Math.random() * 4}%`,
                        width: "8px",
                        height: `${20 + Math.random() * 20}px`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Search icon with animation */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl floating-animation">
                      <Search className="w-10 h-10 text-white" />
                    </div>

                    {/* Search radar rings */}
                    <div className="absolute inset-0 animate-ping">
                      <div className="w-20 h-20 border-4 border-yellow-400 rounded-full opacity-75" />
                    </div>
                    <div
                      className="absolute inset-0 animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <div className="w-20 h-20 border-2 border-orange-400 rounded-full opacity-50" />
                    </div>
                  </div>
                </div>

                {/* Question marks floating around */}
                {["❓", "❓", "❓"].map((emoji, i) => (
                  <div
                    key={i}
                    className="absolute text-2xl animate-bounce opacity-60"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: `${15 + i * 30}%`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Helpful suggestions */}
            <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                <Compass className="w-5 h-5 text-blue-500" />
                Where to go from here?
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Home className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Go Home</p>
                    <p className="text-gray-600 text-xs">Return to your Pokemon collection</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Search</p>
                    <p className="text-gray-600 text-xs">Look for Pokemon by name or ID</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Add Pokemon</p>
                    <p className="text-gray-600 text-xs">Catch new Pokemon for your collection</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ArrowLeft className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Go Back</p>
                    <p className="text-gray-600 text-xs">Return to the previous page</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleGoHome}
                className="button-hover-effect flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Home className="w-5 h-5 mr-2" />
                Return Home
              </Button>

              <Button
                onClick={handleGoBack}
                variant="outline"
                className="button-hover-effect flex-1 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 font-bold py-4 px-8 rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Footer message */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Don't worry, Trainer! Even the best Pokemon masters get lost sometimes.
                <br />
                <span className="font-medium text-gray-600">Keep exploring! 🌟</span>
              </p>
            </div>
          </CardContent>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-tr-full" />
        </Card>
      </div>
    </div>
  );
};
