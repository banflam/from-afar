import { NextResponse } from "next/server";
import { ddb } from "@/lib/aws/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

// TODO: find a way to cache the data / scan less frequently since DynamoDB table scans are the most expensive and time consuming!
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
