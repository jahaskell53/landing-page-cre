"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, Globe, Shield, Zap } from "lucide-react";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '1rem', paddingTop: '1rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', width: '100%', maxWidth: '800px', height: '300px', marginBottom: '0.5rem' }}
          >
            <Image
              src="/mockup.jpg"
              alt="Product Mockup"
              fill
              style={{ objectFit: 'contain', objectPosition: 'center' }}
              priority
            />
          </motion.div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="hero-text-content"
            style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <motion.h1
              variants={fadeInUp}
              className="high-contrast font-kyoto"
              style={{ marginBottom: '1rem' }}
            >
              OpenMidmarket
            </motion.h1>
            <motion.div variants={fadeInUp} className="divider" style={{ maxWidth: '300px', margin: '0 auto 1rem auto' }} />
            <motion.h2
              variants={fadeInUp}
              style={{ maxWidth: '540px', marginBottom: '3.5rem', fontSize: '3rem', lineHeight: '1.2', fontWeight: 300, fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}
            >
              Together, stronger
            </motion.h2>
            <motion.div variants={fadeInUp} style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>Get Started</button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Text and Mockup Section */}
      <section style={{ margin: '4rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <p className="serif" style={{ fontSize: '2.5rem', lineHeight: '1.3' }}>
              OpenMidmarket <span style={{ fontWeight: 700 }}>empowers</span> CRE brokers
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            style={{ position: 'relative', width: '100%', height: '500px' }}
          >
            <Image
              src="/mockup-2.jpg"
              alt="Product Interface"
              fill
              style={{ objectFit: 'contain', objectPosition: 'center' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Trust and Transparency Section */}
      <section style={{ margin: '8rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h2 style={{ 
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              fontWeight: 400, 
              fontFamily: 'var(--font-sans)',
              marginBottom: '1.5rem',
              color: 'var(--foreground)'
            }}>
              OpenMidmarket
            </h2>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ 
                fontSize: 'clamp(3rem, 10vw, 6rem)',
                fontWeight: 700,
                fontFamily: 'var(--font-sans)',
                display: 'inline-block',
                lineHeight: '1.1',
                color: 'var(--foreground)'
              }}>
                fosters trust
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: 'var(--foreground)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '4px'
              }}>
                <ArrowUpRight size={24} color="var(--background)" />
              </div>
              <button style={{ 
                background: 'none', 
                border: 'none', 
                padding: 0,
                fontSize: '1rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 400,
                color: 'var(--foreground)',
                cursor: 'pointer'
              }}>
                Join Us Now
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <p style={{ 
              fontSize: '2.0rem', 
              lineHeight: '1.6', 
              color: 'var(--foreground)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 400
            }}>
              Ensures transparency, and levels the playing field in multifamily real estate—increasing market liquidity, sales volume, and maximizing return
            </p>
          </motion.div>
        </div>
      </section>

      {/* Built for Everyone Section */}
      <section id="features" style={{ margin: '12rem 0' }}>
        <h2 style={{ 
          fontSize: 'clamp(3rem, 10vw, 6rem)', 
          marginBottom: '4rem',
          fontFamily: 'var(--font-sans)',
          fontWeight: 400,
          color: 'var(--foreground)'
        }}>Built for Everyone</h2>
        <div className="divider" />

        {[
          { title: 'For Property Owners', desc: '' },
          { title: 'For Brokers', desc: '' },
          { title: 'For Property Managers', desc: '' },
          { title: 'For Lenders', desc: '' },
          { title: 'For Insurance Agencies', desc: '' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '3rem 0',
              borderBottom: '1px solid var(--border)',
              transition: 'background-color 0.3s ease'
            }}
            className="feature-row"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
              <span style={{ opacity: 0.4, fontFamily: 'var(--font-sans)' }}>0{index + 1}</span>
              <div>
                <h3 style={{ 
                  fontSize: '2rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 400,
                  color: 'var(--foreground)'
                }}>{item.title}</h3>
                {item.desc && <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-sans)' }}>{item.desc}</p>}
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '4rem' }}>
              <ArrowUpRight strokeWidth={1} size={32} />
            </div>
          </motion.div>
        ))}
      </section>

      {/* Visual Break */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: '60vh' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}
        >
          <Image src="/images/detail.png" alt="Detail" fill style={{ objectFit: 'cover' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}
        >
          <Image src="/images/office.png" alt="Office" fill style={{ objectFit: 'cover' }} />
        </motion.div>
      </section>

      {/* CTA Section */}
      <section id="contact" style={{ margin: '12rem 0', textAlign: 'center' }}>
        <h2 className="high-contrast font-kyoto" style={{ marginBottom: '4rem' }}>
          <span className="font-light">Begin Your</span> <br />
          <span className="cursive">Legacy</span>
        </h2>
        <p style={{ maxWidth: '500px', margin: '0 auto 3rem', fontSize: '1.2rem', color: 'var(--text-dim)' }}>
          Join the exclusive circle of realtors who define the future of the industry through the lens of timeless design.
        </p>
        <button className="btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1rem' }}>Request Invitation</button>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        <div style={{ letterSpacing: '0.1em' }}>
          © 2026 OM CRM. All Rights Reserved.
        </div>
        <div style={{ display: 'flex', gap: '2rem', letterSpacing: '0.1em' }}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Instagram</a>
        </div>
      </footer>

      <style jsx>{`
        .feature-row {
          border-radius: 8px;
        }
        .feature-row:hover {
          background-color: #fafafa;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
