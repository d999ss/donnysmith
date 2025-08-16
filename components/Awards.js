import { useState } from 'react'

const awards = [
  {
    id: 1,
    name: 'Webby Awards',
    category: 'Best User Experience',
    project: 'IKON Pass Digital Platform',
    year: '2023',
    type: 'Winner'
  },
  {
    id: 2,
    name: 'Awwwards',
    category: 'Site of the Day',
    project: 'Air Company Brand Launch',
    year: '2022',
    type: 'SOTD'
  },
  {
    id: 3,
    name: 'CSS Design Awards',
    category: 'Website of the Day',
    project: 'GE Vernova GridOS',
    year: '2022',
    type: 'WOTD'
  },
  {
    id: 4,
    name: 'FWA',
    category: 'FWA of the Day',
    project: 'Allergan Aesthetics Platform',
    year: '2021',
    type: 'FOTD'
  },
  {
    id: 5,
    name: 'Communication Arts',
    category: 'Interactive Annual',
    project: 'Dollar Shave Club Redesign',
    year: '2021',
    type: 'Excellence'
  },
  {
    id: 6,
    name: 'One Show',
    category: 'Digital Design',
    project: 'PepsiCo Refresh Campaign',
    year: '2020',
    type: 'Merit'
  },
  {
    id: 7,
    name: 'D&AD',
    category: 'Digital Design',
    project: 'Ciitizen Healthcare Platform',
    year: '2020',
    type: 'Wood Pencil'
  },
  {
    id: 8,
    name: 'Red Dot Design Award',
    category: 'Interface Design',
    project: 'IKON Pass Mobile App',
    year: '2019',
    type: 'Winner'
  },
  {
    id: 9,
    name: 'IxDA Awards',
    category: 'Engaging Experiences',
    project: 'GE Healthcare AI Systems',
    year: '2019',
    type: 'Finalist'
  },
  {
    id: 10,
    name: 'Fast Company',
    category: 'Innovation by Design',
    project: 'Air Company Carbon Tech',
    year: '2022',
    type: 'Honoree'
  }
]

export default function Awards({ onAwardClick }) {
  const [hoveredAward, setHoveredAward] = useState(null)

  return (
    <div style={{
      marginTop: '48px',
      marginBottom: '48px'
    }}>
      <h2 style={{
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '24px',
        color: '#FFFFFF',
        letterSpacing: '-0.3px'
      }}>
        Recognition & Awards
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '12px'
      }}>
        {awards.map((award) => (
          <div
            key={award.id}
            onMouseEnter={() => setHoveredAward(award.id)}
            onMouseLeave={() => setHoveredAward(null)}
            style={{
              background: hoveredAward === award.id ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '12px',
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '6px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  margin: 0,
                  marginBottom: '2px'
                }}>
                  {award.name}
                </h3>
                <span style={{
                  fontSize: '10px',
                  color: hoveredAward === award.id ? '#38FE27' : 'rgba(255, 255, 255, 0.5)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {award.type}
                </span>
              </div>
              <span style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.4)'
              }}>
                {award.year}
              </span>
            </div>
            
            <p style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: '4px 0 2px 0',
              lineHeight: '1.3'
            }}>
              {award.category}
            </p>
            
            <p style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.5)',
              margin: 0,
              fontStyle: 'italic'
            }}>
              {award.project}
            </p>
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.5)',
          lineHeight: '1.5',
          margin: 0
        }}>
          + Multiple additional recognitions including Type Directors Club, Adobe Design Achievement Awards, 
          and features in Communication Arts, Print Magazine, and Fast Company.
        </p>
      </div>
    </div>
  )
}