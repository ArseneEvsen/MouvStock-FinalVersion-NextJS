// File: app/home/InfoCard.tsx

import React from 'react';
import { CircleAlert } from 'lucide-react';

interface CardProps {
  color?: string;
  number: number;
  description: string;
  icon?: React.ReactNode;
}

const InfoCard: React.FC<CardProps> = ({ color = 'bg-green-500', number, description, icon = <CircleAlert size={64} /> }) => {
  return (
    <div className={`relative ${color} p-6 rounded-lg shadow-lg text-white w-full max-w-xs h-48`}>
      {/* Icon positioned in the top-right corner */}
      <div className="absolute top-4 right-4 text-white text-6xl">
        {icon}
      </div>
      {/* Content container */}
      <div className="mt-10">
        <div className="text-4xl font-bold">{number}</div>
        <div className="text-lg mt-2">{description}</div>
      </div>
    </div>
  );
}

export default InfoCard;
