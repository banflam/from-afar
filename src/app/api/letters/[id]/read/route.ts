import { NextRequest, NextResponse } from "next/server";
import { ddb } from "@/lib/aws/dynamo";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  /*export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {*/
  const letterId = context.params.id;

  if (!letterId) {
    return NextResponse.json({ error: "Missing letter ID" }, { status: 400 });
  }

  try {
    const result = await ddb.send(
      new UpdateCommand({
        TableName: "Letters",
        Key: {
          letter_id: letterId,
        },
        UpdateExpression: "SET isRead = :true, readAt = :now",
        ExpressionAttributeValues: {
          ":true": true,
          ":now": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return NextResponse.json(result.Attributes);
  } catch (error) {
    console.error("Error marking letter as read:", error);
    return NextResponse.json(
      { error: "Failed to update letter" },
      { status: 500 }
    );
  }
}
