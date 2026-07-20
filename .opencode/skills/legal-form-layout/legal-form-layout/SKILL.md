---
name: legal-form-layout
description: "Maquetador profesional de planillas y formularios del sistema jurídico de Estados Unidos (cortes estatales, cortes federales y agencias administrativas), especializado en organización del texto y diseño UX/UI para máxima legibilidad y facilidad de llenado. Úsala siempre que el usuario pida crear, rediseñar o maquetar una 'planilla', 'formulario', 'form', 'petition', 'affidavit', 'motion', 'pro se form' o cualquier documento legal en tamaño folio/legal (8.5x14) con membrete (letterhead/caption) y footer de identificación del organismo emisor, número de formulario, versión o cita legal. Aplica también cuando el usuario menciona 'court form', 'poder judicial', 'corte', 'tribunal', 'agencia', 'departamento', 'oficina de inmigración', 'USCIS-style form', o pide que un formulario sea 'fácil de llenar', 'claro', 'legible' o cumpla con requisitos legales de identificación del emisor. Esta skill define las convenciones de diseño y estructura; para la generación real del archivo .docx debe combinarse con la skill docx."
---

# Maquetador de planillas jurídicas (EE. UU.)

Esta skill define cómo un maquetador/diseñador UX experto en el sistema de justicia estadounidense organiza,
diseña y da formato a planillas y formularios legales para ser impresos en papel tamaño **folio/legal
(8.5" x 14")**, con membrete (caption) y footer de identificación del organismo emisor, optimizando la
lectura, la comprensión y el llenado correcto por parte del usuario final (litigante, abogado, funcionario).

**Siempre combina esta skill con `/mnt/skills/public/docx/SKILL.md`** cuando el entregable final sea un
archivo `.docx` — esta skill aporta las convenciones de diseño legal; la skill `docx` aporta la mecánica de
generación del archivo con `docx-js`.

## Paso 0 — Preguntas mínimas antes de maquetar

No preguntes todo de una vez ni bloquees el trabajo por detalles menores; con lo esencial, avanza y deja
supuestos explícitos. Si el usuario no lo indicó ya, aclara solo lo indispensable:

1. **Organismo emisor exacto** (nombre completo, jurisdicción, dirección si aplica) — va en membrete y footer.
2. **Tipo de planilla** (petición, moción, declaración jurada/affidavit, formulario administrativo, orden,
   citación, formulario de beneficios, etc.) — determina la estructura de campos.
3. **Contenido/campos** que debe llevar (o el texto/formulario existente a rediseñar).

Si el usuario ya dio esta información (o adjuntó un formulario existente a rediseñar), no vuelvas a preguntar:
procede directo al maquetado.

## Principios de diseño (UX/UI aplicado a formularios legales)

- **Jerarquía visual clara**: título del formulario en la parte superior, en mayúsculas o negrita, seguido
  del número/código oficial del formulario si existe (ej. "Formulario AOC-CV-1").
  - Los conceptos deben poder identificarse en menos de 3 segundos: nombre del organismo, tipo de trámite,
  y qué se espera que la persona haga.
- **Agrupación lógica de campos**: secciones numeradas (I, II, III o 1, 2, 3), cada una con encabezado
  descriptivo en negrita. No mezclar datos de identificación con declaraciones sustantivas en la misma sección.
- **Espacio para llenar generoso**: usar líneas de subrayado (`___________`) o casillas de tabla con altura
  suficiente para escritura a mano; nunca comprimir campos. Dejar como referencia ~0.3"-0.4" de alto por
  línea de escritura manual.
- **Etiquetas antes del espacio, no después**: "Nombre completo: ______" y no una línea suelta sin contexto.
- **Checkboxes (☐) para opciones excluyentes o múltiples**, alineados en columna, nunca en párrafo corrido.
- **Tipografía**: fuente serif clásica (Times New Roman) o sans-serif neutra (Arial) — nunca decorativas.
  Cuerpo del formulario en 11-12pt; membrete y datos de caso pueden ir en 10-11pt; footer en 8-9pt.
- **Contraste y densidad**: márgenes de al menos 0.75" (1" si el organismo exige encuadernación/perforado);
  interlineado 1.15-1.5 en bloques de instrucciones; evitar párrafos largos — preferir listas numeradas.
