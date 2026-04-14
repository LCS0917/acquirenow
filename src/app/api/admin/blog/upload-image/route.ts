import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Simulate Upload Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would upload to Supabase Storage here.
    // For now, return a placeholder to verify the UI flow.
    return NextResponse.json({ url: "https://images.unsplash.com/photo-1576091160550-2173dad99978?q=80&w=1000&auto=format&fit=crop" });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
