import { NextRequest, NextResponse } from "next/server";
import { ddb } from "@/lib/aws/dynamo";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Letter } from "@/types/Letter";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const recipientId = searchParams.get("senderId");

  if (!recipientId) {
    return NextResponse.json({ error: "Missing senderId" }, { status: 400 });
  }

  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: "Letters",
        IndexName: "recipientId-index",
        KeyConditionExpression: "recipientId = :rid",
        ExpressionAttributeValues: {
          ":rid": recipientId,
        },
      })
    );

    const letters = result.Items as Letter[];
    const now = new Date();

    const incoming = letters.filter((l) => new Date(l.deliveryTime) > now);
    const unread = letters.filter(
      (l) => new Date(l.deliveryTime) <= now && !l.isRead
    );

    const read = letters.filter((l) => l.isRead);

    return NextResponse.json({ incoming, unread, read });
  } catch (error) {
    console.error("Inbox error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
