// ==========================================================================
// Security & Cybersecurity Hardening Module - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

export class SecurityService {
  /**
   * Sanitizes text strings to prevent Cross-Site Scripting (XSS) attacks.
   * Escapes dangerous HTML characters: <, >, &, ", ', /
   * @param {string} str - Raw user input
   * @returns {string} Sanitized string safe for DOM insertion
   */
  static escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Cleans and sanitizes HTML text while stripping inline scripts and event handlers.
   * @param {string} htmlString - Input text/HTML
   * @returns {string} Safe HTML string
   */
  static sanitizeHTML(htmlString) {
    if (!htmlString || typeof htmlString !== 'string') return '';
    
    // Remove script tags and contents
    let clean = htmlString.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers (e.g., onerror, onload, onclick, onmouseover)
    clean = clean.replace(/on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    
    // Remove javascript: pseudo-protocols
    clean = clean.replace(/javascript\s*:/gi, '');
    
    // Remove data: text/html protocols
    clean = clean.replace(/data\s*:\s*text\/html/gi, '');
    
    return clean;
  }

  /**
   * Validates URLs to ensure they use safe protocols (https, http, relative paths, or blob).
   * @param {string} url - URL string to test
   * @returns {boolean} True if safe, false if malicious
   */
  static isValidURL(url) {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim().toLowerCase();
    
    // Block javascript:, data:text/html, and vbscript: protocols
    if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:text/html') || trimmed.startsWith('vbscript:')) {
      return false;
    }
    
    // Allow https, http, relative assets, and blob URLs
    return (
      trimmed.startsWith('https://') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('assets/') ||
      trimmed.startsWith('./assets/') ||
      trimmed.startsWith('blob:')
    );
  }

  /**
   * Sanitizes image URLs to prevent CSRF or XSS via broken image onerror handlers.
   * @param {string} url 
   * @param {string} fallback 
   * @returns {string} Safe image URL
   */
  static safeImageURL(url, fallback = 'assets/logo.png') {
    if (this.isValidURL(url)) {
      return this.escapeHTML(url);
    }
    return fallback;
  }

  /**
   * Validates file upload type to enforce strict PDF file security.
   * @param {File} file 
   * @returns {boolean}
   */
  static isValidPDFFile(file) {
    if (!file) return false;
    const isPDFType = file.type === 'application/pdf';
    const hasPDFExt = file.name.toLowerCase().endsWith('.pdf');
    const isValidSize = file.size > 0 && file.size < 50 * 1024 * 1024; // Max 50MB
    return isPDFType && hasPDFExt && isValidSize;
  }

  /**
   * Sanitizes user profile inputs (usernames, comments, reviews).
   * @param {string} text 
   * @param {number} maxLength 
   * @returns {string}
   */
  static cleanUserInput(text, maxLength = 1000) {
    if (!text) return '';
    const trimmed = String(text).trim().slice(0, maxLength);
    return this.escapeHTML(trimmed);
  }
}
