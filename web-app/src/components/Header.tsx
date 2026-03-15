import { Circle } from "lucide-react";
interface HeaderBarProps {
  title: string;
}

export default function HeaderBar({ title }: HeaderBarProps) {
  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
  return (
    <div className="flex flex-row pt-4 pb-8">
      <div className="flex-1 text-4xl font-bold">{formattedTitle}</div>
      <div className="flex-1 flex justify-end items-center">
        <Circle size={42} />
      </div>
    </div>
  );
}
