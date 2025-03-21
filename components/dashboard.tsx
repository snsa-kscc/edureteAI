"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  tokens: number;
  amount: number;
  limit: number;
}

interface NewLimits {
  [key: string]: string;
}

export function Dashboard({
  initialUsers,
  modelFamily,
  updateUserLimit,
}: {
  initialUsers: User[];
  modelFamily: string;
  updateUserLimit: (userId: string, modelFamily: string, newLimit: number) => Promise<void>;
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [newLimits, setNewLimits] = useState<NewLimits>({});
  const [isPending, startTransition] = useTransition();
  const totalTokens = users.reduce((sum, user) => sum + user.tokens, 0);
  const totalAmount = users.reduce((sum, user) => sum + user.amount, 0);

  const handleLimitChange = (userId: string, value: string) => {
    setNewLimits((prev) => ({ ...prev, [userId]: value }));
  };

  const handleLimitSubmit = (userId: string) => {
    const newLimit = Number(newLimits[userId]);
    if (isNaN(newLimit) || newLimit < 0) {
      toast.error("Invalid input", {
        description: "Please enter a valid positive number.",
      });
      return;
    }

    startTransition(async () => {
      try {
        await updateUserLimit(userId, modelFamily, newLimit);
        setUsers(users.map((user) => (user.userId === userId ? { ...user, limit: newLimit } : user)));
        setNewLimits((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
        toast.success(`Monthly limit for ${users.find((u) => u.userId === userId)?.emailAddress ?? "user"} has been set to $${newLimit}.`);
      } catch (error) {
        toast.error("Failed to update limit", {
          description: "An error occurred while updating the limit. Please try again.",
        });
      }
    });
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(4)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Monthly Usage Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            The table below shows the monthly usage data and limits for each user. Tokens and Amount columns represent the usage for the current month. The
            Current Limit and New Limit columns represent monthly spending limits.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tokens (This Month)</TableHead>
                <TableHead>Amount ($ This Month)</TableHead>
                <TableHead>Current Monthly Limit ($)</TableHead>
                <TableHead>Percentage of Limit Left</TableHead>
                <TableHead>Set New Monthly Limit ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const percentage = user.limit === 0 ? "0" : (((user.limit - user.amount) / user.limit) * 100).toFixed(2);
                return (
                  <TableRow key={user.userId}>
                    <TableCell className={`${+percentage < 10 ? "text-red-500" : ""}`}>{user.firstName}</TableCell>
                    <TableCell className={`${+percentage < 10 ? "text-red-500" : ""}`}>{user.lastName}</TableCell>
                    <TableCell className={`${+percentage < 10 ? "text-red-500" : ""}`}>{user.emailAddress}</TableCell>
                    <TableCell>{user.tokens.toLocaleString()}</TableCell>
                    <TableCell>${user.amount.toFixed(4)}</TableCell>
                    <TableCell>${user.limit.toFixed(2)}</TableCell>
                    <TableCell className={`${+percentage < 10 ? "text-red-500" : ""}`}>{percentage}%</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="New limit"
                          value={newLimits[user.userId] || ""}
                          onChange={(e) => handleLimitChange(user.userId, e.target.value)}
                          className="w-36"
                        />
                        <Button onClick={() => handleLimitSubmit(user.userId)} disabled={isPending}>
                          Set
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
