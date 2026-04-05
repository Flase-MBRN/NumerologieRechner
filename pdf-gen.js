/**
 * MBRN PDF Generator v1.0
 * Client-seitige PDF Generierung für Numerologie Reports
 * 
 * @version 1.0.0
 * @author SWE 1.5
 * @license MIT
 */

class NumerologiePDFGenerator {
  constructor(options = {}) {
    this.config = {
      filename: options.filename || 'numerologie-report.pdf',
      quality: options.quality || 1.0,
      format: options.format || 'a4',
      ...options
    };
    
    this.isGenerating = false;
    this.reportData = null;
  }
  
  /**
   * Generiert PDF aus aktuellen Report-Daten
   * @param {Object} reportData - Numerologie Report Daten
   * @returns {Promise<Blob>}
   */
  async generatePDF(reportData) {
    if (this.isGenerating) {
      throw new Error('PDF wird bereits generiert');
    }
    
    this.isGenerating = true;
    this.reportData = reportData;
    
    try {
      // PDF mit html2canvas + jsPDF generieren
      const pdf = await this._createPDFContent();
      this.isGenerating = false;
      return pdf;
    } catch (error) {
      this.isGenerating = false;
      throw error;
    }
  }
  
  /**
   * Erstellt PDF Content
   * @private
   */
  async _createPDFContent() {
    // Dynamische Bibliotheken laden
    await this._loadDependencies();
    
    // PDF Container erstellen
    const container = this._createPDFContainer();
    document.body.appendChild(container);
    
    try {
      // In Canvas rendern
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: container.scrollWidth,
        height: container.scrollHeight
      });
      
      // PDF erstellen
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: this.config.format
      });
      
      const imgData = canvas.toDataURL('image/jpeg', this.config.quality);
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Seite hinzufügen
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      
      // Bei mehreren Seiten
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      return pdf.output('blob');
    } finally {
      // Container aufräumen
      document.body.removeChild(container);
    }
  }
  
  /**
   * Lädt notwendige Abhängigkeiten
   * @private
   */
  async _loadDependencies() {
    if (window.html2canvas && window.jspdf) {
      return; // Bereits geladen
    }
    
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };
    
    try {
      // html2canvas laden
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      
      // jsPDF laden
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    } catch (error) {
      throw new Error('Konnte PDF-Bibliotheken nicht laden: ' + error.message);
    }
  }
  
  /**
   * Erstellt PDF Container mit styled Content
   * @private
   */
  _createPDFContainer() {
    const container = document.createElement('div');
    container.className = 'pdf-container';
    container.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 210mm;
      background: white;
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      padding: 20mm;
      box-sizing: border-box;
      z-index: -9999;
    `;
    
    const data = this.reportData;
    
    container.innerHTML = `
      <div class="pdf-header">
        <h1 style="color: #8b5cf6; margin-bottom: 8px; font-size: 28px;">🔮 Numerologie Report</h1>
        <p style="color: #666; margin: 0; font-size: 14px;">Gestellt am: ${new Date().toLocaleDateString('de-DE')}</p>
        <hr style="border: none; border-top: 2px solid #8b5cf6; margin: 20px 0;">
      </div>
      
      <div class="pdf-personal-info">
        <h2 style="color: #333; margin-bottom: 12px; font-size: 20px;">👤 Persönliche Daten</h2>
        <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name || 'Nicht angegeben'}</p>
        <p style="margin: 8px 0;"><strong>Geburtsdatum:</strong> ${data.birthdate || 'Nicht angegeben'}</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      </div>
      
      <div class="pdf-numbers">
        <h2 style="color: #333; margin-bottom: 12px; font-size: 20px;">🔢 Deine Zahlen</h2>
        
        ${data.lifePath ? `
        <div class="pdf-number-section" style="margin: 16px 0; padding: 12px; background: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #8b5cf6; margin: 0 0 8px 0; font-size: 16px;">Lebensweg ${data.lifePath.number}</h3>
          <p style="margin: 0; font-size: 14px;">${data.lifePath.meaning || 'Dein grundlegender Lebensweg und deine Hauptaufgabe.'}</p>
        </div>
        ` : ''}
        
        ${data.expression ? `
        <div class="pdf-number-section" style="margin: 16px 0; padding: 12px; background: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #8b5cf6; margin: 0 0 8px 0; font-size: 16px;">Ausdruckszahl ${data.expression.number}</h3>
          <p style="margin: 0; font-size: 14px;">${data.expression.meaning || 'Wie du dich der Welt mitteilst.'}</p>
        </div>
        ` : ''}
        
        ${data.soul ? `
        <div class="pdf-number-section" style="margin: 16px 0; padding: 12px; background: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #8b5cf6; margin: 0 0 8px 0; font-size: 16px;">Seelenzahl ${data.soul.number}</h3>
          <p style="margin: 0; font-size: 14px;">${data.soul.meaning || 'Deine innersten Wünsche und Motivationen.'}</p>
        </div>
        ` : ''}
        
        ${data.personality ? `
        <div class="pdf-number-section" style="margin: 16px 0; padding: 12px; background: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #8b5cf6; margin: 0 0 8px 0; font-size: 16px;">Persönlichkeitszahl ${data.personality.number}</h3>
          <p style="margin: 0; font-size: 14px;">${data.personality.meaning || 'Wie andere dich wahrnehmen.'}</p>
        </div>
        ` : ''}
      </div>
      
      ${data.premium && data.premium.additionalNumbers ? `
      <div class="pdf-premium">
        <h2 style="color: #333; margin-bottom: 12px; font-size: 20px;">💎 Premium Zahlen</h2>
        
        ${data.premium.additionalNumbers.map(num => `
        <div class="pdf-number-section" style="margin: 16px 0; padding: 12px; background: #f3f4f6; border-radius: 8px;">
          <h3 style="color: #8b5cf6; margin: 0 0 8px 0; font-size: 16px;">${num.name} ${num.number}</h3>
          <p style="margin: 0; font-size: 14px;">${num.meaning}</p>
        </div>
        `).join('')}
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      </div>
      ` : ''}
      
      <div class="pdf-footer">
        <p style="color: #666; font-size: 12px; text-align: center; margin: 20px 0;">
          Erstellt mit numerologie.app • © 2026 MBRN Tools
        </p>
        <p style="color: #999; font-size: 10px; text-align: center; margin: 0;">
          Dieser Report dient der Unterhaltung und ersetzt keine professionelle Beratung.
        </p>
      </div>
    `;
    
    return container;
  }
  
  /**
   * Lädt PDF herunter
   * @param {Object} reportData
   * @param {string} filename
   */
  async downloadPDF(reportData, filename = null) {
    try {
      const pdf = await this.generatePDF(reportData);
      const url = URL.createObjectURL(pdf);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || this.config.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('[PDF Generator] Fehler beim Download:', error);
      throw error;
    }
  }
  
  /**
   * Gibt PDF als Blob zurück
   * @param {Object} reportData
   * @returns {Promise<Blob>}
   */
  async getPDFFromReport(reportData) {
    return this.generatePDF(reportData);
  }
  
  /**
   * Prüft ob PDF Generation unterstützt wird
   * @returns {boolean}
   */
  isSupported() {
    return typeof document !== 'undefined' && 
           typeof window !== 'undefined' && 
           typeof Blob !== 'undefined';
  }
}

// Global Export
if (typeof window !== 'undefined') {
  window.NumerologiePDFGenerator = NumerologiePDFGenerator;
}
