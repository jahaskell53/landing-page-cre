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
    <>
      {/* Hero Section */}
      <section className="hero-section hero-section-mobile" style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        alignItems: 'center',
        paddingTop: '100px'
      }}>
        {/* Left Side - Text */}
        <div className="hero-left-mobile" style={{ paddingLeft: '1rem', paddingRight: '2rem' }}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '800px', marginLeft: 'auto' }}
          >
            <motion.h1
              variants={fadeInUp}
              style={{ 
                fontSize: 'clamp(3rem, 10vw, 6rem)', 
                lineHeight: '1.1',
                fontFamily: 'var(--font-sans)',
                fontWeight: 400,
                color: 'var(--foreground)',
                marginBottom: '2rem'
              }}
            >
              <span style={{ fontFamily: 'var(--font-kyoto)', fontStyle: 'italic' }}>Deals</span> you can't find anywhere else
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              style={{ 
                fontSize: '1.75rem',
                lineHeight: '1.6',
                fontFamily: 'var(--font-sans)',
                fontWeight: 400,
                color: 'var(--foreground)',
                opacity: 0.8,
                maxWidth: '600px'
              }}
            >
              The only professional network built for the midmarket. Find local news, vacancies, and listings, designed for you.
            </motion.p>
          </motion.div>
        </div>

        {/* Right Side - Background Image with Mockup */}
        <motion.div
          className="hero-right-mobile"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            right: 0,
            top: '100px',
            width: '50vw',
            height: 'calc(100vh - 100px)',
            overflow: 'visible'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/handshake.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 2
          }}>
            {/* Glow effect behind the mockup */}
            <div style={{
              position: 'absolute',
              width: '80%',
              height: '60%',
              background: 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, transparent 70%)',
              filter: 'blur(40px)',
              zIndex: 1,
              opacity: 0.6
            }} />
            {/* Floating emails/history component - upper left */}
            <div style={{ 
              position: 'absolute', 
              left: '-15%',
              top: '3%',
              width: '50%', 
              height: 'auto',
              zIndex: 3,
              filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.3))'
            }}>
              <Image
                src="/emails-cropped.png"
                alt="Emails"
                width={900}
                height={700}
                style={{ objectFit: 'contain', objectPosition: 'center', width: '100%', height: 'auto' }}
                priority
              />
            </div>
            {/* Floating map component - center right */}
            <div style={{ 
              position: 'absolute', 
              left: '15%',
              top: '30%',
              width: '35%', 
              height: 'auto',
              zIndex: 2,
              filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.3))'
            }}>
              <Image
                src="/map-cropped.png"
                alt="Map"
                width={1000}
                height={800}
                style={{ objectFit: 'contain', objectPosition: 'center', width: '100%', height: 'auto' }}
                priority
              />
            </div>
            {/* Floating article component - bottom left extending past edge */}
            <div style={{ 
              position: 'absolute', 
              left: '-20%',
              bottom: '5%',
              width: '110%', 
              height: 'auto',
              zIndex: 2,
              filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.3))'
            }}>
              <Image
                src="/article-cropped.png"
                alt="Article"
                width={1200}
                height={900}
                style={{ objectFit: 'contain', objectPosition: 'center', width: '100%', height: 'auto' }}
                priority
              />
            </div>
          </div>
        </motion.div>
      </section>

    <main className="container">
      {/* Text and Mockup Section */}
      <section style={{ margin: '4rem 0' }}>
        <div className="section-grid-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <p className="text-2xl-mobile" style={{ fontSize: '2.5rem', lineHeight: '1.3', fontFamily: 'var(--font-sans)' }}>
              OpenMidmarket <span style={{ fontWeight: 700 }}>empowers</span> CRE brokers
            </p>
          </motion.div>
          <motion.div
            className="mockup-container-mobile"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            style={{ position: 'relative', width: '120%', height: '500px' }}
          >
            <Image
              src="/cre-mockup.png"
              alt="Product Interface"
              fill
              style={{ objectFit: 'contain', objectPosition: 'center' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Trust and Transparency Section */}
      <section style={{ margin: '8rem 0' }}>
        <div className="section-grid-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontSize: 'clamp(2rem, 8vw, 6rem)',
              fontWeight: 400,
              fontFamily: 'var(--font-sans)',
              marginBottom: '0',
              lineHeight: '1.1',
              color: 'var(--foreground)'
            }}>
              OpenMidmarket
            </h2>
            <span style={{
              fontSize: 'clamp(2rem, 8vw, 6rem)',
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              display: 'block',
              lineHeight: '1.1',
              color: 'var(--foreground)'
            }}>
              fosters trust
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <p className="text-xl-mobile" style={{
              fontSize: '2.0rem',
              lineHeight: '1.6',
              color: 'var(--foreground)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 400
            }}>
              Ensures transparency, and levels the playing field in multifamily real estate
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
      <section className="visual-break-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: '60vh' }}>
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
          <span className="font-light">Join the</span> <br />
          <span className="cursive">Community</span>
        </h2>
        <p style={{ maxWidth: '500px', margin: '0 auto 3rem', fontSize: '1.2rem', color: 'var(--text-dim)' }}>
          Join the exclusive circle of brokers who will define the future of the industry.
        </p>
        <a className="btn-primary" href="https://app.openmidmarket.com/signup" style={{ padding: '1.5rem 4rem', fontSize: '1rem', display: 'inline-block', textDecoration: 'none' }}>Join Now For Free</a>
      </section>

      {/* Footer */}
      <footer className="footer-mobile" style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        <div style={{ letterSpacing: '0.1em' }}>
          © 2026 OM CRM. All Rights Reserved.
        </div>
        <div className="footer-links-mobile" style={{ display: 'flex', gap: '2rem', letterSpacing: '0.1em' }}>
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
    </>
  );
}
