"use server";

import * as XLSX from "xlsx";
import { getUsersData } from "./redis-actions";
import { getUsersUsage } from "./utils";

export async function getUsersDataXlsx() {
  const MODELS = ["gpt", "claude"];
  const usersData = await getUsersData();
  usersData.sort((a, b) => a.lastName.localeCompare(b.lastName));

  const gptUsers = await getUsersUsage(usersData, MODELS[0]);
  const claudeUsers = await getUsersUsage(usersData, MODELS[1]);

  const combinedData = usersData.map((user) => {
    const gptData = gptUsers.find((u) => u.userId === user.userId);
    const claudeData = claudeUsers.find((u) => u.userId === user.userId);

    return {
      "Last name": user.lastName,
      "First name": user.firstName,
      Email: user.emailAddress,
      "Anthropic num of tokens": claudeData?.tokens ?? 0,
      "Anthropic amount ($)": claudeData?.amount ?? 0,
      "Anthropic limit": claudeData?.limit ?? 0,
      "Anthropic % of limit left": claudeData?.limit === 0 ? 0 : ((claudeData!.limit - claudeData!.amount) / claudeData!.limit) * 100,
      "OpenAI num of tokens": gptData?.tokens ?? 0,
      "OpenAI amount ($)": gptData?.amount ?? 0,
      "OpenAI limit": gptData?.limit ?? 0,
      "OpenAI % of limit left": gptData?.limit === 0 ? 0 : ((gptData!.limit - gptData!.amount) / gptData!.limit) * 100,
      "Total ($)": gptData!.amount + claudeData!.amount,
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(combinedData);

  const columnWidths = [
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
  ];
  ws["!cols"] = columnWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Per Instructor");

  const totalGptTokens = gptUsers.reduce((sum, user) => sum + user.tokens, 0);
  const totalGptAmount = gptUsers.reduce((sum, user) => sum + user.amount, 0);
  const totalClaudeTokens = claudeUsers.reduce((sum, user) => sum + user.tokens, 0);
  const totalClaudeAmount = claudeUsers.reduce((sum, user) => sum + user.amount, 0);

  const totalsData = [
    {
      Model: "Grand Total",
      "Total Tokens": totalGptTokens + totalClaudeTokens,
      "Total Amount ($)": totalGptAmount + totalClaudeAmount,
      "Average Token Price ($)": (totalGptAmount + totalClaudeAmount) / (totalGptTokens + totalClaudeTokens),
    },
    {
      Model: "OpenAI (GPT)",
      "Total Tokens": totalGptTokens,
      "Total Amount ($)": totalGptAmount,
      "Average Token Price ($)": totalGptAmount / totalGptTokens,
    },
    {
      Model: "Anthropic (Claude)",
      "Total Tokens": totalClaudeTokens,
      "Total Amount ($)": totalClaudeAmount,
      "Average Token Price ($)": totalClaudeAmount / totalClaudeTokens,
    },
  ];

  const totalsWs = XLSX.utils.json_to_sheet(totalsData);
  totalsWs["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];

  XLSX.utils.book_append_sheet(wb, totalsWs, "Totals");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return { blob, buffer };
}
