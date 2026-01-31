export default function Footer() {
  return (
    <footer
      className="footer-mobile"
      style={{
        padding: '4rem 0',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.8rem'
      }}
    >
      <div style={{ letterSpacing: '0.1em' }}>
        © 2026 OM CRM. All Rights Reserved.
      </div>
      <div className="footer-links-mobile" style={{ display: 'flex', gap: '2rem', letterSpacing: '0.1em' }}>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">LinkedIn</a>
      </div>
    </footer>
  );
}
