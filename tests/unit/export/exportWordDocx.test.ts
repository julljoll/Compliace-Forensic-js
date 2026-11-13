import { describe, it, expect } from 'vitest';
import {
  transformPlanillaHtmlForWord,
  buildWordDocxHtmlTemplate,
  exportPlanillaElementToWordDocx,
} from '../../../src/lib/export/exportWordDocx';
import { LOGO_PNG_BASE64 } from '../../../src/lib/export/logoBase64';

describe('exportWordDocx — Pre-procesamiento y Exportación a Microsoft Word (.docx)', () => {
  it('transformPlanillaHtmlForWord convierte el membrete a tabla de 2 columnas con logo base64', () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="folio-forense-aislado">
        <header class="canonical-header">
          <div class="header-institution-row">
            <div class="header-logo-group">
              <img src="/logo.png" alt="SHA256.US" class="header-logo" />
              <div class="header-rep-text">
                <span class="header-rep-country">REPÚBLICA BOLIVARIANA DE VENEZUELA</span>
              </div>
            </div>
            <div class="header-badge-legal">
              <div>CÓDIGO: FO-FOR-01</div>
              <div>HOJA 1 DE 1</div>
            </div>
          </div>
        </header>
      </div>
    `;

    const result = transformPlanillaHtmlForWord(div, 'Acta de Consentimiento');
    expect(result).toContain('data:image/png;base64,' + LOGO_PNG_BASE64.substring(0, 30));
    expect(result).toContain('<table');
    expect(result).toContain('FO-FOR-01');
    expect(result).toContain('REPÚBLICA BOLIVARIANA DE VENEZUELA');
  });

  it('transformPlanillaHtmlForWord transforma firmas bilaterales y huellas a tablas estructuradas', () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="canonical-signatures">
        <div class="sig-box">
          <div class="sig-box-title">CONSIGNANTE</div>
          <div class="sig-data-row">NOMBRE: Alexander Wright</div>
          <div class="sig-line-solid"></div>
          <div class="sig-legend">Firma Consignante</div>
          <div class="fingerprint-container">
            <div class="fingerprint-item">
              <div class="thumb-box-canonical"></div>
              <span class="thumb-box-label">PULGAR DER.</span>
            </div>
            <div class="fingerprint-item">
              <div class="thumb-box-canonical"></div>
              <span class="thumb-box-label">PULGAR IZQ.</span>
            </div>
          </div>
        </div>
        <div class="sig-box">
          <div class="sig-box-title">PERITO OFICIAL</div>
          <div class="sig-data-row">NOMBRE: Ing. Christopher Vance</div>
          <div class="sig-line-solid"></div>
          <div class="sig-legend">Firma Perito</div>
          <div class="fingerprint-container">
            <div class="fingerprint-item">
              <div class="thumb-box-canonical"></div>
              <span class="thumb-box-label">PULGAR DER.</span>
            </div>
            <div class="fingerprint-item">
              <div class="thumb-box-canonical"></div>
              <span class="thumb-box-label">PULGAR IZQ.</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const result = transformPlanillaHtmlForWord(div);
    expect(result).toContain('width: 50%');
    expect(result).toContain('18mm');
    expect(result).toContain('24mm');
    expect(result).toContain('PULGAR DER.');
    expect(result).toContain('PULGAR IZQ.');
    expect(result).toContain('Alexander Wright');
    expect(result).toContain('Christopher Vance');
  });

  it('transformPlanillaHtmlForWord inserta saltos duros de página Word para planillas multi-hoja', () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="folio-forense-aislado">
        <div class="page">
          <p>Hoja 1 Contenido</p>
        </div>
        <div class="page">
          <p>Hoja 2 Contenido</p>
        </div>
      </div>
    `;

    const result = transformPlanillaHtmlForWord(div);
    expect(result).toContain('page-break-before: always; mso-break-type: page-break;');
    expect(result).toContain('Hoja 1 Contenido');
    expect(result).toContain('Hoja 2 Contenido');
  });

  it('buildWordDocxHtmlTemplate incluye metadatos Office y dimensiones de Folio (216mm x 330mm)', () => {
    const template = buildWordDocxHtmlTemplate('<p>Cuerpo</p>', 'Documento Oficial');
    expect(template).toContain("urn:schemas-microsoft-com:office:word");
    expect(template).toContain("216mm 330mm");
    expect(template).toContain("margin: 15mm 12mm 15mm 25mm");
    expect(template).toContain("<p>Cuerpo</p>");
  });

  it('exportPlanillaElementToWordDocx genera un Blob DOCX válido con magic header OpenXML PK', async () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="folio-forense-aislado">
        <div class="page">
          <table class="forense-cell-table">
            <tr>
              <td class="forense-cell-label">Expediente:</td>
              <td class="forense-cell-value">EXP-2026-SHA-0091</td>
            </tr>
          </table>
        </div>
      </div>
    `;

    const blob = await exportPlanillaElementToWordDocx(div, 'test.docx', 'Test Planilla');
    expect(blob).toBeDefined();
    expect(blob.size).toBeGreaterThan(1000);

    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    // Magic header de archivo ZIP / DOCX (PK\x03\x04 = 0x50, 0x4B, 0x03, 0x04)
    expect(bytes[0]).toBe(0x50);
    expect(bytes[1]).toBe(0x4B);
    expect(bytes[2]).toBe(0x03);
    expect(bytes[3]).toBe(0x04);
  });

  it('verifica la exportación a DOCX de las 13 planillas oficiales compiladas en dist/', async () => {
    const fs = await import('fs');
    const path = await import('path');

    const planillas = [
      'acta-consentimiento',
      'acta-entrevista',
      'acta-obtencion',
      'planilla-prcc',
      'acta-desprecintado',
      'acta-dictamen',
      'acta-entrega-resultados',
      'acta-sanitizacion',
      'acta-auditoria-timeline',
      'planilla-evaluacion-ux',
      'planilla-audio-sonic',
      'dictamen-imagenes',
      'dictamen-audios',
    ];

    for (const slug of planillas) {
      const filePath = path.resolve('dist/planillas', `${slug}.html`);
      expect(fs.existsSync(filePath), `El archivo ${slug}.html debe existir en dist/planillas`).toBe(true);

      const html = fs.readFileSync(filePath, 'utf-8');
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const container = doc.getElementById('contenedor-planilla-activa') || doc.querySelector('.folio-forense-aislado');
      expect(container, `Debe encontrarse el contenedor para ${slug}`).not.toBeNull();

      const transformedHtml = transformPlanillaHtmlForWord(container as HTMLElement, slug);
      expect(transformedHtml.length).toBeGreaterThan(500);

      const fullDoc = buildWordDocxHtmlTemplate(transformedHtml, slug);
      expect(fullDoc).toContain('216mm 330mm');
      expect(fullDoc).toContain('urn:schemas-microsoft-com:office:word');
    }
  });
});
