const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const twilio = require('twilio');

// Initialize Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Simulated Blockchain Validation
const validateIncident = async (req, res) => {
  const { incidentId, type, location } = req.body;

  try {
    const confidenceScore = Math.random() * 0.3 + 0.7;
    const blockchainHash = crypto.createHash('sha256')
      .update(`${incidentId}-${Date.now()}-${location}`)
      .digest('hex');

    const log = await prisma.verificationLog.create({
      data: {
        incidentId: parseInt(incidentId),
        status: confidenceScore > 0.8 ? 'validated' : 'pending',
        blockchainHash: `0x${blockchainHash}`,
        confidenceScore: parseFloat(confidenceScore.toFixed(2)),
        consensusCount: Math.floor(Math.random() * 5) + 1
      }
    });

    if (confidenceScore > 0.8) {
      await prisma.incident.update({
        where: { id: parseInt(incidentId) },
        data: { verified: true }
      });
    }

    res.status(200).json({ success: true, log });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Real Twilio SMS Dispatch
const logSMS = async (req, res) => {
  const { incidentId, phoneNumber, message } = req.body;

  try {
    let targetNumber = phoneNumber || twilioNumber;
    if (targetNumber && !targetNumber.startsWith('+')) {
      targetNumber = `+91${targetNumber}`;
    }

    let twilioResponse;
    try {
      twilioResponse = await client.messages.create({
        body: message,
        from: twilioNumber.startsWith('+') ? twilioNumber : `+91${twilioNumber}`,
        to: targetNumber
      });
    } catch (twError) {
      console.error('Twilio API call failed:', twError.message);
    }
    
    const smsLog = await prisma.sMSLog.create({
      data: {
        incidentId: incidentId ? parseInt(incidentId) : null,
        phoneNumber: targetNumber,
        message,
        status: twilioResponse ? 'sent' : 'failed',
        provider: 'Twilio Live Gateway'
      }
    });

    res.status(200).json({ success: true, smsLog, sid: twilioResponse?.sid });
  } catch (error) {
    console.error('SMS Log error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Real Twilio SMS Reception (Webhook)
const receiveSMS = async (req, res) => {
  const { From, Body } = req.body;
  const MessagingResponse = twilio.twiml.MessagingResponse;
  const twiml = new MessagingResponse();

  try {
    console.log(`Received SMS from ${From}: ${Body}`);

    await prisma.sMSLog.create({
      data: {
        phoneNumber: From,
        message: Body,
        status: 'received',
        provider: 'Twilio Public Incoming'
      }
    });

    await prisma.verificationLog.create({
      data: {
        incidentId: Math.floor(Math.random() * 1000) + 5000,
        status: 'pending',
        blockchainHash: `0x${crypto.randomBytes(16).toString('hex')}`,
        confidenceScore: 0.85,
        consensusCount: 1
      }
    });

    twiml.message('ResQNav: Accident report received. Thank you for contributing to crowd consensus. Verification in progress.');
    res.type('text/xml').send(twiml.toString());
  } catch (error) {
    console.error('Receive SMS error:', error);
    twiml.message('ResQNav: Error processing report. Please try again.');
    res.type('text/xml').send(twiml.toString());
  }
};

const getLogs = async (req, res) => {
  try {
    const vLogs = await prisma.verificationLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20
    });
    const sLogs = await prisma.sMSLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20
    });
    res.status(200).json({ success: true, verificationLogs: vLogs, smsLogs: sLogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  validateIncident,
  logSMS,
  receiveSMS,
  getLogs
};
