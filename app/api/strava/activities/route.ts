import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function refreshStravaToken(refreshToken: string) {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  return res.json();
}

export async function GET() {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get stored Strava tokens
    const { data: tokenRow, error: tokenError } = await supabase
      .from("strava_tokens")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (tokenError || !tokenRow) {
      return NextResponse.json(
        { error: "Strava not connected" },
        { status: 404 }
      );
    }

    let accessToken = tokenRow.access_token;

    // Refresh token if expiring soon
    const nowUnix = Math.floor(Date.now() / 1000);

    if (nowUnix > tokenRow.expires_at - 300) {
      const refreshed = await refreshStravaToken(
        tokenRow.refresh_token
      );

      if (!refreshed.access_token) {
        return NextResponse.json(
          { error: "Failed to refresh Strava token" },
          { status: 500 }
        );
      }

      accessToken = refreshed.access_token;

      await supabase
        .from("strava_tokens")
        .update({
          access_token: refreshed.access_token,
          refresh_token: refreshed.refresh_token,
          expires_at: refreshed.expires_at,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    // Fetch last 4 weeks of activities
    const fourWeeksAgo = Math.floor(
      (Date.now() - 28 * 24 * 60 * 60 * 1000) / 1000
    );

    const activitiesRes = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${fourWeeksAgo}&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!activitiesRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Strava activities" },
        { status: 500 }
      );
    }

    const activities = await activitiesRes.json();

    if (!Array.isArray(activities)) {
      return NextResponse.json(
        { error: "Invalid activities response" },
        { status: 500 }
      );
    }

    /**
     * INCLUDE ALL RUN TYPES
     *
     * Examples:
     * - Run
     * - TrailRun
     * - VirtualRun
     * - TrackRun
     *
     * Future-proof:
     * anything with "run" in sport_type
     */
    const runs = activities.filter((activity: any) => {
      const sportType =
        activity?.sport_type?.toLowerCase?.() || "";

      return sportType.includes("run");
    });

    // Sort newest first
    runs.sort(
      (a: any, b: any) =>
        new Date(b.start_date).getTime() -
        new Date(a.start_date).getTime()
    );

    /**
     * THIS WEEK (Monday -> Sunday)
     */
    const now = new Date();

    const monday = new Date(now);

    monday.setDate(
      now.getDate() - ((now.getDay() + 6) % 7)
    );

    monday.setHours(0, 0, 0, 0);

    const thisWeekRuns = runs.filter(
      (activity: any) =>
        new Date(activity.start_date) >= monday
    );

    /**
     * WEEKLY STATS
     */
    const weeklyKm = thisWeekRuns.reduce(
      (sum: number, activity: any) =>
        sum + activity.distance / 1000,
      0
    );

    const weeklyDuration = thisWeekRuns.reduce(
      (sum: number, activity: any) =>
        sum + activity.moving_time,
      0
    );

    const weeklyElevation = thisWeekRuns.reduce(
      (sum: number, activity: any) =>
        sum +
        (activity.total_elevation_gain || 0),
      0
    );

    /**
     * AVERAGE PACE
     * stored/displayed as min/km
     */
    let avgPace: string | null = null;

    if (weeklyKm > 0 && thisWeekRuns.length > 0) {
      const avgPaceSec =
        thisWeekRuns.reduce(
          (sum: number, activity: any) => {
            if (
              activity.average_speed &&
              activity.average_speed > 0
            ) {
              return (
                sum +
                1000 / activity.average_speed
              );
            }

            return sum;
          },
          0
        ) / thisWeekRuns.length;

      const paceMin = Math.floor(avgPaceSec / 60);

      const paceSec = Math.round(
        avgPaceSec % 60
      );

      avgPace = `${paceMin}:${paceSec
        .toString()
        .padStart(2, "0")}`;
    }

    /**
     * TODAY'S RUNS
     */
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayRuns = runs.filter(
      (activity: any) =>
        new Date(activity.start_date) >= today
    );

    /**
     * LAST RUN
     */
    const lastRun = runs[0] || null;

    /**
     * DEBUG
     * useful for seeing exactly what Strava returns
     */
    const debug = activities.map((activity: any) => ({
      name: activity.name,
      type: activity.type,
      sport_type: activity.sport_type,
      workout_type: activity.workout_type,
      date: activity.start_date,
      distance_km: (
        activity.distance / 1000
      ).toFixed(1),
    }));

    return NextResponse.json({
      weeklyKm:
        Math.round(weeklyKm * 10) / 10,

      weeklyDuration:
        Math.round(weeklyDuration / 60),

      weeklyElevation:
        Math.round(weeklyElevation),

      avgPace,

      thisWeekCount:
        thisWeekRuns.length,

      todayRuns,

      lastRun,

      recentRuns: runs.slice(0, 10),

      debug,
    });
  } catch (error) {
    console.error("Strava API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}