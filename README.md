<div align="center">

# 🛡️ SHA256.US — CMS de Cumplimiento Forense Digital

### *Sistema Integral de Cadena de Custodia, Peritaje Informático y Compliance Legal*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.7-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MUI v6](https://img.shields.io/badge/MUI_v6-DataGrid_X-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![License](https://img.shields.io/badge/Licencia-MIT-00FF41?style=for-the-badge)](LICENSE)

---

**SHA256.US** es una plataforma web **Cyber-Legal** de alto nivel diseñada para peritos informáticos, auditores y Compliance Officers. Permite la administración rigurosa de evidencias digitales, el seguimiento estricto de protocolos normativos y la generación de documentos con validez legal.

</div>

---

## ⚡ ¿Qué hace esta aplicación?

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3>📁 1. Gestión Integral de Casos (CRUD)</h3>
      <p>Administra expedientes digitales completos para auditorías de WhatsApp, Correos Electrónicos, Discos Duros y Dispositivos Móviles. Incluye registro de metadatos, evidencias y partes involucradas.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🔒 2. Compliance Stepper Secuencial</h3>
      <p>Flujos forenses automatizados paso a paso con <b>bloqueo de etapas</b>. Garantiza que no se salten procedimientos requeridos por normas internacionales y leyes locales.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>📜 3. Planillas Oficiales Legal-Forense</h3>
      <p>Generación e impresión directa de <b>7 planillas oficiales</b> en tamaño <b>Folio / Oficio (216mm x 330mm)</b> con márgenes reglamentarios (Actas de Obtención, PRCC, Entrevistas, Dictámenes).</p>
    </td>
    <td width="50%" valign="top">
      <h3>⛓️ 4. Auditoría Inmutable (Hash Chain SHA-256)</h3>
      <p>Cada acción en el sistema genera un registro encadenado mediante algoritmos criptográficos <b>SHA-256</b>, garantizando la inalterabilidad ante tribunales (MUI X DataGrid).</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>📚 5. Base de Conocimiento Normativo RAG</h3>
      <p>Biblioteca integrada de <b>77 documentos normativos</b> (ISO/IEC 27037, ISO 27042, NIST SP 800-101, MUCC-2017, COPP, Ley de Mensajes de Datos y Firma Electrónica).</p>
    </td>
    <td width="50%" valign="top">
      <h3>⚡ 6. Offline-First & Sincronización</h3>
      <p>Funciona al 100% sin conexión mediante <b>IndexedDB</b> en el navegador local, con soporte de sincronización opcional en la nube con <b>Neon PostgreSQL</b>.</p>
    </td>
  </tr>
</table>

---

## 🔬 Flujos Forenses Especializados

```mermaid
graph LR
    A[📦 Recepción & Obtención] --> B[🔒 Cadena de Custodia PRCC]
    B --> C[⚙️ Extracción & Análisis Bit a Bit]
    C --> D[⚖️ Auditoría & Hash SHA-256]
    D --> E[🖨️ Dictamen & Impresión Folio]
```

1. **WhatsApp Forensics:** 9 pasos guiados (Recepción → ALEAPP / msgstore.db → Informe Pericial).
2. **Email Forensics:** 7 pasos (PST/OST → Análisis de Cabeceras RFC 822 → Adjuntos).
3. **Hard Drive Forensics:** 8 pasos (Write-Blocker → Imagen DD/E01 → Recuperación).

---

## 🚀 Guía Rápida de Instalación Local

Sigue estos 4 sencillos pasos para tener la aplicación corriendo localmente en menos de 2 minutos:

### 📋 Requisitos Previos

- **Node.js:** Versión `18.x` o superior
- **Git:** Instalado en tu equipo
- **Navegador Web:** Chrome, Edge o Firefox

---

### 📥 Paso 1: Clonar el Repositorio

Abre tu terminal y ejecuta:

```bash
git clone https://github.com/julljoll/SHA256.git
cd SHA256
```

---

### 📦 Paso 2: Instalar Dependencias

Ejecuta el gestor de paquetes para instalar todas las librerías:

```bash
npm install
```

---

### ⚙️ Paso 3: Configurar Variables de Entorno *(Opcional)*

La aplicación funciona de forma **autónoma offline** con almacenamiento local IndexedDB. Si deseas conectarla a una base de datos en la nube (Neon PostgreSQL):

> [!NOTE]
> Copia el archivo `.env.example` como `.env.local` y configura tu conexión:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_NEON_DATABASE_URL=postgresql://usuario:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

---

### 🖥️ Paso 4: Iniciar el Servidor de Desarrollo

Inicia la aplicación en modo local:

```bash
npm run dev
```

> [!TIP]
> Abre tu navegador e ingresa a: **`http://localhost:3000`**

---

### 🔑 Credenciales de Acceso Local

```yaml
Usuario: julljoll@gmail.com
Contraseña: admin
```

---

## 🛠️ Comandos de Terminal

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local con Turbopack |
| `npm run build` | Compila y optimiza la aplicación para producción |
| `npm run start` | Inicia el servidor optimizado de producción |
| `npm run lint` | Revisa la calidad del código TypeScript / ESLint |

---

<div align="center">

**SHA256.US — Compliance Officer CMS Forense Digital**  
*Garantizando la integridad, autenticidad y cadena de custodia de la evidencia digital.*

</div>
