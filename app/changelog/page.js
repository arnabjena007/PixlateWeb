import Link from 'next/link';
import fs from 'fs';
import path from 'path';

const Tag = ({ type }) => {
  const styles = {
    Fix: { bg: '#450a0a', text: '#fca5a5' },
    Improved: { bg: '#1e3a8a', text: '#bfdbfe' },
    New: { bg: '#064e3b', text: '#6ee7b7' }
  };
  const style = styles[type] || { bg: '#27272a', text: '#a1a1aa' };
  return (
    <span style={{ 
      backgroundColor: style.bg, 
      color: style.text, 
      padding: '2px 8px', 
      borderRadius: '6px', 
      fontSize: '11px', 
      fontWeight: 'bold', 
      textTransform: 'uppercase', 
      marginRight: '8px',
      display: 'inline-block',
      verticalAlign: 'middle',
    }}>
      {type}
    </span>
  );
};

function getChangelogData() {
  try {
    const filePath = path.join(process.cwd(), 'CHANGELOG.md');
    const md = fs.readFileSync(filePath, 'utf-8');
    const sections = md.split(/^## /m).slice(1);
    
    return sections.map(section => {
      const lines = section.trim().split('\n');
      const headerLine = lines[0];
      const [version, title] = headerLine.split(' - ').map(s => s?.trim());
      
      const dateLine = lines.find(l => l.startsWith('**Date**:'));
      const date = dateLine ? dateLine.replace('**Date**:', '').trim() : '';
      
      const tagsLine = lines.find(l => l.startsWith('**Tags**:'));
      const tags = tagsLine ? tagsLine.replace('**Tags**:', '').split(',').map(t => t.trim()) : [];
      
      const bullets = lines.filter(l => l.startsWith('- ')).map(l => l.replace('- ', '').trim());
      
      return { version, title, date, tags, bullets };
    });
  } catch (error) {
    console.error('Error parsing CHANGELOG.md:', error);
    return [];
  }
}

export default function ChangelogPage() {
  const updates = getChangelogData();

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
        <Link href="/privacy" style={{ textDecoration: 'none', color: '#a1a1aa', fontSize: '15px' }}>
          Privacy Policy →
        </Link>
      </nav>
      
      <h1 style={{ fontSize: '42px', marginBottom: '16px', fontWeight: '800', letterSpacing: '-0.02em' }}>Changelog</h1>
      <p style={{ color: '#a1a1aa', fontSize: '18px', marginBottom: '64px' }}>New updates and improvements to Pixlate.</p>
      
      <div style={{ position: 'relative', paddingLeft: '32px' }}>
        {/* Timeline vertical line */}
        <div style={{
          position: 'absolute',
          top: '6px',
          bottom: '0',
          left: '5px',
          width: '1px',
          backgroundColor: '#27272a'
        }}></div>

        {updates.map((update, index) => (
          <div key={index} style={{ position: 'relative', marginBottom: index === updates.length - 1 ? '0' : '64px' }}>
            {/* Timeline circle */}
            <div style={{
              position: 'absolute',
              left: '-32px',
              top: '6px',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              border: '2px solid #52525b',
              backgroundColor: 'var(--workspace-bg)',
              zIndex: 1
            }}></div>

            <div style={{ color: '#71717a', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
              {update.date}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', margin: 0, marginRight: '8px' }}>{update.title}</h2>
              {update.tags.map(tag => (
                <Tag key={tag} type={tag} />
              ))}
              <span style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', color: '#a1a1aa', fontWeight: '500', marginLeft: 'auto' }}>
                {update.version}
              </span>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#a1a1aa', fontSize: '14px', lineHeight: '1.7' }}>
              {update.bullets.map((bullet, i) => (
                <li key={i} style={{ position: 'relative', paddingLeft: '20px', marginBottom: '12px' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#52525b' }}>•</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      <div style={{ borderTop: '1px solid #27272a', paddingTop: '32px', marginTop: '80px', paddingBottom: '32px', fontSize: '14px', color: '#71717a', display: 'flex', justifyContent: 'space-between' }}>
        <span>Pixlate © 2026. All Rights Reserved.</span>
        <Link href="/" style={{ color: '#71717a', textDecoration: 'none' }}>Back to editor</Link>
      </div>
    </div>
  );
}
