"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, DollarSign, BarChart3, Users } from "lucide-react";

const HERO_IMAGES = ["/images/office.png", "/images/handshake-high-res.png"];
const HERO_CYCLE_MS = 5000;

// Deal Pipeline Card Component
function DealPipelineCard() {
  const deals = [
    { name: '455 Guerrero St', type: '12-Unit Multifamily', amount: '$3.2M', status: 'Under Review', statusColor: '#f59e0b' },
    { name: '1820 Market St', type: '24-Unit Multifamily', amount: '$6.8M', status: 'Term Sheet', statusColor: '#3b82f6' },
    { name: '290 Valencia St', type: '8-Unit Multifamily', amount: '$2.1M', status: 'Approved', statusColor: '#22c55e' },
  ];

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.15)',
        maxWidth: '100%',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--foreground)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <DollarSign size={18} color="var(--background)" />
          </div>
          <span style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--foreground)',
          }}>
            Deal Pipeline
          </span>
        </div>
        <span style={{
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
        }}>
          3 Active
        </span>
      </div>

      {/* Deals List */}
      {deals.map((deal, i) => (
        <div
          key={i}
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: i < deals.length - 1 ? '1px solid var(--border)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--foreground)',
              margin: 0,
              marginBottom: '0.25rem',
            }}>
              {deal.name}
            </p>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-dim)',
              margin: 0,
            }}>
              {deal.type}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--foreground)',
              margin: 0,
              marginBottom: '0.25rem',
            }}>
              {deal.amount}
            </p>
            <span style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              background: `${deal.statusColor}15`,
              color: deal.statusColor,
              borderRadius: '4px',
              fontWeight: 600,
            }}>
              {deal.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Risk Metrics Card Component
function RiskMetricsCard() {
  return (
    <div
      style={{
        background: '#1c1c21',
        borderRadius: '16px',
        padding: '1.75rem',
        color: 'white',
        maxWidth: '100%',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        <BarChart3 size={20} />
        <span style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 500 }}>RISK ASSESSMENT</span>
      </div>

      <div style={{
        fontSize: '1.75rem',
        fontWeight: 700,
        marginBottom: '0.5rem',
      }}>
        455 Guerrero St
      </div>

      <div style={{
        fontSize: '0.9rem',
        opacity: 0.6,
        marginBottom: '1.5rem',
      }}>
        12-Unit Multifamily • San Francisco, CA
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {[
          { label: 'DSCR', value: '1.42x', good: true },
          { label: 'LTV', value: '65%', good: true },
          { label: 'Occupancy', value: '96%', good: true },
          { label: 'Market Risk', value: 'Low', good: true },
        ].map((metric, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '0.75rem',
            }}
          >
            <div style={{
              fontSize: '0.7rem',
              opacity: 0.5,
              marginBottom: '0.25rem',
            }}>
              {metric.label}
            </div>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: metric.good ? '#22c55e' : 'white',
            }}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        background: 'rgba(34, 197, 94, 0.15)',
        borderRadius: '8px',
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#22c55e',
        }} />
        <span style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 500 }}>
          Meets underwriting criteria
        </span>
      </div>
    </div>
  );
}

export default function LendersPage() {
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
                Better deals.
              </span>{' '}
              Smarter lending.
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
              Access qualified borrowers, streamline underwriting, and grow your multifamily portfolio.
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
            {/* Glow effect */}
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
        {/* Value Prop 1: Deal Flow */}
        <section id="dealflow" style={{ margin: '8rem 0' }}>
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
                Grow your{' '}
                <span style={{ fontWeight: 600 }}>deal flow</span>
              </h2>
              <p style={{
                fontSize: '1.35rem',
                lineHeight: '1.7',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                marginBottom: '2rem'
              }}>
                Connect with qualified borrowers actively seeking financing for
                multifamily acquisitions and refinances. See deal details upfront
                and focus on opportunities that match your lending criteria.
              </p>
            </motion.div>

            {/* Mockup - Deal Pipeline */}
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
              <DealPipelineCard />
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider divider-mobile" style={{ margin: '9rem 0' }} />

        {/* Value Prop 2: Risk Assessment */}
        <section id="underwriting" style={{ margin: '8rem 0' }}>
          <div className="section-grid-mobile" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Mockup - Risk Metrics */}
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
              <RiskMetricsCard />
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
                Streamline{' '}
                <span style={{ fontWeight: 600 }}>underwriting</span>
              </h2>
              <p style={{
                fontSize: '1.35rem',
                lineHeight: '1.7',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                marginBottom: '2rem'
              }}>
                Access comprehensive property data, market comps, and risk metrics
                in one place. Make faster, more confident lending decisions with
                real-time insights on every deal.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider divider-mobile" style={{ margin: '6rem 0' }} />

        {/* Value Prop 3: Borrower Relationships */}
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
                Build borrower{' '}
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
                Track your borrower relationships and loan history in one CRM.
                Get notified when existing borrowers are looking for new financing
                or when properties in your portfolio hit the market.
              </p>
            </motion.div>

            {/* Mockup - Relationship Card */}
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
                  <Users size={18} color="var(--foreground)" />
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                  }}>
                    Borrower Portfolio
                  </span>
                </div>

                {/* Borrower Items */}
                {[
                  { name: 'Westside Capital LLC', loans: 3, volume: '$12.4M', status: 'Active' },
                  { name: 'Bay Area Holdings', loans: 2, volume: '$8.1M', status: 'Active' },
                  { name: 'Mission Street Partners', loans: 1, volume: '$3.2M', status: 'Prospect' },
                ].map((borrower, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem',
                    }}>
                      <p style={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'var(--foreground)',
                        margin: 0,
                      }}>
                        {borrower.name}
                      </p>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        background: borrower.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: borrower.status === 'Active' ? '#22c55e' : '#3b82f6',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}>
                        {borrower.status}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-dim)',
                      margin: 0,
                    }}>
                      {borrower.loans} loans • {borrower.volume} total volume
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
              Ready to grow your portfolio?
            </h2>
            <p style={{
              fontSize: '1.35rem',
              fontWeight: 500,
              opacity: 0.8,
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: '1.6'
            }}>
              Join lenders across the country using OpenMidmarket to find
              better deals and build lasting borrower relationships.
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
