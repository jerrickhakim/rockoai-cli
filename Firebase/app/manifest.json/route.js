import { NextResponse } from "next/server";

import app from "@/app.json";

export async function GET() {
  return NextResponse.json({
    id: "/dashboard",
    name: app.name,
    short_name: app.name,
    description: app.description,
    start_url: "/account",
    display: "standalone",
    background_color: app.colors.primary,
    theme_color: app.colors.primary,
    icons: [],
    orientation: "portrait",
    lang: "en-US",
  });
}
