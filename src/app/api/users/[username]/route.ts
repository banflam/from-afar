import { NextRequest, NextResponse } from "next/server";
import { ddb } from "@/lib/aws/dynamo";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";


/*
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ letterId: string }> }
) {
  const { letterId } = await params;
  */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: "Users",
        IndexName: "username-index",
        KeyConditionExpression: "username = :u",
        ExpressionAttributeValues: {
          ":u": username,
        },
        Limit: 1,
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.Items[0];

    const birth = new Date(user.dateOfBirth);
    const age = new Date().getFullYear() - birth.getFullYear();

    return NextResponse.json({
      username: user.username,
      bio: user.bio,
      gender: user.gender,
      city: user.city,
      state: user.state ?? "",
      country: user.country ?? "",
      age,
    });
  } catch (err) {
    console.error("Failed to fetch user profile: from the backend", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
