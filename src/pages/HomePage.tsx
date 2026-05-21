import { Shield, Smartphone, FileText, Microscope, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReferenciaLegal from '../components/MarcoLegal/ReferenciaLegal';

export default function HomePage() {
  const steps = [
    { 
      icon: <FileText className="w-10 h-10 text-fluent-accent" />, 
      title: 'Consignación', 
      desc: 'Registro de evidencia recibida por entrega voluntaria con fijación fotográfica técnica.',
      path: '/forense/consignacion'
    },
    { 
      icon: <Smartphone className="w-10 h-10 text-fluent-accent" />, 
      title: 'Adquisición', 
      desc: 'Extracción de datos en modo solo lectura para garantizar integridad del dispositivo consignado.',
      path: '/forense/adquisicion'
    },
    { 
      icon: <Microscope className="w-10 h-10 text-fluent-accent" />, 
      title: 'Análisis', 
      desc: 'Procesamiento con ALEAPP para parseo de bases de datos SQLite, Protobuf y eventos del sistema.',
      path: '/forense/analisis'
    },
    { 
      icon: <Shield className="w-10 h-10 text-fluent-accent" />, 
      title: 'Informe Técnico', 
      desc: 'Generación automatizada del Dictamen Pericial conforme a la normativa legal venezolana.',
      path: '/forense/informe'
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-fluent-card p-6 sm:p-8 md:p-12 bg-gradient-to-br from-fluent-accent/10 to-transparent border border-fluent-border">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-fluent-text mb-4 tracking-tight">
            Sistema de Peritaje <span className="text-fluent-accent">Digital WhatsApp</span>
          </h1>
          <p className="text-base md:text-lg text-fluent-textSecondary mb-8 leading-relaxed">
            Plataforma integral para el tratamiento técnico-científico de evidencias digitales móviles, 
            diseñada bajo el estricto cumplimiento del Manual Único de Cadena de Custodia.
          </p>
          <div className="flex gap-4">
            <Link to="/forense/consignacion" className="forensic-btn forensic-btn-primary flex items-center gap-2 px-6">
              Iniciar Nuevo Caso <ChevronRight size={18} />
            </Link>
          </div>
        </div>
        {/* Abstract background element */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-fluent-accent/5 rounded-full blur-3xl"></div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item) => (
          <Link 
            key={item.title} 
            to={item.path}
            className="forensic-card p-8 group hover:border-fluent-accent/50"
          >
            <div className="p-3 bg-fluent-surface rounded-xl w-fit mb-6 transition-transform group-hover:scale-110 duration-167">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-fluent-text mb-3 group-hover:text-fluent-accent transition-colors">{item.title}</h3>
            <p className="text-sm text-fluent-textSecondary leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ReferenciaLegal />
        </div>
        <div className="forensic-card p-8 bg-fluent-surfaceActive/30">
          <h3 className="text-lg font-bold text-fluent-text mb-4 flex items-center gap-2">
            <Shield size={20} className="text-fluent-accent" />
            Cumplimiento Estándar
          </h3>
          <ul className="space-y-4">
            {[
              'ISO/IEC 27037:2012',
              'ISO/IEC 27042:2015',
              'NIST SP 800-101 r1',
              'Manual Único de Cadena de Custodia (2017)'
            ].map(std => (
              <li key={std} className="flex items-center gap-3 text-sm text-fluent-textSecondary">
                <div className="w-1.5 h-1.5 rounded-full bg-fluent-accent"></div>
                {std}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
