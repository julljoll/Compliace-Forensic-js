import { useState, useMemo } from 'react';
import { useCMSStore } from '../../store/cmsStore';
import {
  Database, Search, MessageSquare, Users, Mic, ShieldCheck,
  CheckCheck, FileText, Play
} from '../../components/atoms/AppleIcon';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isOutgoing: boolean;
  type?: 'text' | 'audio' | 'document';
  duration?: string; // Para audios
  transcription?: string; // Para audios
}

interface ChatSession {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  status: string;
  lastSeen: string;
}

const MOCK_CHATS: ChatSession[] = [
  {
    id: 'c1',
    name: 'Lic. Alejandro Torres',
    phone: '+598 99 123 456',
    avatar: 'https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/avatar.png',
    lastMessage: 'Sí, ya está firmado y sellado con hash SHA-256 en la cadena.',
    lastTime: '14:22',
    messages: [
      { id: 'm1_1', sender: 'Yo', message: 'Estimado Alejandro, ¿confirmaste el envío del reporte de compliance?', timestamp: '14:15', isOutgoing: true },
      { id: 'm1_2', sender: 'Lic. Alejandro Torres', message: 'Hola. Sí, ya está firmado y sellado con hash SHA-256 en la cadena.', timestamp: '14:22', isOutgoing: false },
      { id: 'm1_3', sender: 'Yo', message: 'Perfecto, procedo a anexarlo al expediente digital en el CMS.', timestamp: '14:25', isOutgoing: true }
    ]
  },
  {
    id: 'c2',
    name: 'Ing. Mariana Silva',
    phone: '+598 94 987 654',
    avatar: 'https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/avatar.png',
    lastMessage: 'Nota de voz de 12 segundos',
    lastTime: 'Ayer',
    messages: [
      { id: 'm2_1', sender: 'Ing. Mariana Silva', message: '¿Completaron la extracción física de la base de datos del móvil?', timestamp: 'Ayer 18:02', isOutgoing: false },
      { id: 'm2_2', sender: 'Yo', message: 'Sí, empleamos el APK Downgrade exitosamente.', timestamp: 'Ayer 18:05', isOutgoing: true },
      { id: 'm2_3', sender: 'Ing. Mariana Silva', message: 'Audio', timestamp: 'Ayer 18:07', isOutgoing: false, type: 'audio', duration: '0:12', transcription: 'Excelente trabajo pericial. Avísame cuando calcules el hash .avilla para contrastar.' }
    ]
  },
  {
    id: 'c3',
    name: 'Soporte Técnico',
    phone: '+1 800 555 0199',
    avatar: 'https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/avatar.png',
    lastMessage: 'Dispositivo Android listo para extracción por depuración USB.',
    lastTime: 'Lunes',
    messages: [
      { id: 'm3_1', sender: 'Soporte Técnico', message: 'Dispositivo Android listo para extracción por depuración USB.', timestamp: 'Lunes 10:14', isOutgoing: false }
    ]
  }
];

const MOCK_CONTACTS: Contact[] = [
  { id: 'con_1', name: 'Lic. Alejandro Torres', phone: '+598 99 123 456', status: 'Disponible', lastSeen: 'Hoy 14:22' },
  { id: 'con_2', name: 'Ing. Mariana Silva', phone: '+598 94 987 654', status: 'En el trabajo', lastSeen: 'Hoy 13:10' },
  { id: 'con_3', name: 'Soporte Técnico', phone: '+1 800 555 0199', status: 'En línea', lastSeen: 'Lunes 10:14' },
  { id: 'con_4', name: 'Dra. Gabriela Méndez (Fiscal)', phone: '+598 91 222 333', status: 'Solo llamadas de emergencia', lastSeen: 'Ayer 09:30' }
];

