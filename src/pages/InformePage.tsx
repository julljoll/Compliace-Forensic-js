import InformeTecnico from '../components/organisms/Laboratorio/InformeTecnico';

export default function InformePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">4. Informe Pericial</h1>
        <p className="text-gray-400 mt-1">Generación de documentación legal y resultados técnicos</p>
      </div>
      <InformeTecnico />
    </div>
  );
}
