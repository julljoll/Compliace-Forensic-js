import { sqlClient, ensureDbInitialized } from './_db';

export default async function handler(req: any, res: any) {
  // Manejo de CORS si es necesario (generalmente no, al estar en el mismo dominio)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,POST,PUT,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!sqlClient) {
    res.status(500).json({ error: 'Database connection not available' });
    return;
  }

  try {
    await ensureDbInitialized();

    const { method } = req;

    if (method === 'GET') {
      const { userId } = req.query;
      const uid = userId ? parseInt(userId as string, 10) : 1;
      const rows = await sqlClient('SELECT * FROM casos WHERE user_id = $1 ORDER BY created_at DESC', [uid]);
      res.status(200).json(rows);
      return;
    }

    if (method === 'POST') {
      const caso = req.body;
      const newId = caso.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      await sqlClient(`
        INSERT INTO casos (
          id, numero_caso, titulo, descripcion, estado, prioridad, fiscal,
          dispositivo_marca, dispositivo_modelo, dispositivo_imei, dispositivo_imei2,
          dispositivo_sim_card, dispositivo_numero_tel, dispositivo_estado_fisico,
          dispositivo_modo_aislamiento, dispositivo_danos_visibles, dispositivo_bateria_estado,
          dispositivo_pantalla_estado, user_id, completed_steps, step_metadata, compliance_checklist, created_at, updated_at,
          tipo_proyecto, solicitante_nombre, solicitante_cedula, correo_investigar, correo_proveedor,
          discoduro_serial, discoduro_capacidad, discoduro_marca, discoduro_modelo, steps
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34)
      `, [
        newId,
        caso.numero_caso || caso.numeroCaso || '',
        caso.titulo || '',
        caso.descripcion || '',
        caso.estado || 'iniciado',
        caso.prioridad || 'media',
        caso.fiscal || '',
        caso.dispositivo_marca || '',
        caso.dispositivo_modelo || '',
        caso.dispositivo_imei || '',
        caso.dispositivo_imei2 || '',
        caso.dispositivo_sim_card || '',
        caso.dispositivo_numero_tel || '',
        caso.dispositivo_estado_fisico || '',
        caso.dispositivo_modo_aislamiento || '',
        caso.dispositivo_danos_visibles || '',
        caso.dispositivo_bateria_estado || '',
        caso.dispositivo_pantalla_estado || '',
        caso.user_id || 1,
        caso.completed_steps ? JSON.stringify(caso.completed_steps) : '{}',
        caso.step_metadata ? JSON.stringify(caso.step_metadata) : '{}',
        caso.compliance_checklist ? JSON.stringify(caso.compliance_checklist) : '[]',
        caso.created_at || new Date().toISOString(),
        new Date().toISOString(),
        caso.tipo_proyecto || caso.tipoProyecto || 'forense_whatsapp',
        caso.solicitante_nombre || '',
        caso.solicitante_cedula || '',
        caso.correo_investigar || '',
        caso.correo_proveedor || '',
        caso.discoduro_serial || '',
        caso.discoduro_capacidad || '',
        caso.discoduro_marca || '',
        caso.discoduro_modelo || '',
        caso.steps ? JSON.stringify(caso.steps) : '{}'
      ]);
      res.status(200).json({ success: true, id: newId });
      return;
    }

    if (method === 'PUT') {
      const { id } = req.query;
      const data = req.body;
      if (!id) {
        res.status(400).json({ error: 'Falta el ID del caso' });
        return;
      }

      const updated = await sqlClient(`
        UPDATE casos SET
          titulo = COALESCE($1, titulo),
          descripcion = COALESCE($2, descripcion),
          estado = COALESCE($3, estado),
          prioridad = COALESCE($4, prioridad),
          fiscal = COALESCE($5, fiscal),
          dispositivo_marca = COALESCE($6, dispositivo_marca),
          dispositivo_modelo = COALESCE($7, dispositivo_modelo),
          dispositivo_imei = COALESCE($8, dispositivo_imei),
          dispositivo_imei2 = COALESCE($9, dispositivo_imei2),
          dispositivo_sim_card = COALESCE($10, dispositivo_sim_card),
          dispositivo_numero_tel = COALESCE($11, dispositivo_numero_tel),
          dispositivo_estado_fisico = COALESCE($12, dispositivo_estado_fisico),
          dispositivo_modo_aislamiento = COALESCE($13, dispositivo_modo_aislamiento),
          dispositivo_danos_visibles = COALESCE($14, dispositivo_danos_visibles),
          dispositivo_bateria_estado = COALESCE($15, dispositivo_bateria_estado),
          dispositivo_pantalla_estado = COALESCE($16, dispositivo_pantalla_estado),
          completed_steps = COALESCE($17, completed_steps),
          step_metadata = COALESCE($18, step_metadata),
          compliance_checklist = COALESCE($19, compliance_checklist),
          tipo_proyecto = COALESCE($20, tipo_proyecto),
          solicitante_nombre = COALESCE($21, solicitante_nombre),
          solicitante_cedula = COALESCE($22, solicitante_cedula),
          correo_investigar = COALESCE($23, correo_investigar),
          correo_proveedor = COALESCE($24, correo_proveedor),
          discoduro_serial = COALESCE($25, discoduro_serial),
          discoduro_capacidad = COALESCE($26, discoduro_capacidad),
          discoduro_marca = COALESCE($27, discoduro_marca),
          discoduro_modelo = COALESCE($28, discoduro_modelo),
          steps = COALESCE($29, steps),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $30
      `, [
        data.titulo ?? null,
        data.descripcion ?? null,
        data.estado ?? null,
        data.prioridad ?? null,
        data.fiscal ?? null,
        data.dispositivo_marca ?? null,
        data.dispositivo_modelo ?? null,
        data.dispositivo_imei ?? null,
        data.dispositivo_imei2 ?? null,
        data.dispositivo_sim_card ?? null,
        data.dispositivo_numero_tel ?? null,
        data.dispositivo_estado_fisico ?? null,
        data.dispositivo_modo_aislamiento ?? null,
        data.dispositivo_danos_visibles ?? null,
        data.dispositivo_bateria_estado ?? null,
        data.dispositivo_pantalla_estado ?? null,
        data.completed_steps !== undefined ? JSON.stringify(data.completed_steps) : null,
        data.step_metadata !== undefined ? JSON.stringify(data.step_metadata) : null,
        data.compliance_checklist !== undefined ? JSON.stringify(data.compliance_checklist) : null,
        data.tipo_proyecto ?? null,
        data.solicitante_nombre ?? null,
        data.solicitante_cedula ?? null,
        data.correo_investigar ?? null,
        data.correo_proveedor ?? null,
        data.discoduro_serial ?? null,
        data.discoduro_capacidad ?? null,
        data.discoduro_marca ?? null,
        data.discoduro_modelo ?? null,
        data.steps !== undefined ? JSON.stringify(data.steps) : null,
        id
      ]);

      res.status(200).json({ success: true, updated: (updated?.length ?? 0) > 0 });
      return;
    }

    if (method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'Falta el ID del caso' });
        return;
      }
      await sqlClient('DELETE FROM casos WHERE id = $1', [id]);
      res.status(200).json({ success: true });
      return;
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
