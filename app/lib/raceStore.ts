import { supabase } from "./supabase";

export interface Race {
  id: string;
  name: string;
  date: string;
  distance: string;
  surface: string;
  goalTime: string;
  location: string;
  isPrimary?: boolean;
  url?: string | null;
  elevation?: string | null;
  cutoff?: string | null;
  temp?: string | null;
  aidStations?: number | null;
  difficulty?: string | null;
  difficultyColor?: string | null;
  snippet?: string | null;
  courseNotes?: string | null;
}

const getRacesLocal = (): Race[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("races");
  if (!saved) return [];
  try { return JSON.parse(saved); } catch { return []; }
};

const saveToLocal = (races: Race[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("races", JSON.stringify(races));
};

const getUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

export const getRaces = (): Race[] => getRacesLocal();

export const saveRace = async (race: Race) => {
  // Always save locally first
  const races = getRacesLocal();
  const existsLocally = races.find(r => r.id === race.id);
  if (!existsLocally) {
    races.push(race);
    saveToLocal(races);
  }

  // Then try Supabase
  const userId = await getUserId();
  if (!userId) return;

  // Check if race already exists in Supabase
  const { data: existing } = await supabase
    .from("races")
    .select("id")
    .eq("id", race.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    // Update instead of insert
    const { error } = await supabase.from("races").update({
      name: race.name,
      date: race.date,
      distance: race.distance,
      surface: race.surface || null,
      goal_time: race.goalTime || null,
      location: race.location || null,
      is_primary: race.isPrimary || false,
      url: race.url || null,
      cutoff: race.cutoff || null,
      temp: race.temp || null,
      aid_stations: race.aidStations || null,
      difficulty: race.difficulty || null,
      difficulty_color: race.difficultyColor || null,
      snippet: race.snippet || null,
      elevation_notes: race.elevation || null,
      course_notes: race.courseNotes || null,
    }).eq("id", race.id).eq("user_id", userId);

    if (error) console.error("Supabase update error:", error.message);
  } else {
    // Fresh insert using race.id (not a new UUID)
    const { error } = await supabase.from("races").insert({
      id: race.id,
      user_id: userId,
      name: race.name,
      date: race.date,
      distance: race.distance,
      surface: race.surface || null,
      goal_time: race.goalTime || null,
      location: race.location || null,
      is_primary: race.isPrimary || false,
      url: race.url || null,
      cutoff: race.cutoff || null,
      temp: race.temp || null,
      aid_stations: race.aidStations || null,
      difficulty: race.difficulty || null,
      difficulty_color: race.difficultyColor || null,
      snippet: race.snippet || null,
      elevation_notes: race.elevation || null,
      course_notes: race.courseNotes || null,
      notes: null,
    });

    if (error) console.error("Supabase save error:", error.message);
  }
};

export const updateRace = async (race: Race) => {
  // Update locally
  const races = getRacesLocal().map(r => r.id === race.id ? race : r);
  saveToLocal(races);

  // Update in Supabase
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase.from("races").update({
    name: race.name,
    date: race.date,
    distance: race.distance,
    surface: race.surface || null,
    goal_time: race.goalTime || null,
    location: race.location || null,
    is_primary: race.isPrimary || false,
    url: race.url || null,
    cutoff: race.cutoff || null,
    temp: race.temp || null,
    aid_stations: race.aidStations || null,
    difficulty: race.difficulty || null,
    difficulty_color: race.difficultyColor || null,
    snippet: race.snippet || null,
    elevation_notes: race.elevation || null,
    course_notes: race.courseNotes || null,
  }).eq("id", race.id).eq("user_id", userId);

  if (error) console.error("Supabase update error:", error.message);
};

export const deleteRace = async (id: string) => {
  const races = getRacesLocal().filter(r => r.id !== id);
  saveToLocal(races);

  const userId = await getUserId();
  if (!userId) return;

  // Fixed: was filtering by name but passing id
  await supabase.from("races").delete().eq("id", id).eq("user_id", userId);
};

export const setPrimaryRace = async (id: string) => {
  const races = getRacesLocal().map(r => ({ ...r, isPrimary: r.id === id }));
  saveToLocal(races);

  const userId = await getUserId();
  if (!userId) return;
  await supabase.from("races").update({ is_primary: false }).eq("user_id", userId);
  await supabase.from("races").update({ is_primary: true }).eq("id", id).eq("user_id", userId);
};

export const loadRacesFromSupabase = async (): Promise<Race[]> => {
  const userId = await getUserId();
  const local = getRacesLocal();
  if (!userId) return local;

  const { data, error } = await supabase
    .from("races")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });

  if (error || !data || data.length === 0) return local;

  const races: Race[] = data.map((r: any) => ({
    id: r.id,
    name: r.name,
    date: r.date,
    distance: r.distance || "",
    surface: r.surface || "",
    goalTime: r.goal_time || "",
    location: r.location || "",
    isPrimary: r.is_primary || false,
    url: r.url || null,
    elevation: r.elevation_notes || null,
    cutoff: r.cutoff || null,
    temp: r.temp || null,
    aidStations: r.aid_stations || null,
    difficulty: r.difficulty || null,
    difficultyColor: r.difficulty_color || null,
    snippet: r.snippet || null,
    courseNotes: r.course_notes || null,
  }));

  saveToLocal(races);
  return races;
};