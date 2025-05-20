import { NextRequest, NextResponse } from "next/server";
import { ddb } from "@/lib/aws/dynamo";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Letter } from "@/types/Letter";
import { error } from "console";

const TABLE_NAME = process.env.DYNAMO_TABLE_LETTERS!;
const RECIPIENT_INDEX_NAME = "recipientId-index";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const recipientId = searchParams.get("recipientId");

  if (!recipientId) {
    return NextResponse.json({ error: "Missing recipientId" }, { status: 400 });
  }

  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: "Letters",
        IndexName: RECIPIENT_INDEX_NAME,
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
  } catch (error) {
    console.error("Inbox error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
