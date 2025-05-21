import { NextResponse } from "next/server";

export async function GET() {
  // mock users, hardcoded for now
  const users = [
    {
      id: "user-001",
      username: "wanderlust_will",
      city: "Paris",
      gender: "Male",
    },
    {
      id: "user-001",
      username: "skyline_sara",
      city: "Tokyo",
      gender: "Female",
    },
    {
      id: "user-003",
      username: "echo_writer",
      city: "Cairo",
      gender: "Other",
    },
  ];

  return NextResponse.json(users);
}
