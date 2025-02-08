import { NextResponse } from "next/server";
import Pusher from "pusher";
import { users } from "@/lib/user";
import { getSession } from "@/lib/session";
import dbConnect from "@/lib/db";
import { Message } from "@/lib/models/Message";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  console.log("Received request body:", body);

  const { senderId, recipientId, message, content } = body;

  if (!message && !content) {
    return NextResponse.json(
      { error: "Message content is required" },
      { status: 400 }
    );
  }

  const messageContent = message || content;

  const sender = users.find((u) => u.id === senderId);
  const recipient = users.find((u) => u.id === recipientId);

  if (!sender || !recipient) {
    return NextResponse.json(
      { error: "Invalid sender or recipient" },
      { status: 400 }
    );
  }

  // Verify that the sender matches the session user
  if (sender.id !== session.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the communication is allowed (Staff to MD or MD to anyone)
  if (sender.personnelType !== "Md" && recipient.personnelType !== "Md") {
    return NextResponse.json(
      { error: "Communication not allowed" },
      { status: 403 }
    );
  }

  // Connect to the database
  await dbConnect();

  // Store the message in the database
  const newMessage = new Message({
    senderId,
    recipientId,
    message: messageContent,
    read: false, // Ensure new messages are marked as unread
  });

  try {
    const savedMessage = await newMessage.save();
    console.log("Saved message:", savedMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }

  try {
    await pusher.trigger(`private-user-${recipientId}`, "new-message", {
      sender,
      message: messageContent,
    });
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    // Note: We don't return here because the message was saved successfully
  }

  return NextResponse.json({ success: true });
}
