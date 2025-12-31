"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Github, Linkedin, Mail, Download, ExternalLink, Code, Microscope, Dna, Activity, ArrowRight, Menu, X, FlaskConical, Brain, Layers, BookOpen, Users, Target, Sparkles, Beaker, Heart } from 'lucide-react';

// MARK FARINAS - PERSONAL PORTFOLIO

const PortfolioWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Navigation Component
  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f6f5f1]/98 backdrop-blur-sm border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo/Brand - Minimalist */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <span className="font-serif text-lg text-black font-normal tracking-[0.25em] uppercase">
              MF
            </span>
          </div>

          {/* Desktop Navigation - Clean Typography */}
          <div className="hidden md:flex items-center gap-8">
            {['home', 'about', 'projects', 'research', 'experience', 'contact'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
                  currentPage === page 
                    ? 'text-black font-medium' 
                    : 'text-black/60 font-normal hover:text-black'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle - Refined */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-black/70 hover:text-black transition-colors"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Menu - Clean Design */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-black/10 pt-4">
            {['home', 'about', 'projects', 'research', 'experience', 'contact'].map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left py-2.5 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
                  currentPage === page 
                    ? 'text-black font-medium pl-4' 
                    : 'text-black/60 font-normal hover:text-black hover:pl-2'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );

  // Home Page Component - American Psycho Business Card
  const HomePage = () => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Bone/Off-White Background with Subtle Texture */}
        <div className="absolute inset-0">
          {/* Base off-white/bone color */}
          <div className="absolute inset-0 bg-[#f6f5f1]"></div>
          
          {/* Subtle paper texture using CSS patterns */}
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 1px,
                  rgba(0, 0, 0, 0.03) 1px,
                  rgba(0, 0, 0, 0.03) 2px
                ),
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 1px,
                  rgba(0, 0, 0, 0.03) 1px,
                  rgba(0, 0, 0, 0.03) 2px
                )
              `,
            }}
          ></div>
          
          {/* Subtle watermark effect - more visible */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.015]">
            <div className="text-[25rem] font-serif tracking-[0.3em] text-black select-none font-light">
              MF
            </div>
          </div>
        </div>

        {/* Main Business Card */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div 
            className="relative max-w-3xl w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Card Shadow */}
            <div 
              className={`absolute inset-0 bg-black/5 blur-2xl transition-all duration-700 ${
                isHovered ? 'translate-y-3 opacity-10' : 'translate-y-1 opacity-5'
              }`}
            ></div>
            
            {/* The Card */}
            <div className={`relative bg-[#fffef9] border border-gray-300/30 p-16 transition-all duration-700 ${
              isHovered ? 'transform -translate-y-0.5' : ''
            }`}>
              
              {/* Subtle embossed texture overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute inset-0 opacity-[0.02]"
                  style={{
                    backgroundImage: `
                      radial-gradient(ellipse at top, rgba(0,0,0,0.02) 0%, transparent 70%),
                      radial-gradient(ellipse at bottom, rgba(0,0,0,0.02) 0%, transparent 70%)
                    `
                  }}
                ></div>
              </div>

              {/* Top Section - Phone Number */}
              <div className="flex justify-between items-start mb-16">
                <div className="text-black text-[13px] tracking-[0.25em] font-normal">
                  780.802.0708
                </div>
                <div className="text-right">
                  <div className="text-black text-[11px] tracking-[0.35em] font-semibold">
                    FARINAS & FARINAS
                  </div>
                  <div className="text-black/80 text-[9px] tracking-[0.25em] font-normal mt-0.5">
                    COMPUTATIONAL BIOLOGY
                  </div>
                </div>
              </div>

              {/* Center - Name */}
              <div className="text-center mb-16">
                <h1 className="text-black text-3xl tracking-[0.35em] font-normal mb-2 uppercase">
                  MARK FARINAS
                </h1>
                <div className="text-black/90 text-[13px] tracking-[0.4em] font-medium uppercase">
                  Software Developer
                </div>
              </div>

              {/* Bottom Section - Address/Info */}
              <div className="text-center">
                <div className="text-black/85 text-[11px] tracking-[0.3em] font-normal uppercase leading-relaxed">
                  MacEwan University Edmonton, AB T5J 4S2
                  <br />
                  <span className="tracking-[0.2em]">farinas@ualberta.ca</span> · <span className="tracking-[0.15em] lowercase">github.com/MVFarinas</span>
                </div>
              </div>

              {/* Subtle Corner Accent - barely visible */}
              <div className="absolute top-4 left-4">
                <div className="w-6 h-6 border-t border-l border-gray-400/10"></div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 border-t border-r border-gray-400/10"></div>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="w-6 h-6 border-b border-l border-gray-400/10"></div>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="w-6 h-6 border-b border-r border-gray-400/10"></div>
              </div>
            </div>
            
            {/* Hover hint */}
            <div className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`}>
              <p className="text-black/50 text-[10px] tracking-[0.3em] uppercase font-light">
                Look at that subtle off-white coloring
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Minimalist Style */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex gap-6">
            <button 
              onClick={() => setCurrentPage('projects')}
              className="text-black/70 text-[10px] tracking-[0.25em] uppercase hover:text-black transition-colors duration-300 font-normal"
            >
              View Portfolio
            </button>
            <span className="text-black/30">·</span>
            <button 
              onClick={() => setCurrentPage('about')}
              className="text-black/70 text-[10px] tracking-[0.25em] uppercase hover:text-black transition-colors duration-300 font-normal"
            >
              About
            </button>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="absolute bottom-3 right-6 animate-pulse">
          <ChevronDown className="w-3 h-3 text-black/20" />
        </div>
      </div>
    );
  };

  // About Page Component
  const AboutPage = () => (
    <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Page Header - Business Card Style */}
        <div className="text-center mb-16">
          <h2 className="text-black text-[11px] tracking-[0.5em] font-normal uppercase mb-4">About</h2>
          <div className="w-16 h-px bg-black/20 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content - Business Card Typography */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction Card */}
            <div className="bg-[#fffef9] p-10 border border-black/10">
              <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-6">
                The Interdisciplinary Journey
              </h3>
              <div className="space-y-4">
                <p className="text-black/85 text-sm leading-relaxed font-light">
                  I'm Mark Farinas, a Computer Science student at MacEwan University with a unique perspective 
                  shaped by my Bachelor's degree in Immunology from the University of Alberta. This dual expertise 
                  allows me to approach problems with both computational rigor and biological insight.
                </p>
                <p className="text-black/85 text-sm leading-relaxed font-light">
                  My journey from studying T-cell proliferation and conducting PCR research to building AI-powered 
                  applications represents more than a career pivot—it's a synthesis of two powerful fields.
                </p>
              </div>
            </div>

            {/* Education Timeline - Minimalist */}
            <div className="bg-[#fffef9] p-10 border border-black/10">
              <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-8">
                Educational Path
              </h3>
              
              <div className="space-y-8">
                <div className="relative pl-6 border-l border-black/10">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-black/80 rounded-full"></div>
                  <div>
                    <h4 className="text-black text-sm font-medium tracking-wider">BSc Computer Science</h4>
                    <p className="text-black/60 text-xs tracking-wider mt-1">MacEwan University • 2024 - Present</p>
                    <p className="text-black/70 text-xs mt-1">GPA: 3.6/4.0</p>
                    <p className="text-black/75 text-xs mt-3 leading-relaxed">
                      Data Structures, Algorithms, Human-Computer Interaction, Python Programming
                    </p>
                  </div>
                </div>

                <div className="relative pl-6 border-l border-black/10">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-black/60 rounded-full"></div>
                  <div>
                    <h4 className="text-black text-sm font-medium tracking-wider">BSc Immunology & Infection</h4>
                    <p className="text-black/60 text-xs tracking-wider mt-1">University of Alberta • 2016 - 2021</p>
                    <p className="text-black/75 text-xs mt-3 leading-relaxed">
                      Molecular Biology, Cell Cultures, Flow Cytometry, Research Methods
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Interests - Clean Design */}
            <div className="bg-[#fffef9] p-10 border border-black/10">
              <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-6">
                Beyond the Code
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-black text-xs tracking-[0.2em] font-medium uppercase mb-3">Health & Fitness</h4>
                  <p className="text-black/75 text-xs leading-relaxed">
                    Passionate about holistic health. Currently working at Popeye's Supplements, 
                    helping others achieve their fitness goals.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-black text-xs tracking-[0.2em] font-medium uppercase mb-3">Scientific Innovation</h4>
                  <p className="text-black/75 text-xs leading-relaxed">
                    Exploring how emerging technologies can solve biological challenges, 
                    from AI diagnostics to computational drug discovery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Business Card Style */}
          <div className="space-y-6">
            {/* Skills Card */}
            <div className="bg-[#fffef9] p-8 border border-black/10">
              <h3 className="text-black text-[11px] tracking-[0.3em] font-medium uppercase mb-6">
                Technical Stack
              </h3>
              
              <div className="space-y-5">
                <div>
                  <h4 className="text-black/70 text-[10px] tracking-[0.2em] uppercase mb-3">Languages</h4>
                  <div className="space-y-1">
                    {['Python', 'JavaScript', 'C'].map(skill => (
                      <div key={skill} className="text-black/85 text-xs font-light">{skill}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-black/70 text-[10px] tracking-[0.2em] uppercase mb-3">Lab Techniques</h4>
                  <div className="space-y-1">
                    {['PCR', 'Flow Cytometry', 'ELISA', 'Cell Culture'].map(skill => (
                      <div key={skill} className="text-black/85 text-xs font-light">{skill}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-black/70 text-[10px] tracking-[0.2em] uppercase mb-3">Tools</h4>
                  <div className="space-y-1">
                    {['Git', 'React', 'Figma', 'FlowJo'].map(skill => (
                      <div key={skill} className="text-black/85 text-xs font-light">{skill}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-[#fffef9] p-8 border border-black/10">
              <h3 className="text-black text-[11px] tracking-[0.3em] font-medium uppercase mb-6">Connect</h3>
              
              <div className="space-y-3">
                <a href="https://github.com/MVFarinas" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-3 text-black/70 hover:text-black transition-colors group">
                  <Github className="w-4 h-4" />
                  <span className="text-xs tracking-wider">GitHub</span>
                </a>
                <a href="https://linkedin.com/in/MarkVincentFarinas" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 text-black/70 hover:text-black transition-colors group">
                  <Linkedin className="w-4 h-4" />
                  <span className="text-xs tracking-wider">LinkedIn</span>
                </a>
                <a href="mailto:farinas@ualberta.ca"
                   className="flex items-center gap-3 text-black/70 hover:text-black transition-colors group">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs tracking-wider">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Projects Page Component
  const ProjectsPage = () => {
    const projects = [
      {
        title: 'Phone Menu Transcriber',
        description: 'AI-powered tool that converts automated phone prompts into structured, readable menu options using Whisper AI.',
        tech: ['Python', 'Whisper AI', 'Audio Processing'],
        github: 'https://github.com/MVFarinas/Phone-Menu-Transcriber',
        features: [
          'Automatic transcription of phone menu audio',
          'Parsing of verbalized numbers and instructions',
          'Clean, formatted output for easy navigation'
        ]
      },
      {
        title: 'Calorie Tracker & Planner',
        description: 'Comprehensive CLI application for nutrition tracking with custom data structures and optimization algorithms.',
        tech: ['Python', 'SciPy', 'Custom Data Structures', 'JSON/CSV'],
        github: 'https://github.com/MVFarinas/Calorie-Tracker-and-Planner',
        features: [
          'Custom linked list implementation',
          'Moving average calculations for trend analysis',
          'Multiple file format support',
          'Personalized nutrition plans'
        ]
      },
      {
        title: 'Hack4Health Solution',
        description: 'Innovative healthcare concept combining biometrics, hardware, and AI for medication adherence.',
        tech: ['Concept Design', 'Figma', 'AI Integration', 'Biometrics'],
        features: [
          'Biometric authentication',
          'AI-powered reminder system',
          'Real-time adherence tracking',
          'Healthcare provider dashboard'
        ]
      },
      {
        title: 'Investment Finance Tool',
        description: 'Work in progress - Advanced tool for investment analysis and portfolio optimization.',
        tech: ['Python', 'Data Analysis', 'Finance APIs'],
        github: 'https://github.com/MVFarinas/Investment-Finance-Tool',
        wip: true
      },
      {
        title: 'Haemocytometer Cell Counter',
        description: 'Work in progress - Automated cell counting tool for laboratory research.',
        tech: ['Python', 'Computer Vision', 'Lab Automation'],
        github: 'https://github.com/MVFarinas/Haemocytometer-Cell-Counter',
        wip: true
      }
    ];

    return (
      <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-black text-[11px] tracking-[0.5em] font-normal uppercase mb-4">Projects</h2>
            <div className="w-16 h-px bg-black/20 mx-auto"></div>
            <p className="text-black/60 text-xs tracking-wider mt-4">Building solutions at the intersection of health and technology</p>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6">
            {projects.map((project, index) => (
              <div 
                key={project.title}
                className="bg-[#fffef9] border border-black/10 p-8 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-black text-sm tracking-[0.2em] font-medium uppercase flex items-center gap-3">
                      {project.title}
                      {project.wip && (
                        <span className="text-[9px] tracking-[0.15em] text-black/50 font-normal">
                          [IN PROGRESS]
                        </span>
                      )}
                    </h3>
                    <p className="text-black/75 text-xs mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  {project.github && (
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/50 hover:text-black transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {project.features && (
                  <div className="mb-4 mt-6">
                    <div className="text-black/60 text-[10px] tracking-[0.2em] uppercase mb-3">Key Features</div>
                    <div className="space-y-1">
                      {project.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-black/40 text-xs mt-0.5">·</span>
                          <span className="text-black/70 text-xs leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {project.tech.map(tech => (
                    <span 
                      key={tech}
                      className="text-[10px] tracking-wider text-black/60 uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Research Page Component
  const ResearchPage = () => {
    const researchExperiences = [
      {
        lab: 'Shapiro Lab',
        institution: 'University of Alberta',
        period: 'April 2019 - September 2019',
        focus: 'Type-1 Diabetes & T-cell Proliferation',
        responsibilities: [
          'Analyzed T-cell proliferation patterns using FlowJo software',
          'Performed ELISA, flow cytometry, and gel electrophoresis',
          'Monitored animal subjects for behavioral and physical changes'
        ],
        techniques: ['Flow Cytometry', 'ELISA', 'FlowJo', 'Gel Electrophoresis']
      },
      {
        lab: 'iGEM Research Competition',
        institution: 'University of Alberta',
        period: 'April 2018 - November 2018',
        focus: 'Anti-fungal Compound Research in Bees',
        responsibilities: [
          'Conducted anti-fungal compound research',
          'Handled live bees for behavior monitoring',
          'Presented findings on international stage'
        ],
        techniques: ['Microbiology', 'Animal Handling', 'Data Analysis']
      },
      {
        lab: 'Bayne Lab',
        institution: 'University of Alberta',
        period: 'October 2017 - January 2018',
        focus: 'Bio-acoustics Software Validation',
        responsibilities: [
          'Validated bio-acoustic software accuracy',
          'Prepared data by gating frequencies'
        ],
        techniques: ['Signal Processing', 'Data Validation']
      }
    ];

    const publications = [
      {
        title: 'Current Methods and Future Research in the Diagnosis of Alzheimers Disease',
        authors: 'Jhajj, G., Farinas, M.',
        journal: 'CUSJ',
        year: '2019',
        status: 'In Press'
      },
      {
        title: 'Wnt4 as a Novel Biomarker for the Early Detection of Acute Kidney Injury',
        authors: 'Lee, J., Jhajj, G., Farinas, M., Solez, K.',
        venue: 'Festival of Undergraduate Research and Creative Activities',
        year: '2019',
        location: 'Edmonton, AB'
      }
    ];

    return (
      <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-black text-[11px] tracking-[0.5em] font-normal uppercase mb-4">Research Experience</h2>
            <div className="w-16 h-px bg-black/20 mx-auto"></div>
            <p className="text-black/60 text-xs tracking-wider mt-4">Contributing to scientific advancement</p>
          </div>

          {/* Research Timeline */}
          <div className="mb-12">
            <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-8">Laboratory Experience</h3>
            
            <div className="space-y-6">
              {researchExperiences.map((experience, index) => (
                <div 
                  key={experience.lab}
                  className="bg-[#fffef9] border border-black/10 p-8"
                >
                  <div>
                    <h4 className="text-black text-sm tracking-[0.15em] font-medium uppercase">
                      {experience.lab}
                    </h4>
                    <div className="flex gap-4 mt-2 text-black/60 text-xs">
                      <span>{experience.institution}</span>
                      <span>·</span>
                      <span>{experience.period}</span>
                    </div>
                    <p className="text-black/80 text-xs mt-3 tracking-wider">{experience.focus}</p>
                    
                    <div className="mt-6">
                      <div className="text-black/60 text-[10px] tracking-[0.2em] uppercase mb-3">Contributions</div>
                      <div className="space-y-1">
                        {experience.responsibilities.map((resp, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-black/40 text-xs mt-0.5">·</span>
                            <span className="text-black/70 text-xs leading-relaxed">{resp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-6">
                      {experience.techniques.map(tech => (
                        <span 
                          key={tech}
                          className="text-[10px] tracking-wider text-black/50 uppercase"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publications Section */}
          <div>
            <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-8">Publications & Presentations</h3>
            
            <div className="grid gap-4">
              {publications.map((pub, index) => (
                <div 
                  key={pub.title}
                  className="bg-[#fffef9] border border-black/10 p-6"
                >
                  <h4 className="text-black text-xs leading-relaxed mb-2">{pub.title}</h4>
                  <p className="text-black/60 text-xs">{pub.authors}</p>
                  <div className="flex items-center gap-3 text-[10px] text-black/50 mt-2">
                    <span>{pub.journal || pub.venue}</span>
                    <span>·</span>
                    <span>{pub.year}</span>
                    {pub.status && (
                      <>
                        <span>·</span>
                        <span className="uppercase tracking-wider">{pub.status}</span>
                      </>
                    )}
                    {pub.location && (
                      <>
                        <span>·</span>
                        <span>{pub.location}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Experience Page Component
  const ExperiencePage = () => {
    const experiences = [
      {
        title: 'Sales Associate',
        company: "Popeye's Supplements",
        location: 'Edmonton, AB',
        period: 'July 2022 - Present',
        responsibilities: [
          'Advise clients on supplements supporting athletic performance',
          'Conduct in-store demos and community engagement',
          'Educate the public on science-backed health solutions'
        ],
        skills: ['Customer Service', 'Health Education', 'Sales']
      },
      {
        title: 'Lab Specialist',
        company: 'Alberta Precision Labs',
        location: 'Edmonton, AB',
        period: 'December 2022 - December 2023',
        responsibilities: [
          'Utilized PCR (qPCR and dPCR) for COVID RNA detection',
          'Prepared and conducted daily lab work',
          'Analyzed data using AbsoluteQ and Microsoft Office'
        ],
        skills: ['Digital PCR', 'RT-PCR', 'RNA Extraction', 'Data Analysis']
      }
    ];

    return (
      <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-black text-[11px] tracking-[0.5em] font-normal uppercase mb-4">Professional Experience</h2>
            <div className="w-16 h-px bg-black/20 mx-auto"></div>
          </div>

          {/* Experience Cards */}
          <div className="grid gap-6">
            {experiences.map((exp, index) => (
              <div 
                key={exp.company}
                className="bg-[#fffef9] border border-black/10 p-8"
              >
                <div className="mb-4">
                  <h3 className="text-black text-sm tracking-[0.15em] font-medium uppercase">{exp.title}</h3>
                  <div className="flex gap-4 mt-2 text-black/60 text-xs">
                    <span className="tracking-wider">{exp.company}</span>
                    <span>·</span>
                    <span>{exp.location}</span>
                    <span>·</span>
                    <span>{exp.period}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-black/60 text-[10px] tracking-[0.2em] uppercase mb-3">Key Responsibilities</div>
                  <div className="space-y-1">
                    {exp.responsibilities.map((resp, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-black/40 text-xs mt-0.5">·</span>
                        <span className="text-black/70 text-xs leading-relaxed">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {exp.skills.map(skill => (
                    <span 
                      key={skill}
                      className="text-[10px] tracking-wider text-black/50 uppercase"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Technical Expertise Section */}
          <div className="mt-16">
            <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-8">Technical Expertise</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#fffef9] p-6 border border-black/10">
                <h4 className="text-black/80 text-[10px] tracking-[0.2em] uppercase mb-4">Programming</h4>
                <div className="space-y-1">
                  {['Python', 'JavaScript', 'C', 'React', 'Git/GitHub'].map(skill => (
                    <div key={skill} className="text-black/70 text-xs">{skill}</div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[#fffef9] p-6 border border-black/10">
                <h4 className="text-black/80 text-[10px] tracking-[0.2em] uppercase mb-4">Laboratory</h4>
                <div className="space-y-1">
                  {['Digital PCR', 'Flow Cytometry', 'ELISA', 'Cell Culture'].map(skill => (
                    <div key={skill} className="text-black/70 text-xs">{skill}</div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[#fffef9] p-6 border border-black/10">
                <h4 className="text-black/80 text-[10px] tracking-[0.2em] uppercase mb-4">Soft Skills</h4>
                <div className="space-y-1">
                  {['Problem Solving', 'Team Collaboration', 'Communication', 'Adaptability'].map(skill => (
                    <div key={skill} className="text-black/70 text-xs">{skill}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Contact Page Component
  const ContactPage = () => (
    <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16 flex items-center">
      <div className="max-w-4xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-black text-[11px] tracking-[0.5em] font-normal uppercase mb-4">Contact</h2>
          <div className="w-16 h-px bg-black/20 mx-auto"></div>
          <p className="text-black/60 text-xs tracking-wider mt-4">Let's connect</p>
        </div>

        {/* Contact Business Card Style */}
        <div className="bg-[#fffef9] border border-black/10 p-12 mb-8">
          <div className="text-center space-y-6">
            <div>
              <div className="text-black text-[10px] tracking-[0.3em] uppercase mb-2">Email</div>
              <a 
                href="mailto:farinas@ualberta.ca"
                className="text-black/80 text-sm tracking-wider hover:text-black transition-colors"
              >
                farinas@ualberta.ca
              </a>
            </div>
            
            <div>
              <div className="text-black text-[10px] tracking-[0.3em] uppercase mb-2">Phone</div>
              <a 
                href="tel:780-802-0708"
                className="text-black/80 text-sm tracking-wider hover:text-black transition-colors"
              >
                780.802.0708
              </a>
            </div>
            
            <div>
              <div className="text-black text-[10px] tracking-[0.3em] uppercase mb-2">Location</div>
              <p className="text-black/80 text-sm tracking-wider">
                Edmonton, AB T5J 4S2
              </p>
            </div>
          </div>
        </div>

        {/* Social Links - Minimalist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a 
            href="https://github.com/MVFarinas"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#fffef9] border border-black/10 p-4 text-center hover:bg-black/5 transition-all group"
          >
            <Github className="w-5 h-5 text-black/60 group-hover:text-black mx-auto mb-2" />
            <span className="text-[10px] text-black/60 tracking-wider uppercase">GitHub</span>
          </a>
          
          <a 
            href="https://linkedin.com/in/MarkVincentFarinas"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#fffef9] border border-black/10 p-4 text-center hover:bg-black/5 transition-all group"
          >
            <Linkedin className="w-5 h-5 text-black/60 group-hover:text-black mx-auto mb-2" />
            <span className="text-[10px] text-black/60 tracking-wider uppercase">LinkedIn</span>
          </a>
          
          <a 
            href="/Mark_CV_2025.pdf"
            download
            className="bg-[#fffef9] border border-black/10 p-4 text-center hover:bg-black/5 transition-all group"
          >
            <Download className="w-5 h-5 text-black/60 group-hover:text-black mx-auto mb-2" />
            <span className="text-[10px] text-black/60 tracking-wider uppercase">Resume</span>
          </a>
          
          <a 
            href="https://www.figma.com/@markfarinas"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#fffef9] border border-black/10 p-4 text-center hover:bg-black/5 transition-all group"
          >
            <Layers className="w-5 h-5 text-black/60 group-hover:text-black mx-auto mb-2" />
            <span className="text-[10px] text-black/60 tracking-wider uppercase">Figma</span>
          </a>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12">
          <p className="text-black/50 text-[10px] tracking-[0.2em] uppercase">
            Open to opportunities in software development & bioinformatics
          </p>
        </div>
      </div>
    </div>
  );

  // Render current page
  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage />;
      case 'about': return <AboutPage />;
      case 'projects': return <ProjectsPage />;
      case 'research': return <ResearchPage />;
      case 'experience': return <ExperiencePage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-gray-100 font-sans">
      
      <Navigation />
      {renderPage()}
    </div>
  );
};

export default PortfolioWebsite;