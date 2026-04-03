"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Bell } from "lucide-react";
// import Footer from "../Footer";

const HERO_IMAGES = ["/images/detail.png", "/images/office.png"];
const HERO_CYCLE_MS = 5000;

// Valuation Card Component
function ValuationCard() {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.15)',
        maxWidth: '100%',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'var(--foreground)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <TrendingUp size={20} color="var(--background)" />
        </div>
        <span style={{
          fontSize: '0.85rem',
          color: 'var(--text-dim)',
          fontWeight: 500,
        }}>
          MARKET VALUATION
        </span>
      </div>

      <div style={{
        fontSize: '2.5rem',
        fontWeight: 700,
        fontFamily: 'var(--font-sans)',
        color: 'var(--foreground)',
        marginBottom: '0.5rem',
      }}>
        $4,250,000
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem',
      }}>
        <span style={{
          color: '#22c55e',
          fontWeight: 600,
          fontSize: '0.95rem',
        }}>
          +12.4%
        </span>
        <span style={{
          color: 'var(--text-dim)',
          fontSize: '0.9rem',
        }}>
          vs. last year
        </span>
      </div>

      <div style={{
        background: 'var(--background)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Cap Rate</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>5.2%</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Price/Unit</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>$354,167</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Comps Analyzed</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>24</span>
        </div>
      </div>

      <div style={{
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        textAlign: 'center',
      }}>
        Updated 2 hours ago
      </div>
    </div>
  );
}

// Alert Card Component
function AlertCard() {
  return (
    <div
      style={{
        background: '#1c1c21',
        borderRadius: '16px',
        padding: '1.5rem',
        color: 'white',
        maxWidth: '100%',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}>
        <Bell size={18} />
        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>NEW ALERT</span>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: 1.6,
        margin: 0,
        marginBottom: '1rem',
      }}>
        A qualified buyer is actively searching in your area. Based on their criteria, your property may be a match.
      </p>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
      }}>
        <button style={{
          padding: '0.6rem 1rem',
          background: 'white',
          color: '#1c1c21',
          borderRadius: '6px',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}>
          View Details
        </button>
        <button style={{
          padding: '0.6rem 1rem',
          background: 'transparent',
          color: 'white',
          borderRadius: '6px',
          fontSize: '0.85rem',
          fontWeight: 500,
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.3)',
        }}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default function OwnersPage() {
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
                Know your value.
              </span>{' '}
              Own your future.
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
              Real-time market insights, qualified buyer connections, and the tools to make informed decisions.
            </motion.p>
          </motion.div>
        </div>

        {/* Right Side - Background Image with Carousel */}
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
        {/* Value Prop 1: Market Valuations */}
        <section id="valuations" style={{ margin: '8rem 0' }}>
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
                Know your property&apos;s{' '}
                <span style={{ fontWeight: 600 }}>true value</span>
              </h2>
              <p style={{
                fontSize: '1.35rem',
                lineHeight: '1.7',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                marginBottom: '2rem'
              }}>
                Get real-time market valuations powered by actual transaction data.
                See comparable sales, cap rates, and price trends specific to your
                property type and location—so you always know where you stand.
              </p>
            </motion.div>

            {/* Mockup - Valuation Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="mockup-container-mobile"
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <ValuationCard />
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider divider-mobile" style={{ margin: '9rem 0' }} />

        {/* Value Prop 2: Buyer Connections */}
        <section id="connections" style={{ margin: '8rem 0' }}>
          <div className="section-grid-mobile" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Mockup - Alert Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="mockup-container-mobile"
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <AlertCard />
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
                Connect with{' '}
                <span style={{ fontWeight: 600 }}>qualified buyers</span>
              </h2>
              <p style={{
                fontSize: '1.35rem',
                lineHeight: '1.7',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                marginBottom: '2rem'
              }}>
                When you&apos;re ready to sell, connect directly with pre-qualified buyers
                actively searching in your market. No cold calls, no tire-kickers—just
                serious investors who match your property profile.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider divider-mobile" style={{ margin: '6rem 0' }} />

        {/* Value Prop 3: Stay Informed */}
        <section id="insights" style={{ margin: '8rem 0' }}>
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
                Stay ahead of{' '}
                <span style={{ fontWeight: 600 }}>market changes</span>
              </h2>
              <p style={{
                fontSize: '1.35rem',
                lineHeight: '1.7',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                marginBottom: '2rem'
              }}>
                Get alerts on regulatory changes, rent control updates, and market
                shifts that affect your properties. Make proactive decisions with
                intelligence curated for your portfolio.
              </p>
            </motion.div>

            {/* Mockup - News/Insights */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="mockup-container-mobile"
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <div style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.15)',
                maxWidth: '420px',
                width: '100%',
              }}>
                {/* Header */}
                <div style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <Shield size={18} color="var(--foreground)" />
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                  }}>
                    Market Intelligence
                  </span>
                </div>

                {/* News Items */}
                {[
                  { title: 'SF Board votes on new rent stabilization measure', tag: 'Regulation', time: '2h ago' },
                  { title: 'Multifamily cap rates compress 15bps in Q4', tag: 'Market', time: '5h ago' },
                  { title: 'New construction permits down 23% YoY', tag: 'Supply', time: '1d ago' },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                    }}>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        background: 'var(--background)',
                        borderRadius: '4px',
                        fontWeight: 600,
                        color: 'var(--foreground)',
                      }}>
                        {item.tag}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-dim)',
                      }}>
                        {item.time}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: 'var(--foreground)',
                      margin: 0,
                      lineHeight: 1.4,
                    }}>
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="cta-section-mobile"
          style={{
            margin: '8rem 0',
            padding: '5rem 4rem',
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)',
            borderRadius: '16px',
            textAlign: 'center'
          }}
        >
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
              Take control of your portfolio
            </h2>
            <p style={{
              fontSize: '1.35rem',
              fontWeight: 500,
              opacity: 0.8,
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: '1.6'
            }}>
              Join thousands of property owners using OpenMidmarket to make
              smarter decisions and maximize their returns.
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

        {/* <Footer /> */}
      </main>
    </>
  );
}
