import type { Character } from "@/types";
import CharacterCard from "./CharacterCard";

interface CharacterGridProps {
  characters: Character[];
  showStatus?: boolean;
}

export default function CharacterGrid({
  characters,
  showStatus,
}: CharacterGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {characters.map((c) => (
        <CharacterCard key={c.id} character={c} showStatus={showStatus} />
      ))}
    </div>
  );
}
