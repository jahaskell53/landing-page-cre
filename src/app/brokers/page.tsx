"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const HERO_IMAGES = ["/images/handshake-high-res.png", "/images/women-handshake.png"];
const HERO_CYCLE_MS = 5000;

// Message Bubble Component for Generate Leads section
function MessageBubble() {
  return (
    <div
      style={{
        position: 'relative',
        background: '#1c1c21',
        borderRadius: '16px 16px 0 16px',
        padding: '1.75rem 2rem',
        color: 'white',
        fontFamily: 'var(--font-sans)',
        maxWidth: '100%',
      }}
    >
      {/* Chat bubble tail */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '20px',
          height: '20px',
          background: '#1c1c21',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
          transform: 'translateY(100%)',
        }}
      />
      <p style={{
        fontSize: '1.1rem',
        lineHeight: 1.7,
        margin: 0,
        marginBottom: '1.25rem',
      }}>
        Hi Sandy,
      </p>
      <p style={{
        fontSize: '1.1rem',
        lineHeight: 1.7,
        margin: 0,
        marginBottom: '1.25rem',
      }}>
        I'm reaching out because I'm currently working with a few active buyers specifically looking for multifamily units in the Mission District.
      </p>
      <p style={{
        fontSize: '1.1rem',
        lineHeight: 1.7,
        margin: 0,
        marginBottom: '1.5rem',
      }}>
        Your property at 455 Guerrero St caught my eye—have you given any thought to selling, or would you be open to a valuation to see where the market sits today? Even if the timing isn't right, I'd love to share some recent data on what's moving in the area.
      </p>
      <p style={{
        fontSize: '0.85rem',
        lineHeight: 1.5,
        margin: 0,
        color: 'rgba(255, 255, 255, 0.5)',
      }}>
        less than a minute ago
      </p>
    </div>
  );
}

