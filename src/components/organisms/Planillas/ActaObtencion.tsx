import { useState } from 'react';
import { CasoCMS } from '../../../store/cmsStore';
import { PlanillaFolioTemplate } from '../../templates/Planillas/PlanillaFolioTemplate';
import { PlanillaSectionTitle } from '../../molecules/Planillas/PlanillaSectionTitle';
import { PlanillaFieldLabel } from '../../atoms/Planillas/PlanillaFieldLabel';
import { PlanillaEditableValue } from '../../atoms/Planillas/PlanillaEditableValue';
import { PlanillaCheckboxGroup } from '../../atoms/Planillas/PlanillaCheckboxGroup';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface ActaObtencionProps {
  caso?: CasoCMS;
  tipoEvidencia?: 'movil' | 'computadora';
}

export default function ActaObtencion({ caso, tipoEvidencia: externalTipoEvidencia }: ActaObtencionProps) {
  const fallbackCaso = {
    numeroCaso: '',
    solicitante_nombre: '',
    solicitante_cedula: '',
    dispositivo_marca: '',
    dispositivo_modelo: '',
    dispositivo_imei: '',
    dispositivo_imei2: '',
    dispositivo_numero_tel: '',
    dispositivo_sim_card: '',
    dispositivo_estado_fisico: '',
    dispositivo_bateria_estado: '',
    descripcion: '',
    peritoLider: '',
    tipoProyecto: '',
    discoduro_serial: '',
    discoduro_capacidad: '',
    discoduro_marca: '',
    discoduro_modelo: '',
  };

  const c = caso || fallbackCaso;
  const [internalTipoEvidencia] = useState<'movil' | 'computadora'>(
    c.tipoProyecto === 'forense_discoduro' ? 'computadora' : 'movil'
  );
  const tipoEvidencia = externalTipoEvidencia || internalTipoEvidencia;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const box = target.closest('.check-item .box, .check-item');
    if (box) {
      const spanBox = box.classList.contains('box') ? box : box.querySelector('.box');
      if (spanBox) {
        if (spanBox.textContent === 'X') {
          spanBox.textContent = '';
        } else {
          spanBox.textContent = 'X';
        }
      }
    }
  };

  return (
    <PlanillaFolioTemplate
      title="Acta de Obtención por Consignación"
      nroLabel="N° EXPEDIENTE:"
      nroValue={c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}
      watermarkText="CONSIGNACIÓN"
      onClick={handleCheckboxClick}
    >
      {/* DATOS DE LA ACTUACIÓN */}
      <div className="section">
        <PlanillaSectionTitle>Datos de la Actuación Forense</PlanillaSectionTitle>
        <div className="grid-container">
          <div className="form-group">
            <PlanillaFieldLabel>Lugar de Actuación / Sede</PlanillaFieldLabel>
            <PlanillaEditableValue placeholder="[Lara, Venezuela — Laboratorio Forense SHA256.US]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Fecha y Hora de la Consignación</PlanillaFieldLabel>
            <PlanillaEditableValue placeholder="[Fecha y Hora (ej: DD/MM/AAAA - HH:MM)]" />
          </div>
        </div>
      </div>

      {/*  I. DATOS DEL CONSIGNANTE  */}
      <div className="section">
        <PlanillaSectionTitle>I. Datos e Identificación del Consignante (Entrega Voluntaria)</PlanillaSectionTitle>
        <div className="grid-container">
          <div className="form-group">
            <PlanillaFieldLabel>Apellidos y Nombres</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.solicitante_nombre} placeholder="[Apellidos y Nombres del Consignante]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Cédula de Identidad / Pasaporte</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.solicitante_cedula} placeholder="[Cédula de Identidad]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Teléfono de Contacto</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.dispositivo_numero_tel} placeholder="[Teléfono de Contacto]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Dirección de Habitación / Sede</PlanillaFieldLabel>
            <PlanillaEditableValue placeholder="[Dirección del Consignante]" />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '5px' }}>
          <PlanillaFieldLabel>Condición Jurídica / Carácter del Consignante (Marque la que corresponda)</PlanillaFieldLabel>
          <PlanillaCheckboxGroup
            fontSize="8.5px"
            style={{ flexDirection: 'row', gap: '12px' }}
            options={[
              { id: '1', label: 'Propietario Legítimo / Personal' },
              { id: '2', label: 'Representante Legal (con Poder / RIF)' },
              { id: '3', label: 'Custodio / Asignatario Corporativo (Empleado)' },
              { id: '4', label: 'Poseedor / Tercero Autorizado' },
            ]}
          />
        </div>
      </div>

      {/*  II. DESCRIPCIÓN DEL DISPOSITIVO  */}
      <div className="section">
        <PlanillaSectionTitle>II. Descripción Técnica de la Evidencia ({tipoEvidencia === 'movil' ? 'Dispositivo Móvil' : 'Computador / Almacenamiento'})</PlanillaSectionTitle>
        
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Marca / Modelo</td>
                <td>
                  <PlanillaEditableValue
                    value={c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : undefined}
                    placeholder="[Marca / Modelo del Dispositivo]"
                  />
                </td>
              </tr>
              <tr>
                <td>IMEI 1 / Serial</td>
                <td>
                  <PlanillaEditableValue value={c.dispositivo_imei} placeholder="[Serial / IMEI del Dispositivo]" />
                </td>
              </tr>
              <tr>
                <td>IMEI 2</td>
                <td>
                  <PlanillaEditableValue value={c.dispositivo_imei2} placeholder="[Segundo IMEI (Si aplica)]" />
                </td>
              </tr>
              <tr>
                <td>Nro. de Línea / Operadora</td>
                <td>
                  <PlanillaEditableValue
                    value={c.dispositivo_numero_tel || c.dispositivo_sim_card ? `${c.dispositivo_numero_tel || ''} (SIM: ${c.dispositivo_sim_card || ''})` : undefined}
                    placeholder="[Nro. de Línea / Operadora / SIM]"
                  />
                </td>
              </tr>
              <tr>
                <td>Estado Físico</td>
                <td>
                  <PlanillaCheckboxGroup
                    options={[
                      { id: 'ef1', label: 'Operativo' },
                      { id: 'ef2', label: 'Daños Pantalla' },
                      { id: 'ef3', label: 'Sin Batería' },
                    ]}
                  />
                </td>
              </tr>
              <tr>
                <td>Estado de Volatilidad</td>
                <td>
                  <PlanillaCheckboxGroup
                    fontSize="9px"
                    style={{ flexDirection: 'row', gap: '10px' }}
                    options={[
                      { id: 'ev1', label: 'Encendido' },
                      { id: 'ev2', label: 'Apagado' },
                      { id: 'ev3', label: 'Suspensión / Bloqueado' },
                    ]}
                  />
                </td>
              </tr>
              <tr>
                <td>Precinto de Seguridad</td>
                <td>
                  N°: <span contentEditable suppressContentEditableWarning className="placeholder-field" style={{ borderBottom: '1px dashed #ccc', minWidth: '80px', display: 'inline-block' }}>[Precinto]</span>
                  &nbsp;&nbsp;&nbsp;&nbsp; Estado:
                  <PlanillaCheckboxGroup
                    fontSize="8.5px"
                    style={{ display: 'inline-flex', marginLeft: '8px', gap: '8px' }}
                    options={[
                      { id: 'p1', label: 'Intacto' },
                      { id: 'p2', label: 'Alterado' },
                      { id: 'p3', label: 'N/A' },
                    ]}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Marca / Modelo del Computador</td>
                <td>
                  <PlanillaEditableValue
                    value={c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : undefined}
                    placeholder="[Marca / Modelo del Computador (ej. HP ProBook 450 G8)]"
                  />
                </td>
              </tr>
              <tr>
                <td>Número de Serie del Computador</td>
                <td>
                  <PlanillaEditableValue value={c.dispositivo_imei} placeholder="[Serial del Equipo / Placa (ej. S/N: 5CD1234567)]" />
                </td>
              </tr>
              <tr>
                <td>Unidad de Disco Duro (Marca / Modelo)</td>
                <td>
                  <PlanillaEditableValue
                    value={c.discoduro_marca || c.discoduro_modelo ? `${c.discoduro_marca || ''} ${c.discoduro_modelo || ''}`.trim() : undefined}
                    placeholder="[Marca / Modelo del Disco (ej. Kingston A400 SSD)]"
                  />
                </td>
              </tr>
              <tr>
                <td>Capacidad del Disco Duro</td>
                <td>
                  <PlanillaEditableValue value={c.discoduro_capacidad} placeholder="[Capacidad (ej. 480 GB SSD / 1 TB HDD)]" />
                </td>
              </tr>
              <tr>
                <td>Número de Serie del Disco Duro</td>
                <td>
                  <PlanillaEditableValue value={c.discoduro_serial} placeholder="[Serial del Disco Duro (S/N)]" />
                </td>
              </tr>
              <tr>
                <td>Unidad USB / Tarjetas Externas</td>
                <td>
                  <PlanillaEditableValue placeholder="[Memorias USB / Tarjetas SD consignadas (Marca, Capacidad, Serial)]" />
                </td>
              </tr>
              <tr>
                <td>Estado de Volatilidad</td>
                <td>
                  <PlanillaCheckboxGroup
                    fontSize="9px"
                    style={{ flexDirection: 'row', gap: '10px' }}
                    options={[
                      { id: 'evc1', label: 'Encendido' },
                      { id: 'evc2', label: 'Apagado' },
                      { id: 'evc3', label: 'Suspensión / Hibernación' },
                    ]}
                  />
                </td>
              </tr>
              <tr>
                <td>Precinto de Seguridad</td>
                <td>
                  N°: <span contentEditable suppressContentEditableWarning className="placeholder-field" style={{ borderBottom: '1px dashed #ccc', minWidth: '80px', display: 'inline-block' }}>[Precinto]</span>
                  &nbsp;&nbsp;&nbsp;&nbsp; Estado:
                  <PlanillaCheckboxGroup
                    fontSize="8.5px"
                    style={{ display: 'inline-flex', marginLeft: '8px', gap: '8px' }}
                    options={[
                      { id: 'pc1', label: 'Intacto' },
                      { id: 'pc2', label: 'Alterado' },
                      { id: 'pc3', label: 'N/A' },
                    ]}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/*  III. INTEGRIDAD FORENSE INICIAL  */}
      <div className="section">
        <PlanillaSectionTitle>III. Registro de Integridad Forense Inicial (Hash SHA-256 de Consignación)</PlanillaSectionTitle>
        <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table">
          <tbody>
            <tr>
              <td style={{ width: '30%', fontWeight: 'bold' }}>Hash SHA-256 Inicial (Adquisición / Medio)</td>
              <td>
                <PlanillaEditableValue placeholder="[Valor Hash SHA-256 de 64 caracteres hex generado al recibir/clonar]" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Algoritmo Auxiliar (MD5)</td>
              <td>
                <PlanillaEditableValue placeholder="[Valor Hash MD5]" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Herramienta / Software de Cálculo</td>
              <td>
                <PlanillaEditableValue placeholder="[ej: FTK Imager / Guymager / HashMyFiles / Cellebrite / dd]" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/*  IV. AUTORIZACIÓN Y CONSENTIMIENTO  */}
      <div className="section">
        <PlanillaSectionTitle>IV. Autorización y Consentimiento de Consignación Voluntaria (Sin Coacción)</PlanillaSectionTitle>
        <div className="legal-text">
          Yo, el consignante arriba identificado, en pleno uso de mis facultades mentales y actuando en mi nombre o en representación legítima de la entidad consignante, hago entrega material voluntaria (Obtención por Consignación Directa Privada) de la evidencia descrita conforme al <strong>Manual Único de Cadena de Custodia (MUCC-2017)</strong> y los <strong>Arts. 187 y 225 del COPP</strong>.
          Declaro bajo juramento que realizo esta consignación <strong>LIBRE DE TODA COACCIÓN, VIOLENCIA, DOLO, AMENAZA O CONSTREÑIMIENTO</strong>.
          <strong>AUTORIZO EXPRESA Y VOLUNTARIAMENTE</strong> al equipo pericial de SHA256.US para la extracción lógica/física de "Mensajes de Datos" (Art. 4, Ley sobre Mensajes de Datos y Firmas Electrónicas), duplicación pericial y análisis forense, delimitado al siguiente alcance:
        </div>
        <div className="form-group">
          <PlanillaFieldLabel>Alcance de la Autorización (Marque uno)</PlanillaFieldLabel>
          <PlanillaCheckboxGroup
            style={{ margin: '5px 0' }}
            options={[{ id: 'alc1', label: 'ANÁLISIS TÉCNICO COMPLETO (Todo el contenido del dispositivo/computador)' }]}
          />
          <PlanillaCheckboxGroup
            style={{ margin: '5px 0' }}
            options={[{ id: 'alc2', label: 'ANÁLISIS DELIMITADO (Únicamente chats de WHATSAPP / Archivos específicos)' }]}
          />
          <div style={{ marginTop: '8px', padding: '8px', border: '1px dashed #1d1d1f', backgroundColor: '#fafafa' }}>
            <PlanillaFieldLabel style={{ fontSize: '8pt', color: '#1d1d1f', fontWeight: 'bold' }}>
              ESPECIFICACIÓN DE ELEMENTOS A VERIFICAR (Chat, Teléfono/Contacto, Nota de Voz, Imagen o Archivo Específico):
            </PlanillaFieldLabel>
            <div contentEditable suppressContentEditableWarning style={{ minHeight: '80px', padding: '6px', fontSize: '10pt', lineHeight: '22px' }}>
              <span className="placeholder-field">[Indique detalladamente el chat/contacto, notas de voz, imágenes o fechas específicas a verificar]</span>
              <div className="dotted-line"></div>
              <div className="dotted-line"></div>
              <div className="dotted-line"></div>
            </div>
          </div>
        </div>
      </div>

      {/*  V. REQUERIMIENTOS DE ACCESO  */}
      <div className="section">
        <PlanillaSectionTitle>V. Requerimientos de Acceso y Preservación</PlanillaSectionTitle>
        <div className="grid-container">
          <div className="form-group">
            <PlanillaFieldLabel>Claves de Acceso / Bloqueo</PlanillaFieldLabel>
            <PlanillaCheckboxGroup
              options={[
                { id: 'pin1', label: 'Contraseña / PIN:' },
                { id: 'pin2', label: 'Sin Bloqueo' },
              ]}
            />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Estado de Aislamiento / Conexión</PlanillaFieldLabel>
            <PlanillaCheckboxGroup
              options={[
                { id: 'ais1', label: 'Modo Avión Activado / WiFi Apagado' },
                { id: 'ais2', label: 'Unidad Desconectada de Red' },
              ]}
            />
          </div>
        </div>
      </div>

      {/*  VI. MOTIVO DE LA CONSIGNACIÓN  */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <PlanillaSectionTitle>VI. Motivo de la Consignación y Pormenores de la Actuación</PlanillaSectionTitle>
        <div className="form-group motive-box" contentEditable suppressContentEditableWarning style={{ minHeight: '360px', padding: '12px', lineHeight: '24px' }}>
          <p style={{ margin: 0 }}>
            <span className="placeholder-field">{c.descripcion ? c.descripcion : '[Describa detalladamente el motivo, antecedentes y pormenores de la consignación de la evidencia digital]'}</span>
          </p>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
        </div>
      </div>

      {/*  VII. FIRMAS  */}
      <div className="signature-section" style={{ gap: '14mm' }}>
        <div className="sig-detail-card">
          <div className="sig-detail-label">EL CONSIGNANTE</div>
          <div className="fingerprint-row" style={{ margin: '6px 0 10px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Consignante</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula de Identidad del Consignante]</span>}</span>
          </div>
          <div className="sig-field">
            Teléfono: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Número de Teléfono]</span>}</span>
          </div>
        </div>
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO RECEPTOR</div>
          <div className="fingerprint-row" style={{ margin: '6px 0 10px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Perito Receptor</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre y Apellido del Perito]</span>}</span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Cédula del Perito]</span></span>
          </div>
          <div className="sig-field">
            CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° CIV (Colegio de Ingenieros)]</span></span>
          </div>
          <div className="sig-field">
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° Inpreabogado]</span></span>
          </div>
          <div className="sig-field">
            Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Experto Informático Forense]</span></span>
          </div>
          <PlanillaCheckboxGroup
            fontSize="8px"
            style={{ gap: '8px', justifyContent: 'center', marginTop: '6px' }}
            options={[
              { id: 'iso1', label: 'DEFR' },
              { id: 'iso2', label: 'DES' },
            ]}
          />
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
