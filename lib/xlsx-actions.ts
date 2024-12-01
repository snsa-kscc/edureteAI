"use server";

import * as XLSX from "xlsx-js-style";
import { getUsersData } from "./redis-actions";
import { getUsersUsage } from "./utils";
import { getUsersUsageNeon } from "./utils";

type ProviderData =
  | {
      userId: string;
      tokens: number;
      amount: number;
      limit: number;
    }
  | undefined;

export async function getUsersDataXlsx(returnBuffer: boolean = false) {
  const MODELS = ["openai", "anthropic"];
  const usersData = await getUsersData();

  const openaiUsers = await getUsersUsageNeon(usersData, MODELS[0]);
  const anthropicUsers = await getUsersUsageNeon(usersData, MODELS[1]);

  const combinedData = usersData.map((user) => {
    const openaiData = openaiUsers.find((u) => u.userId === user.userId);
    const anthropicData = anthropicUsers.find((u) => u.userId === user.userId);

    function getPercentageObject(data: ProviderData) {
      const percentage = data?.limit === 0 ? 0 : ((data!.limit - data!.amount) / data!.limit) * 100;
      return {
        v: percentage,
        t: "n",
        s: percentage < 10 ? { fill: { fgColor: { rgb: "FFFF0000" } } } : {},
      };
    }

    return {
      Role: user.role,
      "Last name": user.lastName,
      "First name": user.firstName,
      Email: user.emailAddress,
      "Total ($)": openaiData!.amount + anthropicData!.amount,
      "Anthropic num of tokens": anthropicData?.tokens ?? 0,
      "Anthropic amount ($)": anthropicData?.amount ?? 0,
      "Anthropic limit": anthropicData?.limit ?? 0,
      "Anthropic % of limit left": getPercentageObject(anthropicData),
      "OpenAI num of tokens": openaiData?.tokens ?? 0,
      "OpenAI amount ($)": openaiData?.amount ?? 0,
      "OpenAI limit": openaiData?.limit ?? 0,
      "OpenAI % of limit left": getPercentageObject(openaiData),
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

  const totalOpenaiTokens = openaiUsers.reduce((sum, user) => sum + user.tokens, 0);
  const totalOpenaiAmount = openaiUsers.reduce((sum, user) => sum + user.amount, 0);
  const totalAnthropicTokens = anthropicUsers.reduce((sum, user) => sum + user.tokens, 0);
  const totalAnthropicAmount = anthropicUsers.reduce((sum, user) => sum + user.amount, 0);

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
      "Total Tokens": totalOpenaiTokens + totalAnthropicTokens,
      "Total Amount ($)": totalOpenaiAmount + totalAnthropicAmount,
      "Average Token Price ($)": (totalOpenaiAmount + totalAnthropicAmount) / (totalOpenaiTokens + totalAnthropicTokens),
    },
    {
      Model: "OpenAI (GPT)",
      "Total Tokens": totalOpenaiTokens,
      "Total Amount ($)": formatTotalAmount(totalOpenaiAmount),
      "Average Token Price ($)": totalOpenaiAmount / totalOpenaiTokens,
    },
    {
      Model: "Anthropic (Claude)",
      "Total Tokens": totalAnthropicTokens,
      "Total Amount ($)": formatTotalAmount(totalAnthropicAmount),
      "Average Token Price ($)": totalAnthropicAmount / totalAnthropicTokens,
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
