import { db } from "@/db";
import { forumSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET handler
export async function GET() {
  try {
    const posts = await db.select().from(forumSchema).execute();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST handler
export async function POST(req: Request) {
  try {
    const { post_title, content, post_author } = await req.json();

    if (!post_title || !content || !post_author) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newPost = await db
      .insert(forumSchema)
      .values({
        post_title,
        content,
        post_author,
        timestamp: new Date().toISOString(),
      })
      .returning()
      .execute();

    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    await db.delete(forumSchema).where(eq(forumSchema.id, Number(id))).execute();

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
