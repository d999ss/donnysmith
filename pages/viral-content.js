import Head from 'next/head'
import { useState } from 'react'

export default function ViralContent() {
  const [selectedTopic, setSelectedTopic] = useState('design')
  
  const viralTakes = {
    design: [
      "Most \"award-winning\" design is just expensive masturbation that doesn't move business metrics.",
      "Your users don't give a shit about your design system. They care about completing their task in under 30 seconds.",
      "90% of UX research is just confirming what you already know but don't want to admit.",
      "Design thinking workshops are corporate theater. Real insights come from watching actual users struggle.",
      "If you can't explain the ROI of your design decision, you're not a designer - you're an artist."
    ],
    agencies: [
      "Design agencies are just middlemen marking up freelancer work by 400% and adding account manager overhead.",
      "Your \"senior designer\" is actually a 23-year-old who learned Figma last year and uses ChatGPT for strategy.",
      "Agency portfolios are 90% work done by people who quit 2 years ago.",
      "Fortune 500 companies are realizing they can hire the actual talent directly for 60% less cost.",
      "The best design work comes from solo experts, not committee-driven agency processes."
    ],
    startups: [
      "Your startup's biggest design problem isn't the UI - it's that nobody wants what you're building.",
      "Spending $50k on branding before product-market fit is like buying a Ferrari for a teenager.",
      "Your beautiful landing page means nothing if your conversion rate is below 2%.",
      "Stop hiring designers to make your broken product look pretty. Fix the product first.",
      "Most startup design problems are actually business model problems in disguise."
    ]
  }
  
  const [currentTake, setCurrentTake] = useState(viralTakes.design[0])
  
  const generateTake = () => {
    const takes = viralTakes[selectedTopic]
    const randomTake = takes[Math.floor(Math.random() * takes.length)]
    setCurrentTake(randomTake)
  }
  
  const shareToTwitter = () => {
    const text = `${currentTake}\n\nThoughts? 🤔\n\nMore controversial design takes: donnysmith.com`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }
  
  const shareToLinkedIn = () => {
    const text = `Controversial design opinion:\n\n${currentTake}\n\nWhat's your take on this? Do you agree or disagree?\n\nMore thoughts at donnysmith.com`
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=https://donnysmith.com&text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }
  
  const copyForReddit = () => {
    const text = `**Controversial Design Opinion:**\n\n${currentTake}\n\nI'm a designer who's worked with GE, Pepsi, and Allergan. This opinion comes from 15+ years of seeing what actually works vs what gets awards.\n\nWhat's your take? Am I completely wrong?\n\n[More controversial takes here](https://donnysmith.com)`
    navigator.clipboard.writeText(text).then(() => {
      alert('Reddit post copied to clipboard! Paste in r/design, r/userexperience, or r/web_design')
    })
  }

  return (
    <>
      <Head>
        <title>Viral Design Content Generator | Controversial Takes That Get Shared</title>
        <meta name="description" content="Generate controversial design opinions that go viral on social media. Get your design business noticed with provocative takes that start conversations." />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        color: '#171717',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        lineHeight: '1.5'
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 24px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            marginBottom: '16px',
            letterSpacing: '-0.025em',
            lineHeight: '1.1'
          }}>
            Viral Design Content Generator
          </h1>
          
          <p style={{ 
            fontSize: '16px', 
            marginBottom: '32px', 
            color: '#525252'
          }}>
            Controversial design takes that get shared, debated, and drive traffic to your business.
          </p>

          <div style={{ 
            backgroundColor: '#ffffff',
            padding: '32px',
            borderRadius: '8px',
            marginBottom: '32px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              marginBottom: '16px',
              fontWeight: '600'
            }}>Choose Your Topic</h2>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {Object.keys(viralTakes).map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    setSelectedTopic(topic)
                    setCurrentTake(viralTakes[topic][0])
                  }}
                  style={{
                    background: selectedTopic === topic ? '#000000' : '#ffffff',
                    color: selectedTopic === topic ? '#ffffff' : '#171717',
                    border: '1px solid #e5e5e5',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
            
            <div style={{ 
              backgroundColor: '#f9f9f9',
              padding: '20px',
              borderRadius: '6px',
              marginBottom: '20px',
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <p style={{ 
                fontSize: '16px',
                fontStyle: 'italic',
                color: '#171717',
                margin: 0
              }}>
                "{currentTake}"
              </p>
            </div>
            
            <button
              onClick={generateTake}
              style={{
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '24px'
              }}
            >
              Generate New Take
            </button>
            
            <div style={{ 
              borderTop: '1px solid #e5e5e5',
              paddingTop: '20px'
            }}>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>Share This Take</h3>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={shareToTwitter}
                  style={{
                    background: '#1da1f2',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Tweet This
                </button>
                
                <button
                  onClick={shareToLinkedIn}
                  style={{
                    background: '#0077b5',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  LinkedIn Post
                </button>
                
                <button
                  onClick={copyForReddit}
                  style={{
                    background: '#ff4500',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Copy for Reddit
                </button>
              </div>
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>Why This Works</h3>
            
            <ul style={{ 
              fontSize: '14px',
              color: '#525252',
              paddingLeft: '20px',
              margin: 0
            }}>
              <li>Controversial opinions get 3x more engagement than safe takes</li>
              <li>People share content they disagree with to start arguments</li>
              <li>Establishes you as an expert with strong opinions</li>
              <li>Drives traffic back to your business through profile clicks</li>
              <li>Creates memorable brand positioning in a crowded market</li>
            </ul>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            marginTop: '40px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <p style={{ 
              fontSize: '14px',
              color: '#525252',
              marginBottom: '12px'
            }}>
              Want more controversial takes and proven business insights?
            </p>
            <a 
              href="/"
              style={{
                color: '#000000',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '14px',
                borderBottom: '1px solid #000000',
                paddingBottom: '2px'
              }}
            >
              Chat with my AI →
            </a>
          </div>
        </div>
      </div>
    </>
  )
}