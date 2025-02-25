import { Button } from "@next-inflearn/ui/components/button";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">To do List</h1>
        <Button size="sm">Button</Button>
      </div>
    </div>
  );
}
