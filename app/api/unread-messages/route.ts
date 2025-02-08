import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Message } from "@/lib/models/Message";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 }
    );
  }

  // Verify that the user requesting unread counts is the logged-in user
  if (userId !== session.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const unreadCounts = await Message.aggregate([
    {
      $match: {
        recipientId: userId,
        read: false,
      },
    },
    {
      $group: {
        _id: "$senderId",
        count: { $sum: 1 },
      },
    },
  ]);

  return NextResponse.json(unreadCounts);
}
