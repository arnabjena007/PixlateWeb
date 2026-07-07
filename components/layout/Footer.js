export default function Footer() {
  return (
    <footer style={{
      position: 'relative',
      padding: '4rem 2rem',
      textAlign: 'center',
      color: '#ffffff', /* Changed back to white text for dark background */
      fontSize: '0.875rem',
      backgroundColor: '#09090B', /* Reverted to the dark background you specified */
      height: '500px', /* Increased height to show more of the artwork */
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("/footer-art-wide.png")',
        backgroundSize: '100% auto',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        mixBlendMode: 'screen',
        opacity: 0.9,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Text and links have been removed as requested */}
    </footer>
  );
}
