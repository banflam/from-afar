import { NextRequest, NextResponse } from "next/server";
import { ddb } from "@/lib/aws/dynamo";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Letter } from "@/types/Letter";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const senderId = searchParams.get("senderId");

  if (!senderId) {
    return NextResponse.json({ error: "Missing senderId" }, { status: 400 });
  }

  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: "Letters",
        IndexName: "senderId-index",
        KeyConditionExpression: "senderId = :sid",
        ExpressionAttributeValues: {
          ":sid": senderId,
        },
      })
    );

    const letters = result.Items as Letter[];
    const now = new Date();

    const on_the_way = letters.filter((l) => new Date(l.deliveryTime) > now);
    const delivered = letters.filter((l) => new Date(l.deliveryTime) <= now);
    const delivered_and_read = delivered.filter((l) => l.isRead);

    return NextResponse.json({ on_the_way, delivered, delivered_and_read });
  } catch (error) {
    console.error("Sent letters API backend error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
