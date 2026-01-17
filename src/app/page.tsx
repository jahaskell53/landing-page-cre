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
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center"
        >
          <motion.p variants={fadeInUp} className="serif cursive" style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-dim)' }}>
            The Renaissance of Digital Editorialism
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="high-contrast"
            style={{ marginBottom: '2rem' }}
          >
            The Art of <br />
            <span className="serif cursive">Relationship</span>
          </motion.h1>
          <motion.div variants={fadeInUp} className="divider" style={{ maxWidth: '300px', margin: '0 auto 2rem' }} />
          <motion.p variants={fadeInUp} style={{ maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.25rem', lineHeight: '1.5', color: 'var(--text-dim)' }}>
            A CRM for the modern realtor who values precision, elegance, and the historical depth of meaningful connections.
          </motion.p>
          <motion.div variants={fadeInUp} style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <button className="btn-primary">Inquire Now</button>
            <button style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              View Portfolio <ArrowUpRight size={16} />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Imagery Section */}
      <section style={{ margin: '4rem 0' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden', borderRadius: '4px' }}
        >
          <Image
            src="/images/hero.png"
            alt="Luxury Living"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white' }}>
            <p className="serif" style={{ fontSize: '1.5rem', opacity: 0.8 }}>Curated Environments for Elite Success</p>
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" style={{ margin: '12rem 0' }}>
        <div className="feature-grid">
          <div className="feature-item" style={{ gridColumn: 'span 5' }}>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="serif"
              style={{ fontSize: '4rem', lineHeight: '1.1' }}
            >
              Architectural <br />
              <span className="cursive">Precision</span>
            </motion.h2>
          </div>
          <div className="feature-item" style={{ gridColumn: 'span 7', paddingTop: '4rem' }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              style={{ fontSize: '1.5rem', lineHeight: '1.6', marginBottom: '2rem' }}
            >
              We believe that lead management is more than just data. It is the orchestration of human potential. Our platform provides the structural integrity required to build a legacy in real estate.
            </motion.p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Heritage</h4>
                <p style={{ color: 'var(--text-dim)' }}>Built on the principles of classic editorial design and modern technical infrastructure.</p>
              </div>
              <div>
                <h4 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Innovation</h4>
                <p style={{ color: 'var(--text-dim)' }}>Utilizing high-end animations and responsive scaling to ensure your brand feels premium on every device.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Table / List (EigenLayer Style) */}
      <section id="features" style={{ margin: '12rem 0' }}>
        <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '4rem' }}>Systemic Elegance</h2>
        <div className="divider" />

        {[
          { icon: <Zap size={24} />, title: 'Direct Response', desc: 'Real-time automation that feels personal and crafted.', status: 'Active' },
          { icon: <Shield size={24} />, title: 'Estate Vault', desc: 'Secure, high-contrast storage for confidential client portfolios.', status: 'Encrypted' },
          { icon: <Globe size={24} />, title: 'Global Reach', desc: 'Connect with international markets using automated translation.', status: 'Live' },
          { icon: <CheckCircle2 size={24} />, title: 'Precision Analytics', desc: 'Detailed insights into your network growth and efficiency.', status: 'Verified' },
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
              <span style={{ opacity: 0.4 }}>0{index + 1}</span>
              <div>
                <h3 className="serif" style={{ fontSize: '2rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-dim)' }}>{item.desc}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '4rem' }}>
              <span className="serif cursive" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>{item.status}</span>
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
          style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px' }}
        >
          <Image src="/images/detail.png" alt="Detail" fill style={{ objectFit: 'cover' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px' }}
        >
          <Image src="/images/office.png" alt="Office" fill style={{ objectFit: 'cover' }} />
        </motion.div>
      </section>

      {/* CTA Section */}
      <section id="contact" style={{ margin: '12rem 0', textAlign: 'center' }}>
        <h2 className="high-contrast serif" style={{ marginBottom: '4rem' }}>
          Begin Your <br />
          <span className="cursive">Legacy</span>
        </h2>
        <p style={{ maxWidth: '500px', margin: '0 auto 3rem', fontSize: '1.2rem', color: 'var(--text-dim)' }}>
          Join the exclusive circle of realtors who define the future of the industry through the lens of timeless design.
        </p>
        <button className="btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1rem' }}>Request Invitation</button>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          © 2026 Renaissance CRM. All Rights Reserved.
        </div>
        <div style={{ display: 'flex', gap: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Instagram</a>
        </div>
      </footer>

      <style jsx>{`
        .feature-row:hover {
          background-color: #fafafa;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
