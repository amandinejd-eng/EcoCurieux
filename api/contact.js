export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const {
      name,
      email,
      projectType,
      message,
      audience,
      hp
    } = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) || {};

    if (hp) {
      return res.status(200).json({ ok: true });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'missing_fields' });
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || 'amandinejd@gmail.com';
    const fromEmail = process.env.CONTACT_FROM_EMAIL || toEmail;
    const fromName = process.env.CONTACT_FROM_NAME || 'EcoCurieux';

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ ok: false, error: 'missing_email_provider_config' });
    }

    const subject = `Demande de contact — ${projectType || 'EcoCurieux'} — ${name}`;

    const safe = (v) => String(v || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const htmlContent = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#222">
        <div style="margin-bottom:16px">
          <div style="font-size:18px;font-weight:700">Nouvelle demande de contact — EcoCurieux</div>
          <div style="font-size:13px;color:#666">Animation nature & biodiversité</div>
        </div>

        <div style="background:#f6f6f6;border:1px solid #e6e6e6;border-radius:10px;padding:14px">
          <div><strong>Nom :</strong> ${safe(name)}</div>
          <div><strong>Email :</strong> ${safe(email)}</div>
          ${audience ? `<div><strong>Vous êtes :</strong> ${safe(audience)}</div>` : ''}
          ${projectType ? `<div><strong>Type de projet :</strong> ${safe(projectType)}</div>` : ''}
          <div style="margin-top:12px"><strong>Message :</strong></div>
          <div style="white-space:pre-wrap">${safe(message)}</div>
        </div>

        <div style="margin-top:14px;font-size:12px;color:#666">
          Envoyé depuis le formulaire de contact EcoCurieux.
        </div>
      </div>
    `;

    const payload = {
      sender: { name: fromName, email: fromEmail },
      to: [{ email: toEmail }],
      replyTo: { email: email, name: name },
      subject,
      htmlContent
    };

    const brevoResp = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!brevoResp.ok) {
      const errText = await brevoResp.text().catch(() => '');
      return res.status(502).json({ ok: false, error: 'email_send_failed', details: errText.slice(0, 500) });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
