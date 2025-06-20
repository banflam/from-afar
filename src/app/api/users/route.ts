import { NextResponse } from "next/server";
import { ddb } from "@/lib/aws/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

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
