import { NextResponse } from "next/server";
import Pusher from "pusher";
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

  const data = await req.formData();
  const socketId = data.get("socket_id") as string;
  const channel = data.get("channel_name") as string;

  // Check if the user is authorized to access this channel
  if (!channel.startsWith(`private-user-${session.id}`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authResponse = pusher.authorizeChannel(socketId, channel);

  return NextResponse.json(authResponse);
}
