"use server";

import * as XLSX from "xlsx-js-style";
import { getUsersData } from "./redis-actions";
import { getUsersUsage } from "./utils";

type ProviderData =
  | {
      userId: string;
      firstName: string;
      lastName: string;
      emailAddress: string;
      tokens: number;
      amount: number;
      limit: number;
    }
  | undefined;

export async function getUsersDataXlsx(returnBuffer: boolean = false) {
  const MODELS = ["gpt", "claude"];
  const usersData = await getUsersData();

  const gptUsers = await getUsersUsage(usersData, MODELS[0]);
  const claudeUsers = await getUsersUsage(usersData, MODELS[1]);

  const combinedData = usersData.map((user) => {
    const gptData = gptUsers.find((u) => u.userId === user.userId);
    const claudeData = claudeUsers.find((u) => u.userId === user.userId);

    function getPercentageObject(data: ProviderData) {
      const percentage = data?.limit === 0 ? 0 : ((data!.limit - data!.amount) / data!.limit) * 100;
      return {
        v: percentage,
        t: "n",
        s: percentage < 10 ? { fill: { fgColor: { rgb: "FFFF0000" } } } : {},
      };
    }

    return {
      "Last name": user.lastName,
      "First name": user.firstName,
      Email: user.emailAddress,
      "Total ($)": gptData!.amount + claudeData!.amount,
      "Anthropic num of tokens": claudeData?.tokens ?? 0,
      "Anthropic amount ($)": claudeData?.amount ?? 0,
      "Anthropic limit": claudeData?.limit ?? 0,
      "Anthropic % of limit left": getPercentageObject(claudeData),
      "OpenAI num of tokens": gptData?.tokens ?? 0,
      "OpenAI amount ($)": gptData?.amount ?? 0,
      "OpenAI limit": gptData?.limit ?? 0,
      "OpenAI % of limit left": getPercentageObject(gptData),
    };
  });

  const wb = XLSX.utils.book_new();
  const instructorWs = XLSX.utils.json_to_sheet(combinedData);

  const instructorRange = XLSX.utils.decode_range(instructorWs["!ref"]!);
  for (let C = instructorRange.s.c; C <= instructorRange.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: instructorRange.s.r, c: C });
    if (!instructorWs[address]) continue;
    instructorWs[address].s = { font: { bold: true } };
  }

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
  instructorWs["!cols"] = columnWidths;

  const totalGptTokens = gptUsers.reduce((sum, user) => sum + user.tokens, 0);
  const totalGptAmount = gptUsers.reduce((sum, user) => sum + user.amount, 0);
  const totalClaudeTokens = claudeUsers.reduce((sum, user) => sum + user.tokens, 0);
  const totalClaudeAmount = claudeUsers.reduce((sum, user) => sum + user.amount, 0);

  function formatTotalAmount(amount: number) {
    return {
      v: amount,
      t: "n",
      s: amount > 15 ? { fill: { fgColor: { rgb: "FFFFFF00" } } } : {},
    };
  }

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
      "Total Amount ($)": formatTotalAmount(totalGptAmount),
      "Average Token Price ($)": totalGptAmount / totalGptTokens,
    },
    {
      Model: "Anthropic (Claude)",
      "Total Tokens": totalClaudeTokens,
      "Total Amount ($)": formatTotalAmount(totalClaudeAmount),
      "Average Token Price ($)": totalClaudeAmount / totalClaudeTokens,
    },
  ];

  const totalsWs = XLSX.utils.json_to_sheet(totalsData);

  const totalsRange = XLSX.utils.decode_range(totalsWs["!ref"]!);
  for (let C = totalsRange.s.c; C <= totalsRange.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: totalsRange.s.r, c: C });
    if (!totalsWs[address]) continue;
    totalsWs[address].s = { font: { bold: true } };
  }

  totalsWs["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];

  XLSX.utils.book_append_sheet(wb, totalsWs, "Totals");
  XLSX.utils.book_append_sheet(wb, instructorWs, "Per Instructor");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  if (returnBuffer) {
    return { buffer, blob };
  } else {
    return { blob };
  }
}
