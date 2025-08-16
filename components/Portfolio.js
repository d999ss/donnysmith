import { useState } from 'react'

const projects = [
  {
    id: 1,
    name: 'IKON Pass',
    role: 'Lead Product Designer',
    description: 'Redesigned the digital experience for millions of skiers worldwide',
    tags: ['Product Design', 'Mobile App', 'Web Platform'],
    year: '2023'
  },
  {
    id: 2,
    name: 'GE Healthcare AI',
    role: 'Design System Lead',
    description: 'Built a comprehensive design system for medical AI applications',
    tags: ['Design Systems', 'Healthcare', 'AI/ML'],
    year: '2022'
  },
  {
    id: 3,
    name: 'Pepsi Refresh',
    role: 'Creative Technologist',
    description: 'Interactive campaign reaching 50M+ users globally',
    tags: ['Creative Tech', 'Campaign', 'Social Impact'],
    year: '2021'
  },
  {
    id: 4,
    name: 'Allergan Aesthetics',
    role: 'UX Architect',
    description: 'Digital transformation for medical aesthetics platform',
    tags: ['Enterprise UX', 'Healthcare', 'Platform Design'],
    year: '2020'
  },
  {
    id: 5,
    name: 'Air Company Carbon Tech',
    role: 'Brand & Product Design',
    description: 'Visual identity and product design for carbon-negative spirits',
    tags: ['Branding', 'Sustainability', 'Product Design'],
    year: '2019'
  }
]

export default function Portfolio({ onProjectClick }) {
  const [hoveredProject, setHoveredProject] = useState(null)

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
        Selected Work
      </h2>
      
      <div style={{
        display: 'grid',
        gap: '16px'
      }}>
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onProjectClick(project)}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
            style={{
              background: hoveredProject === project.id ? '#1a1a1a' : 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%',
              fontFamily: 'inherit'
            }}
            aria-label={`View ${project.name} project details`}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {project.name}
                </h3>
                <p style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0
                }}>
                  {project.role} • {project.year}
                </p>
              </div>
              <span style={{
                fontSize: '11px',
                color: hoveredProject === project.id ? '#38FE27' : 'rgba(255, 255, 255, 0.4)',
                transition: 'color 0.2s ease'
              }}>
                →
              </span>
            </div>
            
            <p style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '8px 0',
              lineHeight: '1.4'
            }}>
              {project.description}
            </p>
            
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: '10px',
                    padding: '4px 8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}