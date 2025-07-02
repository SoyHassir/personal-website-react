/**
 * Structured Data Configuration for SEO
 * JSON-LD Schemas para mejorar SEO y Rich Snippets
 */

// URLs y datos base
const SITE_URL = 'https://hassirlastre.com';
const PROFILE_IMAGE = `${SITE_URL}/img/optimized-profile/profile-large.avif`;
const LOGO_IMAGE = `${SITE_URL}/img/optimized-logo/logo-large.webp`;

// Información personal y profesional
export const PERSON_DATA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Hassir Elias Lastre Sierra',
  alternateName: 'Hassir Lastre',
  givenName: 'Hassir Elias',
  familyName: 'Lastre Sierra',
  description: 'Consultor estratégico especializado en datos e innovación. Doctor en Planeación Estratégica y Dirección de Tecnología. Profesor-investigador reconocido por MinCiencias.',
  image: {
    '@type': 'ImageObject',
    url: PROFILE_IMAGE,
    width: 1200,
    height: 630
  },
  url: SITE_URL,
  sameAs: [
    'https://www.linkedin.com/in/hassirlastresierra',
    'https://scholar.google.es/citations?user=ZMTTnUoAAAAJ&hl=es',
    'https://orcid.org/0000-0002-7581-9331',
    'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001630270',
    'https://www.researchgate.net/profile/Hassir-Lastre-Sierra',
    'https://github.com/SoyHassir',
    'https://twitter.com/SoyHassir'
  ],
  jobTitle: 'Consultor Estratégico y Profesor-Investigador',
  worksFor: {
    '@type': 'Organization',
    name: 'MinCiencias Colombia',
    sameAs: 'https://minciencias.gov.co'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hola@hassirlastre.com',
    contactType: 'Professional',
    areaServed: ['CO', 'LATAM'],
    availableLanguage: ['Spanish', 'English']
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CO',
    addressRegion: 'Colombia'
  },
  alumniOf: [
    {
      '@type': 'EducationalOrganization',
      name: 'Universidad',
      degree: 'PhD en Planeación Estratégica y Dirección de Tecnología'
    },
    {
      '@type': 'EducationalOrganization', 
      name: 'Universidad',
      degree: 'PhD en Economía y Empresa'
    },
    {
      '@type': 'EducationalOrganization',
      name: 'Universidad',
      degree: 'Maestría en Administración Estratégica'
    }
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Investigador Reconocido MinCiencias',
      credentialCategory: 'Professional Certification',
      recognizedBy: {
        '@type': 'Organization',
        name: 'MinCiencias Colombia'
      }
    }
  ],
  knowsAbout: [
    'Strategic Planning',
    'Data Analytics', 
    'Business Intelligence',
    'Digital Transformation',
    'Innovation Management',
    'Technology Management',
    'Organizational Strategy',
    'Research & Development'
  ]
};

// Organización / Negocio
export const ORGANIZATION_DATA = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${SITE_URL}/#organization`,
  name: 'Hassir Lastre Sierra - Consultoría Estratégica',
  alternateName: 'Hassir Lastre Consulting',
  description: 'Consultoría estratégica especializada en datos e innovación para transformar organizaciones.',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_IMAGE,
    width: 400,
    height: 400
  },
  image: PROFILE_IMAGE,
  founder: {
    '@id': `${SITE_URL}/#person`
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CO',
    addressRegion: 'Colombia'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+57',
    email: 'hola@hassirlastre.com',
    contactType: 'customer service',
    areaServed: ['CO', 'LATAM'],
    availableLanguage: ['Spanish', 'English']
  },
  sameAs: [
    'https://www.linkedin.com/in/hassirlastresierra',
    'https://github.com/SoyHassir'
  ],
  serviceType: 'Strategic Consulting',
  areaServed: {
    '@type': 'Country',
    name: 'Colombia'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de Consultoría',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Consultoría Estratégica',
          description: 'Gestión empresarial y estratégica respaldada por investigación certificada MinCiencias'
        }
      },
      {
        '@type': 'Offer', 
        itemOffered: {
          '@type': 'Service',
          name: 'Análisis de Datos',
          description: 'Business intelligence, data analytics y visualización de datos'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service', 
          name: 'Transformación Digital',
          description: 'Acompañamiento integral en procesos de digitalización empresarial'
        }
      }
    ]
  }
};

