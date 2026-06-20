'use client';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '60px 24px',
      color: 'var(--text-primary)',
      lineHeight: '1.6'
    }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#a1a1aa', fontSize: '15px' }}>
          ← Back to Pixlate
        </Link>
        <Link href="/changelog" style={{ textDecoration: 'none', color: '#a1a1aa', fontSize: '15px' }}>
          Changelog →
        </Link>
      </nav>
      
      <h1 style={{ fontSize: '42px', marginBottom: '16px', fontWeight: '800', letterSpacing: '-0.02em' }}>Privacy Policy</h1>
      <p style={{ color: '#a1a1aa', fontSize: '16px', marginBottom: '24px' }}>Plain English. No dark patterns. No surprises.</p>
      
      <p style={{ color: '#71717a', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '40px' }}>
        Last updated: May 20, 2026
      </p>
      
      <div style={{ 
        backgroundColor: '#042f2e', 
        border: '1px solid #0f766e', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '48px' 
      }}>
        <h2 style={{ color: '#2dd4bf', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>TL;DR</h2>
        <p style={{ color: '#ccfbf1', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
          The images and videos you upload <strong style={{ color: '#fff' }}>never leave your browser</strong>. There is no server that sees, stores, or processes your media — everything runs on your own device. We don't track who you are, we don't sell anything, and we don't have advertisers.
        </p>
      </div>

      <div style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: '1.7' }}>
        <h2 style={{ fontSize: '20px', marginTop: '40px', marginBottom: '16px', fontWeight: 'bold', color: '#fff' }}>1. Who runs this site</h2>
        <p style={{ marginBottom: '24px' }}>
          Pixlate is an independent, free, browser-based tool built and maintained by one person. There is no company, no team, and no parent organization. Contact: <a href="https://github.com/arnabjena007" style={{ color: '#a855f7', textDecoration: 'none' }}>arnabjena007</a>.
        </p>

        <h2 style={{ fontSize: '20px', marginTop: '40px', marginBottom: '16px', fontWeight: 'bold', color: '#fff' }}>2. Your images and videos</h2>
        <p style={{ marginBottom: '16px' }}>This is the part people ask about most, so it gets a clear answer:</p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '8px' }}>Nothing you upload is ever sent to a server. The file you drag in, paste, or pick from your computer is read directly into your browser's memory and rendered there. No upload step. No copy on disk. No copy in the cloud.</li>
          <li style={{ marginBottom: '8px' }}>When you close the tab or refresh, the image is gone. We have no way to recover it because we never had it.</li>
          <li style={{ marginBottom: '8px' }}>This is true for every style, every effect, every export (PNG, JPG) — exports are generated in your browser and downloaded straight to your device.</li>
          <li style={{ marginBottom: '8px' }}>The demo gallery images are public assets served from this site. They are not images other users uploaded.</li>
        </ul>

        <h2 style={{ fontSize: '20px', marginTop: '40px', marginBottom: '16px', fontWeight: 'bold', color: '#fff' }}>3. What we store on your device</h2>
        <p style={{ marginBottom: '24px' }}>
          The site uses your browser's localStorage to remember tiny preferences. These never leave your machine. Clearing site data in your browser settings removes these instantly.
        </p>

        <h2 style={{ fontSize: '20px', marginTop: '40px', marginBottom: '16px', fontWeight: 'bold', color: '#fff' }}>4. Cookies</h2>
        <p style={{ marginBottom: '24px' }}>
          There are no advertising cookies, no third-party tracking cookies, and no marketing pixels used on this site.
        </p>

        <h2 style={{ fontSize: '20px', marginTop: '40px', marginBottom: '16px', fontWeight: 'bold', color: '#fff' }}>5. Third parties that may receive data</h2>
        <p style={{ marginBottom: '24px' }}>
          <strong>Vercel</strong> — hosts the site. Like any web host, it sees each request's IP address, browser user-agent, and the URL requested, and keeps short-lived server logs. See Vercel's privacy policy.
          <br /><br />
          That is the complete list. No advertisers, no data brokers, no social-media trackers.
        </p>

        <h2 style={{ fontSize: '20px', marginTop: '40px', marginBottom: '16px', fontWeight: 'bold', color: '#fff' }}>6. No accounts, no payments</h2>
        <p style={{ marginBottom: '24px' }}>
          Pixlate has no sign-up, no login, no subscription, and no payments. We do not collect names, email addresses, billing information, or any identity data — there is nowhere on the site to enter it.
        </p>

        <h2 style={{ fontSize: '20px', marginTop: '40px', marginBottom: '16px', fontWeight: 'bold', color: '#fff' }}>7. Children</h2>
        <p style={{ marginBottom: '24px' }}>
          The site is suitable for general audiences but is not specifically directed at children under 13. We don't knowingly collect any data from children, since we collect no identifying data from anyone.
        </p>

        <h2 style={{ fontSize: '20px', marginTop: '40px', marginBottom: '16px', fontWeight: 'bold', color: '#fff' }}>8. Your rights</h2>
        <p style={{ marginBottom: '24px' }}>
          Because we do not store identifying information about you and have no account system, there is no profile to access, correct, or delete.
        </p>

        <h2 style={{ fontSize: '20px', marginTop: '40px', marginBottom: '16px', fontWeight: 'bold', color: '#fff' }}>9. Changes to this policy</h2>
        <p style={{ marginBottom: '24px' }}>
          If this policy materially changes, the "Last updated" date at the top of this page will change.
        </p>

        <h2 style={{ fontSize: '20px', marginTop: '40px', marginBottom: '16px', fontWeight: 'bold', color: '#fff' }}>10. Contact</h2>
        <p style={{ marginBottom: '48px' }}>
          Questions, deletion requests, or anything else: Contact via GitHub (<a href="https://github.com/arnabjena007" style={{ color: '#a855f7', textDecoration: 'none' }}>arnabjena007</a>).
        </p>
      </div>

      <div style={{ borderTop: '1px solid #27272a', paddingTop: '32px', paddingBottom: '32px', fontSize: '14px', color: '#71717a', display: 'flex', justifyContent: 'space-between' }}>
        <span>Pixlate © 2026. All Rights Reserved.</span>
        <Link href="/" style={{ color: '#71717a', textDecoration: 'none' }}>Back to editor</Link>
      </div>
    </div>
  );
}
