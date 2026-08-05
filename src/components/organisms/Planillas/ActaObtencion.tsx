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
      {/* HEADER PRINCIPAL ESMERALDA */}
      <div className="uswds-top-header">
        ACTA DE OBTENCIÓN POR CONSIGNACIÓN DIRECTA — MUCC-2017 & ISO/IEC 27037
      </div>

      {/* 1.0 DATOS DE LA ACTUACIÓN */}
      <div className="section">
        <div className="uswds-banner-title">1.0 DATOS DE LA ACTUACIÓN FORENSE PRIVADA</div>
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Lugar de Actuación / Sede</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Lara, Venezuela — Laboratorio Forense SHA256.US]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Fecha y Hora de la Consignación</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[DD/MM/AAAA - HH:MM]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2.0 DATOS DEL CONSIGNANTE */}
      <div className="section">
        <div className="uswds-banner-title">2.0 IDENTIFICACIÓN COMPLETA DEL CONSIGNANTE PRIVADO</div>
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Apellidos y Nombres</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_nombre} placeholder="[Apellidos y Nombres del Consignante]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Cédula de Identidad / Pasaporte</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_cedula} placeholder="[Cédula de Identidad]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Teléfono de Contacto</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.dispositivo_numero_tel} placeholder="[Teléfono de Contacto]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Dirección de Habitación / Sede</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Dirección del Consignante]" />
            </div>
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

      {/* 3.0 ESPECIFICACIÓN TÉCNICA */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-3.0">3.0 ESPECIFICACIÓN TÉCNICA RIGUROSA DEL DISPOSITIVO</PlanillaSectionTitle>
        
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
                  <span style={{ marginLeft: '16px' }}>Estado:</span>
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
                  <span style={{ marginLeft: '16px' }}>Estado:</span>
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

      {/* 4.0 ESTADO FÍSICO */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-4.0">4.0 ESTADO FÍSICO, OBSERVACIONES VISUALES Y FIJACIÓN FOTOGRÁFICA DE RECEPCIÓN</PlanillaSectionTitle>
        
        <div style={{ marginTop: '8px', marginBottom: '10px', padding: '10px', border: '1px dashed #0F172A', backgroundColor: '#F8FAFC', borderRadius: '4px' }}>
          <PlanillaFieldLabel style={{ fontSize: '8.5pt', color: '#0F172A', fontWeight: 'bold' }}>
            ESTADO FÍSICO, OBSERVACIONES DE RECEPCIÓN Y ACCESORIOS (Escriba a lápiz o digite en 5 líneas):
          </PlanillaFieldLabel>
          <div contentEditable suppressContentEditableWarning style={{ minHeight: '120px', padding: '6px', fontSize: '9.5pt', lineHeight: '24px' }}>
            <span className="placeholder-field">{c.dispositivo_estado_fisico ? c.dispositivo_estado_fisico : '[Describa detalladamente el estado de la pantalla, bordes, cámara, puerto de carga, batería, estuche y protector]'}</span>
            <div className="dotted-line"></div>
            <div className="dotted-line"></div>
            <div className="dotted-line"></div>
            <div className="dotted-line"></div>
            <div className="dotted-line"></div>
          </div>
        </div>

        {/* FIJACIÓN FOTOGRÁFICA DE RECEPCIÓN (MUCC-2017 p. 47) */}
        <div style={{ padding: '8px 10px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', borderRadius: '4px', marginTop: '6px' }}>
          <PlanillaFieldLabel style={{ fontSize: '8.5pt', color: '#0F172A', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>
            REGISTRO DE FIJACIÓN FOTOGRÁFICA EN EL ACTO DE RECEPCIÓN (MUCC-2017 p. 47):
          </PlanillaFieldLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '8.5pt' }}>
            <div>[ &nbsp;&nbsp;&nbsp; ] <strong>Fotografías Generales:</strong> Dispositivo en mesa de recepción</div>
            <div>[ &nbsp;&nbsp;&nbsp; ] <strong>Fotografías Particulares:</strong> Frontal, posterior y laterales</div>
            <div>[ &nbsp;&nbsp;&nbsp; ] <strong>Fotografías de Detalle:</strong> Seriales, IMEIs, puertos y daños</div>
            <div>[ &nbsp;&nbsp;&nbsp; ] <strong>Tomas Archivadas:</strong> N° de fotografías: <span contentEditable suppressContentEditableWarning className="placeholder-field" style={{ border: 'none', display: 'inline-block', minWidth: '50px' }}>[N°]</span></div>
          </div>
        </div>
      </div>

      {/* 5.0 ALCANCE Y AUTORIZACIÓN */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-5.0">5.0 ALCANCE Y AUTORIZACIÓN EXPRESA DEL EXAMEN PERICIAL</PlanillaSectionTitle>
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

      {/* 6.0 CUSTODIA INICIAL */}
      {/* 6.0 CUSTODIA INICIAL, HASH SHA-256 Y EMPACADO EN BOLSA FARADAY / PRECINTO */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-6.0">6.0 CUSTODIA INICIAL, HASH SHA-256 Y EMPACADO EN BOLSA FARADAY / PRECINTO</PlanillaSectionTitle>
        <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table" style={{ marginTop: '8px', width: '100%', borderCollapse: 'collapse', borderColor: '#CBD5E1' }}>
          <tbody>
            <tr>
              <td style={{ width: '35%', fontWeight: 'bold', fontSize: '9pt', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                Hash SHA-256 Inicial (Embalaje — MUCC-2017 p. 37)
              </td>
              <td style={{ padding: '8px', minHeight: '26px' }}>
                <PlanillaEditableValue placeholder="[Ingrese o escriba a mano el Hash SHA-256 de 64 caracteres hex]" style={{ fontSize: '9px', fontFamily: 'monospace', width: '100%', minWidth: '220px' }} />
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', fontSize: '9pt', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                Algoritmo Auxiliar MD5 (Verificación cruzada)
              </td>
              <td style={{ padding: '8px', minHeight: '26px' }}>
                <PlanillaEditableValue placeholder="[Ingrese o escriba a mano el Hash MD5 de 32 caracteres hex]" style={{ fontSize: '9px', fontFamily: 'monospace', width: '100%', minWidth: '220px' }} />
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', fontSize: '9pt', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                Herramienta / Software de Cálculo
              </td>
              <td style={{ padding: '8px', minHeight: '26px' }}>
                <PlanillaEditableValue placeholder="[Ingrese o escriba a mano la herramienta de cálculo]" style={{ fontSize: '9pt', width: '100%', minWidth: '220px' }} />
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', fontSize: '9pt', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                Bolsa Faraday / Apantallamiento RF
              </td>
              <td style={{ padding: '8px', fontSize: '9pt' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>[ &nbsp;&nbsp;&nbsp; ] Bolsa de Aislamiento Electromagnético RF</span>
                  <span>[ &nbsp;&nbsp;&nbsp; ] Caja Rígida Anti-Impactos</span>
                </div>
                <div style={{ marginTop: '6px', fontSize: '8.5pt', color: '#334155' }}>
                  N° Bolsa Faraday: <span className="placeholder-field" contentEditable suppressContentEditableWarning style={{ border: 'none', display: 'inline-block', minWidth: '150px' }}>[N° Bolsa Faraday]</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', fontSize: '9pt', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                Precinto de Seguridad Plástico
              </td>
              <td style={{ padding: '8px', fontSize: '9pt' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    N° Precinto: <span className="placeholder-field" contentEditable suppressContentEditableWarning style={{ border: 'none', display: 'inline-block', minWidth: '150px' }}>[N° Precinto]</span>
                  </div>
                  <div>
                    Estado: [ &nbsp;&nbsp;&nbsp; ] Intacto / Sin alteración &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp;&nbsp; ] Violado / Alterado
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', fontSize: '9pt', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                Estado de Aislamiento de Red
              </td>
              <td style={{ padding: '8px', fontSize: '9pt' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>[ &nbsp;&nbsp;&nbsp; ] Modo Avión Activado</span>
                  <span>[ &nbsp;&nbsp;&nbsp; ] Tarjeta SIM Retirada</span>
                  <span>[ &nbsp;&nbsp;&nbsp; ] WiFi Desactivado</span>
                  <span>[ &nbsp;&nbsp;&nbsp; ] Bluetooth Desactivado</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 7.0 ANTECEDENTES, MOTIVO Y FIRMAS DE CONFORMIDAD */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <PlanillaSectionTitle id="seccion-7.0">7.0 ANTECEDENTES, MOTIVO DE LA CONSIGNACIÓN Y FIRMAS DE CONFORMIDAD</PlanillaSectionTitle>
        <PlanillaFieldLabel style={{ fontSize: '8.5pt', fontWeight: 'bold', marginBottom: '4px', display: 'block' }}>
          MOTIVO Y ANTECEDENTES DE LA CONSIGNACIÓN (Describa los hechos que motivan la entrega de la evidencia):
        </PlanillaFieldLabel>
        <div className="form-group motive-box" contentEditable suppressContentEditableWarning style={{ minHeight: '220px', padding: '12px', lineHeight: '24px' }}>
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
        </div>
      </div>

      {/*  VII. FIRMAS  */}
      <div className="signature-section" style={{ gap: '14mm' }}>
        <div className="sig-detail-card">
          <div className="sig-detail-label">EL CONSIGNANTE PRIVADO</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Nombre del Consignante]</span>}</span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula de Identidad]</span>}</span>
          </div>
          <div className="sig-field">
            Teléfono: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Número Telefónico]</span>}</span>
          </div>
          <div className="sig-field">
            Dirección: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Dirección de Habitación]</span></span>
          </div>

          <div className="sig-line" style={{ marginTop: '16px' }} />
          <div className="sig-line-label">Firma del Consignante Privado</div>

          <div className="fingerprint-row" style={{ margin: '12px 0 8px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
        </div>
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO RECEPTOR</div>
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

          <div className="sig-line" style={{ marginTop: '16px' }} />
          <div className="sig-line-label">Firma del Perito Receptor</div>

          <div className="fingerprint-row" style={{ margin: '12px 0 8px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>

          <div style={{ fontSize: '8px', textAlign: 'center', marginTop: '6px', color: '#0F172A', fontWeight: 'bold' }}>
            Rol ISO/IEC 27037: [ &nbsp;X&nbsp; ] DEFR (Adquisición & Imagen Forense) &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] DES
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
