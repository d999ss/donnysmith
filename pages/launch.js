import Head from 'next/head'
import { useState } from 'react'

export default function Launch() {
  const [upvotes, setUpvotes] = useState(247)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  
  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes(prev => prev + 1)
      setHasUpvoted(true)
      
      // Track this upvote
      if (typeof window !== 'undefined') {
        // This would normally send to analytics
        console.log('Upvote tracked')
      }
    }
  }
  
  const shareToHackerNews = () => {
    const title = "I built an AI version of myself that shows real client results (GE, Pepsi, Allergan)"
    const url = "https://donnysmith.com"
    const hnUrl = `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`
    window.open(hnUrl, '_blank')
  }
  
  const shareToReddit = () => {
    const title = "I built an AI version of myself as a designer - it shows real Fortune 500 results"
    const text = `After 15+ years working with companies like GE Aerospace, Pepsi, and Allergan, I built an AI version of myself that can answer questions about my work and approach.\n\nSome results it can discuss:\n- Ikon Pass: 2.1→4.6 star rating (4M users)\n- Air Company: +340% brand recognition\n- Allergan: +156% practitioner adoption\n\nThe AI is trained on my actual project experience and can qualify potential clients, discuss pricing, and even share controversial design opinions.\n\nTry it out: https://donnysmith.com\n\nWhat do you think of AI assistants for freelancers/consultants?`
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Reddit post copied! Paste in r/entrepreneur, r/freelance, or r/artificial')
    })
  }

  return (
    <>
      <Head>
        <title>🚀 Launch: AI Designer Assistant | Donny Smith</title>
        <meta name="description" content="Designer's AI assistant that shows real Fortune 500 results. GE, Pepsi, Allergan projects. Chat about design strategy, pricing, and get brutal feedback." />
        <meta property="og:title" content="Designer Built AI Assistant That Shows Real Client Results" />
        <meta property="og:description" content="Fortune 500 designer creates AI version of himself. Shows real results: Ikon Pass 2.1→4.6 stars, Air Company +340% recognition." />
        <meta property="og:image" content="https://donnysmith.com/ai-launch-preview.jpg" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        color: '#171717',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        lineHeight: '1.5'
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>
          
          {/* ProductHunt-style header */}
          <div style={{ 
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#000000',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                AI
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  AI Designer Assistant
                </h1>
                <p style={{ 
                  fontSize: '14px',
                  color: '#525252',
                  margin: 0
                }}>
                  Designer's AI that shows real Fortune 500 results
                </p>
              </div>
              <button
                onClick={handleUpvote}
                style={{
                  background: hasUpvoted ? '#000000' : '#ffffff',
                  color: hasUpvoted ? '#ffffff' : '#171717',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  cursor: hasUpvoted ? 'default' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '60px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                <span style={{ fontSize: '16px', marginBottom: '2px' }}>▲</span>
                <span>{upvotes}</span>
              </button>
            </div>
            
            <p style={{ 
              fontSize: '16px',
              color: '#171717',
              margin: 0,
              marginBottom: '16px'
            }}>
              I built an AI version of myself that can discuss real client results from GE Aerospace, Pepsi, 
              and Allergan. It qualifies leads, shares pricing, and gives brutal design feedback.
            </p>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a 
                href="/"
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Try the AI →
              </a>
              <span style={{
                background: '#f9f9f9',
                color: '#525252',
                padding: '10px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                border: '1px solid #e5e5e5'
              }}>
                Free to use
              </span>
            </div>
          </div>
          
          {/* Results showcase */}
          <div style={{ 
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>What the AI knows about:</h2>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                <strong>Ikon Pass App Redesign:</strong> 2.1 → 4.6 star rating (4M users)
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                <strong>Air Company Branding:</strong> +340% brand recognition
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                <strong>Allergan Platform:</strong> +156% practitioner adoption
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                <strong>Project Pricing:</strong> $25k-$200k+ ranges with qualification
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div style={{ 
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>Features</h2>
            
            <ul style={{ 
              fontSize: '14px',
              color: '#171717',
              paddingLeft: '20px',
              margin: 0,
              lineHeight: '1.6'
            }}>
              <li>Discusses real Fortune 500 project results</li>
              <li>Qualifies potential clients with budget/timeline questions</li>
              <li>Shares controversial design opinions that go viral</li>
              <li>Provides brutal, honest design feedback</li>
              <li>Shows transparent pricing for different project types</li>
              <li>Routes qualified leads to calendar booking</li>
            </ul>
          </div>
          
          {/* Share section */}
          <div style={{ 
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>Share this launch</h2>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button
                onClick={shareToHackerNews}
                style={{
                  background: '#ff6600',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Submit to Hacker News
              </button>
              
              <button
                onClick={shareToReddit}
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
              
              <button
                onClick={() => {
                  const text = "Designer built an AI version of himself that shows real Fortune 500 results (GE, Pepsi, Allergan). Pretty impressive: donnysmith.com"
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
                  window.open(url, '_blank')
                }}
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
                Tweet
              </button>
            </div>
            
            <p style={{ 
              fontSize: '12px',
              color: '#525252',
              margin: 0
            }}>
              Help spread the word about this AI assistant experiment!
            </p>
          </div>
          
          {/* Maker section */}
          <div style={{ 
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ 
              fontSize: '14px',
              color: '#525252',
              marginBottom: '8px'
            }}>
              Made by Donny Smith
            </p>
            <p style={{ 
              fontSize: '12px',
              color: '#737373',
              margin: 0
            }}>
              15+ years designing for Fortune 500 companies
            </p>
          </div>
        </div>
      </div>
    </>
  )
}