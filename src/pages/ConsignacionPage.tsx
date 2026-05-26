import ConsignacionForm from '../components/organisms/Obtencion/ConsignacionForm';

export default function ConsignacionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">1. Consignación de Evidencia</h1>
        <p className="text-gray-400 mt-1">Registro de dispositivo móvil recibido por entrega voluntaria</p>
      </div>
      <ConsignacionForm />
    </div>
  );
}
