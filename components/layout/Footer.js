export default function Footer() {
  return (
    <footer style={{
      position: 'relative',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 2rem',
      textAlign: 'center',
      color: '#ffffff',
      fontSize: '0.875rem',
      backgroundColor: 'var(--workspace-bg)',
      overflow: 'hidden'
    }}>
      {/* Jagged Generative Art Side Image */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: 0,
        bottom: '-10%',
        width: '600px',
        backgroundImage: 'url("/footer-art.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        zIndex: 0,
        mixBlendMode: 'lighten',
        opacity: 0.9,
        maskImage: 'linear-gradient(to right, transparent, black 30%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontWeight: 500 }}>
          &copy; {new Date().getFullYear()} Pixlate. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 500 }}>
          <a href="https://github.com/arnabjena007/PixlateWeb" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = 0.7} onMouseOut={(e) => e.currentTarget.style.opacity = 1}>
            GitHub
          </a>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = 0.7} onMouseOut={(e) => e.currentTarget.style.opacity = 1}>
            Twitter
          </a>
          <a href="/about" style={{ color: '#ffffff', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = 0.7} onMouseOut={(e) => e.currentTarget.style.opacity = 1}>
            About
          </a>
        </div>
      </div>
    </footer>
  );
}
