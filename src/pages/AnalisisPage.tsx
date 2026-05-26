import AnalisisForense from '../components/organisms/Laboratorio/AnalisisForense';

export default function AnalisisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">3. Análisis Forense</h1>
        <p className="text-gray-400 mt-1">Procesamiento y parseo de artefactos digitales (ALEAPP)</p>
      </div>
      <AnalisisForense />
    </div>
  );
}
