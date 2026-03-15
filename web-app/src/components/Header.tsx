import { Circle } from "lucide-react";
export default function HeaderBar() {
  return (
    <div className="flex flex-row pt-4 pb-8">
      <div className="flex-1 text-4xl font-bold">Chat</div>
      <div className="flex-1 flex justify-end items-center">
        <Circle size={42} />
      </div>
    </div>
  );
}