- **Lenguaje llano junto al legal**: si el formulario incluye lenguaje técnico obligatorio (cláusulas de
  certificación, jurament, "under penalty of perjury"), puede acompañarse de una instrucción breve en
  lenguaje simple sobre qué debe hacer la persona en cada sección, sin alterar el texto legal obligatorio.
- **Firma y fecha siempre al final de cada declaración jurada**, con línea de firma, nombre en imprenta,
  fecha, y si aplica, notario o testigo.

## Estructura estándar de una planilla judicial/administrativa en EE. UU.

```
[MEMBRETE / CAPTION]
  Nombre del organismo (corte, agencia, departamento) — centrado o alineado según la
  convención de esa jurisdicción
  Dirección / división / circuito (si aplica)
  Sello o espacio reservado para sello oficial (si aplica) — usar un marcador de posición
  claramente etiquetado, nunca inventar un sello

  Caso No.: ______________        (si es planilla judicial: nombre de las partes,
  Demandante/Petitioner: ________   "Plaintiff v. Defendant" o formato equivalente)
  Demandado/Respondent: _________

[TÍTULO DEL FORMULARIO]
  (Nombre oficial del formulario, número de formulario si existe, referencia a la regla o
  estatuto que lo exige, si se conoce)

[INSTRUCCIONES BREVES] (opcional pero recomendado para formularios pro se / público general)

[CUERPO — secciones numeradas con campos]
  1. Información de identificación
  2. Declaración / solicitud / hechos
  3. Certificación bajo pena de perjurio (si aplica)
  4. Firma(s)

[FOOTER — en cada página]
  Nombre del organismo emisor
  Número/código de formulario y versión o fecha de revisión (ej. "Form CV-100 [Rev. 01/2026]")
  Número de página ("Página 1 de 2")
  Referencia legal si la ley exige citar la autoridad que aprueba el formulario
```

Esta estructura es una guía general: **respeta siempre el formato específico que exija la jurisdicción u
organismo indicado por el usuario** cuando se conozca (los tribunales estatales, tribunales federales y
agencias administrativas tienen reglas de formato propias — captions, márgenes, tipografía obligatoria,
numeración de líneas en el margen izquierdo, etc.). Si el usuario no especifica la jurisdicción exacta, usa
esta estructura genérica y dilo explícitamente como un supuesto.

## Configuración de página (papel folio/legal)

Al generar el `.docx` con la skill `docx`, configura:

- **Tamaño legal (8.5" x 14")**: en DXA, `width: 12240, height: 20160` (1440 DXA = 1").
- **Márgenes**: 1" en todos los lados como mínimo estándar; ajustar solo si el organismo indicado exige otra
  medida (algunas cortes exigen numeración de líneas en el margen izquierdo, lo que requiere margen extra).
- **Encabezado (membrete)** y **pie de página (footer)** repetidos en todas las páginas usando `Header`/`Footer`
  de docx-js — nunca escribir el membrete/footer como texto suelto en el cuerpo, para que se repita
  automáticamente en documentos de varias páginas.
- **Numeración de página** en el footer ("Página X de Y") cuando el formulario tenga más de una página.

## Checklist final antes de entregar

- [ ] ¿El membrete identifica claramente el organismo emisor y, si aplica, el caso/las partes?
- [ ] ¿El footer identifica al organismo emisor en cada página, con número de formulario/versión, como lo
      exige la ley o la convención del organismo?
- [ ] ¿Cada campo tiene su etiqueta y espacio suficiente para llenarse a mano o a máquina?
- [ ] ¿Las secciones están numeradas y agrupadas lógicamente?
- [ ] ¿El tamaño de página es legal/folio (8.5" x 14") salvo indicación contraria?
- [ ] ¿Se verificó el resultado renderizando el `.docx` a PDF/imagen (ver skill `docx`, sección "Verify the
      output") para confirmar que el membrete y footer se ven correctamente en cada página?

Si falta información sobre el organismo exacto o la jurisdicción, indícalo como supuesto explícito en la
respuesta al usuario en vez de inventar datos oficiales (nombre de corte, sello, número de formulario).
