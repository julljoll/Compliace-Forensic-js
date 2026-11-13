'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

import { useCMSStore } from '../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../data/normativasEtapas';
import { PLANILLAS_REGISTRY } from '../data/planillasRegistry';
import {
  BookOpen, Shield, FileText, CheckCircle2, ChevronRight,
  Search, ExternalLink, Activity
} from '../components/atoms/AppleIcon';

const CATEGORIAS_FILTRO = [
  { id: 'todas', label: 'Todas', emoji: '📚' },
  { id: 'ISO', label: 'ISO & NIST', emoji: '🛡️' },
  { id: 'LEY', label: 'Leyes TICs & Penal', emoji: '⚖️' },
  { id: 'MANUAL', label: 'Cadena de Custodia', emoji: '📋' },
  { id: 'REGLAMENTO', label: 'Doctrina & Normas', emoji: '📕' },
];

const TIPO_TAG_CLASS: Record<string, string> = {
  ISO: 'usa-tag--info',
  LEY: 'usa-tag--success',
  MANUAL: 'usa-tag--error',
  REGLAMENTO: 'usa-tag--muted',
};

export default function NormativasPage() {
  const normativas = useCMSStore(state => state.normativas);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas');
  const [selectedNormativaId, setSelectedNormativaId] = useState<string | null>('ISO-27037');

  const filteredNormativas = useMemo(() => {
    return normativas.filter(n => {
      const matchCategory = categoriaSeleccionada === 'todas' || n.tipo === categoriaSeleccionada;
      const q = searchTerm.toLowerCase();
      const matchSearch = !q ||
        n.codigo.toLowerCase().includes(q) ||
        n.nombre.toLowerCase().includes(q) ||
        n.descripcion.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [normativas, categoriaSeleccionada, searchTerm]);

  const selectedNormativa = useMemo(() => {
    return normativas.find(n => n.id === selectedNormativaId) || filteredNormativas[0] || normativas[0];
  }, [normativas, selectedNormativaId, filteredNormativas]);

  const planillasRelacionadas = useMemo(() => {
    if (!selectedNormativa) return [];
    const targetCode = selectedNormativa.codigo.toLowerCase();
    return Object.values(PLANILLAS_REGISTRY).filter(p =>
      p.normativas.some(n => {
        const nLower = n.toLowerCase();
        return nLower.includes(targetCode) || targetCode.includes(nLower) ||
               (targetCode.includes('iso') && nLower.includes('iso')) ||
               (targetCode.includes('copp') && nLower.includes('copp')) ||
               (targetCode.includes('mucc') && nLower.includes('mucc')) ||
               (targetCode.includes('nist') && nLower.includes('nist'));
      })
    );
  }, [selectedNormativa]);

  return (
    <div className="container-fluid max-w-1280 px-0 pb-5">
      {/* Header Institucional USWDS */}
      <div className="pb-3 mb-4 border-bottom border-2" style={{ borderColor: '#CBD5E1' }}>
        <h1 className="h3 fw-bold text-navy mb-1 d-flex align-items-center gap-2" style={{ color: '#112E51' }}>
          <BookOpen size={28} className="text-warning" />
          Marco Normativo Legal &amp; Sustento de Compliance Forense
        </h1>
        <p className="text-muted small mb-0">
          Base de conocimiento interactiva con {normativas.length} normas, leyes y estándares (ISO 27037/27042, NIST SP 800-101, MUCC-2017, COPP y Ley de Mensajes de Datos) que garantizan la admisibilidad procesal de cada peritaje.
        </p>
      </div>

      {/* Barra de Filtros Rápidos por Categoría Temática */}
      <div className="d-flex gap-2 overflow-auto pb-2 mb-4">
        {CATEGORIAS_FILTRO.map(cat => {
          const isSelected = categoriaSeleccionada === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoriaSeleccionada(cat.id)}
              className={`btn btn-sm rounded-pill font-monospace fw-bold px-3 ${
                isSelected ? 'btn-warning text-navy' : 'btn-outline-secondary text-navy bg-white'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          );
        })}
      </div>

      <div className="row g-4">
        {/* Lista Maestra de Normativas */}
        <div className="col-12 col-md-4">
          <div className="card p-3 shadow-sm border bg-white rounded-3">
            <div className="input-group mb-3">
              <span className="input-group-text bg-light text-muted border-end-0">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar norma, código o ley..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '68vh' }}>
              {filteredNormativas.map((norm) => {
                const tagClass = TIPO_TAG_CLASS[norm.tipo] || 'usa-tag--info';
                const isSelected = selectedNormativa && norm.id === selectedNormativa.id;

                return (
                  <div
                    key={norm.id}
                    onClick={() => setSelectedNormativaId(norm.id)}
                    className={`p-2 rounded-3 border cursor-pointer transition-all ${
                      isSelected ? 'bg-primary bg-opacity-10 border-primary' : 'bg-light hover-bg-white'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <div className="min-w-0">
                        <div className={`fw-bold style-none ${isSelected ? 'text-primary' : 'text-navy'}`} style={{ fontSize: '13px' }}>
                          {norm.codigo}
                        </div>
                        <div className="text-muted text-truncate" style={{ fontSize: '11px' }}>
                          {norm.nombre}
                        </div>
                      </div>
                      <span className={`usa-tag ${tagClass}`} style={{ fontSize: '9px' }}>
                        {norm.tipo}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vista Detallada Didáctica de Sustento Legal */}
        <div className="col-12 col-md-8">
          {selectedNormativa && (
            <div className="card p-4 shadow-sm border bg-white rounded-3">
              {/* Encabezado de la Norma */}
              <div className="d-flex justify-content-between align-items-start pb-3 mb-3 border-bottom">
                <div>
                  <h2 className="h4 fw-bold text-navy mb-1" style={{ color: '#112E51' }}>
                    {selectedNormativa.codigo} — {selectedNormativa.nombre}
                  </h2>
                  <div className="text-muted small">
                    Versión Oficial: <span className="fw-bold text-dark">{selectedNormativa.version}</span> | Vigencia / Emisión: <span className="fw-bold text-dark">{selectedNormativa.fechaVigencia}</span>
                  </div>
                </div>
                <span className={`usa-tag ${TIPO_TAG_CLASS[selectedNormativa.tipo] || 'usa-tag--info'} fs-6`}>
                  {selectedNormativa.tipo}
                </span>
              </div>

              {/* Bloque A: Ficha Didáctica de Sustento Jurídico */}
              <div className="usa-summary-box mb-4">
                <div className="fw-bold text-navy text-uppercase mb-2 d-flex align-items-center gap-1" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>
                  <Shield size={18} className="text-primary" />
                  📌 Sustento Jurídico &amp; Valor Probatorio en el Compliance
                </div>
                <div className="text-dark leading-relaxed" style={{ fontSize: '13.5px', textAlign: 'justify' }}>
                  {selectedNormativa.descripcion}
                </div>
              </div>

              {/* Acciones & Articulado Didáctico */}
              {selectedNormativa.articulos && selectedNormativa.articulos.length > 0 && (
                <div className="mb-4">
                  <h3 className="h6 fw-bold text-navy text-uppercase mb-3" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>
                    📖 Articulado y Requisitos de Cumplimiento
                  </h3>
                  <div className="accordion" id="accordionNormativa">
                    {selectedNormativa.articulos.map((art, idx) => (
                      <div className="accordion-item mb-2 border rounded-2" key={idx}>
                        <h2 className="accordion-header" id={`heading${idx}`}>
                          <button
                            className="accordion-button collapsed fw-bold text-navy"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${idx}`}
                            aria-expanded="false"
                            aria-controls={`collapse${idx}`}
                            style={{ fontSize: '13px' }}
                          >
                            Requisito #{idx + 1}
                          </button>
                        </h2>
                        <div
                          id={`collapse${idx}`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading${idx}`}
                          data-bs-parent="#accordionNormativa"
                        >
                          <div className="accordion-body text-dark small leading-relaxed">
                            {art}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Planillas Relacionadas USWDS */}
              {planillasRelacionadas.length > 0 && (
                <div>
                  <h3 className="h6 fw-bold text-navy text-uppercase mb-3" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>
                    📄 Planillas Oficiales Acreditadas por esta Norma
                  </h3>
                  <div className="row g-2">
                    {planillasRelacionadas.map(p => (
                      <div className="col-12 col-md-6" key={p.id}>
                        <Link href={`/planillas/${p.id}`} className="text-decoration-none">
                          <div className="p-3 rounded-3 border bg-light hover-border-primary transition-all d-flex align-items-center justify-content-between">
                            <div>
                              <div className="fw-bold text-navy" style={{ fontSize: '13px' }}>{p.nombreOficial}</div>
                              <div className="text-muted font-monospace" style={{ fontSize: '10px' }}>Código: {p.codigo}</div>
                            </div>
                            <ChevronRight size={16} className="text-primary" />
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
