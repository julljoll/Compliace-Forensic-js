import AdquisicionTecnica from '../components/organisms/Obtencion/AdquisicionTecnica';

export default function AdquisicionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">2. Adquisición Forense</h1>
        <p className="text-gray-400 mt-1">Extracción de datos con herramientas especializadas (Andriller)</p>
      </div>
      <AdquisicionTecnica />
    </div>
  );
}
