import { useEffect } from 'react';
import './Planillas.css';

const SeguimientoPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="planilla-container">

    <div className="app-container">
        <aside>
            <div className="logo">
                <span className="logo-text">SHA256.US</span>
                <span className="logo-subtext">Cero Riesgo de Nulidad</span>
            </div>

            <div className="nav-section">
                <span className="nav-title">Fase 1: Obtención</span>
                <a href="#step1" className="nav-item active" id="nav-step1"><span className="step-num">1</span> <span>Recepción</span></a>
                <a href="#step2" className="nav-item" id="nav-step2"><span className="step-num">2</span> <span>Fijación In Situ</span></a>
                <a href="#step3" className="nav-item" id="nav-step3"><span className="step-num">3</span> <span>Adquisición</span></a>
                <a href="#step4" className="nav-item" id="nav-step4"><span className="step-num">4</span> <span>PRCC & Embalaje</span></a>
            </div>

            <div className="nav-section">
                <span className="nav-title">Fase 2: Peritaje</span>
                <a href="#step5" className="nav-item" id="nav-step5"><span className="step-num">5</span> <span>Recepción Lab</span></a>
                <a href="#step6" className="nav-item" id="nav-step6"><span className="step-num">6</span> <span>Procesamiento</span></a>
                <a href="#step7" className="nav-item" id="nav-step7"><span className="step-num">7</span> <span>Derivación</span></a>
            </div>

            <div className="nav-section">
                <span className="nav-title">Fase 3: Dictamen & Cierre</span>
                <a href="#step8" className="nav-item" id="nav-step8"><span className="step-num">8</span> <span>Elaboración Dictamen</span></a>
                <a href="#step9" className="nav-item" id="nav-step9"><span className="step-num">9</span> <span>Remisión</span></a>
            </div>
        </aside>

        <main>
            <header>
                <div className="phase-badge">República Bolivariana de Venezuela</div>
                <h1>Protocolo de Peritaje Forense Android</h1>
                <div className="header-meta">
                    <span><strong>Objetivo:</strong> Análisis con Cero Riesgo de Nulidad</span>
                    <span><strong>Normas:</strong> MUCCEF 2017, ISO 27037/27042</span>
                </div>
            </header>

            {/*  STEP 1  */}
            <section id="step1" className="step-card">
                <div className="card-header">
                    <h2 className="card-title">Paso 1: Recepción, Entrevista y Consignación</h2>
                    <span className="step-action">Acción: Recibir el dispositivo y levantar actas preliminares.</span>
                </div>
                <div className="doc-box">
                    <span className="doc-title">Documentación Obligatoria</span>
                    <ul className="doc-list">
                        <li>Acta de Entrevista</li>
                        <li>Acta de Obtención por Consignación</li>
                    </ul>
                    <div className="doc-filling"><strong>Cómo llenarlas:</strong> Deben redactarse en tercera persona, tiempo presente, de manera clara, secuencial y precisa. Indicar circunstancias de modo, tiempo y lugar. Firmadas por el consignatario y funcionario receptor.</div>
                </div>
                <ul className="tutorial-list">
                    <li className="tutorial-item">Realiza una entrevista estructurada (preguntas básicas, intermedias y finales) a quien entrega el equipo.</li>
                    <li className="tutorial-item">Levanta el Acta de Entrevista para dejar constancia de cómo obtuvo los chats/audios.</li>
                    <li className="tutorial-item">Levanta el Acta de Obtención por Consignación recibiendo formalmente la evidencia.</li>
                </ul>
                <div className="checkbox-container" onClick={() => { window.print() }}>
                    <input type="checkbox" id="check1" onChange={() => { }} />
                    <label className="checkbox-label">Paso Completado</label>
                </div>
            </section>

            {/*  STEP 2  */}
            <section id="step2" className="step-card">
                <div className="card-header">
                    <h2 className="card-title">Paso 2: Fijación In Situ y Aislamiento</h2>
                    <span className="step-action">Acción: Fijar fotográficamente el dispositivo en vivo y aislarlo de la red.</span>
                </div>
                <div className="doc-box">
                    <span className="doc-title">Documentación Obligatoria</span>
                    <ul className="doc-list">
                        <li>Fijación fotográfica (Reseñada en Acta de Obtención)</li>
                    </ul>
                    <div className="doc-filling"><strong>Cómo llenarlas:</strong> En el Acta de Obtención se debe describir el dispositivo: marca, modelo, IMEI, SIMCard, y estado de la pantalla.</div>
                </div>
                <ul className="tutorial-list">
                    <li className="tutorial-item">Fija fotográficamente la pantalla mostrando la actividad "sin intervenir en su funcionalidad" (no tocar botones).</li>
                    <li className="tutorial-item">Aísla el equipo poniéndolo en Modo Avión o usando Bolsa de Faraday para evitar borrado remoto.</li>
                    <li className="tutorial-item">Documenta los datos individualizantes del móvil.</li>
                </ul>
                <div className="checkbox-container" onClick={() => { window.print() }}>
                    <input type="checkbox" id="check2" onChange={() => { }} />
                    <label className="checkbox-label">Paso Completado</label>
                </div>
            </section>

            {/*  STEP 3  */}
            <section id="step3" className="step-card">
                <div className="card-header">
                    <h2 className="card-title">Paso 3: Adquisición Digital Forense</h2>
                    <span className="step-action">Acción: Extracción física/lógica y sellado hash.</span>
                </div>
                <div className="doc-box">
                    <span className="doc-title">Documentación Obligatoria</span>
                    <ul className="doc-list">
                        <li>Documentación para el Dictamen Pericial</li>
                    </ul>
                    <div className="doc-filling"><strong>Cómo llenarlas:</strong> Anotar las versiones exactas del software (Andriller) y los algoritmos Hash utilizados.</div>
                </div>
                <ul className="tutorial-list">
                    <li className="tutorial-item">Conecta el dispositivo asegurando inalterabilidad (write-blockers).</li>
                    <li className="tutorial-item">Ejecuta "Andriller" para realizar una adquisición de solo lectura, no destructiva.</li>
                    <li className="tutorial-item">Calcula inmediatamente el Hash (SHA-256 o MD5) de la imagen extraída para sellar la data.</li>
                </ul>
                <div className="checkbox-container" onClick={() => { window.print() }}>
                    <input type="checkbox" id="check3" onChange={() => { }} />
                    <label className="checkbox-label">Paso Completado</label>
                </div>
            </section>

            {/*  STEP 4  */}
            <section id="step4" className="step-card">
                <div className="card-header">
                    <h2 className="card-title">Paso 4: Apertura de Cadena de Custodia, Embalaje y Rotulado</h2>
                    <span className="step-action">Acción: Ingresar la evidencia matriz al sistema de protección.</span>
                </div>
                <div className="doc-box">
                    <span className="doc-title">Documentación Obligatoria</span>
                    <ul className="doc-list">
                        <li>Planilla de Registro de Cadena de Custodia (PRCC)</li>
                        <li>Rótulo de Evidencia</li>
                    </ul>
                    <div className="doc-filling"><strong>Cómo llenarlas:</strong> PRCC: Tinta negra/azul, letra de molde, firma manuscrita e impresión dactilar del pulgar derecho. RÓTULO: Tinta indeleble. Incluir Oficina, Expediente, PRCC, descripción y observaciones.</div>
                </div>
                <ul className="tutorial-list">
                    <li className="tutorial-item">Abre la PRCC y completa la Fase de Obtención con los datos del móvil.</li>
                    <li className="tutorial-item">Embala el dispositivo usando bolsa antiestática o papel y coloca precintos de seguridad físicos.</li>
                    <li className="tutorial-item">Fija el Rótulo con la información correspondiente.</li>
                </ul>
                <div className="checkbox-container" onClick={() => { window.print() }}>
                    <input type="checkbox" id="check4" onChange={() => { }} />
                    <label className="checkbox-label">Paso Completado</label>
                </div>
            </section>

            {/*  STEP 5  */}
            <section id="step5" className="step-card">
                <div className="card-header">
                    <h2 className="card-title">Paso 5: Recepción, Verificación y Designación</h2>
                    <span className="step-action">Acción: Ingreso al laboratorio forense y asignación de perito.</span>
                </div>
                <div className="doc-box">
                    <span className="doc-title">Documentación Obligatoria</span>
                    <ul className="doc-list">
                        <li>PRCC (Transferencia: Recibe)</li>
                        <li>Libro de Registro Interno de Laboratorio</li>
                    </ul>
                    <div className="doc-filling"><strong>Cómo llenarlas:</strong> PRCC: Firma y pulgar derecho tras verificar precintos. LIBRO: Foliado, asentar fecha, hora y datos del perito que acepta el caso.</div>
                </div>
                <ul className="tutorial-list">
                    <li className="tutorial-item">Comprueba la integridad del embalaje y rótulos.</li>
                    <li className="tutorial-item">Recalcula el Hash de la imagen y compáralo con el de extracción (Art. 7 Ley Mensajes de Datos).</li>
                    <li className="tutorial-item">El perito firma los controles internos aceptando formalmente el caso.</li>
                </ul>
                <div className="checkbox-container" onClick={() => { window.print() }}>
                    <input type="checkbox" id="check5" onChange={() => { }} />
                    <label className="checkbox-label">Paso Completado</label>
                </div>
            </section>

            {/*  STEP 6  */}
            <section id="step6" className="step-card">
                <div className="card-header">
                    <h2 className="card-title">Paso 6: Procesamiento Estructurado con ALEAPP</h2>
                    <span className="step-action">Acción: Parsear logs y bases de datos SQLite.</span>
                </div>
                <div className="doc-box">
                    <span className="doc-title">Documentación Obligatoria</span>
                    <ul className="doc-list">
                        <li>Logs y Tablas de salida de ALEAPP</li>
                    </ul>
                    <div className="doc-filling"><strong>Cómo llenarlas:</strong> Garantizar que el reporte liste nombres nativos, fechas, rutas y Hashes individuales.</div>
                </div>
                <ul className="tutorial-list">
                    <li className="tutorial-item">Carga la imagen forense en ALEAPP.</li>
                    <li className="tutorial-item">Procesa msgstore.db (WhatsApp), audios (.opus) y screenshots.</li>
                    <li className="tutorial-item">Reconstruye el Timeline (ISO 27042).</li>
                </ul>
                <div className="checkbox-container" onClick={() => { window.print() }}>
                    <input type="checkbox" id="check6" onChange={() => { }} />
                    <label className="checkbox-label">Paso Completado</label>
                </div>
            </section>

            {/*  STEP 7  */}
            <section id="step7" className="step-card">
                <div className="card-header">
                    <h2 className="card-title">Paso 7: Obtención por Derivación (Nueva Evidencia)</h2>
                    <span className="step-action">Acción: Aislar chats, audios o archivos clave detectados.</span>
                </div>
                <div className="doc-box">
                    <span className="doc-title">Documentación Obligatoria</span>
                    <ul className="doc-list">
                        <li>NUEVA PRCC (Para data derivada)</li>
                        <li>Acta de Obtención por Derivación</li>
                    </ul>
                    <div className="doc-filling"><strong>Cómo llenarlas:</strong> NUEVA PRCC: Propio número correlativo, tinta negra/azul, firma y huella. ACTA: Indicar ruta específica de aislamiento desde la evidencia principal.</div>
                </div>
                <ul className="tutorial-list">
                    <li className="tutorial-item">Aísla las transcripciones, imágenes y audios relevantes.</li>
                    <li className="tutorial-item">Genera el Acta de Obtención por Derivación.</li>
                    <li className="tutorial-item">Abre la Nueva PRCC describiendo archivos y sus hashes.</li>
                </ul>
                <div className="checkbox-container" onClick={() => { window.print() }}>
                    <input type="checkbox" id="check7" onChange={() => { }} />
                    <label className="checkbox-label">Paso Completado</label>
                </div>
            </section>

            {/*  STEP 8  */}
            <section id="step8" className="step-card">
                <div className="card-header">
                    <h2 className="card-title">Paso 8: Elaboración del Dictamen Pericial</h2>
                    <span className="step-action">Acción: Estructuración y blindaje legal de los resultados.</span>
                </div>
                <div className="doc-box">
                    <span className="doc-title">Documentación Obligatoria</span>
                    <ul className="doc-list">
                        <li>Dictamen Pericial</li>
                    </ul>
                    <div className="doc-filling"><strong>Cómo llenarlas:</strong> Estructura: Motivo, Descripción, Exámenes, Resultados, Conclusiones y Consumo. Firmado y sellado.</div>
                </div>
                <ul className="tutorial-list">
                    <li className="tutorial-item">Redacta resultados con tabla de: Nombre, fechas, ruta, tamaño y Hash.</li>
                    <li className="tutorial-item">Fundamenta con Ley de Mensajes de Datos (Art. 4 y 8).</li>
                    <li className="tutorial-item">Declara que la evidencia original no fue consumida ni alterada.</li>
                </ul>
                <div className="checkbox-container" onClick={() => { window.print() }}>
                    <input type="checkbox" id="check8" onChange={() => { }} />
                    <label className="checkbox-label">Paso Completado</label>
                </div>
            </section>

            {/*  STEP 9  */}
            <section id="step9" className="step-card">
                <div className="card-header">
                    <h2 className="card-title">Paso 9: Re-embalaje y Remisión</h2>
                    <span className="step-action">Acción: Preparar el dispositivo y la data para su salida.</span>
                </div>
                <div className="doc-box">
                    <span className="doc-title">Documentación Obligatoria</span>
                    <ul className="doc-list">
                        <li>PRCC (Transferencia: Entrega)</li>
                    </ul>
                    <div className="doc-filling"><strong>Cómo llenarlas:</strong> Renglón "Entrega", Motivo: "Traslado" o "Resguardo". Firma y huella del perito.</div>
                </div>
                <ul className="tutorial-list">
                    <li className="tutorial-item">Coloca el dispositivo en su embalaje original (o nuevo si se dañó).</li>
                    <li className="tutorial-item">Coloca nuevos precintos de seguridad del laboratorio.</li>
                    <li className="tutorial-item">Remite a Resguardo Judicial o despacho fiscal.</li>
                </ul>
                <div className="checkbox-container" onClick={() => { window.print() }}>
                    <input type="checkbox" id="check9" onChange={() => { }} />
                    <label className="checkbox-label">Paso Completado</label>
                </div>
            </section>



            <div className="footer-info">
                SHA256 Forensic Laboratory | Protocolo MUCCEF 2017 | Ley sobre Mensajes de Datos y Firmas Electrónicas
            </div>
        </main>
    </div>

    

    </div>
  );
};

export default SeguimientoPage;
