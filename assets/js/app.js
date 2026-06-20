(function () {
  'use strict';

  const STORAGE_KEYS = {
    settings: 'exceldpoqb-provider-config',
    locale: 'dpoqbexcel-locale',
    theme: 'dpoqbexcel-theme',
    sessions: 'OpenExcelDB_v3.sessions.plain',
    workbookId: 'dpoqbexcel-workbook-id',
    sheetMap: 'dpoqbexcel-sheet-map-v1'
  };

  const DEFAULT_BASE_URL = 'https://api.dpoqb.top/v1';
  const DEFAULT_SETTINGS = {
    provider: 'dpoqb',
    model: 'gpt-oss-120b',
    apiKey: '',
    customPrefixUrl: DEFAULT_BASE_URL,
    thinking: 'none',
    followMode: true,
    temperature: 0.2,
    maxAgentSteps: 8
  };

  const PROVIDERS = {
    dpoqb: {
      label: 'dpoqb LLM',
      baseUrls: [
        { label: 'api通用接口', value: DEFAULT_BASE_URL },
        { label: '测试接口', value: 'https://api.dpoqb.top/t1' }
      ],
      models: [
        { id: 'gpt-oss-120b', name: 'GPT OSS 120B', contextWindow: 200000, maxTokens: 128000 },
        { id: 'gpt-oss-20b', name: 'GPT OSS 20B', contextWindow: 128000, maxTokens: 64000 }
      ]
    },
    OpenAI: {
      label: 'OpenAI Compatible',
      baseUrls: [{ label: 'OpenAI', value: 'https://api.openai.com/v1' }],
      models: [
        { id: 'gpt-5.2-chat-latest', name: 'GPT-5.2 Chat' },
        { id: 'gpt-5.1-chat-latest', name: 'GPT-5.1 Chat' },
        { id: 'gpt-4.1', name: 'GPT-4.1' },
        { id: 'gpt-4o', name: 'GPT-4o' }
      ]
    },
    DeepSeek: {
      label: 'DeepSeek Compatible',
      baseUrls: [{ label: 'DeepSeek', value: 'https://api.deepseek.com/v1' }],
      models: [
        { id: 'deepseek-chat', name: 'DeepSeek Chat' },
        { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' }
      ]
    },
    OpenRouter: {
      label: 'OpenRouter',
      baseUrls: [{ label: 'OpenRouter', value: 'https://openrouter.ai/api/v1' }],
      models: [
        { id: 'openai/gpt-5.2-chat', name: 'OpenAI GPT-5.2 Chat' },
        { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek V3.2' },
        { id: 'moonshotai/kimi-k2-thinking', name: 'Kimi K2 Thinking' }
      ]
    },
    Groq: {
      label: 'Groq',
      baseUrls: [{ label: 'Groq', value: 'https://api.groq.com/openai/v1' }],
      models: [
        { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B' },
        { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill Llama 70B' }
      ]
    },
    Custom: {
      label: 'Custom OpenAI Compatible',
      baseUrls: [{ label: '自定义', value: '' }],
      models: [{ id: 'custom-model', name: 'custom-model' }]
    }
  };

  const I18N = {
    zh: {
      chat: '对话', settings: '设置', tools: '工具', newChat: '新建对话', clear: '清空消息', deleteSession: '删除当前会话',
      followOn: '跟随模式：已开启', followOff: '跟随模式：已关闭', light: '浅色', dark: '深色',
      title: '准备好处理你的 Excel 数据', subtitle: '你可以让我分析、可视化或转换你的数据',
      input: '告诉我你想如何处理这份表格…', noConfig: '请先在设置中配置 API 密钥', send: '发送', stop: '停止', stopped: '已停止生成。',
      chart: '智能图表生成', chartDesc: '自动推荐图表类型并一键生成',
      fix: '公式错误诊断', fixDesc: '定位报错原因并生成修复公式',
      analyze: '跨表智能解析', analyzeDesc: '自动关联多表数据并输出结论',
      provider: '服务商', env: '接口环境', model: '模型', apiKey: 'API 密钥', baseUrl: 'Base URL', thinking: '思考模式',
      configured: 'API 已配置', notConfigured: '填写以上信息即可开始', about: '关于',
      aboutText: 'dpoqb Excel 助手使用 AI 为你的 Excel 提供智能对话能力。API 密钥仅保存在浏览器本地。',
      sessions: '会话', usage: '用量统计', advanced: '高级工具', manualTool: '手动执行工具', run: '执行',
      toolName: '工具名称', params: '参数 JSON', output: '输出', demo: '当前不在 Excel/Office 环境中，Excel 工具只能在插件侧边栏里运行。',
      lang: 'EN', configuredShort: '已配置', notConfiguredShort: '未配置',
      sessionHistory: '会话历史', noSessions: '暂无历史会话', confirmDeleteSession: '确定删除该会话吗？删除后不可恢复。', currentSession: '当前会话', confirm: '确认', cancel: '取消'
    },
    en: {
      chat: 'Chat', settings: 'Settings', tools: 'Tools', newChat: 'New Chat', clear: 'Clear messages', deleteSession: 'Delete current session',
      followOn: 'Follow mode: ON', followOff: 'Follow mode: OFF', light: 'Light', dark: 'Dark',
      title: 'Ready to work with your Excel data', subtitle: 'Ask me to analyze, visualize, or transform your data',
      input: 'Tell me what to do with this workbook…', noConfig: 'Configure API key in settings to get started', send: 'Send', stop: 'Stop', stopped: 'Stopped.',
      chart: 'Chart Generation', chartDesc: 'One-click visualization & styling',
      fix: 'Error Fix', fixDesc: 'Auto-detect & fix formula errors',
      analyze: 'Multi-Sheet Analysis', analyzeDesc: 'Cross-sheet automation and conclusions',
      provider: 'Provider', env: 'Environment', model: 'Model', apiKey: 'API Key', baseUrl: 'Base URL', thinking: 'Thinking Mode',
      configured: 'API configured', notConfigured: 'Fill in all fields above to get started', about: 'About',
      aboutText: 'dpoqb Excel Assistant gives your Excel workbook AI chat and action capabilities. API keys are only stored locally in your browser.',
      sessions: 'Sessions', usage: 'Usage', advanced: 'Advanced tools', manualTool: 'Manual tool runner', run: 'Run',
      toolName: 'Tool name', params: 'Params JSON', output: 'Output', demo: 'Not currently running inside Excel/Office. Excel tools only work in the add-in task pane.',
      lang: '中文', configuredShort: 'Configured', notConfiguredShort: 'Not configured',
      sessionHistory: 'Session History', noSessions: 'No sessions yet', confirmDeleteSession: 'Delete this session? This cannot be undone.', currentSession: 'Current session', confirm: 'Confirm', cancel: 'Cancel'
    }
  };

  const SYSTEM_PROMPT = `You are an AI assistant integrated into Microsoft Excel with full access to read and modify spreadsheet data.

Available tools:
READ:
- get_cell_ranges: Read cell values, formulas, and formatting
- get_range_as_csv: Get data as CSV, useful for analysis
- search_data: Find text across the spreadsheet
- get_all_objects: List charts, pivot tables, and other objects

WRITE:
- set_cell_range: Write values, formulas, notes, and formatting
- clear_cell_range: Clear contents or formatting
- copy_to: Copy ranges with formula translation
- modify_sheet_structure: Insert/delete/hide/unhide rows/columns, freeze panes
- modify_workbook_structure: Create/delete/rename/duplicate sheets
- resize_range: Adjust column widths and row heights
- modify_object: Create/update/delete charts and pivot tables
- eval_officejs: Execute Office.js code when the listed tools are not enough

Citations: Use markdown links with #cite: hash to reference sheets/cells. Clicking navigates there.
- Sheet only: [Sheet Name](#cite:sheetId)
- Cell/range: [A1:B10](#cite:sheetId!A1:B10)
Example: [Exchange Ratio](#cite:3) or [see cell B5](#cite:3!B5)

When the user asks about their workbook data, read it first. Be concise. Use A1 notation for cell references. Before overwriting existing data, confirm unless the user explicitly asks to replace or overwrite.`;

  const state = {
    locale: loadLocale(),
    theme: getStoredItem(STORAGE_KEYS.theme) || (prefersDarkMode() ? 'dark' : 'light'),
    tab: 'chat',
    settings: loadSettings(),
    workbookId: null,
    sessions: loadSessions(),
    currentSessionId: null,
    messages: [],
    isWorking: false,
    stopRequested: false,
    abortController: null,
    error: null,
    stats: { inputTokens: 0, outputTokens: 0, totalCost: 0, calls: 0 },
    toolOutput: '',
    workbookLabel: '',
    sessionMenuOpen: false,
    pendingDeleteSessionId: null
  };

  function getStoredItem(key) { try { return (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem(key) : null; } catch { return null; } }
  function setStoredItem(key, value) { try { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(key, value); } catch {} }
  function prefersDarkMode() { return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches; }
  function getNavigatorLanguage() { return (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en'; }

  function t(key) { return (I18N[state.locale] && I18N[state.locale][key]) || key; }
  function loadLocale() { const v = getStoredItem(STORAGE_KEYS.locale); return v === 'en' || v === 'zh' ? v : (getNavigatorLanguage().startsWith('zh') ? 'zh' : 'en'); }
  function loadSettings() { try { return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(getStoredItem(STORAGE_KEYS.settings) || '{}')); } catch { return { ...DEFAULT_SETTINGS }; } }
  function saveSettings() { setStoredItem(STORAGE_KEYS.settings, JSON.stringify(state.settings)); }
  function loadSessions() { try { return JSON.parse(getStoredItem(STORAGE_KEYS.sessions) || '[]'); } catch { return []; } }
  function saveSessions() { setStoredItem(STORAGE_KEYS.sessions, JSON.stringify(state.sessions)); }
  function id() { const c = typeof crypto !== 'undefined' ? crypto : null; return (c && typeof c.randomUUID === 'function') ? c.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
  function now() { return Date.now(); }
  function hasOffice() { return typeof Office !== 'undefined' && typeof Excel !== 'undefined' && Excel.run; }
  function escapeHtml(s) { return String(s ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch])); }
  function pretty(v) { try { return JSON.stringify(v, null, 2); } catch { return String(v); } }
  function normalizeBaseUrl(url) { return String(url || '').replace(/\/+$/, ''); }
  function chatEndpoint() { const base = normalizeBaseUrl(state.settings.customPrefixUrl || DEFAULT_BASE_URL); return base.endsWith('/chat/completions') ? base : `${base}/chat/completions`; }

  function getProviderModels(provider) {
    const p = PROVIDERS[provider] || PROVIDERS.Custom;
    const models = p.models.slice();
    const current = state.settings.model;
    if (current && !models.some(m => m.id === current)) models.unshift({ id: current, name: current });
    return models;
  }

  function activeWorkbookKey() { return state.workbookId || 'browser'; }
  function sessionsForCurrentWorkbook() {
    const key = activeWorkbookKey();
    return state.sessions.filter(s => (s.workbookId || 'browser') === key);
  }
  function makeSession(name) {
    return { id: id(), workbookId: activeWorkbookKey(), name: name || (state.locale === 'zh' ? '新对话' : 'NEW CHAT'), messages: [], createdAt: now(), updatedAt: now() };
  }
  function ensureSession() {
    const available = sessionsForCurrentWorkbook();
    if (state.currentSessionId && available.some(s => s.id === state.currentSessionId)) return;
    let session = available[0];
    if (!session) { session = makeSession(); state.sessions.unshift(session); saveSessions(); }
    state.currentSessionId = session.id;
    state.messages = session.messages || [];
  }
  function persistCurrentSession() {
    const s = state.sessions.find(x => x.id === state.currentSessionId);
    if (!s) return;
    s.messages = state.messages;
    s.updatedAt = now();
    const firstUser = state.messages.find(m => m.role === 'user');
    if (firstUser && (!s.name || s.name === '新对话' || s.name === 'NEW CHAT')) {
      const text = firstUser.content.trim();
      s.name = text.length > 40 ? text.slice(0, 37) + '...' : text;
    }
    state.sessions.sort((a, b) => b.updatedAt - a.updatedAt);
    saveSessions();
  }

  function splitTableRow(line) {
    let text = String(line || '').trim();
    if (text.startsWith('|')) text = text.slice(1);
    if (text.endsWith('|')) text = text.slice(0, -1);
    return text.split('|').map(cell => cell.trim());
  }

  function isTableDivider(line) {
    const cells = splitTableRow(line);
    return cells.length > 1 && cells.every(cell => /^:?-{3,}:?$/.test(cell));
  }

  function renderInline(text) {
    let html = escapeHtml(text || '');
    const codeParts = [];
    html = html.replace(/`([^`]+)`/g, (_, code) => {
      const key = `\u0000CODE${codeParts.length}\u0000`;
      codeParts.push(`<code>${code}</code>`);
      return key;
    });
    html = html.replace(/\[([^\]]+)\]\(#cite:([^\)]+)\)/g, (_, label, ref) => `<a href="#cite:${ref}" class="citation">${label}</a>`);
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, (_, label, url) => `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`);
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    html = html.replace(/(^|\s)\*([^*\n]+)\*(?=\s|$|[,.!?;:，。！？；：])/g, '$1<em>$2</em>');
    html = html.replace(/(^|\s)_([^_\n]+)_(?=\s|$|[,.!?;:，。！？；：])/g, '$1<em>$2</em>');
    codeParts.forEach((part, i) => { html = html.replace(`\u0000CODE${i}\u0000`, part); });
    return html;
  }

  function renderMarkdown(md) {
    const src = String(md || '').replace(/\r\n/g, '\n');
    const lines = src.split('\n');
    const out = [];
    let i = 0;

    const isBlockStart = (line, next) => {
      const tline = line || '';
      return /^```/.test(tline.trim()) || /^\s{0,3}#{1,6}\s+/.test(tline) || /^\s*>\s?/.test(tline) || /^\s*[-*+]\s+/.test(tline) || /^\s*\d+\.\s+/.test(tline) || (tline.includes('|') && next && isTableDivider(next));
    };

    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }

      const fence = line.trim().match(/^```\s*([\w-]+)?/);
      if (fence) {
        i++;
        const code = [];
        while (i < lines.length && !/^```/.test(lines[i].trim())) code.push(lines[i++]);
        if (i < lines.length) i++;
        const lang = fence[1] ? ` data-lang="${escapeHtml(fence[1])}"` : '';
        out.push(`<pre class="md-code"${lang}><code>${escapeHtml(code.join('\n'))}</code></pre>`);
        continue;
      }

      const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        out.push(`<h${level}>${renderInline(heading[2].trim())}</h${level}>`);
        i++;
        continue;
      }

      if (/^\s*>\s?/.test(line)) {
        const quote = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^\s*>\s?/, ''));
        out.push(`<blockquote>${renderMarkdown(quote.join('\n'))}</blockquote>`);
        continue;
      }

      if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
        const ordered = /^\s*\d+\.\s+/.test(line);
        const items = [];
        const re = ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*+]\s+(.+)$/;
        while (i < lines.length && re.test(lines[i])) {
          const item = lines[i].match(re)[1];
          items.push(`<li>${renderInline(item)}</li>`);
          i++;
        }
        out.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`);
        continue;
      }

      if (line.includes('|') && lines[i + 1] && isTableDivider(lines[i + 1])) {
        const headers = splitTableRow(line);
        i += 2;
        const rows = [];
        while (i < lines.length && lines[i].includes('|') && lines[i].trim()) rows.push(splitTableRow(lines[i++]));
        const thead = headers.map(h => `<th>${renderInline(h)}</th>`).join('');
        const tbody = rows.map(row => `<tr>${headers.map((_, idx) => `<td>${renderInline(row[idx] || '')}</td>`).join('')}</tr>`).join('');
        out.push(`<div class="md-table-wrap"><table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table></div>`);
        continue;
      }

      const para = [];
      while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i], lines[i + 1])) para.push(lines[i++]);
      out.push(`<p>${para.map(x => renderInline(x.trim())).join('<br>')}</p>`);
    }
    return out.join('');
  }

  function render() {
    document.documentElement.dataset.theme = state.theme;
    ensureSession();
    const configured = Boolean(state.settings.apiKey && state.settings.model && state.settings.customPrefixUrl);
    const currentProvider = PROVIDERS[state.settings.provider] || PROVIDERS.Custom;
    const models = getProviderModels(state.settings.provider);
    const visibleSessions = sessionsForCurrentWorkbook();
    const sessionsHtml = visibleSessions.length ? visibleSessions.map(s => {
      const pendingDelete = state.pendingDeleteSessionId === s.id;
      return `
      <div class="session-item ${s.id === state.currentSessionId ? 'active' : ''} ${pendingDelete ? 'confirming-delete' : ''}">
        <button data-action="switch-session" data-id="${s.id}" title="${escapeHtml(s.name)}" ${pendingDelete ? 'disabled' : ''}><span>${escapeHtml(s.name)}</span><small>${new Date(s.updatedAt).toLocaleString()}</small></button>
        ${pendingDelete ? `<div class="delete-confirm"><small>${t('confirmDeleteSession')}</small><div><button class="confirm-delete-btn" data-action="confirm-delete-session" data-id="${s.id}">${t('confirm')}</button><button class="cancel-delete-btn" data-action="cancel-delete-session" data-id="${s.id}">${t('cancel')}</button></div></div>` : `<button class="delete-btn" data-action="delete-session" data-id="${s.id}" title="${t('deleteSession')}">×</button>`}
      </div>`;
    }).join('') : `<div class="session-empty">${t('noSessions')}</div>`;
    const messagesHtml = state.messages.length ? state.messages.map(renderMessage).join('') : `
      <div class="empty">
        <img class="logo" src="assets/logo.png" alt="logo" />
        <h2>${t('title')}</h2>
        <p>${t('subtitle')}</p>
        <div class="prompt-grid">
          <button class="prompt-card" data-prompt="${escapeHtml(state.locale === 'zh' ? '请根据当前表格数据结构，生成合适的可视化图表' : 'Generate charts to visualize my data and apply professional styling')}"><strong>${t('chart')}</strong><span>${t('chartDesc')}</span></button>
          <button class="prompt-card" data-prompt="${escapeHtml(state.locale === 'zh' ? '帮我检查当前表格中的错误内容，定位问题并给出修复后的正确结果' : 'Check my spreadsheet for formula errors and fix them automatically')}"><strong>${t('fix')}</strong><span>${t('fixDesc')}</span></button>
          <button class="prompt-card" data-prompt="${escapeHtml(state.locale === 'zh' ? '帮我全面分析表中所有内容，并输出汇总结果与关键分析结论' : 'Analyze all workbook contents and summarize key conclusions')}"><strong>${t('analyze')}</strong><span>${t('analyzeDesc')}</span></button>
        </div>
      </div>`;
    document.getElementById('container').innerHTML = `
      <div class="app">
        <header class="header">
          <img class="logo" src="assets/logo.png" alt="logo" />
          <div class="title"><strong>dpoqb in Excel</strong><span>${escapeHtml(state.workbookLabel || (configured ? t('configuredShort') : t('notConfiguredShort')))}</span></div>
          <div class="session-menu-wrap">
            <button class="session-trigger" data-action="toggle-session-menu" title="${t('sessionHistory')}"><span>${t('sessions')}</span><strong>⌄</strong></button>
            ${state.sessionMenuOpen ? `<div class="session-menu">
              <div class="session-menu-head"><strong>${t('sessionHistory')}</strong><button class="secondary-btn compact" data-action="new-chat">＋ ${t('newChat')}</button></div>
              <div class="session-list header-session-list">${sessionsHtml}</div>
            </div>` : ''}
          </div>
          <button class="icon-btn" data-action="toggle-follow" title="${state.settings.followMode ? t('followOn') : t('followOff')}">${state.settings.followMode ? '◎' : '○'}</button>
          <button class="icon-btn" data-action="toggle-theme" title="${state.theme === 'dark' ? t('light') : t('dark')}">${state.theme === 'dark' ? '☀' : '☾'}</button>
          <button class="icon-btn" data-action="toggle-locale" title="language">${t('lang')}</button>
        </header>
        <nav class="tabs">
          <button class="tab ${state.tab === 'chat' ? 'active' : ''}" data-tab="chat">${t('chat')}</button>
          <button class="tab ${state.tab === 'settings' ? 'active' : ''}" data-tab="settings">${t('settings')}</button>
          <button class="tab ${state.tab === 'tools' ? 'active' : ''}" data-tab="tools">${t('tools')}</button>
        </nav>
        <main class="main">
          <section class="panel chat-panel ${state.tab === 'chat' ? 'active' : ''}">
            <div class="messages" id="messages">${messagesHtml}</div>
            <div class="composer">
              ${state.error ? `<div class="error">${escapeHtml(state.error)}</div>` : ''}
              <div class="input-wrap">
                <textarea id="chat-input" rows="2" placeholder="${configured ? t('input') : t('noConfig')}" ${state.isWorking || !configured ? 'disabled' : ''}></textarea>
                <button class="send-btn" data-action="send" ${!configured ? 'disabled' : ''}>${state.isWorking ? t('stop') : t('send')}</button>
              </div>
            </div>
          </section>
          <section class="panel settings-panel ${state.tab === 'settings' ? 'active' : ''}">
            <div class="section">
              <h3>API Configuration</h3>
              <div class="field"><label>${t('provider')}</label><select data-bind="provider">${Object.entries(PROVIDERS).map(([k, p]) => `<option value="${k}" ${state.settings.provider === k ? 'selected' : ''}>${escapeHtml(p.label)}</option>`).join('')}</select></div>
              <div class="field"><label>${t('env')}</label><select data-action="pick-base-url">${currentProvider.baseUrls.map(x => `<option value="${escapeHtml(x.value)}" ${state.settings.customPrefixUrl === x.value ? 'selected' : ''}>${escapeHtml(x.label || x.value)}</option>`).join('')}<option value="__custom__">自定义 / Custom</option></select></div>
              <div class="field"><label>${t('baseUrl')}</label><input data-bind="customPrefixUrl" value="${escapeHtml(state.settings.customPrefixUrl || '')}" placeholder="https://.../v1" /></div>
              <div class="field"><label>${t('model')}</label><select data-action="pick-model">${models.map(m => `<option value="${escapeHtml(m.id)}" ${state.settings.model === m.id ? 'selected' : ''}>${escapeHtml(m.name || m.id)}</option>`).join('')}<option value="__custom__">自定义模型 / Custom model</option></select><input data-bind="model" value="${escapeHtml(state.settings.model || '')}" placeholder="model id" /></div>
              <div class="field"><label>${t('apiKey')}</label><input data-bind="apiKey" value="${escapeHtml(state.settings.apiKey || '')}" type="password" placeholder="sk-..." /></div>
              <div class="field"><label>${t('thinking')}</label><select data-bind="thinking"><option value="none" ${state.settings.thinking === 'none' ? 'selected' : ''}>off</option><option value="low" ${state.settings.thinking === 'low' ? 'selected' : ''}>low</option><option value="medium" ${state.settings.thinking === 'medium' ? 'selected' : ''}>medium</option><option value="high" ${state.settings.thinking === 'high' ? 'selected' : ''}>high</option></select></div>
              <label class="check"><input type="checkbox" data-bind="followMode" ${state.settings.followMode ? 'checked' : ''}/> ${t('followOn')}</label>
              <div class="hint">${configured ? t('configured') : t('notConfigured')}</div>
            </div>
            <div class="section"><h3>${t('usage')}</h3><div class="stats"><div class="stat"><span>Input</span><strong>${state.stats.inputTokens}</strong></div><div class="stat"><span>Output</span><strong>${state.stats.outputTokens}</strong></div><div class="stat"><span>Calls</span><strong>${state.stats.calls}</strong></div><div class="stat"><span>Cost</span><strong>${state.stats.totalCost.toFixed(6)}</strong></div></div></div>
            <div class="section"><h3>${t('about')}</h3><p class="hint">${t('aboutText')}</p>${hasOffice() ? '' : `<p class="hint">${t('demo')}</p>`}</div>
          </section>
          <section class="panel tools-panel ${state.tab === 'tools' ? 'active' : ''}">
            <div class="section tool-runner">
              <h3>${t('manualTool')}</h3>
              <div class="field"><label>${t('toolName')}</label><select id="manual-tool">${TOOL_DEFINITIONS.map(x => `<option value="${x.function.name}">${x.function.name}</option>`).join('')}</select></div>
              <div class="field"><label>${t('params')}</label><textarea id="manual-args">${escapeHtml(defaultArgsForTool(TOOL_DEFINITIONS[0].function.name))}</textarea></div>
              <button class="primary-btn" data-action="run-tool">${t('run')}</button>
              <pre class="output">${escapeHtml(state.toolOutput || t('output'))}</pre>
            </div>
          </section>
        </main>
        <footer class="footer"><span>dpoqb in Excel · Plain Edition</span><span>${escapeHtml(state.settings.model || '')}</span></footer>
      </div>`;
    const msgEl = document.getElementById('messages');
    if (msgEl) msgEl.scrollTop = msgEl.scrollHeight;
  }

  function renderMessage(m) {
    if (m.role === 'tool') {
      return `<div class="msg tool"><div class="bubble">${escapeHtml(m.name || 'tool')}\n${escapeHtml(trimToolText(m.content))}</div><div class="meta">${new Date(m.timestamp || now()).toLocaleTimeString()}</div></div>`;
    }
    if (m.role === 'assistant') {
      let body = m.content ? `<div class="markdown">${renderMarkdown(m.content)}</div>` : '';
      if (m.toolCalls && m.toolCalls.length) {
        body += m.toolCalls.map(tc => `<div class="tool-block"><div class="tool-head"><span>${escapeHtml(tc.name)}</span><span class="status ${tc.status || 'running'}">${escapeHtml(tc.status || 'running')}</span></div><div class="tool-body">${escapeHtml(pretty(tc.args))}${tc.result ? '\n\n' + escapeHtml(trimToolText(tc.result)) : ''}</div></div>`).join('');
      }
      return `<div class="msg assistant"><div class="bubble">${body || '...'}</div><div class="meta">${new Date(m.timestamp || now()).toLocaleTimeString()}</div></div>`;
    }
    return `<div class="msg user"><div class="bubble">${escapeHtml(m.content)}</div><div class="meta">${new Date(m.timestamp || now()).toLocaleTimeString()}</div></div>`;
  }
  function trimToolText(v) { const s = typeof v === 'string' ? v : pretty(v); return s.length > 4000 ? s.slice(0, 4000) + '\n... truncated ...' : s; }

  async function initOffice() {
    if (navigator.userAgent.indexOf('Trident') !== -1 || navigator.userAgent.indexOf('Edge') !== -1) {
      const legacy = document.getElementById('legacy-message');
      if (legacy) legacy.hidden = false;
    }
    if (typeof Office !== 'undefined' && Office.onReady) {
      try {
        await Office.onReady();
        if (hasOffice()) {
          state.workbookId = await getWorkbookId();
          const md = await getWorkbookMetadata().catch(() => null);
          if (md) state.workbookLabel = md.workbookName || ''; // 不再显示当前选择范围，避免展示过期状态
        }
      } catch (e) {
        console.warn('[Office init]', e);
      }
    }
    ensureSession();
    render();
  }

  document.addEventListener('click', async (ev) => {
    const clickedInsideSessionMenu = ev.target.closest('.session-menu-wrap');
    const shouldCloseSessionMenu = state.sessionMenuOpen && !clickedInsideSessionMenu;
    const cite = ev.target.closest('a.citation');
    if (cite) {
      ev.preventDefault();
      const ref = cite.getAttribute('href').replace('#cite:', '');
      await navigateCitation(ref).catch(e => alert(e.message));
      return;
    }
    const tab = ev.target.closest('[data-tab]');
    if (tab) { if (shouldCloseSessionMenu) { state.sessionMenuOpen = false; state.pendingDeleteSessionId = null; } state.tab = tab.dataset.tab; render(); return; }
    const prompt = ev.target.closest('[data-prompt]');
    if (prompt) { fillPrompt(prompt.dataset.prompt || ''); return; }
    const actionEl = ev.target.closest('[data-action]');
    if (!actionEl) { if (shouldCloseSessionMenu) { state.sessionMenuOpen = false; state.pendingDeleteSessionId = null; render(); } return; }
    const action = actionEl.dataset.action;
    if (action === 'toggle-session-menu') {
      state.sessionMenuOpen = !state.sessionMenuOpen;
      state.pendingDeleteSessionId = null;
      render();
    } else if (action === 'send') {
      if (state.isWorking) { stopActiveRequest(); return; }
      const input = document.getElementById('chat-input');
      if (input && input.value.trim()) await sendUserMessage(input.value.trim());
    } else if (action === 'new-chat') {
      const s = makeSession(); state.sessions.unshift(s); state.currentSessionId = s.id; state.messages = []; state.sessionMenuOpen = false; state.pendingDeleteSessionId = null; saveSessions(); render();
    } else if (action === 'clear') {
      state.messages = []; persistCurrentSession(); render();
    } else if (action === 'toggle-theme') {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'; setStoredItem(STORAGE_KEYS.theme, state.theme); render();
    } else if (action === 'toggle-locale') {
      state.locale = state.locale === 'zh' ? 'en' : 'zh'; setStoredItem(STORAGE_KEYS.locale, state.locale); render();
    } else if (action === 'toggle-follow') {
      state.settings.followMode = !state.settings.followMode; saveSettings(); render();
    } else if (action === 'switch-session') {
      const s = state.sessions.find(x => x.id === actionEl.dataset.id); if (s) { state.currentSessionId = s.id; state.messages = s.messages || []; state.sessionMenuOpen = false; state.pendingDeleteSessionId = null; render(); }
    } else if (action === 'delete-session') {
      state.pendingDeleteSessionId = actionEl.dataset.id;
      render();
    } else if (action === 'cancel-delete-session') {
      state.pendingDeleteSessionId = null;
      render();
    } else if (action === 'confirm-delete-session') {
      const deleteId = actionEl.dataset.id;
      state.sessions = state.sessions.filter(x => x.id !== deleteId);
      state.pendingDeleteSessionId = null;
      if (state.currentSessionId === deleteId) { state.currentSessionId = null; state.messages = []; }
      ensureSession(); saveSessions(); render();
    } else if (action === 'run-tool') {
      await runManualTool();
    }
  });

  document.addEventListener('change', (ev) => {
    const bind = ev.target.dataset.bind;
    if (bind) {
      if (ev.target.type === 'checkbox') state.settings[bind] = ev.target.checked;
      else state.settings[bind] = ev.target.value;
      if (bind === 'provider') {
        const provider = PROVIDERS[state.settings.provider] || PROVIDERS.Custom;
        state.settings.customPrefixUrl = provider.baseUrls[0].value || state.settings.customPrefixUrl;
        state.settings.model = provider.models[0].id;
      }
      saveSettings(); render(); return;
    }
    if (ev.target.dataset.action === 'pick-base-url') {
      if (ev.target.value !== '__custom__') state.settings.customPrefixUrl = ev.target.value;
      saveSettings(); render(); return;
    }
    if (ev.target.dataset.action === 'pick-model') {
      if (ev.target.value !== '__custom__') state.settings.model = ev.target.value;
      saveSettings(); render(); return;
    }
    if (ev.target.id === 'manual-tool') {
      const args = document.getElementById('manual-args');
      if (args) args.value = defaultArgsForTool(ev.target.value);
    }
  });

  document.addEventListener('input', (ev) => {
    const bind = ev.target.dataset.bind;
    if (bind) {
      state.settings[bind] = ev.target.value;
      saveSettings();
    }
  });
  document.addEventListener('keydown', async (ev) => {
    if (ev.target.id === 'chat-input' && ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      if (ev.target.value.trim() && !state.isWorking) await sendUserMessage(ev.target.value.trim());
    }
  });

  function fillPrompt(text) {
    const input = document.getElementById('chat-input');
    if (!input) return;
    input.value = text;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  function stopActiveRequest() {
    if (!state.isWorking) return;
    state.stopRequested = true;
    if (state.abortController) state.abortController.abort();
    state.isWorking = false;
    render();
  }

  async function sendUserMessage(text) {
    if (state.isWorking) return;
    state.error = null;
    state.stopRequested = false;
    state.abortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
    ensureSession();
    state.messages.push({ role: 'user', content: text, timestamp: now() });
    state.isWorking = true;
    persistCurrentSession();
    render();
    try {
      await runAgentLoop();
      persistCurrentSession();
    } catch (e) {
      if (state.stopRequested || e?.name === 'AbortError') {
        markStoppedMessage();
        persistCurrentSession();
      } else {
        state.error = e.message || String(e);
      }
    } finally {
      state.isWorking = false;
      state.abortController = null;
      render();
    }
  }

  function makeAbortError() {
    const e = new Error('Request aborted');
    e.name = 'AbortError';
    return e;
  }

  function markStoppedMessage() {
    const text = t('stopped');
    const last = state.messages[state.messages.length - 1];
    if (last && last.role === 'assistant') {
      if (!last.content && !(last.toolCalls && last.toolCalls.length)) last.content = text;
      else if (last.content && !last.content.includes(text)) last.content += `\n\n_${text}_`;
    } else {
      state.messages.push({ role: 'assistant', content: text, timestamp: now() });
    }
  }

  async function runAgentLoop() {
    if (!state.settings.apiKey) throw new Error('Please configure API key first');
    let metadataText = '';
    if (hasOffice()) {
      try { metadataText = '\n\nWorkbook metadata:\n' + JSON.stringify(await getWorkbookMetadata(), null, 2); }
      catch (e) { metadataText = '\n\nWorkbook metadata unavailable: ' + e.message; }
    }
    const conversation = toApiMessages(state.messages);
    const messages = [{ role: 'system', content: SYSTEM_PROMPT + metadataText }, ...conversation];
    const maxSteps = Number(state.settings.maxAgentSteps || 8);

    for (let step = 0; step < maxSteps; step++) {
      if (state.stopRequested) throw makeAbortError();

      const assistantUi = { role: 'assistant', content: '', timestamp: now(), toolCalls: [] };
      state.messages.push(assistantUi);
      render();

      let lastRender = 0;
      const scheduleStreamRender = () => {
        const ts = Date.now();
        if (ts - lastRender > 80) { lastRender = ts; render(); }
      };

      const res = await callChatCompletions(messages, {
        signal: state.abortController?.signal,
        onContent(delta) {
          assistantUi.content += delta;
          scheduleStreamRender();
        }
      });
      updateUsage(res.usage);
      const msg = res.choices?.[0]?.message || {};

      if (msg.content && !assistantUi.content) assistantUi.content = msg.content;

      if (msg.tool_calls && msg.tool_calls.length) {
        messages.push({ role: 'assistant', content: msg.content || '', tool_calls: msg.tool_calls });
        for (const tc of msg.tool_calls) {
          if (state.stopRequested) throw makeAbortError();
          const name = tc.function?.name;
          let args = {};
          try { args = JSON.parse(tc.function?.arguments || '{}'); } catch (e) { args = { _parseError: e.message, raw: tc.function?.arguments || '' }; }
          const uiCall = { id: tc.id, name, args, status: 'running', result: '' };
          assistantUi.toolCalls.push(uiCall); render();
          let toolResult;
          try {
            toolResult = await executeToolByName(name, args);
            if (state.stopRequested) throw makeAbortError();
            uiCall.status = toolResult && toolResult.success === false ? 'error' : 'complete';
            uiCall.result = toolResult;
            await maybeFollow(toolResult);
          } catch (e) {
            if (state.stopRequested || e?.name === 'AbortError') {
              uiCall.status = 'stopped';
              uiCall.result = { success: false, stopped: true };
              render();
              throw makeAbortError();
            }
            toolResult = { success: false, error: e.message || String(e) };
            uiCall.status = 'error'; uiCall.result = toolResult;
          }
          messages.push({ role: 'tool', tool_call_id: tc.id, name, content: JSON.stringify(toolResult) });
          render();
        }
        persistCurrentSession();
        continue;
      }

      if (!assistantUi.content && !(assistantUi.toolCalls && assistantUi.toolCalls.length)) {
        state.messages = state.messages.filter(m => m !== assistantUi);
      }
      render();
      return;
    }

    state.messages.push({ role: 'assistant', content: state.locale === 'zh' ? '工具调用步骤已达到上限，请继续发送指令让我接着完成。' : 'The tool-call step limit was reached. Send another instruction to continue.', timestamp: now() });
  }

  function toApiMessages(messages) {
    const out = [];
    for (const m of messages) {
      if (m.role === 'user') {
        if (String(m.content || '').trim()) out.push({ role: 'user', content: m.content });
      } else if (m.role === 'assistant') {
        const parts = [];
        if (String(m.content || '').trim()) parts.push(m.content);
        const toolSummary = summarizeToolCalls(m.toolCalls || []);
        if (toolSummary) parts.push(toolSummary);
        const content = parts.join('\n\n');
        if (content.trim()) out.push({ role: 'assistant', content });
      }
    }
    return out;
  }

  function summarizeToolCalls(toolCalls) {
    if (!Array.isArray(toolCalls) || !toolCalls.length) return '';
    const lines = toolCalls.map(tc => {
      const result = tc.result ? trimToolText(tc.result) : '';
      return `- ${tc.name || 'tool'} (${tc.status || 'unknown'}): ${result}`;
    });
    return `Tool execution summary from previous turn:\n${lines.join('\n')}`;
  }

  async function callChatCompletions(messages, options = {}) {
    const body = { model: state.settings.model, messages, tools: TOOL_DEFINITIONS, tool_choice: 'auto', temperature: Number(state.settings.temperature || 0.2), stream: true };
    if (state.settings.thinking && state.settings.thinking !== 'none') body.reasoning_effort = state.settings.thinking;
    const res = await fetch(chatEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.settings.apiKey}` },
      body: JSON.stringify(body),
      signal: options.signal
    });
    if (!res.ok) {
      let text = await res.text().catch(() => '');
      try { const j = JSON.parse(text); text = j.error?.message || j.message || text; } catch {}
      throw new Error(`API ${res.status}: ${text || res.statusText}`);
    }

    const contentType = res.headers && res.headers.get ? (res.headers.get('content-type') || '') : '';
    if (!res.body || typeof res.body.getReader !== 'function' || contentType.includes('application/json')) {
      const json = await res.json();
      const content = json.choices?.[0]?.message?.content || '';
      if (content && options.onContent) options.onContent(content);
      return json;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const toolCalls = [];
    let content = '';
    let usage = null;
    let buffer = '';

    const processLine = (line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(':')) return;
      if (!trimmed.startsWith('data:')) return;
      const data = trimmed.slice(5).trim();
      if (!data || data === '[DONE]') return;
      let chunk;
      try { chunk = JSON.parse(data); } catch { return; }
      if (chunk.usage) usage = chunk.usage;
      const choice = chunk.choices && chunk.choices[0];
      const delta = choice && choice.delta ? choice.delta : {};
      if (typeof delta.content === 'string') {
        content += delta.content;
        if (options.onContent) options.onContent(delta.content, content);
      }
      if (Array.isArray(delta.tool_calls)) mergeToolCallDeltas(toolCalls, delta.tool_calls);
    };

    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';
      for (const line of lines) processLine(line);
      if (done) break;
    }
    if (buffer.trim()) processLine(buffer);

    const message = { role: 'assistant', content };
    const normalizedToolCalls = toolCalls.filter(Boolean).map(tc => ({
      id: tc.id || `call_${id().replace(/[^a-zA-Z0-9_]/g, '')}`,
      type: tc.type || 'function',
      function: { name: tc.function.name || '', arguments: tc.function.arguments || '{}' }
    })).filter(tc => tc.function.name);
    if (normalizedToolCalls.length) message.tool_calls = normalizedToolCalls;
    return { choices: [{ message }], usage };
  }

  function mergeToolCallDeltas(toolCalls, deltas) {
    for (const part of deltas) {
      const index = Number.isInteger(part.index) ? part.index : 0;
      const target = toolCalls[index] || { id: '', type: 'function', function: { name: '', arguments: '' } };
      if (part.id) target.id = part.id;
      if (part.type) target.type = part.type;
      if (part.function) {
        if (part.function.name) target.function.name += part.function.name;
        if (part.function.arguments) target.function.arguments += part.function.arguments;
      }
      toolCalls[index] = target;
    }
  }

  function updateUsage(usage) {
    state.stats.calls++;
    if (!usage) return;
    state.stats.inputTokens += usage.prompt_tokens || usage.input_tokens || 0;
    state.stats.outputTokens += usage.completion_tokens || usage.output_tokens || 0;
    state.stats.totalCost += 0;
  }

  async function runManualTool() {
    const name = document.getElementById('manual-tool').value;
    const raw = document.getElementById('manual-args').value;
    state.toolOutput = 'running...'; render();
    try {
      const args = raw.trim() ? JSON.parse(raw) : {};
      const out = await executeToolByName(name, args);
      state.toolOutput = pretty(out);
      await maybeFollow(out);
    } catch (e) {
      state.toolOutput = 'ERROR: ' + (e.message || String(e));
    }
    render();
  }

  function requireOffice() { if (!hasOffice()) throw new Error(t('demo')); }

  async function getWorkbookId() {
    if (!hasOffice()) return 'browser';
    return new Promise((resolve, reject) => {
      const settings = Office.context.document.settings;
      let v = settings.get(STORAGE_KEYS.workbookId);
      if (v) return resolve(v);
      v = id();
      settings.set(STORAGE_KEYS.workbookId, v);
      settings.saveAsync(r => r.status === Office.AsyncResultStatus.Succeeded ? resolve(v) : reject(new Error(r.error?.message || 'Failed to save workbook ID')));
    });
  }
  async function saveOfficeSetting(key, value) {
    return new Promise((resolve, reject) => {
      Office.context.document.settings.set(key, value);
      Office.context.document.settings.saveAsync(r => r.status === Office.AsyncResultStatus.Succeeded ? resolve() : reject(new Error(r.error?.message || 'Failed to save document setting')));
    });
  }
  function loadOfficeSetting(key, fallback) {
    try { return Office.context.document.settings.get(key) || fallback; } catch { return fallback; }
  }

  async function getSheetMap(context, sheets) {
    let map = {};
    try { map = JSON.parse(loadOfficeSetting(STORAGE_KEYS.sheetMap, '{}') || '{}'); } catch { map = {}; }
    let max = Object.values(map).reduce((a, b) => Math.max(a, Number(b) || 0), 0);
    let dirty = false;
    for (const s of sheets) {
      if (!map[s.id]) { map[s.id] = ++max; dirty = true; }
    }
    if (dirty) await saveOfficeSetting(STORAGE_KEYS.sheetMap, JSON.stringify(map)).catch(() => {});
    return new Map(Object.entries(map));
  }
  async function worksheetById(context, stableId) {
    const sheets = context.workbook.worksheets;
    sheets.load('items');
    await context.sync();
    for (const sheet of sheets.items) sheet.load('id,name');
    await context.sync();
    const map = await getSheetMap(context, sheets.items);
    for (const sheet of sheets.items) if (Number(map.get(sheet.id)) === Number(stableId)) return sheet;
    return null;
  }
  function colName(index) { let s = '', n = index; while (n >= 0) { s = String.fromCharCode(n % 26 + 65) + s; n = Math.floor(n / 26) - 1; } return s; }
  function a1(row, col) { return `${colName(col)}${row + 1}`; }
  function quoteSheetName(name) { return `'${String(name || '').replace(/'/g, "''")}'`; }
  function parseStart(address) {
    const part = String(address || 'A1').split('!').pop().split(':')[0].replace(/'/g, '');
    const m = part.match(/([A-Z]+)(\d+)/i);
    if (!m) return { startCol: 0, startRow: 0 };
    const col = m[1].toUpperCase().split('').reduce((acc, ch) => acc * 26 + ch.charCodeAt(0) - 64, 0) - 1;
    return { startCol: col, startRow: Number(m[2]) - 1 };
  }
  function rangeForDimension(ref, count, dim) {
    count = Number(count || 1);
    if (dim === 'rows') {
      const start = Number(ref || 1);
      return `${start}:${start + count - 1}`;
    }
    const start = String(ref || 'A').toUpperCase();
    const n = start.split('').reduce((acc, ch) => acc * 26 + ch.charCodeAt(0) - 64, 0) - 1;
    return `${start}:${colName(n + count - 1)}`;
  }

  async function getWorkbookMetadata() {
    requireOffice();
    return Excel.run(async context => {
      const wb = context.workbook;
      wb.load('name');
      const sheets = wb.worksheets;
      sheets.load('items');
      const active = sheets.getActiveWorksheet();
      active.load('id,name');
      const selected = wb.getSelectedRange();
      selected.load('address');
      await context.sync();
      for (const sheet of sheets.items) sheet.load('id,name,position,visibility');
      await context.sync();
      const map = await getSheetMap(context, sheets.items);
      const info = [];
      for (const sheet of sheets.items) {
        const used = sheet.getUsedRangeOrNullObject();
        used.load('address,rowCount,columnCount');
        await context.sync();
        info.push({ sheetId: Number(map.get(sheet.id)), name: sheet.name, nativeId: sheet.id, position: sheet.position, visibility: sheet.visibility, maxRows: used.isNullObject ? 0 : used.rowCount, maxColumns: used.isNullObject ? 0 : used.columnCount, usedRange: used.isNullObject ? null : used.address.split('!').pop() });
      }
      return { success: true, workbookId: state.workbookId || 'workbook', workbookName: wb.name || '', activeSheet: { sheetId: Number(map.get(active.id)), name: active.name }, selectedRange: selected.address.includes('!') ? selected.address.split('!').pop() : selected.address, worksheets: info };
    });
  }

  async function getCellRanges(args) {
    requireOffice();
    const { sheetId, ranges, includeStyles = true, cellLimit = 2000 } = args;
    const requestedRanges = Array.isArray(ranges) ? ranges : [];
    const limit = Math.max(1, Number(cellLimit || 2000));
    return Excel.run(async context => {
      const sheet = await worksheetById(context, sheetId);
      if (!sheet) throw new Error(`Worksheet with ID ${sheetId} not found`);
      sheet.load('name');
      const used = sheet.getUsedRangeOrNullObject();
      used.load('address');
      await context.sync();
      const dimension = used.isNullObject ? 'A1' : used.address.split('!').pop();
      const cells = {}, formulas = {}, styles = {};
      let count = 0, hasMore = false;
      for (let rangeIndex = 0; rangeIndex < requestedRanges.length; rangeIndex++) {
        if (count >= limit) { hasMore = true; break; }
        const rangeText = requestedRanges[rangeIndex];
        const range = sheet.getRange(rangeText);
        range.load('values,formulas,address,rowCount,columnCount');
        await context.sync();
        const start = parseStart(range.address);
        const styleCells = [];
        let stoppedInsideRange = false;
        outer: for (let r = 0; r < range.rowCount; r++) {
          for (let c = 0; c < range.columnCount; c++) {
            if (count >= limit) { stoppedInsideRange = true; break outer; }
            const key = a1(start.startRow + r, start.startCol + c);
            const val = range.values[r][c];
            const formula = range.formulas[r][c];
            let returnedSomething = false;
            if (val !== null && val !== '' && typeof val !== 'undefined') { cells[key] = val; returnedSomething = true; }
            if (typeof formula === 'string' && formula.startsWith('=')) { formulas[key] = formula; returnedSomething = true; }
            if (returnedSomething) {
              count++;
              if (includeStyles) styleCells.push([key, range.getCell(r, c)]);
            }
          }
        }
        if (stoppedInsideRange || (count >= limit && rangeIndex < requestedRanges.length - 1)) hasMore = true;
        if (includeStyles && styleCells.length) {
          styleCells.forEach(([, cell]) => { cell.format.font.load('name,size,color,bold,italic,underline,strikethrough'); cell.format.fill.load('color'); cell.format.load('horizontalAlignment'); });
          await context.sync();
          for (const [key, cell] of styleCells) {
            const style = {};
            if (cell.format.font.name) style.fontFamily = cell.format.font.name;
            if (cell.format.font.size) style.fontSize = cell.format.font.size;
            if (cell.format.font.bold !== null) style.fontWeight = cell.format.font.bold ? 'bold' : 'normal';
            if (cell.format.font.italic !== null) style.fontStyle = cell.format.font.italic ? 'italic' : 'normal';
            if (cell.format.font.color) style.fontColor = cell.format.font.color;
            if (cell.format.fill.color) style.backgroundColor = cell.format.fill.color;
            if (cell.format.horizontalAlignment) style.horizontalAlignment = String(cell.format.horizontalAlignment).toLowerCase();
            if (Object.keys(style).length) styles[key] = style;
          }
        }
        if (hasMore) break;
      }
      return { success: true, hasMore, worksheet: { name: sheet.name, sheetId, dimension, cells, formulas, styles, borders: {} } };
    });
  }

  async function getRangeAsCsv(args) {
    requireOffice();
    const { sheetId, range, includeHeaders = true, maxRows = 500 } = args;
    return Excel.run(async context => {
      const sheet = await worksheetById(context, sheetId);
      if (!sheet) throw new Error(`Worksheet with ID ${sheetId} not found`);
      sheet.load('name');
      const r = sheet.getRange(range);
      r.load('values,rowCount,columnCount');
      await context.sync();
      const start = includeHeaders ? 0 : 1;
      const rows = [];
      for (let i = start; i < Math.min(r.rowCount, start + maxRows); i++) rows.push(r.values[i].map(csvEscape).join(','));
      return { success: true, csv: rows.join('\n'), rowCount: rows.length, columnCount: r.columnCount, hasMore: r.rowCount - start > maxRows, sheetName: sheet.name };
    });
  }
  function csvEscape(v) { if (v == null) return ''; const s = String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }

  async function searchData(args) {
    requireOffice();
    const { searchTerm, sheetId, range, offset = 0, options = {} } = args;
    const { matchCase = false, matchEntireCell = false, matchFormulas = false, useRegex = false, maxResults = 500 } = options;
    return Excel.run(async context => {
      const sheets = context.workbook.worksheets;
      sheets.load('items'); await context.sync();
      for (const s of sheets.items) s.load('id,name'); await context.sync();
      const map = await getSheetMap(context, sheets.items);
      const targetSheets = sheetId ? [await worksheetById(context, sheetId)].filter(Boolean) : sheets.items;
      const matches = [];
      const regex = useRegex ? new RegExp(searchTerm, matchCase ? 'g' : 'ig') : null;
      for (const sheet of targetSheets) {
        const r = range ? sheet.getRange(range) : sheet.getUsedRangeOrNullObject();
        r.load('values,formulas,address,rowCount,columnCount'); await context.sync();
        if (r.isNullObject) continue;
        const start = parseStart(r.address);
        for (let row = 0; row < r.rowCount; row++) for (let col = 0; col < r.columnCount; col++) {
          const val = r.values[row][col];
          const formula = r.formulas[row][col];
          const text = String(matchFormulas && formula ? formula : (val ?? ''));
          let ok;
          if (regex) { regex.lastIndex = 0; ok = regex.test(text); }
          else { const a = matchCase ? text : text.toLowerCase(); const b = matchCase ? searchTerm : searchTerm.toLowerCase(); ok = matchEntireCell ? a === b : a.includes(b); }
          if (ok) matches.push({ sheetName: sheet.name, sheetId: Number(map.get(sheet.id)), a1: a1(start.startRow + row, start.startCol + col), value: val, formula: typeof formula === 'string' && formula.startsWith('=') ? formula : null, row: start.startRow + row + 1, column: start.startCol + col + 1 });
        }
      }
      const slice = matches.slice(offset, offset + maxResults);
      return { success: true, matches: slice, totalFound: matches.length, returned: slice.length, offset, hasMore: offset + maxResults < matches.length, searchTerm, nextOffset: offset + maxResults < matches.length ? offset + maxResults : null };
    });
  }

  async function setCellRange(args) {
    requireOffice();
    const { sheetId, range, cells, copyToRange, resizeWidth, resizeHeight, allow_overwrite = false } = args;
    const maxWriteCells = 10000;
    if (!Array.isArray(cells) || !cells.length || !cells.every(Array.isArray)) throw new Error('cells must be a non-empty two-dimensional array');
    const writeCellCount = cells.reduce((sum, row) => sum + row.length, 0);
    if (writeCellCount > maxWriteCells) throw new Error(`Refusing to write ${writeCellCount} cells in one call. Split the write into chunks of ${maxWriteCells} cells or fewer.`);
    return Excel.run(async context => {
      const sheet = await worksheetById(context, sheetId);
      if (!sheet) throw new Error(`Worksheet with ID ${sheetId} not found`);
      sheet.load('name');
      const r = sheet.getRange(range);
      r.load('values,formulas,address,rowCount,columnCount'); await context.sync();
      if (cells.length !== r.rowCount) throw new Error(`cells row count (${cells.length}) does not match target range row count (${r.rowCount})`);
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].length !== r.columnCount) throw new Error(`cells[${i}] column count (${cells[i].length}) does not match target range column count (${r.columnCount})`);
      }
      const start = parseStart(r.address);
      if (!allow_overwrite) {
        const occupied = [];
        for (let i = 0; i < r.rowCount; i++) for (let j = 0; j < r.columnCount; j++) {
          if ((r.values[i][j] !== null && r.values[i][j] !== '') || (typeof r.formulas[i][j] === 'string' && r.formulas[i][j].startsWith('='))) occupied.push(a1(start.startRow + i, start.startCol + j));
        }
        if (occupied.length) throw new Error(`Would overwrite ${occupied.length} non-empty cell(s): ${occupied.slice(0, 10).join(', ')}${occupied.length > 10 ? '...' : ''}. Retry with allow_overwrite=true if confirmed.`);
      }
      const matrix = cells.map(row => row.map(cell => cell && typeof cell === 'object' ? (cell.formula || (cell.value ?? null)) : (cell ?? null)));
      r.formulas = matrix;
      const sheetPrefix = `${quoteSheetName(sheet.name)}!`;
      for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
          const cellAddress = `${sheetPrefix}${a1(start.startRow + i, start.startCol + j)}`;
          applyCellOptions(context, r.getCell(i, j), cells[i][j], cellAddress);
        }
      }
      if (copyToRange) sheet.getRange(copyToRange).copyFrom(r, Excel.RangeCopyType.all, false, false);
      applyResize(r, resizeWidth, resizeHeight);
      await context.sync();
      const dirty = [{ sheetId, range }];
      if (copyToRange) dirty.push({ sheetId, range: copyToRange });
      return { success: true, writtenRange: range, copiedTo: copyToRange || null, _dirtyRanges: dirty };
    });
  }
  function applyCellOptions(context, cell, spec, cellAddress) {
    if (!spec || typeof spec !== 'object') return;
    if (spec.note) {
      if (!context.workbook.notes || typeof context.workbook.notes.add !== 'function') throw new Error('Excel Notes API is not available in this Office host');
      context.workbook.notes.add(cellAddress, String(spec.note));
    }
    const st = spec.cellStyles || {};
    if (st.fontWeight) cell.format.font.bold = st.fontWeight === 'bold';
    if (st.fontStyle) cell.format.font.italic = st.fontStyle === 'italic';
    if (st.fontSize) cell.format.font.size = st.fontSize;
    if (st.fontFamily) cell.format.font.name = st.fontFamily;
    if (st.fontColor) cell.format.font.color = st.fontColor;
    if (st.backgroundColor) cell.format.fill.color = st.backgroundColor;
    if (st.horizontalAlignment) cell.format.horizontalAlignment = st.horizontalAlignment;
    if (st.numberFormat) cell.numberFormat = [[st.numberFormat]];
    const borderMap = { top: 'EdgeTop', bottom: 'EdgeBottom', left: 'EdgeLeft', right: 'EdgeRight' };
    for (const [side, val] of Object.entries(spec.borderStyles || {})) {
      if (!val || !borderMap[side]) continue;
      const b = cell.format.borders.getItem(borderMap[side]);
      if (val.color) b.color = val.color;
      if (val.weight) b.weight = val.weight;
      if (val.style) b.style = val.style === 'solid' ? 'Continuous' : val.style;
    }
  }
  function applyResize(r, width, height) { if (width) r.getEntireColumn().format.columnWidth = width.value; if (height) r.getEntireRow().format.rowHeight = height.value; }

  async function clearCellRange(args) {
    requireOffice();
    const { sheetId, range, clearType = 'contents' } = args;
    return Excel.run(async context => {
      const sheet = await worksheetById(context, sheetId);
      if (!sheet) throw new Error(`Worksheet with ID ${sheetId} not found`);
      const map = { contents: Excel.ClearApplyTo.contents, formats: Excel.ClearApplyTo.formats, all: Excel.ClearApplyTo.all };
      sheet.getRange(range).clear(map[clearType] || Excel.ClearApplyTo.contents);
      await context.sync();
      return { success: true, cleared: range, clearType, _dirtyRanges: [{ sheetId, range }] };
    });
  }

  async function copyTo(args) {
    requireOffice();
    const { sheetId, sourceRange, destinationRange } = args;
    return Excel.run(async context => {
      const sheet = await worksheetById(context, sheetId);
      if (!sheet) throw new Error(`Worksheet with ID ${sheetId} not found`);
      sheet.getRange(destinationRange).copyFrom(sheet.getRange(sourceRange), Excel.RangeCopyType.all, false, false);
      await context.sync();
      return { success: true, sourceRange, destinationRange, _dirtyRanges: [{ sheetId, range: destinationRange }] };
    });
  }

  async function modifySheetStructure(args) {
    requireOffice();
    const { sheetId, operation, dimension = 'rows', reference, count = 1, position = 'before' } = args;
    return Excel.run(async context => {
      const sheet = await worksheetById(context, sheetId);
      if (!sheet) throw new Error(`Worksheet with ID ${sheetId} not found`);
      if (operation === 'unfreeze') sheet.freezePanes.unfreeze();
      else if (operation === 'freeze') dimension === 'columns' ? sheet.freezePanes.freezeColumns(Number(count || reference || 1)) : sheet.freezePanes.freezeRows(Number(count || reference || 1));
      else {
        let ref = reference;
        if (operation === 'insert' && position === 'after') {
          if (dimension === 'rows') ref = String(Number(reference || 1) + 1);
          else ref = colName(String(reference || 'A').toUpperCase().split('').reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0));
        }
        const range = sheet.getRange(rangeForDimension(ref, count, dimension));
        if (operation === 'insert') range.insert(dimension === 'rows' ? Excel.InsertShiftDirection.down : Excel.InsertShiftDirection.right);
        if (operation === 'delete') range.delete(dimension === 'rows' ? Excel.DeleteShiftDirection.up : Excel.DeleteShiftDirection.left);
        if (operation === 'hide') dimension === 'rows' ? range.rowHidden = true : range.columnHidden = true;
        if (operation === 'unhide') dimension === 'rows' ? range.rowHidden = false : range.columnHidden = false;
      }
      await context.sync();
      return { success: true, operation, dimension, sheetId, _dirtyRanges: [{ sheetId, range: '*' }] };
    });
  }

  async function modifyWorkbookStructure(args) {
    requireOffice();
    const { operation, sheetId, sheetName, newName, tabColor } = args;
    return Excel.run(async context => {
      let result = { success: true, operation };
      if (operation === 'create') {
        const s = context.workbook.worksheets.add(sheetName || 'Sheet');
        if (tabColor) s.tabColor = tabColor;
        s.load('id,name'); await context.sync();
        const map = await getSheetMap(context, [s]);
        result.sheetId = Number(map.get(s.id)); result.name = s.name;
      } else {
        const sheet = await worksheetById(context, sheetId);
        if (!sheet) throw new Error(`Worksheet with ID ${sheetId} not found`);
        if (operation === 'delete') sheet.delete();
        if (operation === 'rename') { sheet.name = newName || sheetName || sheet.name; if (tabColor) sheet.tabColor = tabColor; }
        if (operation === 'duplicate') {
          const copy = sheet.copy(Excel.WorksheetPositionType.after, sheet);
          if (newName) copy.name = newName;
          if (tabColor) copy.tabColor = tabColor;
          copy.load('id,name'); await context.sync();
          const map = await getSheetMap(context, [copy]);
          result.sheetId = Number(map.get(copy.id)); result.name = copy.name;
        }
      }
      await context.sync();
      result._dirtyRanges = result.sheetId ? [{ sheetId: result.sheetId, range: '*' }] : (sheetId ? [{ sheetId, range: '*' }] : []);
      return result;
    });
  }

  async function resizeRange(args) {
    requireOffice();
    const { sheetId, range, width, height } = args;
    return Excel.run(async context => {
      const sheet = await worksheetById(context, sheetId);
      if (!sheet) throw new Error(`Worksheet with ID ${sheetId} not found`);
      const r = range ? sheet.getRange(range) : sheet.getUsedRangeOrNullObject();
      applyResize(r, width, height);
      await context.sync();
      return { success: true, sheetId, range: range || '*', _dirtyRanges: [{ sheetId, range: range || '*' }] };
    });
  }

  async function getAllObjects(args = {}) {
    requireOffice();
    const { sheetId, id } = args;
    return Excel.run(async context => {
      const sheets = context.workbook.worksheets;
      sheets.load('items'); await context.sync();
      for (const s of sheets.items) s.load('id,name'); await context.sync();
      const map = await getSheetMap(context, sheets.items);
      const targetSheets = sheetId ? [await worksheetById(context, sheetId)].filter(Boolean) : sheets.items;
      const objects = [];
      for (const sheet of targetSheets) {
        const charts = sheet.charts; charts.load('items');
        const pivots = sheet.pivotTables; pivots.load('items');
        await context.sync();
        for (const c of charts.items) { c.load('id,name'); await context.sync(); if (!id || c.id === id) objects.push({ id: c.id, type: 'chart', name: c.name, sheetId: Number(map.get(sheet.id)), sheetName: sheet.name }); }
        for (const p of pivots.items) { p.load('id,name'); await context.sync(); if (!id || p.id === id) objects.push({ id: p.id, type: 'pivotTable', name: p.name, sheetId: Number(map.get(sheet.id)), sheetName: sheet.name }); }
      }
      return { success: true, objects };
    });
  }

  async function modifyObject(args) {
    requireOffice();
    const { operation, sheetId, objectType, id: objectId, properties = {} } = args;
    return Excel.run(async context => {
      const sheet = await worksheetById(context, sheetId);
      if (!sheet) throw new Error(`Worksheet with ID ${sheetId} not found`);
      let result = { success: true, operation, objectType, sheetId };
      if (objectType === 'chart') {
        if (operation === 'create') {
          if (!properties.source || !properties.chartType) throw new Error('Chart creation requires source and chartType');
          const chart = sheet.charts.add(properties.chartType, sheet.getRange(properties.source), Excel.ChartSeriesBy.auto);
          if (properties.name) chart.name = properties.name;
          if (properties.title) { chart.title.text = properties.title; chart.title.visible = true; }
          if (properties.anchor) chart.setPosition(properties.anchor);
          chart.load('id,name'); await context.sync();
          result.id = chart.id; result.name = chart.name;
        } else {
          if (!objectId) throw new Error('Chart update/delete requires id');
          const chart = sheet.charts.getItem(objectId);
          if (operation === 'delete') chart.delete();
          if (operation === 'update') {
            if (properties.title) { chart.title.text = properties.title; chart.title.visible = true; }
            if (properties.name) chart.name = properties.name;
            if (properties.anchor) chart.setPosition(properties.anchor);
          }
        }
      } else if (objectType === 'pivotTable') {
        if (operation === 'create') {
          if (!properties.source || !properties.range) throw new Error('PivotTable creation requires source and range');
          const pivot = sheet.pivotTables.add(properties.name || `Pivot_${Date.now()}`, properties.source, properties.range);
          await context.sync();
          const fieldErrors = await addPivotFields(context, pivot, properties);
          pivot.load('id,name'); await context.sync();
          result.id = pivot.id; result.name = pivot.name;
          if (fieldErrors.length) { result.success = false; result.errors = fieldErrors; }
        } else {
          if (!objectId) throw new Error('PivotTable update/delete requires id');
          const pivot = sheet.pivotTables.getItem(objectId);
          if (operation === 'delete') pivot.delete();
          if (operation === 'update') {
            const fieldErrors = await addPivotFields(context, pivot, properties);
            if (fieldErrors.length) { result.success = false; result.errors = fieldErrors; }
          }
        }
      }
      await context.sync();
      result._dirtyRanges = [{ sheetId, range: properties.range || properties.anchor || '*' }];
      return result;
    });
  }
  async function addPivotFields(context, pivot, p) {
    const errors = [];
    for (const x of (p.rows || [])) {
      try {
        pivot.rowHierarchies.add(pivot.hierarchies.getItem(x.field));
        await context.sync();
      } catch (e) {
        errors.push({ area: 'rows', field: x.field, error: e.message || String(e) });
      }
    }
    for (const x of (p.columns || [])) {
      try {
        pivot.columnHierarchies.add(pivot.hierarchies.getItem(x.field));
        await context.sync();
      } catch (e) {
        errors.push({ area: 'columns', field: x.field, error: e.message || String(e) });
      }
    }
    for (const x of (p.values || [])) {
      try {
        const h = pivot.hierarchies.getItem(x.field);
        const dh = pivot.dataHierarchies.add(h);
        if (x.summarizeBy) dh.summarizeBy = pivotSummarizeBy(x.summarizeBy);
        await context.sync();
      } catch (e) {
        errors.push({ area: 'values', field: x.field, summarizeBy: x.summarizeBy || null, error: e.message || String(e) });
      }
    }
    return errors;
  }
  function pivotSummarizeBy(value) {
    const map = {
      sum: Excel.AggregationFunction && Excel.AggregationFunction.sum || 'Sum',
      count: Excel.AggregationFunction && Excel.AggregationFunction.count || 'Count',
      average: Excel.AggregationFunction && Excel.AggregationFunction.average || 'Average',
      max: Excel.AggregationFunction && Excel.AggregationFunction.max || 'Max',
      min: Excel.AggregationFunction && Excel.AggregationFunction.min || 'Min'
    };
    return map[value] || value;
  }

  async function evalOfficeJs(args) {
    requireOffice();
    const code = args.code || '';
    return Excel.run(async context => {
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const fn = new AsyncFunction('context', 'Excel', code);
      const result = await fn(context, Excel);
      return { success: true, result: result ?? null, _dirtyRanges: [{ sheetId: -1, range: '*' }] };
    });
  }

  async function executeToolByName(name, args) {
    const fn = TOOL_EXECUTORS[name];
    if (!fn) throw new Error(`Tool ${name} not found`);
    return fn(args || {});
  }
  async function maybeFollow(result) {
    if (!state.settings.followMode || !result) return;
    const dirty = result._dirtyRanges;
    if (!Array.isArray(dirty) || !dirty.length) return;
    const first = dirty.find(x => x.sheetId && x.sheetId > 0);
    if (first) await selectRange(first.sheetId, first.range === '*' ? undefined : first.range).catch(console.warn);
  }
  async function selectRange(sheetId, range) {
    requireOffice();
    return Excel.run(async context => {
      const sheet = await worksheetById(context, sheetId);
      if (!sheet) throw new Error(`Worksheet with ID ${sheetId} not found`);
      sheet.activate();
      if (range) sheet.getRange(range).select();
      await context.sync();
      return { success: true };
    });
  }
  async function navigateCitation(ref) {
    const [sid, range] = ref.split('!');
    return selectRange(Number(sid), range);
  }

  const TOOL_EXECUTORS = {
    get_cell_ranges: getCellRanges,
    get_range_as_csv: getRangeAsCsv,
    search_data: searchData,
    get_all_objects: getAllObjects,
    set_cell_range: setCellRange,
    clear_cell_range: clearCellRange,
    copy_to: copyTo,
    modify_sheet_structure: modifySheetStructure,
    modify_workbook_structure: modifyWorkbookStructure,
    resize_range: resizeRange,
    modify_object: modifyObject,
    eval_officejs: evalOfficeJs
  };

  const TOOL_DEFINITIONS = [
    { type: 'function', function: { name: 'get_cell_ranges', description: 'Read cell values, formulas, and formatting from specified ranges in a worksheet. Returns cells as a sparse object with A1-notation keys.', parameters: { type: 'object', properties: { sheetId: { type: 'number', description: 'The worksheet ID (1-based index)' }, ranges: { type: 'array', items: { type: 'string' }, description: "Array of ranges in A1 notation, e.g. ['A1:C10']" }, includeStyles: { type: 'boolean', description: 'Include font/fill styling info. Default true' }, cellLimit: { type: 'number', description: 'Maximum cells to return. Default 2000' }, explanation: { type: 'string' } }, required: ['sheetId', 'ranges'] } } },
    { type: 'function', function: { name: 'get_range_as_csv', description: 'Read cell data from a range and return it as CSV format. Great for analysis.', parameters: { type: 'object', properties: { sheetId: { type: 'number' }, range: { type: 'string' }, includeHeaders: { type: 'boolean' }, maxRows: { type: 'number' }, explanation: { type: 'string' } }, required: ['sheetId', 'range'] } } },
    { type: 'function', function: { name: 'search_data', description: 'Find text or values across the spreadsheet. Supports regex and case-sensitive search.', parameters: { type: 'object', properties: { searchTerm: { type: 'string' }, sheetId: { type: 'number' }, range: { type: 'string' }, offset: { type: 'number' }, options: { type: 'object', properties: { matchCase: { type: 'boolean' }, matchEntireCell: { type: 'boolean' }, matchFormulas: { type: 'boolean' }, useRegex: { type: 'boolean' }, maxResults: { type: 'number' } } }, explanation: { type: 'string' } }, required: ['searchTerm'] } } },
    { type: 'function', function: { name: 'get_all_objects', description: 'List all charts, pivot tables, and other objects in the workbook.', parameters: { type: 'object', properties: { sheetId: { type: 'number' }, id: { type: 'string' }, explanation: { type: 'string' } } } } },
    { type: 'function', function: { name: 'set_cell_range', description: "WRITE. Write values, formulas, notes, and formatting to cells. By default fails if target cells contain data. Retry with allow_overwrite=true after confirmation.", parameters: { type: 'object', properties: { sheetId: { type: 'number' }, range: { type: 'string' }, cells: { type: 'array', items: { type: 'array', items: { type: 'object', properties: { value: {}, formula: { type: 'string' }, note: { type: 'string' }, cellStyles: { type: 'object' }, borderStyles: { type: 'object' } } } } }, copyToRange: { type: 'string' }, resizeWidth: { type: 'object', properties: { type: { enum: ['points', 'standard'] }, value: { type: 'number' } } }, resizeHeight: { type: 'object', properties: { type: { enum: ['points', 'standard'] }, value: { type: 'number' } } }, allow_overwrite: { type: 'boolean' }, explanation: { type: 'string' } }, required: ['sheetId', 'range', 'cells'] } } },
    { type: 'function', function: { name: 'clear_cell_range', description: "Clear contents, formatting, or both from a range. clearType: contents/formats/all.", parameters: { type: 'object', properties: { sheetId: { type: 'number' }, range: { type: 'string' }, clearType: { enum: ['contents', 'formats', 'all'] }, explanation: { type: 'string' } }, required: ['sheetId', 'range'] } } },
    { type: 'function', function: { name: 'copy_to', description: 'Copy a range to another location with formula translation. If destination is larger, source pattern repeats.', parameters: { type: 'object', properties: { sheetId: { type: 'number' }, sourceRange: { type: 'string' }, destinationRange: { type: 'string' }, explanation: { type: 'string' } }, required: ['sheetId', 'sourceRange', 'destinationRange'] } } },
    { type: 'function', function: { name: 'modify_sheet_structure', description: "Insert, delete, hide, unhide, or freeze rows and columns. Use reference like '5' or 'C'.", parameters: { type: 'object', properties: { sheetId: { type: 'number' }, operation: { enum: ['insert', 'delete', 'hide', 'unhide', 'freeze', 'unfreeze'] }, dimension: { enum: ['rows', 'columns'] }, reference: { type: 'string' }, count: { type: 'number' }, position: { enum: ['before', 'after'] }, explanation: { type: 'string' } }, required: ['sheetId', 'operation', 'dimension'] } } },
    { type: 'function', function: { name: 'modify_workbook_structure', description: 'Create, delete, rename, or duplicate worksheets.', parameters: { type: 'object', properties: { operation: { enum: ['create', 'delete', 'rename', 'duplicate'] }, sheetId: { type: 'number' }, sheetName: { type: 'string' }, newName: { type: 'string' }, tabColor: { type: 'string' }, explanation: { type: 'string' } }, required: ['operation'] } } },
    { type: 'function', function: { name: 'resize_range', description: "Adjust column widths or row heights. Use 'A:D' for columns, '1:5' for rows, or omit range for entire sheet.", parameters: { type: 'object', properties: { sheetId: { type: 'number' }, range: { type: 'string' }, width: { type: 'object', properties: { type: { enum: ['points', 'standard'] }, value: { type: 'number' } } }, height: { type: 'object', properties: { type: { enum: ['points', 'standard'] }, value: { type: 'number' } } }, explanation: { type: 'string' } }, required: ['sheetId'] } } },
    { type: 'function', function: { name: 'modify_object', description: 'Create, update, or delete charts and pivot tables.', parameters: { type: 'object', properties: { operation: { enum: ['create', 'update', 'delete'] }, sheetId: { type: 'number' }, objectType: { enum: ['pivotTable', 'chart'] }, id: { type: 'string' }, properties: { type: 'object', properties: { name: { type: 'string' }, source: { type: 'string' }, range: { type: 'string' }, anchor: { type: 'string' }, rows: { type: 'array', items: { type: 'object', properties: { field: { type: 'string' } } } }, columns: { type: 'array', items: { type: 'object', properties: { field: { type: 'string' } } } }, values: { type: 'array', items: { type: 'object', properties: { field: { type: 'string' }, summarizeBy: { enum: ['sum', 'count', 'average', 'max', 'min'] } } } }, title: { type: 'string' }, chartType: { enum: ['columnClustered', 'barClustered', 'line', 'pie', 'scatter', 'area', 'doughnut'] } } }, explanation: { type: 'string' } }, required: ['operation', 'sheetId', 'objectType'] } } },
    { type: 'function', function: { name: 'eval_officejs', description: 'Execute arbitrary Office.js code in Excel.run. Escape hatch for unsupported operations. Code receives context and Excel.', parameters: { type: 'object', properties: { code: { type: 'string' }, explanation: { type: 'string' } }, required: ['code'] } } }
  ];

  function defaultArgsForTool(name) {
    const samples = {
      get_cell_ranges: { sheetId: 1, ranges: ['A1:D10'], includeStyles: true, cellLimit: 2000 },
      get_range_as_csv: { sheetId: 1, range: 'A1:D10', includeHeaders: true, maxRows: 500 },
      search_data: { searchTerm: 'keyword', options: { matchCase: false, useRegex: false, maxResults: 100 } },
      get_all_objects: {},
      set_cell_range: { sheetId: 1, range: 'A1:B2', cells: [[{ value: '标题1', cellStyles: { fontWeight: 'bold' } }, { value: '标题2', cellStyles: { fontWeight: 'bold' } }], [{ value: 1 }, { formula: '=A2*2' }]], allow_overwrite: false },
      clear_cell_range: { sheetId: 1, range: 'A1:B2', clearType: 'contents' },
      copy_to: { sheetId: 1, sourceRange: 'A1:B2', destinationRange: 'D1:E2' },
      modify_sheet_structure: { sheetId: 1, operation: 'insert', dimension: 'rows', reference: '5', count: 1, position: 'before' },
      modify_workbook_structure: { operation: 'create', sheetName: 'AI分析结果', tabColor: '#134cff' },
      resize_range: { sheetId: 1, range: 'A:D', width: { type: 'points', value: 90 } },
      modify_object: { operation: 'create', sheetId: 1, objectType: 'chart', properties: { source: 'A1:B10', chartType: 'columnClustered', anchor: 'E2', title: 'Chart' } },
      eval_officejs: { code: "const range = context.workbook.worksheets.getActiveWorksheet().getRange('A1');\nrange.load('values');\nawait context.sync();\nreturn range.values;" }
    };
    return pretty(samples[name] || {});
  }

  window.dpoqbExcelTools = TOOL_EXECUTORS;
  initOffice();
})();
