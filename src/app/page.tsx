"use client";

import { motion, useInView, animate } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, Globe, Shield, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayValue(Math.round(latest))
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  const formattedValue = value >= 1000 ? displayValue.toLocaleString() : displayValue;

  return (
    <span ref={ref}>
      {formattedValue}{suffix}
    </span>
  );
}

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
              CoStar-level intelligence brought to the midmarket. Find local news, vacancies, and listings, personalized to you.
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
      {/* Trust and Transparency Section */}
      <section style={{ margin: '4rem 0' }}>
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

      {/* Stats Section */}
      <section style={{ margin: '8rem 0', padding: '4rem 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="stats-grid-mobile"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            textAlign: 'center'
          }}
        >
          {[
            { value: 50000, suffix: '+', label: 'Properties Tracked' },
            { value: 120, suffix: '+', label: 'Markets Covered' },
            { value: 2500, suffix: '+', label: 'Active Brokers' },
            { value: 10, suffix: 'B+', label: 'Deal Volume' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              style={{
                padding: '2rem 1rem',
                borderLeft: index > 0 ? '1px solid var(--border)' : 'none'
              }}
              className={index > 0 ? 'stat-border-mobile' : ''}
            >
              <div style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                color: 'var(--foreground)',
                marginBottom: '0.5rem'
              }}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{
                fontSize: '1rem',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 400
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Text and Mockup Section - Feature Peek */}
      <section style={{ margin: '8rem 0' }}>
        <div className="section-grid-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <p className="text-2xl-mobile" style={{ fontSize: '2.5rem', lineHeight: '1.3', fontFamily: 'var(--font-sans)', marginBottom: '1.5rem' }}>
              OpenMidmarket <span style={{ fontWeight: 700 }}>empowers</span> CRE brokers
            </p>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-sans)',
              maxWidth: '400px'
            }}>
              Track every touchpoint with your network. See relationship history, recent interactions, and next best actions at a glance.
            </p>
          </motion.div>

          {/* Layered UI Cards */}
          <div
            className="mockup-container-mobile"
            style={{
              position: 'relative',
              width: '100%',
              height: '480px'
            }}
          >
            {/* Background Card - Contacts List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              style={{
                position: 'absolute',
                left: '0',
                top: '10%',
                width: '70%',
                height: 'auto',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.12), 0 10px 30px -10px rgba(0, 0, 0, 0.08)',
                zIndex: 1,
                background: 'white'
              }}
            >
              <Image
                src="/mockups/cropped/contacts.png"
                alt="Contacts List"
                width={600}
                height={700}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </motion.div>

            {/* Foreground Card - Person Detail / Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 40, x: 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              style={{
                position: 'absolute',
                left: '40%',
                top: '25%',
                width: '55%',
                height: 'auto',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 35px 100px -15px rgba(0, 0, 0, 0.18), 0 15px 40px -10px rgba(0, 0, 0, 0.12)',
                zIndex: 2,
                background: 'white'
              }}
            >
              <Image
                src="/mockups/cropped/person-detail.png"
                alt="Contact Timeline"
                width={700}
                height={500}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </motion.div>

            {/* Callout badge - Your Network */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              style={{
                position: 'absolute',
                left: '-3%',
                top: '8%',
                background: 'var(--foreground)',
                color: 'var(--background)',
                padding: '0.5rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                zIndex: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}
            >
              Your Network
            </motion.div>

            {/* Callout badge - Full History */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              style={{
                position: 'absolute',
                right: '-5%',
                top: '55%',
                background: 'var(--foreground)',
                color: 'var(--background)',
                padding: '0.5rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                zIndex: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}
            >
              Full History
            </motion.div>
          </div>
        </div>
      </section>

      {/* Digitizes Collaboration Section */}
      <section style={{ margin: '10rem 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{ maxWidth: '1100px' }}
        >
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 400,
            fontFamily: 'var(--font-sans)',
            lineHeight: '1.15',
            color: 'var(--foreground)',
            marginBottom: '2rem'
          }}>
            OpenMidmarket{' '}
            <span style={{ fontWeight: 700 }}>digitizes collaboration</span>
          </h2>
          <p className="text-xl-mobile" style={{
            fontSize: '1.5rem',
            lineHeight: '1.7',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 400,
            maxWidth: '900px'
          }}>
            across property owners, brokers, property managers, lenders, insurers, and trades—creating operational efficiency, building trust, and increasing market liquidity and transaction volumes.
          </p>
        </motion.div>
      </section>

      {/* Built for the Midmarket Section */}
      <section id="features" style={{ margin: '12rem 0' }}>
        <h2 style={{ 
          fontSize: 'clamp(3rem, 10vw, 6rem)', 
          marginBottom: '4rem',
          fontFamily: 'var(--font-sans)',
          fontWeight: 400,
          color: 'var(--foreground)'
        }}>Built for the Midmarket</h2>
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

      {/* Advocacy Section */}
      <section style={{
        margin: '10rem 0',
        padding: '5rem 4rem',
        backgroundColor: 'var(--foreground)',
        color: 'var(--background)',
        borderRadius: '16px'
      }}
      className="advocacy-section-mobile"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="section-grid-mobile"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}
        >
          <div>
            <span style={{
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              opacity: 0.6,
              marginBottom: '1.5rem',
              display: 'block'
            }}>
              Our Commitment
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 400,
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.2',
              marginBottom: '0'
            }}>
              <span style={{ fontWeight: 700 }}>5%</span> of profits dedicated to advocacy
            </h2>
          </div>
          <div>
            <p className="text-xl-mobile" style={{
              fontSize: '1.35rem',
              lineHeight: '1.7',
              fontFamily: 'var(--font-sans)',
              fontWeight: 400,
              opacity: 0.9
            }}>
              Mid-market property owners lack a unified voice, resulting in unfair rent control and burdensome regulations. OpenMidmarket advocates for its members, dedicating 5% of profits to regulatory initiatives that ensure fair, balanced policy.
            </p>
          </div>
        </motion.div>
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
