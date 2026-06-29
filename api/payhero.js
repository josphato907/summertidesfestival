export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, phone_number, external_reference, description } = req.body;

  const PAYHERO_URL = 'https://backend.payhero.co.ke/api/v2/payments';
  const PAYHERO_AUTH = 'Basic eXQ3ejV2Z2F0WVdYUGd5bFRmT206TzNRY1EycXVpN0diUGJrSGhidHlYQ1dmZ3NqVHNWNkwwUmZ0d21CbQ==';
  const PAYHERO_CHANNEL_ID = 5306;
  
  // We specify a callback URL to the same domain (Vercel automatically sets x-forwarded-host)
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const PAYHERO_CALLBACK_URL = `${protocol}://${host}/api/callback`;

  try {
    const response = await fetch(PAYHERO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': PAYHERO_AUTH,
      },
      body: JSON.stringify({
        amount,
        phone_number,
        channel_id: PAYHERO_CHANNEL_ID,
        provider: 'm-pesa',
        external_reference,
        callback_url: PAYHERO_CALLBACK_URL,
        description,
      }),
    });

    const data = await response.json();
    return res.status(response.status || 200).json(data);
  } catch (error) {
    console.error("PayHero Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
