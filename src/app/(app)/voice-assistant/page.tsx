import { PageHeader } from "@/components/page-header";
import { VoiceAssistant } from "@/components/voice-assistant";

export default function VoiceAssistantPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 h-full">
      <PageHeader title="المساعد الصوتي الذكي" />
      <VoiceAssistant />
    </div>
  );
}
