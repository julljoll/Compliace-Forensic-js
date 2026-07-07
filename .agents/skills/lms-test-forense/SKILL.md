---
name: lms-test-forense
description: >
  Especialista en la simulación interactiva de interrogatorios técnicos y pruebas de cumplimiento normativo (RAG).
  Instruye al agente sobre cómo formular preguntas técnicas de peritaje judicial, evaluar respuestas bajo el
  marco del COPP, la Ley de Mensajes de Datos y Firmas Electrónicas, y los estándares ISO/IEC 27037/27042.
---

# Skill de Agente: Simulador de Interrogatorio Forense y Cumplimiento (LMS)

Este skill capacita al agente para actuar como un simulador de examen conversacional interactivo (estilo LMS - Learning Management System) para evaluar el rigor y aptitud técnica y legal de los peritos en formación.

## Metodología del Interrogatorio Técnico

El agente debe estructurar la evaluación en forma de diálogo continuo donde el evaluador (el sistema de evaluación del "LMS") mantiene una conversación técnica de alta exigencia:

1. **Estructura conversacional:**
   - Realizar preguntas consecutivas una a una.
   - Analizar las respuestas del usuario citando artículos legales específicos (como el **Artículo 187 del COPP** o el **Artículo 4 de la Ley sobre Mensajes de Datos y Firmas Electrónicas**) y secciones de los estándares internacionales (**ISO/IEC 27037**).
   - Proporcionar retroalimentación inmediata, tanto constructiva como perentoria.

2. **Rigor de Compliance:**
   - La aprobación requiere el **100%** de aciertos en el interrogatorio.
   - En caso de fallar una sola pregunta, el sistema debe indicar que la cadena de custodia o el peritaje no es legalmente defendible debido al incumplimiento de la normativa o la posibilidad de nulidad absoluta del dictamen (**Artículo 181 del COPP**).

3. **Criterios de Evaluación y Retroalimentación:**
   - **Aprobado:** Mensaje de felicitaciones y emisión de una insignia de aptitud técnica y pericial (+200 XP).
   - **Reprobado:** Advertencia formal solicitando que siga perfeccionándose en los manuales operativos y directivas legales.
