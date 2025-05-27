"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  username: string;
  city: string;
  gender: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Find Someone to Write To</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-600">
                {user.city} - {user.gender}
              </p>
            </div>

            <Link
              href={{
                pathname: "/send",
                query: { recipientId: user.id },
              }}
              className="text-blue-600 underline text-sm"
            >
              Write Letter
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