// Website Schema
export const WEBSITE_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Hassir Lastre Sierra - Consultor Estratégico',
  alternateName: 'Hassir Lastre',
  description: 'Sitio web oficial de Hassir Lastre Sierra, consultor estratégico especializado en datos e innovación.',
  url: SITE_URL,
  publisher: {
    '@id': `${SITE_URL}/#person`
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?s={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  },
  inLanguage: ['es-ES', 'en-US'],
  isAccessibleForFree: true,
  isFamilyFriendly: true,
  audience: {
    '@type': 'Audience',
    audienceType: 'Business Professionals'
  }
};

// Services individuales
export const SERVICES_DATA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/#service-consultoria`,
    name: 'Consultoría Estratégica',
    description: 'Gestión empresarial y estratégica respaldada por investigación certificada MinCiencias. Metodologías validadas académicamente para optimizar procesos organizacionales.',
    provider: {
      '@id': `${SITE_URL}/#person`
    },
    serviceType: 'Business Consulting',
    areaServed: {
      '@type': 'Country',
      name: 'Colombia'
    },
    availableLanguage: ['Spanish', 'English']
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/#service-formacion`,
    name: 'Formación Empresarial',
    description: 'Cursos y talleres especializados en temas actuales de negocios y tecnología, impartidos por docente-investigador con experiencia internacional.',
    provider: {
      '@id': `${SITE_URL}/#person`
    },
    serviceType: 'Educational Training',
    areaServed: {
      '@type': 'Country',
      name: 'Colombia'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/#service-analisis`,
    name: 'Análisis de Datos',
    description: 'Business intelligence, data analytics y visualización de datos para transformar información en insights estratégicos que impulsen la toma de decisiones.',
    provider: {
      '@id': `${SITE_URL}/#person`
    },
    serviceType: 'Data Analytics',
    areaServed: {
      '@type': 'Country',
      name: 'Colombia'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/#service-investigacion`,
    name: 'Investigación & Desarrollo',
    description: 'Proyectos de I+D+i aplicados al sector empresarial, desarrollo de nuevos productos y servicios basados en metodologías científicas rigurosas.',
    provider: {
      '@id': `${SITE_URL}/#person`
    },
    serviceType: 'Research and Development',
    areaServed: {
      '@type': 'Country',
      name: 'Colombia'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/#service-transformacion`,
    name: 'Transformación Digital',
    description: 'Acompañamiento integral en procesos de digitalización empresarial, implementación de tecnologías emergentes y cultura digital organizacional.',
    provider: {
      '@id': `${SITE_URL}/#person`
    },
    serviceType: 'Digital Transformation',
    areaServed: {
      '@type': 'Country',
      name: 'Colombia'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/#service-tecnologia`,
    name: 'Soluciones Tecnológicas',
    description: 'Desarrollo web, aplicaciones móviles y sistemas personalizados aplicando las últimas tendencias en innovación digital y buenas prácticas.',
    provider: {
      '@id': `${SITE_URL}/#person`
    },
    serviceType: 'Technology Solutions',
    areaServed: {
      '@type': 'Country',
      name: 'Colombia'
    }
  }
];

// BreadcrumbList para navegación
export const getBreadcrumbData = (currentPage = 'home') => {
  const breadcrumbMap = {
    home: [
      { name: 'Inicio', url: SITE_URL }
    ],
    about: [
      { name: 'Inicio', url: SITE_URL },
      { name: 'Sobre mí', url: `${SITE_URL}#sobre-mi` }
    ],
    services: [
      { name: 'Inicio', url: SITE_URL },
      { name: 'Servicios', url: `${SITE_URL}#servicios` }
    ],
    contact: [
      { name: 'Inicio', url: SITE_URL },
      { name: 'Contacto', url: `${SITE_URL}#contacto` }
    ]
  };

  const items = breadcrumbMap[currentPage] || breadcrumbMap.home;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

// FAQ Schema (si decides agregar FAQs)
export const FAQ_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué servicios ofrece Hassir Lastre Sierra?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ofrezco servicios de consultoría estratégica, formación empresarial, análisis de datos, investigación & desarrollo, transformación digital y soluciones tecnológicas.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cuál es la experiencia académica de Hassir Lastre?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Soy doctor en Planeación Estratégica y Dirección de Tecnología, y también en Economía y Empresa, con maestría en Administración Estratégica. Soy profesor-investigador reconocido por MinCiencias.'
      }
    }
  ]
};

/**
 * Función para obtener todos los schemas combinados
 */
export const getAllSchemas = () => {
  return [
    PERSON_DATA,
    ORGANIZATION_DATA, 
    WEBSITE_DATA,
    ...SERVICES_DATA,
    getBreadcrumbData('home')
  ];
}; 