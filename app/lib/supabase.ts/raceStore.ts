export interface Race {
  id: string;
  name: string;
  date: string;
  distance: string;
  surface: string;
  goalTime: string;
  location: string;
}

export const getRaces = (): Race[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("races");
  if (!saved) return [
    { id: "1", name: "Knysna Forest Marathon", date: "2025-07-19", distance: "Marathon", surface: "Trail", goalTime: "4:00:00", location: "Knysna, Western Cape" },
    { id: "2", name: "Cape Town Marathon", date: "2025-09-21", distance: "Marathon", surface: "Road", goalTime: "3:45:00", location: "Cape Town City Centre" },
  ];
  return JSON.parse(saved);
};

export const saveRace = (race: Race) => {
  const races = getRaces();
  races.push(race);
  localStorage.setItem("races", JSON.stringify(races));
};

export const deleteRace = (id: string) => {
  const races = getRaces().filter(r => r.id !== id);
  localStorage.setItem("races", JSON.stringify(races));
};