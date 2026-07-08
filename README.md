# SHA256.US — CMS de Cumplimiento Forense

**Sistema de gestión de cumplimiento normativo para procesos de peritaje digital.**  
Diseñado para que el **Compliance Officer** lleve el seguimiento comprobable de cada caso, genere los reportes exigidos por la ley e imprima las planillas oficiales en cada etapa del proceso.

> Basado en: Manual Único de Cadena de Custodia (Venezuela, 2017), ISO/IEC 27037, NIST SP 800-101, COPP, Ley de Mensajes de Datos y Firmas Electrónicas, y normativas SUSCERTE.

---

## Propósito

Esta app **no realiza análisis forense**. Es un **gestor de contenido (CMS)** que ayuda al perito auditor a:

- **Crear y gestionar casos** con toda la metadata del dispositivo y las partes involucradas.
- **Controlar el cumplimiento normativo** paso a paso según los instrumentos legales precargados.
- **Imprimir planillas oficiales** en tamaño Carta con proporciones de papel sellado.
- **Exportar en ZIP** formatos editables HTML y Microsoft Word (.doc) con estilos inlined.
- **Auditar cada acción** con trazabilidad inmutable mediante encadenamiento de hashes SHA-256 (hash chain).
- **Generar reportes de auditoría** con línea de tiempo imprimible para presentar en tribunales.

---

## Stack Tecnológico y Diseño

| Capa | Tecnología | Detalles |
|------|-----------|----------|
| **Framework** | Next.js 16+ (App Router) | Server-side rendering, generación estática y routing por archivos en `src/app/`. |
| **Frontend** | React 19 + TypeScript 6 | Arquitectura tipada modular. |
| **Estilos** | TailwindCSS 3 (Modo Oscuro Permanente) | Selector de modo claro removido para consistencia visual. |
| **Tipografía** | Ubuntu (Google Fonts) | Pesos 300, 400, 500, 700 — tipografía global del sistema. |
| **Iconografía** | Google Material Design Icons (Outlined) | Integrado a nivel de componentes atómicos via `AppleIcon.tsx`. |
| **Estado** | Zustand 5 + IndexedDB | Gestión reactiva de datos offline-first. |
| **Persistencia** | IndexedDB + Neon PostgreSQL | Sincronización robusta en la nube con fallback local. |
| **Deploy** | Vercel (standalone) | Despliegue perimetral global con output `standalone`. |

---

## Estructura del Proyecto

```
SHA256.US/
├── src/
│   ├── components/       # Componentes React (Atomic Design)
│   │   ├── atoms/        # Componentes base (Toast, ErrorBoundary, AppleIcon.tsx)
│   │   ├── molecules/    # Componentes compuestos (KpiCard)
│   │   ├── organisms/    # Bloques funcionales (Casos, Compliance, etc.)
│   │   └── templates/    # Layouts estructurales (CMSLayout, Layout)
│   ├── pages/            # Páginas del CMS
│   │   ├── DashboardPage.tsx
│   │   ├── CasosPage.tsx / CasoDetailPage.tsx
│   │   ├── Control/SeguimientoCompliancePage.tsx
│   │   ├── NormativasPage.tsx / AuditoriaPage.tsx
│   │   ├── PersonalPage.tsx / TareasPage.tsx
│   │   ├── CorreoForensePage.tsx
│   │   ├── Forense/          # TutorialesForensesPage, ManualAvillaPage, ManualServerlessPage
│   │   └── Planillas/    # ActaObtencionPage, ActaEntrevistaPage, PlanillaPRCCPage, DictamenPage
│   ├── store/            # Zustand stores
│   │   ├── cmsStore.ts   # Estado principal del CMS (Semillas alineadas a normativas_rag)
│   │   ├── auditStore.ts # Auditoría con hash chain
│   │   └── authStore.ts  # Autenticación
│   ├── data/             # Fuentes de datos compartidas
│   └── db/               # Capa de persistencia
├── normativas_rag/       # Base documental de RAG (77 archivos de leyes, códigos y estándares)
├── design_tokens.md      # Especificaciones del sistema de diseño (colores, fuentes y sombras)
├── dist/                 # Build de producción
└── public/               # Assets estáticos
```

---

## Sistema de Diseño (Tokens y Jerarquías)

Para optimizar la visualización del CMS de Compliance Officer en modo oscuro absoluto:
* **h1:** `#00FF41` (Verde Matriz)
* **h2:** `#FECF06` (Amarillo Oro)
* **h3 / h4:** `#524000` (Dorado Oscuro) con fondo de contraste translúcido (`rgba(254, 207, 6, 0.18)`) y filete lateral izquierdo de 3px.
* **h5 / h6:** `#FFFFFF` (Blanco)

---

## Instalación y Uso

```bash
npm install
npm run dev      # Desarrollo en http://localhost:3000
npm run build    # Build producción optimizada
npm run start    # Servidor de producción
npm run lint     # Linting con ESLint
```

Credenciales por defecto: `admin` / `admin`

---

## Licencia

MIT

---

*Versión: 3.0.0 — CMS de Cumplimiento Forense*  
*Última actualización: Julio 2026*
