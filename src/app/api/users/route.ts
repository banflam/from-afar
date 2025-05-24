import { NextResponse } from "next/server";
import { ddb } from "@/lib/aws/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

// TODO: find a way to cache the data / scan less frequently since DynamoDB table scans are the most expensive and time consuming!
// TODO: there must be a better way to get a list of all the users. This is kind of ridiculous and bug-prone, to create an entirely separate DynamoDB table for users, add info to it at account creation, retrieve info etc.
export async function GET() {
  const res = await ddb.send(
    new ScanCommand({
      TableName: "Users",
    })
  );
  return NextResponse.json(
    res.Items || "Error retrieving users from the DynamoDB Users table"
  );
}
