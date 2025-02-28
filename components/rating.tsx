"use client";

import type React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RatingTrackerProps {
  onRatingSelect: (rating: string) => void;
}

const MoodTracker: React.FC<RatingTrackerProps> = ({ onRatingSelect }) => {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const ratings = [
    {
      value: "good",
      emoji: "😊",
      label: "Good",
      bgColor: "bg-yellow-100",
      hoverColor: "hover:bg-yellow-200",
    },
    {
      value: "fair",
      emoji: "😐",
      label: "Fair",
      bgColor: "bg-blue-100",
      hoverColor: "hover:bg-blue-200",
    },
    {
      value: "bad",
      emoji: "😔",
      label: "Bad",
      bgColor: "bg-gray-100",
      hoverColor: "hover:bg-gray-200",
    },
  ];

  const handleRatingSelect = (rating: string) => {
    setIsAnimating(true);
    setSelectedRating(rating);
    setTimeout(() => {
      setIsAnimating(false);
      onRatingSelect(rating);
    }, 500);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          How do you feel about your resolved issue?
        </h2>
        <p className="text-gray-500">Select your rating below</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {ratings.map((rating) => {
          const isSelected = selectedRating === rating.value;

          return (
            <Button
              key={rating.value}
              onClick={() => handleRatingSelect(rating.value)}
              className={`
                relative p-4 rounded-lg transition-all duration-200
                ${rating.bgColor} ${rating.hoverColor}
                ${
                  isSelected
                    ? "ring-2 ring-offset-2 ring-blue-500 scale-105"
                    : ""
                }
                ${isAnimating && isSelected ? "animate-pulse" : ""}
              `}
              variant="ghost"
            >
              <div className="flex flex-col items-center space-y-3">
                <span
                  className={`text-4xl transition-transform duration-200
                  ${
                    isSelected
                      ? "transform scale-125"
                      : "transform hover:scale-110"
                  }
                `}
                >
                  {rating.emoji}
                </span>
                <span
                  className={`font-medium ${
                    isSelected ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {rating.label}
                </span>
              </div>
            </Button>
          );
        })}
      </div>

      {selectedRating && (
        <div className="text-center pt-4 animate-fade-in">
          <p className="text-gray-600">Thank you for your feedback!</p>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </Card>
  );
};

export default MoodTracker;
