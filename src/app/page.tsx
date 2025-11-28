import AvatarScene from "@/components/canvas/AvatarScene";
import HudOverlay from "@/components/ui/HudOverlay";
import SkillOverlay from "@/components/features/SkillTree/SkillOverlay";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { view } = await searchParams;
  const isSkillsOpen = view === "skills";

  return (
    <div className="relative w-full h-full min-h-screen">
      <AvatarScene />
      <HudOverlay />
      <SkillOverlay isOpen={isSkillsOpen} />
    </div>
  );
}
