import * as XLSX from "xlsx-js-style";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { getUserQuota } from "./redis-actions";
import { getYesterdayUsage, getUserQuota as getUserQuotaNeon } from "./neon-actions";
import { type UserData } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleModelProvider(model: string) {
  if (model.startsWith("claude")) {
    return anthropic(model);
  } else {
    return openai(model);
  }
}

export function formatWorksheet(worksheet: XLSX.WorkSheet, columnWidths: { wch: number }[]) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]!);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: range.s.r, c: C });
    if (!worksheet[address]) continue;
    worksheet[address].s = { font: { bold: true } };
  }
  worksheet["!cols"] = columnWidths;
  return worksheet;
}

export function tokensToDollars(tokens: number): number {
  return Number((tokens / 66_666).toFixed(4));
}

export function dollarsToTokens(dollars: number): number {
  return Math.round(dollars * 66_666);
}

export async function getUsersUsage(usersData: UserData[], model: string) {
  const res = await Promise.all(
    usersData.map(async ({ firstName, lastName, emailAddress, userId }) => {
      const { totalTokensUsed, quotaLimit } = await getUserQuota(userId, model);
      return {
        userId,
        firstName,
        lastName,
        emailAddress,
        tokens: totalTokensUsed,
        amount: tokensToDollars(totalTokensUsed),
        limit: tokensToDollars(quotaLimit),
      };
    })
  );
  return res;
}

export async function getUsersUsageNeon(usersData: UserData[], modelFamily: string) {
  const res = await Promise.all(
    usersData.map(async ({ userId }) => {
      const { totalTokensUsed, totalCost, quotaLimit } = await getUserQuotaNeon(userId, modelFamily);
      return {
        userId,
        tokens: totalTokensUsed,
        amount: +totalCost,
        limit: +quotaLimit,
      };
    })
  );
  return res;
}

export async function getUsersYesterdayUsage(usersData: UserData[], modelFamily: string) {
  const res = await Promise.all(
    usersData.map(async ({ userId }) => {
      const { totalTokens, totalCost } = await getYesterdayUsage(userId, modelFamily);
      return {
        userId,
        tokens: +totalTokens,
        amount: +totalCost,
      };
    })
  );
  return res;
}
