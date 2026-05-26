import { Scale, Book, Shield } from 'lucide-react';

export default function ReferenciaLegal() {
  return (
    <div className="space-y-6">
      <div className="forensic-card p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-bold text-fluent-text flex items-center gap-3">
            <Scale className="w-6 h-6 text-fluent-accent shrink-0" />
            Marco Legal y Estándares Internacionales
          </h2>
          <span className="text-[10px] font-bold bg-fluent-accent/10 text-fluent-accent px-2 py-1 rounded uppercase tracking-widest self-start sm:self-auto">
            Vigente 2024
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-fluent-accent-light uppercase flex items-center gap-2 tracking-widest">
              <Book size={14} /> Legislación Nacional
            </h4>
            <ul className="text-sm text-fluent-textSecondary space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-fluent-border shrink-0"></div>
                <span>Constitución Nacional (Art. 49)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-fluent-border shrink-0"></div>
                <span>COPP Art. 188 (Resguardo)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-fluent-border shrink-0"></div>
                <span>Ley Delitos Informáticos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-fluent-border shrink-0"></div>
                <span>Ley Mensajes de Datos</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-fluent-accent-light uppercase flex items-center gap-2 tracking-widest">
              <Shield size={14} /> Estándares Globales
            </h4>
            <ul className="text-sm text-fluent-textSecondary space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-fluent-border shrink-0"></div>
                <span>ISO/IEC 27037:2012</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-fluent-border shrink-0"></div>
                <span>ISO/IEC 27042:2015</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-fluent-border shrink-0"></div>
                <span>NIST SP 800-101 r1</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-fluent-border shrink-0"></div>
                <span>ACPO Good Practice Guide</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-fluent-accent-light uppercase tracking-widest">Procedimientos</h4>
            <ul className="text-sm text-fluent-textSecondary space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-fluent-border shrink-0"></div>
                <span>Manual Único de Cadena de Custodia</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-fluent-border shrink-0"></div>
                <span>Protocolos de Traslado Técnico</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-fluent-border">
          <h3 className="text-xs font-bold text-fluent-text uppercase tracking-widest mb-6">Procesos de Carácter Continuo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-fluent-surface border border-fluent-border p-5 rounded-fluent-card group hover:bg-fluent-surfaceHover transition-all">
              <span className="text-fluent-accent-light font-bold text-xs block mb-2 tracking-widest uppercase">Resguardo y Custodia</span>
              <p className="text-xs text-fluent-textSecondary leading-relaxed">
                Protección, conservación y aseguramiento de la integridad física y lógica en depósitos especializados bajo control ambiental.
              </p>
            </div>
            <div className="bg-fluent-surface border border-fluent-border p-5 rounded-fluent-card group hover:bg-fluent-surfaceHover transition-all">
              <span className="text-fluent-accent-light font-bold text-xs block mb-2 tracking-widest uppercase">Trazabilidad de Transferencia</span>
              <p className="text-xs text-fluent-textSecondary leading-relaxed">
                Registro inmutable de cada traspaso de responsabilidad, detallando funcionario actuante, organismo y motivo del movimiento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
