"use server";

import * as XLSX from "xlsx-js-style";
import { getUsersData } from "./redis-actions";
import { formatWorksheet } from "./utils";
import { getUsersUsage, getUsersYesterdayUsage } from "./utils";
import { type ProviderData } from "@/types";

export async function getUsersDataXlsx(returnBuffer: boolean = false) {
  const MODELS = ["openai", "anthropic"];
  const usersData = await getUsersData();

  const openaiCurrentUsers = await getUsersUsage(usersData, MODELS[0]);
  const anthropicCurrentUsers = await getUsersUsage(usersData, MODELS[1]);

  const openaiYesterdayUsers = await getUsersYesterdayUsage(usersData, MODELS[0]);
  const anthropicYesterdayUsers = await getUsersYesterdayUsage(usersData, MODELS[1]);

  const currentData = usersData.map((user) => {
    const openaiData = openaiCurrentUsers.find((u) => u.userId === user.userId);
    const anthropicData = anthropicCurrentUsers.find((u) => u.userId === user.userId);

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

  const yesterdayData = usersData.map((user) => {
    const openaiData = openaiYesterdayUsers.find((u) => u.userId === user.userId);
    const anthropicData = anthropicYesterdayUsers.find((u) => u.userId === user.userId);

    return {
      Role: user.role,
      "Last name": user.lastName,
      "First name": user.firstName,
      Email: user.emailAddress,
      "Total ($)": (openaiData?.amount || 0) + (anthropicData?.amount || 0),
      "Anthropic tokens": anthropicData?.tokens ?? 0,
      "Anthropic amount ($)": anthropicData?.amount ?? 0,
      "OpenAI tokens": openaiData?.tokens ?? 0,
      "OpenAI amount ($)": openaiData?.amount ?? 0,
    };
  });

  const totalOpenaiTokens = openaiCurrentUsers.reduce((sum, user) => sum + user.tokens, 0);
  const totalOpenaiAmount = openaiCurrentUsers.reduce((sum, user) => sum + user.amount, 0);
  const totalAnthropicTokens = anthropicCurrentUsers.reduce((sum, user) => sum + user.tokens, 0);
  const totalAnthropicAmount = anthropicCurrentUsers.reduce((sum, user) => sum + user.amount, 0);

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
      "Average Token Price ($)":
        totalOpenaiTokens + totalAnthropicTokens === 0 ? 0 : (totalOpenaiAmount + totalAnthropicAmount) / (totalOpenaiTokens + totalAnthropicTokens),
    },
    {
      Model: "OpenAI (GPT)",
      "Total Tokens": totalOpenaiTokens,
      "Total Amount ($)": formatTotalAmount(totalOpenaiAmount),
      "Average Token Price ($)": totalOpenaiTokens === 0 ? 0 : totalOpenaiAmount / totalOpenaiTokens,
    },
    {
      Model: "Anthropic (Claude)",
      "Total Tokens": totalAnthropicTokens,
      "Total Amount ($)": formatTotalAmount(totalAnthropicAmount),
      "Average Token Price ($)": totalAnthropicTokens === 0 ? 0 : totalAnthropicAmount / totalAnthropicTokens,
    },
  ];

  const workbook = XLSX.utils.book_new();

  const currentWorksheet = XLSX.utils.json_to_sheet(currentData);
  formatWorksheet(currentWorksheet, [
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 25 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
  ]);
  XLSX.utils.book_append_sheet(workbook, currentWorksheet, "Current Usage");

  const yesterdayWorksheet = XLSX.utils.json_to_sheet(yesterdayData);
  formatWorksheet(yesterdayWorksheet, [{ wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]);
  XLSX.utils.book_append_sheet(workbook, yesterdayWorksheet, "Yesterday Usage");

  const totalsWorksheet = XLSX.utils.json_to_sheet(totalsData);
  formatWorksheet(totalsWorksheet, [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }]);
  XLSX.utils.book_append_sheet(workbook, totalsWorksheet, "Totals");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  if (returnBuffer) {
    return { buffer, blob };
  } else {
    return { blob };
  }
}
