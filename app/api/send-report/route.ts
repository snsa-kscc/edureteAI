import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getUsersDataXlsx } from "@/lib/xlsx-actions";
import { headers } from "next/headers";

export async function GET(req: Request) {
  const headersList = headers();
  const cronToken = headersList.get("authorization");

  if (cronToken !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { buffer } = await getUsersDataXlsx();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0].replace(/:/g, "-");

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_TO,
      subject: "edureteAI App Daily Report",
      text: "Please find attached the daily report.",
      html: `
      <h1>Daily Report</h1>
      <p>Please find attached the daily report.</p>
      <p>Best Regards,</p>
      <p>edureteAI App</p>
      `,
      attachments: [
        {
          filename: `edureteAI-report-${formattedDate}_${formattedTime}_UTC.xlsx`,
          content: buffer,
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return new NextResponse("Report sent successfully", { status: 200 });
  } catch (error) {
    console.error("Error generating report:", error);
    return new NextResponse("Error generating report", { status: 500 });
  }
}
