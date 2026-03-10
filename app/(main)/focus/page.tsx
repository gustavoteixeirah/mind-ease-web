// Mobile
import { FocusPanel } from "@/components/foco/FocusPanel";
import { Card } from "@/components/ui/card";
import HeaderBackButton from "@/components/ui/header-back-button";

export default function FocusPage() {
  return (
    <div>
      <HeaderBackButton title="Modo foco" />
      <main className="h-[100vw]">
        <Card className="p-4 py-6 pb-23 md:p-6">
          <FocusPanel />
        </Card>
      </main>
    </div>
  );
}
