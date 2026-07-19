# Adquisición: AVILLA Forensics y Kali Linux + Andriller

Ambas herramientas se usan aquí **exclusivamente para adquisición** (obtener la imagen/extracción del dispositivo), no para análisis. El análisis va después, con IPED o ALEAPP.

## AVILLA Forensics

AVILLA Forensics es una herramienta gratuita (desarrollada por la Policía Científica de Brasil) orientada a la adquisición forense de dispositivos móviles Android, especialmente útil por su soporte a extracciones vía ADB y su capacidad de generar extracciones lógicas y de sistema de archivos en formatos compatibles con procesadores forenses como IPED.

**Flujo típico:**
1. Aislar el dispositivo de red (modo avión + Faraday si es posible, o al menos deshabilitar Wi-Fi/datos) antes de conectar — evita borrado remoto o sincronización que altere la evidencia.
2. Habilitar depuración USB en el dispositivo si el estado del caso lo permite (documentar si ya venía habilitada o si tuviste que activarla — esto es relevante para el informe).
3. Conectar el dispositivo y seleccionar en AVILLA el tipo de extracción:
   - **Lógica**: datos de aplicaciones accesibles sin privilegios elevados.
   - **Sistema de archivos completo**: requiere el dispositivo rooteado o el uso de exploits soportados por la herramienta para ciertos chipsets/versiones.
4. Ejecutar la extracción y esperar el reporte final de AVILLA, que incluye el hash de la extracción generada.
5. Calcular y registrar el hash (SHA-256 recomendado sobre MD5 por menor probabilidad de colisión) del archivo de salida inmediatamente después de la extracción, antes de mover el archivo a almacenamiento de evidencia.

**Nota de versión:** las opciones de menú y los chipsets/exploits soportados cambian entre versiones de AVILLA. Si el usuario menciona una versión específica, pregunta o indica que confirme en el changelog oficial antes de asumir que una opción de exploit sigue disponible.

## Kali Linux + Andriller

Andriller corre sobre Kali (o cualquier distro Linux con Python 3) y se enfoca en adquisición y decodificación rápida de dispositivos Android vía ADB, incluyendo utilidades de bypass de bloqueo de pantalla (PIN/patrón) para modelos específicos con vulnerabilidades conocidas.

**Flujo típico:**
1. Verificar que ADB reconoce el dispositivo:
   ```bash
   adb devices
   ```
2. Si el dispositivo está bloqueado y el modelo tiene un exploit soportado, usar el módulo de bypass de Andriller correspondiente (documentar en el informe el método usado — esto suele ser objeto de cuestionamiento en juicio, así que la trazabilidad del método importa).
3. Lanzar Andriller (interfaz gráfica o CLI):
   ```bash
   andriller
   ```
4. Seleccionar el dispositivo detectado y las categorías de datos a extraer (contactos, SMS, ubicaciones, apps de mensajería, etc.).
5. Andriller genera automáticamente un archivo de log/reporte de la sesión de extracción — consérvalo junto con la evidencia, es parte de la cadena de custodia técnica.
6. Igual que con AVILLA: hashear el resultado final apenas termine la extracción.

**Cuándo usar Andriller vs. AVILLA:** si el objetivo es una extracción rápida y dirigida (mensajería, contactos) en campo o con recursos limitados, Andriller es más ágil. Si se necesita una extracción de sistema de archivos más completa y compatible con el pipeline de IPED, AVILLA suele ser la opción más robusta. En laboratorios que manejan volumen, es común correr ambas y comparar cobertura.

## Regla común a ambas

No trabajes nunca sobre el archivo de extracción original. En cuanto se genera y se hashea, haz una copia de trabajo y realiza todo triaje/análisis posterior sobre esa copia, conservando el original intacto y verificado.
