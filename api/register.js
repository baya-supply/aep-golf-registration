export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    teamName, company, captainName, captainEmail, captainPhone,
    dietary, paymentMethod, registrationType, players, playerCount,
    totalExGST, totalIncGST, submittedAt
  } = req.body;

  if (!teamName || !company || !captainName || !captainEmail || !players?.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const ref = 'AEP-2026-' + String(Math.floor(Math.random() * 9000) + 1000);
  const submittedDate = new Date(submittedAt).toLocaleString('en-AU', {
    timeZone: 'Australia/Brisbane',
    dateStyle: 'short',
    timeStyle: 'short'
  });

  const playerSummary = players
    .map((p, i) => `${i + 1}. ${p.name || '(unnamed)'}${p.isCaptain ? ' (C)' : ''} | HCP: ${p.handicap || '-'} | Shirt: ${p.shirt || '-'}`)
    .join('\n');

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/tblgtkJYRzaQ8cGWj`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Ref': ref,
            'Submitted': submittedDate,
            'Team Name': teamName,
            'Company': company,
            'Captain Name': captainName,
            'Captain Email': captainEmail,
            'Captain Phone': captainPhone || '',
            'Players': playerCount,
            'Ex GST': totalExGST,
            'Inc GST': totalIncGST,
            'Payment Method': paymentMethod === 'eft' ? 'Bank Transfer (EFT)' : 'Invoice',
            'Registration Type': registrationType,
            'Dietary / Notes': dietary || '',
            'Player Details': playerSummary,
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Airtable error:', err);
      throw new Error('Airtable write failed');
    }

    return res.status(200).json({ ref });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}
