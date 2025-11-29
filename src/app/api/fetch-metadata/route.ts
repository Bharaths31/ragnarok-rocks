import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. Get the URL from the query string (e.g. ?url=https://github.com/...)
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // 2. Fetch the external website (Server-side fetch avoids CORS)
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)", // Pretend to be a browser
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch site");
    }

    const html = await response.text();

    // 3. Simple Regex to find OpenGraph Image and Title
    // (We use Regex here to avoid installing heavy scraping libraries like Cheerio)
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)"/i);
    const iconMatch = html.match(/<link rel="icon" href="(.*?)"/i);

    const title = titleMatch ? titleMatch[1] : "Unknown Title";
    const image = ogImageMatch ? ogImageMatch[1] : null;
    const icon = iconMatch ? iconMatch[1] : null;

    // 4. Return the data to your frontend
    return NextResponse.json({
      title,
      image,
      icon: icon && !icon.startsWith("http") ? new URL(icon, targetUrl).toString() : icon
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}