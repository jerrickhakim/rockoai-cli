import React from "react";

interface DashboardHeaderProps {
  title: string;
  endContent?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  endContent,
}) => {
  return (
    <div className="mb-2 flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-900">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>

      {endContent || null}
    </div>
  );
};

export default DashboardHeader;
