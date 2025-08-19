import Head from 'next/head'
import Link from 'next/link'

export default function HireProductDesigner() {
  return (
    <>
      <Head>
        <title>Hire Product Designer - Fortune 500 Experience | Donny Smith</title>
        <meta name="description" content="Hire a product designer with Fortune 500 experience. GE, Pepsi, Allergan clients. $50k minimum. 2 projects available Q4 2024." />
        <meta name="keywords" content="hire product designer, Fortune 500 designer, UX designer for hire, enterprise product designer, startup product designer" />
        <meta property="og:title" content="Hire Product Designer - Fortune 500 Experience" />
        <meta property="og:description" content="Product designer with GE, Pepsi, Allergan experience. Increased Ikon Pass rating from 2.1 to 4.6 stars. $50k minimum." />
        <link rel="canonical" href="https://www.donnysmith.com/hire-product-designer" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
            Hire a Product Designer with Fortune 500 Experience
          </h1>
          
          <p style={{ fontSize: '20px', marginBottom: '40px', color: '#CCCCCC' }}>
            15+ years designing for GE Aerospace, Pepsi, Allergan Aesthetics, and high-growth startups.
          </p>

          <div style={{ 
            backgroundColor: '#111111',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '40px',
            border: '1px solid #333333'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Recent Results</h2>
            <ul style={{ fontSize: '18px', lineHeight: '1.6' }}>
              <li><strong>Ikon Pass:</strong> App Store rating 2.1 → 4.6 stars</li>
              <li><strong>Air Company:</strong> Brand recognition +340%</li>
              <li><strong>Allergan Aesthetics:</strong> Platform usage +234%</li>
            </ul>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Investment Levels</h2>
            
            <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
              <div style={{ backgroundColor: '#111111', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ color: '#00FFFF' }}>Product Design & UX</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$50k - $150k</p>
                <p>6-12 weeks | User research, full product design, prototyping</p>
              </div>
              
              <div style={{ backgroundColor: '#111111', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ color: '#00FFFF' }}>Full Platform Development</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$100k - $300k</p>
                <p>12-20 weeks | Complete product build, backend + frontend</p>
              </div>
              
              <div style={{ backgroundColor: '#111111', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ color: '#00FFFF' }}>Enterprise Transformation</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$200k+</p>
                <p>3-6 months | Multi-product ecosystems, design systems</p>
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#001122',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '40px',
            border: '1px solid #003366'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '15px', color: '#00FFFF' }}>
              🚨 Limited Availability
            </h3>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              Currently taking <strong>2 new projects this quarter</strong>. Next availability: December 2024.
            </p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <a 
                href="https://calendly.com/donnysmith/strategy-call"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                📅 Book Strategy Call
              </a>
              <a 
                href="mailto:d999ss@gmail.com?subject=Product%20Design%20Inquiry"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                📧 Email Direct
              </a>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Why Companies Choose Me</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <h3 style={{ color: '#00FFFF', marginBottom: '10px' }}>Fortune 500 Experience</h3>
                <p>Worked with GE Aerospace, Pepsi, Allergan Aesthetics on mission-critical projects.</p>
              </div>
              <div>
                <h3 style={{ color: '#00FFFF', marginBottom: '10px' }}>Proven ROI</h3>
                <p>Every project includes specific metrics and business impact measurement.</p>
              </div>
              <div>
                <h3 style={{ color: '#00FFFF', marginBottom: '10px' }}>Full-Stack Approach</h3>
                <p>Not just design - complete product strategy, development, and launch.</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/" style={{ 
              color: '#00FFFF', 
              textDecoration: 'none',
              fontSize: '18px'
            }}>
              ← Chat with my AI assistant
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}