import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    const { to, message } = await req.json();

    if (!to || !message) {
      return NextResponse.json({ error: 'Missing "to" or "message" fields' }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhone) {
      console.warn("Twilio credentials not configured. Simulating SMS success.");
      // Soft fallback for hackathons/testing without actual Twilio env vars.
      return NextResponse.json({ success: true, simulated: true, sid: "SIMULATED_SID_12345" }, { status: 200 });
    }

    const client = twilio(accountSid, authToken);

    const response = await client.messages.create({
      body: message,
      from: fromPhone,
      to,
    });

    return NextResponse.json({ success: true, sid: response.sid }, { status: 200 });
  } catch (error: any) {
    console.error('Twilio Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
