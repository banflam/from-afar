import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Letter } from "@/types/Letter";
import { ddb } from "@/lib/aws/dynamo";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { receiveMessageOnPort } from "worker_threads";
import { error } from "console";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { senderId, recipientId, content, deliveryTime } = body;
    console.log("Received body", body);

    if (!senderId || !recipientId || !content || !deliveryTime) {
      return NextResponse.json(
        { error: "Missing fields in the Letter" },
        { status: 400 }
      );
    }

    const letter: Letter = {
      letter_id: uuidv4(),
      senderId,
      recipientId,
      content,
      createdAt: new Date().toISOString(),
      deliveryTime,
      isRead: false,
    };

    console.log("Putting letter into DynamoDB", body);
    await ddb.send(
      new PutCommand({
        TableName: "Letters",
        Item: letter,
      })
    );

    return NextResponse.json(letter, { status: 201 });
  } catch (error) {
    console.error("Error saving letter:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
