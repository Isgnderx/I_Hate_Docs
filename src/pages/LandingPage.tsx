import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  useEffect(() => {
    document.body.classList.remove('app');
    document.body.classList.add('landing');
  }, []);

  return (
    <div>
      <div className="orb-container">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <nav className="nav" id="navbar">
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            <div className="nav-logo-icon">✦</div>
            I Hate Docs
          </a>
          <div className="nav-links">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#workflow" className="nav-link">
              How It Works
            </a>
            <a href="#dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
            <a href="#faq" className="nav-link">
              FAQ
            </a>
          </div>
          <div className="nav-actions">
            <Link className="btn btn-ghost" to="/auth?mode=signin">
              Sign In
            </Link>
            <Link className="btn btn-primary" to="/auth?mode=signup">
              Try Free
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-floating hero-float-1">📄</div>
        <div className="hero-floating hero-float-2">✨</div>
        <div className="hero-floating hero-float-3">🤖</div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Now with AI Agents — v2.3
          </div>
          <h1 className="hero-title">
            <span className="hero-title-gradient">The Future</span>
            <br />
            of Documents
          </h1>
          <p className="hero-desc">
            An AI-native workspace where PDFs become intelligent. Edit, chat, redesign, and generate
            documents at the speed of thought.
          </p>
          <div className="hero-cta-group">
            <Link className="btn btn-primary btn-lg" to="/auth?mode=signup">
              Start free — no credit card
            </Link>
            <a className="btn btn-ghost btn-lg" href="#product-preview">
              Watch demo →
            </a>
          </div>
        </div>
      </section>

      <div className="dashboard-preview reveal" id="product-preview">
        <div className="dashboard-preview-inner">
          <div className="dashboard-preview-header">
            <div className="preview-dot preview-dot-red"></div>
            <div className="preview-dot preview-dot-yellow"></div>
            <div className="preview-dot preview-dot-green"></div>
            <div className="preview-title-bar">research-paper.pdf — I Hate Docs AI</div>
          </div>
          <div className="dashboard-preview-body">
            <div className="preview-sidebar">
              <div className="preview-sidebar-item active">
                <span className="preview-sidebar-icon">📂</span> Workspace
              </div>
              <div className="preview-sidebar-item">
                <span className="preview-sidebar-icon">🤖</span> AI Assistant
              </div>
              <div className="preview-sidebar-item">
                <span className="preview-sidebar-icon">📝</span> Recent
              </div>
              <div className="preview-sidebar-item">
                <span className="preview-sidebar-icon">⭐</span> Starred
              </div>
              <div className="preview-sidebar-item">
                <span className="preview-sidebar-icon">🗑️</span> Trash
              </div>
            </div>
            <div className="preview-main">
              <div className="preview-pdf-frame">
                <div className="preview-pdf-line"></div>
                <div className="preview-pdf-line"></div>
                <div className="preview-pdf-line"></div>
                <div className="preview-pdf-line"></div>
                <div className="preview-pdf-line"></div>
                <div className="preview-pdf-line"></div>
                <div className="preview-pdf-line"></div>
                <div className="preview-pdf-line"></div>
                <div className="preview-pdf-line"></div>
                <div className="preview-pdf-highlight"></div>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                AI is analyzing your document...
              </p>
            </div>
            <div className="preview-ai-panel">
              <div className="preview-ai-header">AI Copilot</div>
              <div className="preview-ai-msg">
                This paper discusses transformer architectures. Would you like me to summarize the key findings?
              </div>
              <div className="preview-ai-msg">
                I can also extract figures, rewrite sections, or convert it into a presentation.
              </div>
              <div className="preview-ai-input">
                <span className="preview-ai-input-text">Ask anything about this PDF...</span>
                <div className="preview-ai-input-btn">→</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="logos-section reveal">
        <p className="logos-label">Placeholder logos — replace with verified customers</p>
        <div className="logos-grid">
          <span>Stripe</span>
          <span>Notion</span>
          <span>Figma</span>
          <span>Vercel</span>
          <span>Linear</span>
          <span>Arc</span>
          <span>OpenAI</span>
          <span>Supabase</span>
        </div>
      </div>

      <section className="section reveal" id="features">
        <span className="section-label">Platform</span>
        <h2 className="section-title">
          Every document
          <br />
          superpower. Built-in.
        </h2>
        <p className="section-subtitle">
          From editing to AI-driven analysis, everything you need in one elegant workspace.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3 className="feature-title">Chat with PDFs</h3>
            <p className="feature-desc">Ask questions, get instant answers with citations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✏️</div>
            <h3 className="feature-title">Smart Edit</h3>
            <p className="feature-desc">Edit PDF text, images, and layouts directly without leaving the app.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3 className="feature-title">AI Redesign</h3>
            <p className="feature-desc">Transform documents into a beautiful, on-brand layout instantly.</p>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="showcase">
          <div className="showcase-text">
            <span className="section-label">Core Feature</span>
            <h2>
              Talk to your
              <br />
              documents.
            </h2>
            <p>
              Highlight any section and ask AI to explain, rewrite, or expand it. Get answers backed by
              inline citations.
            </p>
            <Link className="btn btn-primary" to="/auth?mode=signup">
              Try AI Chat →
            </Link>
          </div>
          <div className="showcase-visual">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--sp-4)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>You:</strong> What&apos;s the main argument in section
                3.2?
              </div>
              <div
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--accent-blue)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--sp-4)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 0 20px var(--accent-blue-glow)'
                }}
              >
                <strong style={{ color: 'var(--accent-blue-soft)' }}>I Hate Docs AI:</strong> Section 3.2 argues that
                attention mechanisms outperform recurrent models. <em style={{ color: 'var(--accent-purple)' }}>
                  (Source: Page 7, ¶3)
                </em>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="workflow">
        <span className="section-label">Workflow</span>
        <h2 className="section-title">How it works</h2>
        <p className="section-subtitle">From upload to insight in seconds. No learning curve.</p>
        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="workflow-step-number">1</div>
            <h4 className="workflow-step-title">Upload</h4>
            <p className="workflow-step-desc">Drag and drop any PDF file.</p>
          </div>
          <div className="workflow-step">
            <div className="workflow-step-number">2</div>
            <h4 className="workflow-step-title">AI Processes</h4>
            <p className="workflow-step-desc">We extract text, structure, and metadata securely.</p>
          </div>
          <div className="workflow-step">
            <div className="workflow-step-number">3</div>
            <h4 className="workflow-step-title">Interact</h4>
            <p className="workflow-step-desc">Chat, edit, translate, or redesign — same workspace.</p>
          </div>
          <div className="workflow-step">
            <div className="workflow-step-number">4</div>
            <h4 className="workflow-step-title">Export</h4>
            <p className="workflow-step-desc">Download annotated PDFs instantly.</p>
          </div>
        </div>
      </section>

      <section className="dashboard-section reveal" id="dashboard">
        <span className="section-label">Workspace</span>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Your AI document
          <br />
          command center.
        </h2>
        <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--sp-12)' }}>
          A workspace designed for speed, clarity, and flow.
        </p>
        <div className="dashboard-full">
          <div className="dashboard-header">
            <div className="dashboard-header-left">
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>📂 My Workspace</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>/ research / machine-learning</span>
            </div>
            <div className="dashboard-header-right">
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>2 collaborators active</span>
              <div className="db-avatar">LN</div>
            </div>
          </div>
          <div className="dashboard-body">
            <div className="db-sidebar">
              <div className="db-nav-item active">
                <span className="db-nav-icon">📄</span> All Documents
                <span className="db-nav-badge">24</span>
              </div>
              <div className="db-nav-item">
                <span className="db-nav-icon">🤖</span> AI Assistant
              </div>
              <div className="db-nav-item">
                <span className="db-nav-icon">📊</span> Generated
                <span className="db-nav-badge">3</span>
              </div>
              <div className="db-nav-item">
                <span className="db-nav-icon">⭐</span> Starred
              </div>
            </div>
            <div className="db-main">
              <div className="db-toolbar">
                <div className="db-tool-btn active">
                  <span className="icon">✏️</span> Edit
                </div>
                <div className="db-tool-btn">
                  <span className="icon">💬</span> Chat
                </div>
                <div className="db-tool-btn">
                  <span className="icon">🎨</span> Redesign
                </div>
                <div className="db-tool-btn">
                  <span className="icon">📝</span> Summarize
                </div>
              </div>
              <div className="db-document-view">
                <div className="db-doc-content">
                  <div className="db-doc-line"></div>
                  <div className="db-doc-line"></div>
                  <div className="db-doc-line"></div>
                  <div className="db-doc-line"></div>
                </div>
                <div className="db-doc-ai-popup">
                  💡 AI detected 3 key insights
                  <br />
                  <span style={{ color: 'var(--accent-blue-soft)' }}>Click to review →</span>
                </div>
              </div>
            </div>
            <div className="db-ai-panel">
              <div className="db-ai-panel-title">
                <span className="status"></span> I Hate Docs AI
              </div>
              <div className="db-ai-chat">
                <div className="db-ai-msg">
                  I&apos;ve analyzed your document. Key topics:
                  <br />
                  • Transformer architectures
                  <br />
                  • Attention mechanisms
                  <br />
                  • Performance benchmarks
                </div>
              </div>
              <div className="db-ai-commands">
                <span className="db-ai-chip">Summarize</span>
                <span className="db-ai-chip">Generate slides</span>
                <span className="db-ai-chip">Extract data</span>
              </div>
              <div className="preview-ai-input" style={{ marginTop: 'auto' }}>
                <span className="preview-ai-input-text">Ask AI to do anything...</span>
                <div className="preview-ai-input-btn">→</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="pricing">
        <span className="section-label">Pricing</span>
        <h2 className="section-title">
          Simple, transparent,
          <br />
          AI-native pricing.
        </h2>
        <p className="section-subtitle">Start free. Upgrade when you need more power.</p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="pricing-name">Starter</h3>
            <div className="pricing-price">
              $0<span>/mo</span>
            </div>
            <p className="pricing-desc">For individuals getting started with AI documents.</p>
            <div className="pricing-features">
              <div className="pricing-feature">
                <span className="pricing-check">✓</span> 5 PDFs / month
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span> Basic AI chat
              </div>
            </div>
            <Link className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border-muted)' }} to="/auth?mode=signup">
              Get Started
            </Link>
          </div>
          <div className="pricing-card pricing-card-featured">
            <h3 className="pricing-name">Pro</h3>
            <div className="pricing-price">
              $19<span>/mo</span>
            </div>
            <p className="pricing-desc">For professionals who live in documents.</p>
            <div className="pricing-features">
              <div className="pricing-feature">
                <span className="pricing-check">✓</span> 100 PDFs / month
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span> Full AI chat + citations
              </div>
            </div>
            <Link className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} to="/auth?mode=signup">
              Start Free Trial
            </Link>
          </div>
          <div className="pricing-card">
            <h3 className="pricing-name">Teams</h3>
            <div className="pricing-price">
              $49<span>/mo</span>
            </div>
            <p className="pricing-desc">Team workspace (coming soon).</p>
            <div className="pricing-features">
              <div className="pricing-feature">
                <span className="pricing-check">✓</span> Everything in Pro
              </div>
            </div>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border-muted)' }} type="button">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <section className="section reveal" id="faq">
        <span className="section-label">FAQ</span>
        <h2 className="section-title">
          Questions?
          <br />
          We&apos;ve got answers.
        </h2>
        <div className="faq-list">
          <div className="faq-item open">
            <button className="faq-question" type="button">
              Is my data private and secure?
              <span className="faq-arrow">+</span>
            </button>
            <div className="faq-answer">
              Yes. Files are private per user and secured by Supabase RLS. No AI model training on your data.
            </div>
          </div>
          <div className="faq-item">
            <button className="faq-question" type="button">
              What file types are supported?
              <span className="faq-arrow">+</span>
            </button>
            <div className="faq-answer">PDF for MVP. More formats planned.</div>
          </div>
        </div>
      </section>

      <section className="section cta-section reveal">
        <div className="cta-card">
          <h2>
            Ready to experience
            <br />
            the future of documents?
          </h2>
          <p>Join thousands of researchers, founders, and creators already using I Hate Docs.</p>
          <Link className="btn btn-primary btn-lg" to="/auth?mode=signup">
            Get started free →
          </Link>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', marginTop: 'var(--sp-4)', position: 'relative' }}>
            No credit card required • 5 free documents included
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-logo">
              <div className="nav-logo-icon">✦</div>
              I Hate Docs
            </div>
            <p>The AI-native document workspace for the future of work.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="/">Documentation</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="/">About</a>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="/">Twitter / X</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 I Hate Docs. All rights reserved.</span>
          <span>Built with love in San Francisco</span>
        </div>
      </footer>
    </div>
  );
}
