export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '2rem',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.875rem',
      backgroundColor: 'var(--workspace-bg)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          &copy; {new Date().getFullYear()} Pixlate. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="https://github.com/arnabjena007/PixlateWeb" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            GitHub
          </a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            Twitter
          </a>
          <a href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            About
          </a>
        </div>
      </div>
    </footer>
  );
}
