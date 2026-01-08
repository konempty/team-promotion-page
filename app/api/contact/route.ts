import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, message } = await request.json()

    // Validate input
    if (!email || !message) {
      return NextResponse.json({ error: "Email and message are required" }, { status: 400 })
    }

    // TODO: Replace with your Slack webhook URL
    const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

    if (SLACK_WEBHOOK_URL) {
      // Send to Slack
      await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `새로운 문의가 접수되었습니다`,
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "🔔 새로운 문의",
              },
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*이메일:*\n${email}`,
                },
                {
                  type: "mrkdwn",
                  text: `*시간:*\n${new Date().toLocaleString("ko-KR")}`,
                },
              ],
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*문의 내용:*\n${message}`,
              },
            },
          ],
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
