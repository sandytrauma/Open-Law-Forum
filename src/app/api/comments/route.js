import { db } from "@/db";
import { commentsSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET Handler
export async function GET(req) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");

  if (!postId || isNaN(Number(postId))) {
    return NextResponse.json({ error: "Invalid or missing postId" }, { status: 400 });
  }

  try {
    const comments = await db
      .select()
      .from(commentsSchema)
      .where(eq(commentsSchema.forum_id, Number(postId)))
      .execute();

    if (!comments || comments.length === 0) {
      return NextResponse.json({ error: "No comments found for this post" }, { status: 404 });
    }

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST Handler
export async function POST(req) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");

  if (!postId || isNaN(Number(postId))) {
    return NextResponse.json({ error: "Invalid or missing postId" }, { status: 400 });
  }

  try {
    const { content, commenter } = await req.json();

    if (!content || !commenter) {
      return NextResponse.json({ error: "Content and commenter are required" }, { status: 400 });
    }

    const newComment = await db
      .insert(commentsSchema)
      .values({
        forum_id: Number(postId),
        content,
        commenter,
        timestamp: new Date().toISOString(),
      })
      .returning()
      .execute();

    return NextResponse.json(newComment[0], { status: 201 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
