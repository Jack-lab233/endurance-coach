import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query) {
    return NextResponse.json({ error: "No query provided" }, { status: 400 });
  }

  try {
    const tavilyRes = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: `${query} running race event details date location registration`,
        search_depth: "advanced",
        max_results: 5,
        include_answer: true,
      }),
    });

    const tavilyData = await tavilyRes.json();

    // Extract race details from results
    const results = tavilyData.results || [];
    const answer = tavilyData.answer || "";

    // Parse each result into a race object
    const races = results.map((r: any, i: number) => {
      const text = (r.content + " " + r.title + " " + answer).toLowerCase();

      // Try to detect distance
      let distance = "Marathon";
      if (text.includes("100km") || text.includes("100 km")) distance = "100km";
      else if (text.includes("50km") || text.includes("50 km")) distance = "50km";
      else if (text.includes("half marathon") || text.includes("21km") || text.includes("21.1")) distance = "Half Marathon";
      else if (text.includes("10km") || text.includes("10 km")) distance = "10km";
      else if (text.includes("5km") || text.includes("5 km")) distance = "5km";
      else if (text.includes("marathon")) distance = "Marathon";

      // Try to detect surface
      let surface = "Road";
      if (text.includes("trail") || text.includes("mountain") || text.includes("forest")) surface = "Trail";
      else if (text.includes("track")) surface = "Track";
      else if (text.includes("mixed")) surface = "Mixed";

      // Try to detect difficulty
      let difficulty = "Moderate";
      let difficultyColor = "#f0a830";
      if (text.includes("technical") || text.includes("challenging") || text.includes("tough") || text.includes("hard")) {
        difficulty = "Hard";
        difficultyColor = "#e05252";
      } else if (text.includes("flat") || text.includes("fast") || text.includes("easy") || text.includes("beginner")) {
        difficulty = "Easy";
        difficultyColor = "#1fcc8a";
      }

      // Try to detect elevation
      const elevMatch = r.content.match(/(\d[\d,]*)\s*m(?:eters?)?\s*(?:of\s+)?(?:elevation|climb|gain|ascent)/i);
      const elevation = elevMatch ? `${elevMatch[1]}m gain` : null;

      // Try to detect cutoff
      const cutoffMatch = r.content.match(/(\d+)\s*hour/i);
      const cutoff = cutoffMatch ? `${cutoffMatch[1]} hours` : null;

      // Try to detect temperature
      const tempMatch = r.content.match(/(\d+)[°\s]*[–-]\s*(\d+)[°\s]*[CF]/i);
      const temp = tempMatch ? `${tempMatch[1]}–${tempMatch[2]}°C` : null;

      // Try to detect aid stations
      const aidMatch = r.content.match(/(\d+)\s*aid\s*station/i);
      const aidStations = aidMatch ? parseInt(aidMatch[1]) : null;

      return {
        id: `search-${i}-${Date.now()}`,
        name: r.title.replace(/\s*[-|].*$/, "").trim(),
        url: r.url,
        snippet: r.content.slice(0, 200),
        distance,
        surface,
        difficulty,
        difficultyColor,
        elevation,
        cutoff,
        temp,
        aidStations,
        location: "",
        date: "",
        goalTime: "",
      };
    });

    return NextResponse.json({ races, answer });
  } catch (err) {
    console.error("Tavily error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}