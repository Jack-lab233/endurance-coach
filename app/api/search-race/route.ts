import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query) {
    return NextResponse.json({ error: "No query provided" }, { status: 400 });
  }

  try {
    // ── 1. FIND THE RACE ──────────────────────────────────────────────────
    const tavilyRes = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: `${query} official race event registration entry 2026`,
        search_depth: "advanced",
        max_results: 10,
        include_answer: true,
      }),
    });

    const tavilyData = await tavilyRes.json();
    const results = tavilyData.results || [];

    const blockedDomains = [
      "instagram.com", "facebook.com", "twitter.com", "x.com",
      "youtube.com", "tiktok.com", "reddit.com", "wikipedia.org",
      "tripadvisor.com", "strava.com", "garmin.com", "mapmyrun.com",
      "runnersworld.com", "running.co.za", "news24.com", "timeslive.co.za",
      "dailymaverick.co.za", "capetimes.co.za", "sport24.co.za",
    ];

    const raceKeywords = [
      "registration", "register", "entry", "entries", "race date",
      "start time", "distance", "marathon", "half marathon", "trail run",
      "10km", "5km", "ultra", "event", "finisher", "route", "results",
    ];

    const excludeKeywords = [
      "instagram", "facebook", "twitter", "youtube", "tiktok",
      "news", "article", "blog post", "review", "photo", "video",
      "permit", "trespassing", "stroller", "riders",
    ];

    const filtered = results.filter((r: any) => {
      const url = (r.url || "").toLowerCase();
      const title = (r.title || "").toLowerCase();
      const content = (r.content || "").toLowerCase();
      const combined = title + " " + content + " " + url;

      if (blockedDomains.some(d => url.includes(d))) return false;
      if (excludeKeywords.some(k => title.includes(k))) return false;
      if (!raceKeywords.some(k => combined.includes(k))) return false;
      return true;
    });

    const races = filtered.slice(0, 5).map((r: any, i: number) => {
      const text = (r.content + " " + r.title).toLowerCase();
      const fullText = r.content + " " + r.title;

      let distance = "Marathon";
      if (text.includes("100km") || text.includes("100 km")) distance = "100km";
      else if (text.includes("50km") || text.includes("50 km")) distance = "50km";
      else if (text.includes("half marathon") || text.includes("21.1km") || text.includes("21km")) distance = "Half Marathon";
      else if (text.includes("10km") || text.includes("10 km")) distance = "10km";
      else if (text.includes("5km") || text.includes("5 km")) distance = "5km";
      else if (text.includes("marathon")) distance = "Marathon";

      let surface = "Road";
      if (text.includes("trail") || text.includes("mountain") || text.includes("forest")) surface = "Trail";
      else if (text.includes("track")) surface = "Track";

      let difficulty = "Moderate";
      let difficultyColor = "#f0a830";
      if (text.includes("technical") || text.includes("challenging") || text.includes("tough") || text.includes("extreme")) {
        difficulty = "Hard"; difficultyColor = "#e05252";
      } else if (text.includes("flat") || text.includes("fast") || text.includes("beginner friendly")) {
        difficulty = "Easy"; difficultyColor = "#1fcc8a";
      }

      let date = "";
      const datePatterns = [
        /(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(202\d)/i,
        /(202\d)[\/\-](\d{2})[\/\-](\d{2})/i,
      ];
      for (const pattern of datePatterns) {
        const match = fullText.match(pattern);
        if (match) {
          if (match[3] && match[3].startsWith("202")) {
            const months: Record<string, string> = {
              january: "01", february: "02", march: "03", april: "04",
              may: "05", june: "06", july: "07", august: "08",
              september: "09", october: "10", november: "11", december: "12",
            };
            const month = months[match[2].toLowerCase()];
            if (month) date = match[3] + "-" + month + "-" + match[1].padStart(2, "0");
          } else if (match[1] && match[1].startsWith("202")) {
            date = match[1] + "-" + match[2] + "-" + match[3];
          }
          if (date) break;
        }
      }

      const elevMatch = fullText.match(/(\d[\d,]*)\s*m(?:eters?)?\s*(?:of\s+)?(?:elevation|climb|gain|ascent)/i);
      const elevation = elevMatch ? elevMatch[1] + "m gain" : null;

      const cutoffMatch = fullText.match(/(\d+)\s*hour[s]?\s*(?:cutoff|time limit)/i);
      const cutoff = cutoffMatch ? cutoffMatch[1] + " hours" : null;

      const tempMatch = fullText.match(/(\d+)\s*[°\-–]\s*(\d+)\s*°?\s*[cC]/i);
      const temp = tempMatch ? tempMatch[1] + "–" + tempMatch[2] + "°C" : null;

      const aidMatch = fullText.match(/(\d+)\s*aid\s*station/i);
      const aidStations = aidMatch ? parseInt(aidMatch[1]) : null;

      const cleanName = r.title
        .replace(/\s*[\|\-–]\s*.+$/, "")
        .replace(/\s*\(.+\)$/, "")
        .trim();

      return {
        id: "search-" + i + "-" + Date.now(),
        name: cleanName,
        url: r.url,
        snippet: r.content.slice(0, 180),
        distance,
        surface,
        difficulty,
        difficultyColor,
        elevation,
        cutoff,
        temp,
        aidStations,
        location: "",
        date,
        goalTime: "",
        courseNotes: null as string | null,
      };
    });

    // ── 2. COURSE INTELLIGENCE — research the top result ─────────────────
    if (races.length > 0) {
      try {
        const topRace = races[0];

        // Deep search for course-specific info
        const courseRes = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: `${topRace.name} course profile terrain elevation route description runner experience`,
            search_depth: "advanced",
            max_results: 5,
            include_answer: true,
          }),
        });

        const courseData = await courseRes.json();
        const courseResults = courseData.results || [];

        // Combine all text for Claude to analyse
        const courseContext = courseResults
          .map((r: any) => `SOURCE: ${r.url}\n${r.content}`)
          .join("\n\n---\n\n")
          .slice(0, 6000); // keep tokens reasonable

        if (courseContext.length > 100) {
          // Ask Claude to generate structured course notes
          const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.ANTHROPIC_API_KEY!,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 600,
              system: `You are an expert endurance running coach. Your job is to write concise, practical course notes for athletes preparing for a race. 
Focus on: terrain and surface type, key climbs and descents, technical sections, river crossings or obstacles, exposed sections, notable landmarks, pacing strategy advice, and anything else a runner needs to know to prepare properly.
Write in clear bullet points. Be specific and practical — not generic. If the race has iconic or well-known sections, name them.
Return ONLY the bullet points, no intro sentence, no headers. Each bullet starts with •. Maximum 8 bullets.`,
              messages: [
                {
                  role: "user",
                  content: `Write course notes for the ${topRace.name} (${topRace.distance}, ${topRace.surface}) based on this research:\n\n${courseContext}`,
                },
              ],
            }),
          });

          const claudeData = await claudeRes.json();
          const notes = claudeData.content?.[0]?.text?.trim() || null;
          if (notes) {
            races[0].courseNotes = notes;
          }
        }
      } catch (err) {
        console.error("Course research error:", err);
        // Non-fatal — races still return without course notes
      }
    }

    return NextResponse.json({ races, answer: tavilyData.answer || "" });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}