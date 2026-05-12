/* ============================================================
   I HATE DOCS — Authenticated App JavaScript
   View Routing · AI Simulation · Interactions · State
   ============================================================ */

(function() {
  'use strict';

  // ==================== DOM REFS ====================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // Shell
  const appShell = $('#appShell');
  const sidebar = $('#sidebar');
  const contentArea = $('#contentArea');
  const topbar = $('#topbar');

  // Sidebar
  const sidebarCollapse = $('#sidebarCollapse');
  const sidebarLinks = $$('.sidebar-link[data-view]');
  const workspaceSwitcher = $('#workspaceSwitcher');
  const sidebarUser = $('#sidebarUser');

  // Topbar
  const cmdBtn = $('#cmdBtn');
  const topbarBack = $('#topbarBack');
  const topbarBreadcrumbs = $('#topbarBreadcrumbs');
  const topbarDocStatus = $('#topbarDocStatus');
  const aiActivityBtn = $('#aiActivityBtn');
  const notificationsBtn = $('#notificationsBtn');
  const topbarProfile = $('#topbarProfile');

  // Command Palette
  const cmdPalette = $('#cmdPalette');
  const cmdPaletteInput = $('.cmd-palette-input');

  // AI Panel
  const aiPanel = $('#aiPanel');
  const aiPanelClose = $('#aiPanelClose');
  const aiPanelNewChat = $('#aiPanelNewChat');
  const aiMessages = $('#aiMessages');
  const aiThinking = $('#aiThinking');
  const aiChatInput = $('#aiChatInput');
  const aiSendBtn = $('#aiSendBtn');
  const aiSuggestedPrompts = $('#aiSuggestedPrompts');
  const promptChips = $$('.ai-prompt-chip');

  // AI Float Button
  const aiFloatBtn = $('#aiFloatBtn');

  // Workspace
  const workspaceView = $('#workspaceView');
  const docCanvasScroll = $('#docCanvasScroll');
  const zoomIn = $('#zoomIn');
  const zoomOut = $('#zoomOut');
  const zoomFit = $('#zoomFit');
  const zoomValue = $('#zoomValue');
  const docPage = $('#docPage');
  const pageThumbnails = $$('.thumbnail-item');
  const canvasToolBtns = $$('.canvas-tool-btn');
  const floatingAiBtns = $$('.floating-ai-btn');
  const aiRewriteTrigger = $('#aiRewriteTrigger');

  // AI suggestion on doc
  const aiSuggestionApply = $('.ai-suggestion-apply');
  const aiSuggestionDismiss = $('.ai-suggestion-dismiss');

  // Presentation
  const themeOptions = $$('.theme-option');
  const slideThumbs = $$('.slide-thumb');

  // Redesign
  const redesignTemplates = $$('.redesign-template');

  // File Manager
  const fileCards = $$('.file-card');
  const fileStars = $$('.file-card-star');
  const fileTabs = $$('.file-tab');
  const uploadBtn = $('#uploadBtn');

  // Multi-doc
  const multiDocActions = $$('.multi-doc-action');
  const paneCloseBtns = $$('.pane-close');

  // Toast
  const toastContainer = $('#toastContainer');

  // Agent cards
  const agentBtns = $$('.agent-card-btn');

  // Research cards
  const researchBtns = $$('.research-card-btn');

  // Equation explain
  const equationExplainBtns = $$('.ai-explain-btn');

  // Settings
  const settingsFields = $$('.settings-field input, .settings-field select');

  // ==================== STATE ====================
  const state = {
    currentView: 'workspace',
    previousView: null,
    sidebarCollapsed: false,
    aiPanelOpen: true,
    zoomLevel: 100,
    selectedThumbnail: 0,
    selectedTool: 'select',
    mobileSidebarOpen: false,
  };

  // View display names for breadcrumbs
  const viewNames = {
    workspace: 'Workspace',
    documents: 'All Documents',
    agents: 'AI Agents',
    presentation: 'Presentations',
    redesign: 'AI Redesign',
    research: 'Research Mode',
    'multi-doc': 'Multi-Document',
    recent: 'Recent',
    shared: 'Shared with me',
    starred: 'Starred',
    templates: 'Templates',
    trash: 'Trash',
    settings: 'Settings',
  };

  const docNames = {
    workspace: 'Q4 Research Report',
    documents: 'Document Library',
    agents: 'Agent Hub',
    presentation: 'Slide Builder',
    redesign: 'Style Lab',
    research: 'Academic Tools',
    'multi-doc': 'Split View',
  };

  // ==================== VIEW ROUTING ====================
  function navigateTo(view) {
    if (state.currentView === view) return;

    // Hide all views
    $$('.view').forEach((v) => v.classList.remove('active'));

    // Show target
    const targetView = document.getElementById(
      view === 'workspace' ? 'workspaceView' :
      view === 'documents' ? 'documentsView' :
      view === 'agents' ? 'agentsView' :
      view === 'presentation' ? 'presentationView' :
      view === 'redesign' ? 'redesignView' :
      view === 'research' ? 'researchView' :
      view === 'multi-doc' ? 'multiDocView' :
      view === 'recent' ? 'recentView' :
      view === 'shared' ? 'sharedView' :
      view === 'starred' ? 'starredView' :
      view === 'templates' ? 'templatesView' :
      view === 'trash' ? 'trashView' :
      view === 'settings' ? 'settingsView' : 'workspaceView'
    );

    if (targetView) targetView.classList.add('active');

    // Update state
    state.previousView = state.currentView;
    state.currentView = view;

    // Update sidebar active
    sidebarLinks.forEach((l) => {
      l.classList.toggle('active', l.dataset.view === view);
    });

    // Update breadcrumbs
    updateBreadcrumbs(view);

    // Show/hide workspace-specific panels
    if (view === 'workspace') {
      $('#pageThumbnails').style.display = '';
      $('.floating-ai-actions').style.display = '';
      aiPanel.classList.remove('collapsed');
      state.aiPanelOpen = true;
    } else {
      const thumbnails = $('#pageThumbnails');
      if (thumbnails) thumbnails.style.display = 'none';
      $('.floating-ai-actions').style.display = 'none';
    }

    // Populate shared/recent/starred grids if empty
    if (view === 'shared' && !$('#sharedGrid').children.length) populateFileGrid('sharedGrid', 4);
    if (view === 'recent' && !$('#recentGrid').children.length) populateFileGrid('recentGrid', 8);
    if (view === 'starred' && !$('#starredGrid').children.length) populateFileGrid('starredGrid', 3);
    if (view === 'trash' && !$('#trashGrid').children.length) populateTrashGrid();

    // Close mobile sidebar on navigate
    if (state.mobileSidebarOpen && window.innerWidth <= 768) {
      toggleMobileSidebar();
    }
  }

  function updateBreadcrumbs(view) {
    const name = viewNames[view] || view;
    const docName = docNames[view] || '';

    if (view === 'workspace') {
      topbarBreadcrumbs.innerHTML = `
        <span class="breadcrumb-item">Workspace</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        <span class="breadcrumb-item active">${docName}</span>
      `;
      topbarDocStatus.style.display = '';
    } else {
      topbarBreadcrumbs.innerHTML = `
        <span class="breadcrumb-item active">${name}</span>
      `;
      topbarDocStatus.style.display = 'none';
    }

    if (state.previousView && view !== 'workspace') {
      topbarBack.style.display = '';
    } else {
      topbarBack.style.display = 'none';
    }
  }

  // Sidebar navigation clicks
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.dataset.view;
      if (view) navigateTo(view);
    });
  });

  // Topbar back button
  topbarBack.addEventListener('click', () => {
    if (state.previousView) {
      navigateTo(state.previousView);
    } else {
      navigateTo('workspace');
    }
    topbarBack.style.display = 'none';
  });

  // User button navigates to settings
  topbarProfile.addEventListener('click', () => navigateTo('settings'));

  // ==================== COMMAND PALETTE ====================
  function openCmdPalette() {
    cmdPalette.classList.add('active');
    setTimeout(() => cmdPaletteInput.focus(), 100);
  }
  function closeCmdPalette() {
    cmdPalette.classList.remove('active');
  }

  cmdBtn.addEventListener('click', openCmdPalette);
  cmdPalette.addEventListener('click', (e) => {
    if (e.target === cmdPalette) closeCmdPalette();
  });

  // Cmd palette item clicks
  $$('.cmd-palette-item').forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.querySelector('span').textContent.trim();
      handleCmdAction(action);
      closeCmdPalette();
    });
  });

  cmdPaletteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCmdPalette();
    if (e.key === 'Enter') {
      const query = cmdPaletteInput.value.trim().toLowerCase();
      if (query.includes('document')) navigateTo('documents');
      else if (query.includes('agent')) navigateTo('agents');
      else if (query.includes('presentation') || query.includes('slide')) navigateTo('presentation');
      else if (query.includes('redesign')) navigateTo('redesign');
      else if (query.includes('research')) navigateTo('research');
      else if (query.includes('settings')) navigateTo('settings');
      else if (query.includes('chat') || query.includes('ai')) showToast('AI panel activated');
      else navigateTo('workspace');
      closeCmdPalette();
    }
  });

  function handleCmdAction(action) {
    if (action.includes('New Document')) showToast('Creating new document...');
    else if (action.includes('Chat with Document')) { navigateTo('workspace'); showToast('AI chat ready'); }
    else if (action.includes('Upload')) { navigateTo('documents'); showToast('Drop files to upload'); }
    else if (action.includes('Workspace')) navigateTo('workspace');
    else if (action.includes('Documents')) navigateTo('documents');
    else if (action.includes('Agents') || action.includes('AI Agents')) navigateTo('agents');
  }

  // ==================== KEYBOARD SHORTCUTS ====================
  document.addEventListener('keydown', (e) => {
    const mod = e.metaKey || e.ctrlKey;

    // Cmd/Ctrl + K: Command palette
    if (mod && e.key === 'k') {
      e.preventDefault();
      openCmdPalette();
    }

    // Cmd/Ctrl + J: Toggle AI panel
    if (mod && e.key === 'j') {
      e.preventDefault();
      toggleAiPanel();
    }

    // Escape: Close panels
    if (e.key === 'Escape') {
      if (cmdPalette.classList.contains('active')) closeCmdPalette();
    }

    // Cmd/Ctrl + B: Toggle sidebar
    if (mod && e.key === 'b') {
      e.preventDefault();
      toggleSidebar();
    }
  });

  // ==================== SIDEBAR ====================
  function toggleSidebar() {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
  }
  sidebarCollapse.addEventListener('click', toggleSidebar);

  function toggleMobileSidebar() {
    state.mobileSidebarOpen = !state.mobileSidebarOpen;
    sidebar.classList.toggle('mobile-open', state.mobileSidebarOpen);
  }

  // Workspace switcher
  workspaceSwitcher.addEventListener('click', () => {
    showToast('Workspace switched to Personal (Pro)');
  });

  // Settings button in sidebar
  $$('.sidebar-settings-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigateTo('settings');
    });
  });

  // ==================== AI PANEL ====================
  function toggleAiPanel() {
    state.aiPanelOpen = !state.aiPanelOpen;
    aiPanel.classList.toggle('collapsed', !state.aiPanelOpen);
  }
  aiPanelClose.addEventListener('click', toggleAiPanel);

  aiPanelNewChat.addEventListener('click', () => {
    // Clear messages except system
    const messages = aiMessages.querySelectorAll('.ai-message-user, .ai-message-assistant, .ai-insight-cards, .ai-thinking');
    messages.forEach((m) => m.remove());
    showToast('New AI chat session started');
  });

  // AI Chat Send
  function sendAiMessage(text) {
    if (!text) text = aiChatInput.value.trim();
    if (!text) return;

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-message ai-message-user';
    userMsg.innerHTML = `<div class="ai-message-content"><p>${escapeHtml(text)}</p></div>`;
    aiMessages.appendChild(userMsg);

    // Clear input
    aiChatInput.value = '';

    // Show thinking state
    aiThinking.style.display = 'flex';
    aiMessages.scrollTop = aiMessages.scrollHeight;

    // Simulate AI response after delay
    setTimeout(() => {
      aiThinking.style.display = 'none';

      const aiMsg = document.createElement('div');
      aiMsg.className = 'ai-message ai-message-assistant';
      const response = generateAiResponse(text);
      aiMsg.innerHTML = `
        <div class="ai-message-avatar">
          <div class="ai-msg-avatar-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10h-10V2z"/></svg>
          </div>
        </div>
        <div class="ai-message-content"><p>${response}</p></div>
      `;
      aiMessages.appendChild(aiMsg);
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }, 1200 + Math.random() * 800);
  }

  function generateAiResponse(prompt) {
    const lower = prompt.toLowerCase();
    if (lower.includes('summar')) {
      return 'This document presents findings from Q4 2025 research on AI-driven document processing. Key results show context-aware neural processing outperforms traditional OCR by <strong>34%</strong>, with the top system achieving <strong>99.4% accuracy</strong> at <strong>0.3s</strong> processing time. The report recommends a phased adoption strategy for enterprises.';
    }
    if (lower.includes('table') || lower.includes('data') || lower.includes('extract')) {
      return 'I\'ve extracted the comparison data from the table:<br><br>• <strong>System A</strong>: 97.2% accuracy, 1.2s, UX 8.9, AI: High<br>• <strong>System B</strong>: 94.8% accuracy, 2.1s, UX 8.2, AI: Medium<br>• <strong>System C</strong>: 96.1% accuracy, 0.8s, UX 9.1, AI: Very High<br>• <strong>I Hate Docs</strong>: 99.4% accuracy, 0.3s, UX 9.7, AI: Extreme';
    }
    if (lower.includes('method') || lower.includes('methodology')) {
      return 'The methodology section describes a <strong>mixed-methods approach</strong> combining quantitative benchmarking with qualitative expert review. A panel of 8 senior researchers conducted blind evaluations over a 6-week period, assessing 47 distinct platforms across 12 criteria including processing accuracy, speed, UX, integration capability, and AI feature depth.';
    }
    if (lower.includes('recommend') || lower.includes('suggest')) {
      return 'Based on the findings, I recommend:<br>1. Prioritize platforms with <strong>context-aware processing</strong> (34% accuracy gain)<br>2. Invest in <strong>custom fine-tuning pipelines</strong> for domain-specific use cases<br>3. Adopt a <strong>phased rollout strategy</strong> starting with high-volume document workflows<br>4. Ensure <strong>API integration capability</strong> for seamless workflow automation';
    }
    if (lower.includes('translate') || lower.includes('spanish')) {
      return 'Aquí está la traducción de los hallazgos clave:<br><br>"El hallazgo más significativo fue la aparición del <strong>procesamiento neuronal consciente del contexto</strong> como paradigma dominante. Los sistemas que combinan la comprensión de la estructura del documento con el análisis semántico superaron a los enfoques tradicionales basados en OCR en un promedio del 34% en todas las métricas de precisión."';
    }
    if (lower.includes('equation') || lower.includes('explain')) {
      return 'The equation <code>E(d) = α · ln(1 + |d|) + β · s(d) + γ · c(d)</code> represents the <strong>Processing Efficiency Model</strong>:<br><br>• <strong>α · ln(1 + |d|)</strong> — Logarithmic growth of base processing with document size<br>• <strong>β · s(d)</strong> — Structure complexity factor (headings, tables, etc.)<br>• <strong>γ · c(d)</strong> — Context density multiplier<br><br>This model predicts processing efficiency scales logarithmically rather than linearly with document complexity.';
    }
    if (lower.includes('slide') || lower.includes('presentation')) {
      return 'I can generate a presentation from this document. Based on the structure, I suggest:<br><br><strong>Slide 1</strong>: Title — Q4 Research Summary<br><strong>Slide 2</strong>: Executive Summary — Key takeaways<br><strong>Slide 3</strong>: Methodology Overview<br><strong>Slide 4</strong>: Key Findings — The 34% accuracy improvement<br><strong>Slide 5</strong>: Benchmark Comparison Table<br><strong>Slide 6</strong>: Recommendations<br><br>Would you like me to generate these slides?';
    }
    return 'Based on the document, I can help you with summarization, data extraction, methodology analysis, translation, or generating presentation slides. What would be most useful?';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Send on button click
  aiSendBtn.addEventListener('click', () => sendAiMessage());

  // Send on Enter (Shift+Enter for newline)
  aiChatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendAiMessage();
    }
  });

  // Suggested prompt chips
  promptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.prompt;
      aiChatInput.value = prompt;
      sendAiMessage(prompt);
    });
  });

  // ==================== AI FLOATING BUTTON ====================
  aiFloatBtn.addEventListener('click', () => {
    navigateTo('workspace');
    if (!state.aiPanelOpen) toggleAiPanel();
    setTimeout(() => aiChatInput.focus(), 400);
  });

  // ==================== WORKSPACE INTERACTIONS ====================
  // Zoom
  function updateZoom() {
    zoomValue.textContent = state.zoomLevel + '%';
    docPage.style.transform = `scale(${state.zoomLevel / 100})`;
    docPage.style.transformOrigin = 'top center';
  }

  zoomIn.addEventListener('click', () => {
    state.zoomLevel = Math.min(200, state.zoomLevel + 10);
    updateZoom();
  });

  zoomOut.addEventListener('click', () => {
    state.zoomLevel = Math.max(50, state.zoomLevel - 10);
    updateZoom();
  });

  zoomFit.addEventListener('click', () => {
    state.zoomLevel = 100;
    updateZoom();
    docCanvasScroll.scrollTop = 0;
  });

  // Page thumbnails
  pageThumbnails.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      pageThumbnails.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
      state.selectedThumbnail = i;
      // Scroll doc to approximate page position
      const pageHeight = docPage.offsetHeight;
      docCanvasScroll.scrollTo({ top: i * pageHeight, behavior: 'smooth' });
    });
  });

  // Canvas tools
  canvasToolBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      canvasToolBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedTool = btn.title.toLowerCase();
    });
  });

  // Floating AI actions
  floatingAiBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'summarize') {
        if (!state.aiPanelOpen) toggleAiPanel();
        sendAiMessage('Summarize this document');
      } else if (action === 'rewrite') {
        showToast('AI rewriting selected text...');
      } else if (action === 'translate') {
        if (!state.aiPanelOpen) toggleAiPanel();
        sendAiMessage('Translate this document');
      } else if (action === 'chat') {
        if (!state.aiPanelOpen) toggleAiPanel();
        aiChatInput.focus();
      }
    });
  });

  // AI Rewrite trigger
  if (aiRewriteTrigger) {
    aiRewriteTrigger.addEventListener('click', () => {
      showToast('AI is analyzing this paragraph for rewrite suggestions...');
      setTimeout(() => {
        showToast('3 rewrite options available — check the AI panel');
      }, 1500);
    });
  }

  // AI Suggestion on doc
  if (aiSuggestionApply) {
    aiSuggestionApply.addEventListener('click', () => {
      showToast('AI suggestion applied to document');
      const suggestion = $('.doc-ai-suggestion');
      if (suggestion) {
        suggestion.style.opacity = '0';
        suggestion.style.transform = 'translateY(-10px)';
        suggestion.style.transition = 'all 0.3s ease';
        setTimeout(() => suggestion.remove(), 300);
      }
    });
  }
  if (aiSuggestionDismiss) {
    aiSuggestionDismiss.addEventListener('click', () => {
      const suggestion = $('.doc-ai-suggestion');
      if (suggestion) {
        suggestion.style.opacity = '0';
        suggestion.style.transform = 'translateY(-10px)';
        suggestion.style.transition = 'all 0.3s ease';
        setTimeout(() => suggestion.remove(), 300);
      }
    });
  }

  // Doc status indicator (simulate saving)
  let saveTimeout;
  const docParagraphs = $$('.doc-paragraph.editable, .doc-title.editable');
  docParagraphs.forEach((p) => {
    p.addEventListener('input', () => {
      const indicator = $('.doc-status-indicator');
      const statusText = topbarDocStatus.querySelector('span');
      if (indicator) { indicator.className = 'doc-status-indicator saving'; }
      if (statusText) statusText.textContent = 'Saving...';

      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        if (indicator) { indicator.className = 'doc-status-indicator saved'; }
        if (statusText) statusText.textContent = 'Saved';
      }, 1000);
    });
  });

  // ==================== FILE MANAGER ====================
  // Star toggles
  fileStars.forEach((star) => {
    star.addEventListener('click', (e) => {
      e.stopPropagation();
      star.classList.toggle('active');
      const svg = star.querySelector('svg');
      if (star.classList.contains('active')) {
        svg.setAttribute('fill', 'currentColor');
        showToast('Added to starred');
      } else {
        svg.setAttribute('fill', 'none');
        showToast('Removed from starred');
      }
    });
  });

  // File card clicks -> navigate to workspace
  fileCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.file-card-star') || e.target.closest('.file-card-more') ||
          e.target.closest('.drag-drop-zone')) return;
      navigateTo('workspace');
    });
  });

  // File tabs
  fileTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      fileTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Upload button
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => showToast('Drag & drop files here or click to browse'));
  }

  // ==================== PRESENTATION ====================
  // Theme options
  themeOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      themeOptions.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');

      // Update main slide gradient
      const mainSlide = $('.slide-main-content');
      if (mainSlide) {
        mainSlide.style.background = opt.style.background;
      }
      showToast('Theme applied');
    });
  });

  // Slide thumbnails
  slideThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      slideThumbs.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Export button
  const exportBtn = $('.slide-export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => showToast('Exporting presentation as PPTX...'));
  }

  // Create presentation button
  const createPresBtn = $('.presentation-create-btn');
  if (createPresBtn) {
    createPresBtn.addEventListener('click', () => showToast('Creating new AI-generated presentation...'));
  }

  // ==================== REDESIGN ====================
  redesignTemplates.forEach((tmpl) => {
    tmpl.addEventListener('click', () => {
      redesignTemplates.forEach((t) => t.classList.remove('active'));
      tmpl.classList.add('active');
      showToast('Style preset applied');
    });
  });

  // ==================== MULTI-DOC ====================
  multiDocActions.forEach((btn) => {
    btn.addEventListener('click', () => {
      multiDocActions.forEach((a) => a.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  paneCloseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('Document closed');
    });
  });

  // ==================== AGENTS ====================
  agentBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const agentName = btn.closest('.agent-card').querySelector('.agent-card-name').textContent;
      showToast(`Launching ${agentName}...`);
    });
  });

  // ==================== RESEARCH ====================
  researchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cardName = btn.closest('.research-card').querySelector('h3').textContent;
      showToast(`${cardName} activated`);
    });
  });

  // Equation explain
  equationExplainBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!state.aiPanelOpen) toggleAiPanel();
      sendAiMessage('Explain this equation');
    });
  });

  // ==================== NOTIFICATION TOAST ====================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // Auto-remove after 3s
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3000);

    // Click to dismiss
    toast.addEventListener('click', () => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    });
  }

  // ==================== AI ACTIVITY BUTTON ====================
  aiActivityBtn.addEventListener('click', () => {
    showToast('AI is processing 2 tasks in the background');
  });

  // ==================== NOTIFICATIONS BUTTON ====================
  notificationsBtn.addEventListener('click', () => {
    showToast('3 new notifications — AI finished summarizing a document');
  });

  // ==================== FILE GRID POPULATORS ====================
  function populateFileGrid(gridId, count) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const names = ['Q4 Research Report', 'AI Strategy 2026', 'Board Presentation', 'ML Survey', 'Benchmark Data', 'Contract Analysis', 'Product Roadmap', 'Design System', 'API Documentation', 'User Research', 'Financial Model', 'Team Onboarding'];
    const types = ['badge-pdf', 'badge-docx', 'badge-pptx', 'badge-pdf', 'badge-xlsx', 'badge-pdf', 'badge-docx', 'badge-pdf', 'badge-pdf', 'badge-docx', 'badge-xlsx', 'badge-docx'];
    const sizes = ['2.4 MB', '1.8 MB', '5.1 MB', '12.3 MB', '892 KB', '3.1 MB', '1.2 MB', '4.5 MB', '956 KB', '2.1 MB', '1.7 MB', '3.8 MB'];

    for (let i = 0; i < Math.min(count, names.length); i++) {
      const card = document.createElement('div');
      card.className = 'file-card';
      card.innerHTML = `
        <div class="file-card-preview">
          <div class="file-card-thumb"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <div class="file-card-badge ${types[i]}">${types[i].replace('badge-','').toUpperCase()}</div>
        </div>
        <div class="file-card-info">
          <h3 class="file-card-name">${names[i]}</h3>
          <div class="file-card-meta"><span>${sizes[i]}</span><span>·</span><span>Dec ${12-i}, 2025</span></div>
        </div>
        <div class="file-card-actions">
          <button class="file-card-star"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>
          <button class="file-card-more"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button>
        </div>
      `;
      card.addEventListener('click', (e) => {
        if (e.target.closest('.file-card-star') || e.target.closest('.file-card-more')) return;
        navigateTo('workspace');
      });
      const star = card.querySelector('.file-card-star');
      star.addEventListener('click', (e) => {
        e.stopPropagation();
        star.classList.toggle('active');
      });
      grid.appendChild(card);
    }
  }

  function populateTrashGrid() {
    const grid = document.getElementById('trashGrid');
    if (!grid) return;
    const names = ['Old Draft v2.pdf', 'Duplicate Report.docx', 'Temp Export.pptx', 'Archive Data.xlsx', 'Deleted Notes.pdf'];
    for (let i = 0; i < 5; i++) {
      const card = document.createElement('div');
      card.className = 'file-card';
      card.style.opacity = '0.5';
      card.innerHTML = `
        <div class="file-card-preview">
          <div class="file-card-thumb"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
        </div>
        <div class="file-card-info"><h3 class="file-card-name">${names[i]}</h3></div>
      `;
      grid.appendChild(card);
    }
  }

  // ==================== SETTINGS CHANGES ====================
  settingsFields.forEach((field) => {
    field.addEventListener('change', (e) => {
      const label = e.target.closest('.settings-field')?.querySelector('label')?.textContent || 'Setting';
      showToast(`${label} updated`);
    });
  });

  // Range input display
  const rangeInput = $('.settings-field input[type="range"]');
  if (rangeInput) {
    rangeInput.addEventListener('input', (e) => {
      const label = e.target.closest('.settings-field').querySelector('label');
      if (label) label.textContent = `AI Temperature (${e.target.value}%)`;
    });
  }

  // Empty trash button
  const emptyTrashBtn = $('.file-action-btn.danger');
  if (emptyTrashBtn) {
    emptyTrashBtn.addEventListener('click', () => {
      showToast('Trash emptied');
    });
  }

  // ==================== ADD SLIDE BUTTON ====================
  const addSlideBtn = $('.slide-thumb-add');
  if (addSlideBtn) {
    addSlideBtn.addEventListener('click', () => {
      showToast('New slide added — AI will generate content');
    });
  }

  // ==================== DRAG & DROP VISUAL ====================
  const dropZone = $('.drag-drop-zone');
  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--accent)';
      dropZone.style.background = 'rgba(99,102,241,0.06)';
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = '';
      dropZone.style.background = '';
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '';
      dropZone.style.background = '';
      showToast('File uploaded successfully');
    });
  }

  // ==================== DOC CANVAS SCROLL PARALLAX ====================
  docCanvasScroll.addEventListener('scroll', () => {
    const scrollY = docCanvasScroll.scrollTop;
    const floatingActions = $('.floating-ai-actions');
    if (floatingActions) {
      floatingActions.style.transform = `translateY(calc(-50% + ${scrollY * 0.05}px))`;
    }
  });

  // ==================== INIT ====================
  function init() {
    // Initial breadcrumbs
    updateBreadcrumbs('workspace');

    // Populate default grids
    populateFileGrid('recentGrid', 8);
    populateFileGrid('sharedGrid', 4);
    populateFileGrid('starredGrid', 3);
    populateTrashGrid();

    console.log('%c🖤 I Hate Docs %cApp Shell Ready',
      'font-size:16px;font-weight:800;color:#6366f1;',
      'font-size:12px;color:#94a3b8;');
  }

  init();

})();
