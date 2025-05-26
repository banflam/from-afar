import { NextRequest, NextResponse } from "next/server";
import { ddb } from "@/lib/aws/dynamo";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  email?: string;
  "cognito:username": string;
  [key: string]: string | number | boolean | undefined;
};

export async function POST(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = auth.replace("Bearer", "");
  const decoded = jwtDecode<JwtPayload>(token);

  const user = {
    userId: decoded.sub,
    username: decoded["cognito:username"],
    city: "unknown",
    gender: "other",
    bio: "",
    createdAt: new Date().toISOString(),
  };

  await ddb.send(
    new PutCommand({
      TableName: "Users",
      Item: user,
      ConditionExpression: "attribute_not_exists(userId)", // do not overwrite an existing userId
    })
  );

  return NextResponse.json({ message: "Profile initialized" });
}
