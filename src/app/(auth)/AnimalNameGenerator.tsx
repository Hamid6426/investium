"use client";

import React from "react";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

export function generateRandomAnimalName(): string {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: " ",
    style: "capital",
  });
}

interface AnimalNameGeneratorProps {
  onGenerate: (name: string) => void;
  className?: string;
}

const AnimalNameGenerator: React.FC<AnimalNameGeneratorProps> = ({
  onGenerate,
  className = "",
}) => {
  const handleClick = () => {
    const name = generateRandomAnimalName();
    onGenerate(name);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`ml-3 bg-primary text-white py-2 px-4 cursor-pointer transition-all duration-300 font-semibold hover:text-white rounded-sm hover:bg-accent ${className}`}
    >
      Generate
    </button>
  );
};

export default AnimalNameGenerator;
