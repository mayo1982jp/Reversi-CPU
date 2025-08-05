import ReversiGame from "@/components/ReversiGame";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start gap-6 p-6">
      <ReversiGame />
      <MadeWithDyad />
    </div>
  );
};

export default Index;