export default function BrokersPage() {
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setHeroImageIndex((i) => (i + 1) % HERO_IMAGES.length),
      HERO_CYCLE_MS
    );
    return () => clearInterval(id);
  }, []);

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
              <span style={{ fontFamily: 'var(--font-kyoto)', fontStyle: 'italic' }}>
                More deals.
              </span>{' '}
              Higher commissions.
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              style={{
                fontSize: '1.95rem',
                lineHeight: '1.6',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                color: 'var(--foreground)',
                opacity: 0.8,
                maxWidth: '600px'
              }}
            >
              Generate more leads, shorter deal cycles, and higher commissions.
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
          {HERO_IMAGES.map((src, i) => (
            <motion.div
              key={src}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                zIndex: 0,
              }}
              initial={false}
              animate={{ opacity: heroImageIndex === i ? 1 : 0 }}
              transition={{ duration: 1 }}
            />
          ))}
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
          </div>
        </motion.div>
      </section>

      <main className="container">
        {/* Value Prop 1: Maintaining Relationships */}
        <section id="relationships" style={{ margin: '8rem 0' }}>
          <div className="section-grid-mobile" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 400,
                fontFamily: 'var(--font-sans)',
                lineHeight: '1.15',
                marginBottom: '1.5rem',
                color: 'var(--foreground)'
              }}>
                Maintain your{' '}
                <span style={{ fontWeight: 600 }}>relationships</span>
              </h2>
              <p style={{
                fontSize: '1.35rem',
                lineHeight: '1.7',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                marginBottom: '2rem'
              }}>
                Never lose track of a connection. With one easy sync from your email account, see every interaction, meeting,
                and touchpoint with your network in one place. Know exactly when
                to reach out and what to talk about.
              </p>
            </motion.div>

            {/* Mockup - Layered Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="mockup-container-mobile"
              style={{
                position: 'relative',
                height: '500px'
              }}
            >
              {/* Person Detail Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                style={{
                  position: 'absolute',
                  right: '8%',
                  top: '-5%',
                  width: '55%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 35px 100px -15px rgba(0, 0, 0, 0.2)',
                  background: 'white',
                  zIndex: 2
                }}
              >
                <Image
                  src="/mockups/cropped/person-detail.png"
                  alt="Contact Details"
                  width={500}
                  height={600}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider" style={{ margin: '9rem 0' }} />

        {/* Value Prop 2: Local News & Regulation */}
        <section style={{ margin: '8rem 0' }}>
          <div className="section-grid-mobile" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Mockup - New Lead Message Bubble */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="mockup-container-mobile"
              style={{
                position: 'relative',
                borderRadius: '16px',
                boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <MessageBubble />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 400,
                fontFamily: 'var(--font-sans)',
                lineHeight: '1.15',
                marginBottom: '1.5rem',
                color: 'var(--foreground)'
              }}>
                Generate more{' '}
                <span style={{ fontWeight: 600 }}>leads</span>
              </h2>
              <p style={{
                fontSize: '1.35rem',
                lineHeight: '1.7',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                marginBottom: '2rem'
              }}>
                Find qualified buyers and sellers in your markets. Reach decision-makers
                directly and fill your pipeline with warm introductions from your network.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider" style={{ margin: '6rem 0' }} />

        {/* Value Prop 3: Host Seminars */}
        <section id="seminars" style={{ margin: '8rem 0' }}>
          <div className="section-grid-mobile" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 400,
                fontFamily: 'var(--font-sans)',
                lineHeight: '1.15',
                marginBottom: '1.5rem',
                color: 'var(--foreground)'
              }}>
                Host{' '}
                <span style={{ fontWeight: 600 }}>seminars</span>
              </h2>
              <p style={{
                fontSize: '1.35rem',
                lineHeight: '1.7',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                marginBottom: '2rem'
              }}>
                Position yourself as a market expert. Create and promote educational
                seminars for property owners, investors, and other industry professionals.
                Build your reputation while generating leads.
              </p>
            </motion.div>

            {/* Mockup - Seminar/Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="mockup-container-mobile"
              style={{
                position: 'relative',
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Seminar Card UI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  borderRadius: '16px',
                  background: 'white',
                  boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.15)',
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <div style={{
                  background: 'var(--foreground)',
                  color: 'var(--background)',
                  padding: '1.5rem',
                }}>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>
                    UPCOMING SEMINAR
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    Multifamily Investment Trends 2026
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      background: 'var(--background)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>FEB</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>14</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                        Thursday, 2:00 PM PST
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                        Virtual Event • 45 minutes
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: 'var(--background)',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      marginLeft: '-8px'
                    }}>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: `hsl(${i * 60}, 70%, 75%)`,
                            border: '2px solid white',
                            marginLeft: '-8px'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                      <strong style={{ color: 'var(--foreground)' }}>47</strong> registered
                    </span>
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--foreground)',
                    color: 'var(--background)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    Manage Event
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          margin: '8rem 0',
          padding: '5rem 4rem',
          backgroundColor: 'var(--foreground)',
          color: 'var(--background)',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 400,
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.2',
              marginBottom: '1.5rem'
            }}>
              Ready to grow your business?
            </h2>
            <p style={{
              fontSize: '1.35rem',
              fontWeight: 500,
              opacity: 0.8,
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: '1.6'
            }}>
              Join thousands of CRE brokers who are leveraging OpenMidmarket
              to build stronger relationships and close more deals.
            </p>
            <a
              href="https://app.openmidmarket.com/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1.25rem 2.5rem',
                background: 'var(--background)',
                color: 'var(--foreground)',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'transform 0.3s ease'
              }}
            >
              Get Started Free
              <ArrowRight size={20} />
            </a>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="footer-mobile" style={{
          padding: '4rem 0',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem'
        }}>
          <div style={{ letterSpacing: '0.1em' }}>
            © 2026 OM CRM. All Rights Reserved.
          </div>
          <div className="footer-links-mobile" style={{ display: 'flex', gap: '2rem', letterSpacing: '0.1em' }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Instagram</a>
          </div>
        </footer>
      </main>
    </>
  );
}
