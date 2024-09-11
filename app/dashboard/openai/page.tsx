"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Navigation } from "@/components/components-navigation";

// Mock data for demonstration
const initialUsers = [
  { id: 1, email: "sinisa@dvasadva.com", tokens: 1034, amount: 0.0002, limit: 5 },
  { id: 2, email: "sinisa@dvasadva.hr", tokens: 2359, amount: 0.0002, limit: 5 },
  { id: 3, email: "test@example.com", tokens: 3455, amount: 0.0003, limit: 5 },
  { id: 4, email: "test2@example.com", tokens: 94, amount: 0.0001, limit: 5 },
];

export default function AppDashboardOpenaiPage() {
  const [users, setUsers] = useState(initialUsers);
  const [newLimits, setNewLimits] = useState({});

  const totalTokens = users.reduce((sum, user) => sum + user.tokens, 0);
  const totalAmount = users.reduce((sum, user) => sum + user.amount, 0);

  const handleLimitChange = (userId, value) => {
    setNewLimits((prev) => ({ ...prev, [userId]: value }));
  };

  const handleLimitSubmit = (userId) => {
    const newLimit = Number(newLimits[userId]);
    if (isNaN(newLimit) || newLimit < 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid dollar amount for the monthly limit.",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map((user) => (user.id === userId ? { ...user, limit: newLimit } : user)));
    setNewLimits((prev) => ({ ...prev, [userId]: "" }));

    toast({
      title: "Monthly Limit Updated",
      description: `OpenAI API monthly usage limit for ${users.find((u) => u.id === userId)?.email ?? "user"} has been set to $${newLimit}.`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OpenAI API Usage Dashboard</h1>
      <Navigation />

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OpenAI Total Tokens (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OpenAI Total Amount (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(4)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>OpenAI API Monthly Usage Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            The table below shows the monthly usage data and limits for each user. Tokens and Amount columns represent the usage for the current month. The
            Current Limit and New Limit columns represent monthly spending limits.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Tokens (This Month)</TableHead>
                <TableHead>Amount ($ This Month)</TableHead>
                <TableHead>Current Monthly Limit ($)</TableHead>
                <TableHead>Set New Monthly Limit ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.tokens.toLocaleString()}</TableCell>
                  <TableCell>${user.amount.toFixed(4)}</TableCell>
                  <TableCell>${user.limit.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="New monthly limit ($)"
                        value={newLimits[user.id] || ""}
                        onChange={(e) => handleLimitChange(user.id, e.target.value)}
                        className="w-36"
                      />
                      <Button onClick={() => handleLimitSubmit(user.id)}>Set</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
