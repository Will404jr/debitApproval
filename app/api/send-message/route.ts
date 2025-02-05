import { NextResponse } from "next/server";
import Pusher from "pusher";
import { users } from "@/lib/user";
import { getSession } from "@/lib/session";

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

  const { senderId, recipientId, message } = await req.json();

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

  await pusher.trigger(`private-user-${recipientId}`, "new-message", {
    sender,
    message,
  });

  return NextResponse.json({ success: true });
}