export default function WhatsAppParserPage() {
  const casos = useCMSStore(state => state.casos);

  // Configuración
  const [casoSeleccionado, setCasoSeleccionado] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'audios' | 'search'>('chats');
  
  // Chats
  const [selectedChatId, setSelectedChatId] = useState('c1');
  const [busquedaChats, setBusquedaChats] = useState('');
  
  // Búsqueda avanzada de palabras clave
  const [queryBusqueda, setQueryBusqueda] = useState('');
  
  // Audio playback simulado
  const [reproduciendoAudioId, setReproduciendoAudioId] = useState<string | null>(null);

  const selectedChat = useMemo(() => {
    return MOCK_CHATS.find(c => c.id === selectedChatId) || MOCK_CHATS[0];
  }, [selectedChatId]);

  // Búsqueda de chats
  const chatsFiltrados = useMemo(() => {
    return MOCK_CHATS.filter(c =>
      c.name.toLowerCase().includes(busquedaChats.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(busquedaChats.toLowerCase())
    );
  }, [busquedaChats]);

  // Lista de audios
  const todosLosAudios = useMemo(() => {
    const list: { chatName: string; msg: ChatMessage }[] = [];
    MOCK_CHATS.forEach(chat => {
      chat.messages.forEach(msg => {
        if (msg.type === 'audio') {
          list.push({ chatName: chat.name, msg });
        }
      });
    });
    return list;
  }, []);

  // Búsqueda de palabras clave en todos los mensajes
  const mensajesEncontrados = useMemo(() => {
    if (!queryBusqueda.trim()) return [];
    const list: { chatName: string; msg: ChatMessage }[] = [];
    MOCK_CHATS.forEach(chat => {
      chat.messages.forEach(msg => {
        if (msg.message && msg.message.toLowerCase().includes(queryBusqueda.toLowerCase())) {
          list.push({ chatName: chat.name, msg });
        } else if (msg.transcription && msg.transcription.toLowerCase().includes(queryBusqueda.toLowerCase())) {
          list.push({ chatName: chat.name, msg });
        }
      });
    });
    return list;
  }, [queryBusqueda]);

  const toggleAudio = (id: string) => {
    if (reproduciendoAudioId === id) {
      setReproduciendoAudioId(null);
    } else {
      setReproduciendoAudioId(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">WhatsApp Parser</h1>
          <p className="text-sm text-[#86868B] font-medium max-w-2xl mt-1">
            Visualizador forense de chats, audios transcritos y bases de datos decodificadas de mensajería instantánea.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="apple-badge-blue">
            <Database size={12} className="mr-1" /> SQLite Decoder
          </span>
          <span className="apple-badge-green">
            <ShieldCheck size={12} className="mr-1" /> Cadena Custodia OK
          </span>
        </div>
      </div>

      {/* Selector de caso y carga */}
      <div className="apple-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
            Caso Judicial Asociado
          </label>
          <select
            value={casoSeleccionado}
            onChange={(e) => setCasoSeleccionado(e.target.value)}
            className="apple-input w-full"
          >
            <option value="">-- Seleccionar Caso --</option>
            {casos.map((caso) => (
              <option key={caso.id} value={caso.id}>
                {caso.numeroCaso} — {caso.titulo}
              </option>
            ))}
          </select>
        </div>
        
        {/* Pestañas Apple Style */}
        <div className="flex bg-[#E5E5EA] p-0.5 rounded-[10px] self-start md:self-end">
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-[8px] transition-all flex items-center gap-1.5 ${
              activeTab === 'chats' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            <MessageSquare size={13} /> Conversaciones
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-[8px] transition-all flex items-center gap-1.5 ${
              activeTab === 'contacts' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            <Users size={13} /> Contactos
          </button>
          <button
            onClick={() => setActiveTab('audios')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-[8px] transition-all flex items-center gap-1.5 ${
              activeTab === 'audios' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            <Mic size={13} /> Audios (.opus)
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-[8px] transition-all flex items-center gap-1.5 ${
              activeTab === 'search' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            <Search size={13} /> Búsqueda
          </button>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="apple-card min-h-[500px] overflow-hidden grid grid-cols-1 md:grid-cols-3">
        
        {/* Panel izquierdo / Lista de chats (Solo visible en pestaña Chats) */}
        {activeTab === 'chats' && (
          <div className="md:col-span-1 border-r border-[#E5E5EA] flex flex-col bg-[#F5F5F7]">
            <div className="p-4 border-b border-[#E5E5EA]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-[#86868B]" size={14} />
                <input
                  type="text"
                  placeholder="Buscar chat o mensaje..."
                  value={busquedaChats}
                  onChange={(e) => setBusquedaChats(e.target.value)}
                  className="apple-input w-full pl-9"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#E5E5EA]/50">
              {chatsFiltrados.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full p-4 flex gap-3 text-left transition-colors ${
                    selectedChatId === chat.id ? 'bg-white border-l-4 border-[#0071E3]' : 'hover:bg-white/50'
                  }`}
                >
                  <img
                    src={chat.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full bg-neutral-200 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="text-xs font-bold text-[#1D1D1F] truncate">{chat.name}</h3>
                      <span className="text-[10px] text-[#86868B] font-medium">{chat.lastTime}</span>
                    </div>
                    <p className="text-[11px] text-[#86868B] truncate">{chat.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Panel derecho / Visualizador de Contenidos */}
        <div className={`flex flex-col ${activeTab === 'chats' ? 'md:col-span-2' : 'md:col-span-3'} bg-white min-h-[500px]`}>
          
          {/* VISTA 1: CHAT DETAIL */}
          {activeTab === 'chats' && (
            <>
              {/* Header Chat */}
              <div className="p-4 border-b border-[#E5E5EA] flex items-center justify-between shrink-0 bg-[#F5F5F7]">
                <div>
                  <h3 className="text-sm font-bold text-[#1D1D1F]">{selectedChat.name}</h3>
                  <p className="text-[10px] text-[#86868B] font-mono">{selectedChat.phone}</p>
                </div>
                <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider bg-white border border-[#D2D2D7] px-3 py-1 rounded-[6px]">
                  Bases de datos vinculadas: msgstore.db + wa.db
                </div>
              </div>

              {/* Burbujas de mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F2F2F7]">
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[70%] ${msg.isOutgoing ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <span className="text-[10px] text-[#86868B] mb-1 font-semibold">{msg.sender}</span>
                    <div
                      className={`p-3 rounded-[12px] relative shadow-sm ${
                        msg.isOutgoing
                          ? 'bg-[#0071E3] text-white rounded-tr-none'
                          : 'bg-white text-[#1D1D1F] rounded-tl-none border border-[#E5E5EA]'
                      }`}
                    >
                      {msg.type === 'audio' ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleAudio(msg.id)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                reproduciendoAudioId === msg.id ? 'bg-[#FF3B30] text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'
                              }`}
                            >
                              <Play size={12} className={reproduciendoAudioId === msg.id ? 'animate-ping' : ''} />
                            </button>
                            <div>
                              <p className="text-xs font-bold text-neutral-800">Nota de voz ({msg.duration})</p>
                              <p className="text-[10px] text-neutral-500 font-mono">Formato Opus decodificado</p>
                            </div>
                          </div>
                          <div className="bg-[#F5F5F7] text-neutral-800 text-[11px] p-2.5 rounded-[8px] italic border-l-2 border-[#0071E3]">
                            📝 {msg.transcription}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs leading-relaxed break-words">{msg.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[9px] text-[#86868B] font-semibold">
                      <span>{msg.timestamp}</span>
                      {msg.isOutgoing && <CheckCheck size={11} className="text-[#34C759]" />}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* VISTA 2: CONTACTS LIST */}
          {activeTab === 'contacts' && (
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#1D1D1F] flex items-center gap-2">
                <Users size={20} className="text-[#0071E3]" />
                Directorio de Contactos Extraídos (`wa.db`)
              </h3>
              <div className="overflow-x-auto border border-[#E5E5EA] rounded-[8px]">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#F5F5F7] text-xs font-bold text-[#86868B] uppercase tracking-wider border-b border-[#E5E5EA]">
                      <th className="p-3">Nombre / Alias</th>
                      <th className="p-3">Número de Teléfono</th>
                      <th className="p-3">Estado de WhatsApp</th>
                      <th className="p-3">Última Conexión</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-[#E5E5EA]">
                    {MOCK_CONTACTS.map(c => (
                      <tr key={c.id} className="hover:bg-[#F5F5F7]/30">
                        <td className="p-3 font-semibold text-[#1D1D1F]">{c.name}</td>
                        <td className="p-3 font-mono">{c.phone}</td>
                        <td className="p-3 text-[#86868B]">{c.status}</td>
                        <td className="p-3 font-medium">{c.lastSeen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA 3: AUDIOS LIST */}
          {activeTab === 'audios' && (
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#1D1D1F] flex items-center gap-2">
                <Mic size={20} className="text-[#FF3B30]" />
                Notas de Voz y Transcripciones Inteligentes (.opus)
              </h3>

              <div className="space-y-4">
                {todosLosAudios.map(({ chatName, msg }) => (
                  <div key={msg.id} className="p-4 border border-[#E5E5EA] rounded-[10px] flex gap-4 items-start bg-[#F5F5F7]/40">
                    <button
                      onClick={() => toggleAudio(msg.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        reproduciendoAudioId === msg.id ? 'bg-[#FF3B30] text-white' : 'bg-white border border-[#D2D2D7] text-[#1D1D1F]'
                      }`}
                    >
                      <Play size={14} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#1D1D1F]">{chatName}</h4>
                        <span className="text-[10px] text-[#86868B] font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#86868B] mt-0.5">Duración: {msg.duration} | Canal: Mono | Muestreo: 16000Hz</p>
                      
                      <div className="mt-3 bg-white p-3 rounded-[8px] border border-[#E5E5EA] text-xs italic text-[#1D1D1F]">
                        <span className="font-bold text-[#FF3B30] not-italic mr-1.5">Transcripción AI:</span>
                        "{msg.transcription}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA 4: ADVANCED KEYWORD SEARCH */}
          {activeTab === 'search' && (
            <div className="p-6 space-y-6 flex-1 flex flex-col">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#1D1D1F] flex items-center gap-2">
                  <Search size={20} className="text-[#0071E3]" />
                  Búsqueda Forense de Palabras Clave
                </h3>
                <p className="text-xs text-[#86868B]">
                  Filtre por términos clave, nombres propios o códigos en todos los mensajes y metadatos del volcado.
                </p>
              </div>

              <div className="flex gap-3 max-w-xl">
                <input
                  type="text"
                  placeholder="Ej: compliance, hash, pericial..."
                  value={queryBusqueda}
                  onChange={(e) => setQueryBusqueda(e.target.value)}
                  className="apple-input flex-1"
                />
              </div>

              {queryBusqueda.trim() ? (
                <div className="flex-1 space-y-4">
                  <p className="text-xs font-semibold text-[#86868B]">
                    Mensajes encontrados ({mensajesEncontrados.length}):
                  </p>
                  
                  <div className="space-y-3">
                    {mensajesEncontrados.map(({ chatName, msg }) => (
                      <div key={msg.id} className="p-4 border border-[#E5E5EA] rounded-[10px] hover:bg-[#F5F5F7]/30 transition-all">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-xs font-bold text-[#0071E3]">{chatName}</span>
                          <span className="text-[9px] text-[#86868B] font-mono">{msg.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#1D1D1F] bg-[#0071E3]/5 p-2 rounded border border-[#0071E3]/10">
                          {msg.message || `[Nota de voz] Transcripción: "${msg.transcription}"`}
                        </p>
                      </div>
                    ))}
                    {mensajesEncontrados.length === 0 && (
                      <p className="text-xs text-[#86868B] italic">No se encontraron coincidencias para "{queryBusqueda}".</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[#86868B] text-center p-8">
                  <FileText size={48} className="text-[#86868B]/40 mb-3" />
                  <p className="text-xs font-medium">Introduzca un término de búsqueda para comenzar la indexación en SQLite.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
