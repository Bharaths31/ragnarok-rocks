import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Get params from frontend
  const rawTopics = searchParams.get("topics");
  const limit = searchParams.get("limit") || "10";
  
  // Default query if no topics exist
  const query = rawTopics ? rawTopics.replaceAll(",", " OR ") : "technology";
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
  }

  try {
    // Fetch from GNews
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${limit}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour to save API credits
    
    if (!res.ok) throw new Error("Failed to fetch news");
    
    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}