import { NextRequest, NextResponse } from "next/server";
import { ddb } from "@/lib/aws/dynamo";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  email?: string;
  "cognito:username": string;
  [key: string]: string | number | boolean | undefined;
};

const TABLE = "Users";

export async function PATCH(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = auth.replace("Bearer ", "");
  const decoded = jwtDecode<JwtPayload>(token);
  const userId = decoded.sub;

  const body = await req.json();

  const updates = {
    city: body.city,
    gender: body.gender,
    bio: body.bio,
    dateOfBirth: body.dateOfBirth,
    latitude: body.latitude,
    longitude: body.longitude,
  };

  try {
    await ddb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { userId },
        UpdateExpression: `SET city = :city, gender = :gender, bio = :bio, dateOfBirth = :dob, latitude = :lat, longitude = :long`,
        ExpressionAttributeValues: {
          ":city": updates.city,
          ":gender": updates.gender,
          ":bio": updates.bio,
          ":dob": updates.dateOfBirth,
          ":lat": updates.latitude,
          ":long": updates.longitude,
        },
      })
    );

    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Error updating profile", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = auth.replace("Bearer ", "");
  const decoded = jwtDecode<JwtPayload>(token);

  const userId = decoded.sub;

  try {
    const result = await ddb.send(
      new GetCommand({
        TableName: TABLE,
        Key: { userId },
      })
    );

    if (!result.Item) {
      return NextResponse.json({
        email: decoded.email ?? "",
        username: decoded["cognito:username"] ?? "",
        city: "",
        gender: "",
        bio: "",
        dateOfBirth: "",
        latitude: null,
        longitude: null,
      });
    }

    return NextResponse.json(result.Item);
  } catch (err) {
    console.error("Error fetching profile", err);
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}

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
