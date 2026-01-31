"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function BrokersPage() {
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
                fontSize: '1.75rem',
                lineHeight: '1.6',
                fontFamily: 'var(--font-sans)',
                fontWeight: 400,
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
          </div>
        </motion.div>
      </section>

      <main className="container">
        {/* Value Prop 1: Maintaining Relationships */}
        <section style={{ margin: '8rem 0' }}>
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
                <span style={{ fontWeight: 700 }}>relationships</span>
              </h2>
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.7',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '2rem'
              }}>
                Never lose track of a connection. See every interaction, meeting,
                and touchpoint with your network in one place. Know exactly when
                to reach out and what to talk about.
              </p>
              <ul style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {[
                  'Full interaction history at a glance',
                  'Smart reminders to stay in touch',
                  'Network strength scoring'
                ].map((item, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1rem',
                    color: 'var(--foreground)'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--foreground)'
                    }} />
                    {item}
                  </li>
                ))}
              </ul>
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
                  right: '-5%',
                  top: '20%',
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
        <div className="divider" style={{ margin: '6rem 0' }} />

        {/* Value Prop 2: Local News & Regulation */}
        <section style={{ margin: '8rem 0' }}>
          <div className="section-grid-mobile" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Mockup - News Cards */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="mockup-container-mobile"
              style={{
                position: 'relative',
                height: '500px'
              }}
            >
              {/* Article Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                style={{
                  position: 'absolute',
                  left: '-5%',
                  top: '0',
                  width: '110%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.15)',
                  background: 'white',
                  zIndex: 1
                }}
              >
                <Image
                  src="/mockups/cropped/post.png"
                  alt="News Article"
                  width={900}
                  height={643}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </motion.div>

              {/* Second Article Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                style={{
                  position: 'absolute',
                  right: '-10%',
                  bottom: '5%',
                  width: '70%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 35px 100px -15px rgba(0, 0, 0, 0.2)',
                  background: 'white',
                  zIndex: 2
                }}
              >
                <Image
                  src="/mockups/cropped/new-post.png.png"
                  alt="Create Post"
                  width={500}
                  height={400}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </motion.div>
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
                <span style={{ fontWeight: 700 }}>leads</span>
              </h2>
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.7',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '2rem'
              }}>
                Find qualified buyers and sellers in your markets. Reach decision-makers
                directly and fill your pipeline with warm introductions from your network.
              </p>
              <ul style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {[
                  'Discover active buyers and sellers in your territory',
                  'Direct access to property owners and investors',
                  'Warm introductions through your network'
                ].map((item, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1rem',
                    color: 'var(--foreground)'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--foreground)'
                    }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider" style={{ margin: '6rem 0' }} />

        {/* Value Prop 3: Host Seminars */}
        <section style={{ margin: '8rem 0' }}>
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
                <span style={{ fontWeight: 700 }}>seminars</span>
              </h2>
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.7',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '2rem'
              }}>
                Position yourself as a market expert. Create and promote educational
                seminars for property owners, investors, and other industry professionals.
                Build your reputation while generating leads.
              </p>
              <ul style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {[
                  'Easy event creation and management',
                  'Built-in RSVP and attendee tracking',
                  'Automatic follow-up tools'
                ].map((item, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1rem',
                    color: 'var(--foreground)'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--foreground)'
                    }} />
                    {item}
                  </li>
                ))}
              </ul>
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
              Ready to grow your{' '}
              <span style={{ fontFamily: 'var(--font-kyoto)', fontStyle: 'italic' }}>
                business
              </span>?
            </h2>
            <p style={{
              fontSize: '1.25rem',
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
