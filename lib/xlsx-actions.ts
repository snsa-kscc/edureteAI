"use server";

import * as XLSX from "xlsx-js-style";
import { getUsersData } from "./redis-actions";
import { getUsersUsage, getUsersYesterdayUsage, getUniqueFamilies } from "./utils";
import { type ProviderData } from "@/types";

export async function getUsersDataXlsx(returnBuffer: boolean = false) {
  const MODEL_FAMILY = getUniqueFamilies();
  const usersData = await getUsersData();

  const currentUsageByFamily = await Promise.all(MODEL_FAMILY.map((family) => getUsersUsage(usersData, family)));
  const yesterdayUsageByFamily = await Promise.all(MODEL_FAMILY.map((family) => getUsersYesterdayUsage(usersData, family)));

  const currentData = usersData.map((user) => {
    const modelData = MODEL_FAMILY.reduce((acc, family, index) => {
      const data = currentUsageByFamily[index].find((u) => u.userId === user.userId);
      return {
        ...acc,
        [`${family} num of tokens`]: data?.tokens ?? 0,
        [`${family} amount ($)`]: data?.amount ?? 0,
        [`${family} limit`]: data?.limit ?? 0,
        [`${family} % of limit left`]: getPercentageObject(data),
      };
    }, {});

    return {
      Role: user.role,
      "Last name": user.lastName,
      "First name": user.firstName,
      Email: user.emailAddress,
      Joined: user.createdAt,
      "Total ($)": currentUsageByFamily.reduce((sum, familyData) => {
        const userData = familyData.find((u) => u.userId === user.userId);
        return sum + (userData?.amount || 0);
      }, 0),
      ...modelData,
    };
  });

  const yesterdayData = usersData.map((user) => {
    const modelData = MODEL_FAMILY.reduce((acc, family, index) => {
      const data = yesterdayUsageByFamily[index].find((u) => u.userId === user.userId);
      return {
        ...acc,
        [`${family} tokens`]: data?.tokens ?? 0,
        [`${family} amount ($)`]: data?.amount ?? 0,
      };
    }, {});

    return {
      Role: user.role,
      "Last name": user.lastName,
      "First name": user.firstName,
      Email: user.emailAddress,
      Joined: user.createdAt,
      "Total ($)": yesterdayUsageByFamily.reduce((sum, familyData) => {
        const userData = familyData.find((u) => u.userId === user.userId);
        return sum + (userData?.amount || 0);
      }, 0),
      ...modelData,
    };
  });

  const totalsData = [
    {
      Model: "Grand Total",
      "Total Tokens": currentUsageByFamily.reduce((sum, familyData) => sum + familyData.reduce((familySum, user) => familySum + user.tokens, 0), 0),
      "Total Amount ($)": currentUsageByFamily.reduce((sum, familyData) => sum + familyData.reduce((familySum, user) => familySum + user.amount, 0), 0),
      "Average Token Price ($)": (() => {
        const totalTokens = currentUsageByFamily.reduce((sum, familyData) => sum + familyData.reduce((familySum, user) => familySum + user.tokens, 0), 0);
        const totalAmount = currentUsageByFamily.reduce((sum, familyData) => sum + familyData.reduce((familySum, user) => familySum + user.amount, 0), 0);
        return totalTokens === 0 ? 0 : totalAmount / totalTokens;
      })(),
    },
    ...MODEL_FAMILY.map((family) => {
      const familyIndex = MODEL_FAMILY.indexOf(family);
      const familyData = currentUsageByFamily[familyIndex];
      const totalTokens = familyData.reduce((sum, user) => sum + user.tokens, 0);
      const totalAmount = familyData.reduce((sum, user) => sum + user.amount, 0);

      return {
        Model: `${family}`,
        "Total Tokens": totalTokens,
        "Total Amount ($)": formatTotalAmount(totalAmount),
        "Average Token Price ($)": totalTokens === 0 ? 0 : totalAmount / totalTokens,
      };
    }),
  ];

  const baseColumnWidths = [{ wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 12 }];
  const modelColumnWidths = MODEL_FAMILY.flatMap(() => Array(4).fill({ wch: 12 }));

  const workbook = XLSX.utils.book_new();

  const currentWorksheet = XLSX.utils.json_to_sheet(currentData);
  formatWorksheet(currentWorksheet, [...baseColumnWidths, ...modelColumnWidths]);
  XLSX.utils.book_append_sheet(workbook, currentWorksheet, "Current Usage");

  const yesterdayWorksheet = XLSX.utils.json_to_sheet(yesterdayData);
  formatWorksheet(yesterdayWorksheet, [...baseColumnWidths, ...modelColumnWidths]);
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

function getPercentageObject(data: ProviderData) {
  const percentage = data?.limit === 0 ? 0 : ((data!.limit - data!.amount) / data!.limit) * 100;
  return {
    v: percentage,
    t: "n",
    s: percentage < 10 ? { fill: { fgColor: { rgb: "FFFF0000" } } } : {},
  };
}

function formatTotalAmount(amount: number) {
  return {
    v: amount,
    t: "n",
    s: amount > 15 ? { fill: { fgColor: { rgb: "FFFFFF00" } } } : {},
  };
}

function formatWorksheet(worksheet: XLSX.WorkSheet, columnWidths: { wch: number }[]) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]!);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: range.s.r, c: C });
    if (!worksheet[address]) continue;
    worksheet[address].s = { font: { bold: true } };
  }
  worksheet["!cols"] = columnWidths;
  return worksheet;
}
