import { BookOpen, Smartphone, Mic, Image as ImageIcon, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ManualAvillaPage() {
  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      {/* ── Encabezado ─────────────────────────────────── */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
          <div className="p-2 rounded-[4px] bg-fluent-accent/10 border border-fluent-accent/20">
             <BookOpen className="text-fluent-accent" size={28} strokeWidth={2.5} />
          </div>
          Avilla Forensics Operations
        </h1>
        <p className="text-sm text-fluent-text-muted font-medium max-w-3xl mt-3 leading-relaxed opacity-80">
          Operational protocol for evidence acquisition in Android devices, specialized in WhatsApp artifacts, 
          image recovery, and forensic integrity validation via native AES-256 encrypted logs.
        </p>
      </div>

      {/* ── Resumen de la Herramienta ──────────────────── */}
      <div className="fluent-mica p-8 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-[2px] h-full bg-fluent-accent" />
        <h2 className="text-xl font-bold text-white mb-4 tracking-tight">Technical Overview: Avilla Engine</h2>
        <p className="text-sm text-fluent-text-muted leading-relaxed mb-6 font-medium opacity-80">
          Avilla Forensics is a specialized logical extraction engine designed for Windows environments. 
          It utilizes an advanced <strong>APK Downgrade</strong> methodology to bypass encryption for third-party applications, 
          eliminating the requirement for <em>Root</em> privileges while maintaining forensic sterility.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-black px-3 py-1 bg-white/[0.05] rounded-[2px] border border-white/5 text-fluent-text-muted uppercase tracking-widest">Open Source Core</span>
          <span className="text-[10px] font-black px-3 py-1 bg-white/[0.05] rounded-[2px] border border-white/5 text-fluent-text-muted uppercase tracking-widest">Android 14+ Baseline</span>
          <a href="https://github.com/AvillaDaniel/AvillaForensics" target="_blank" rel="noreferrer" 
             className="text-[10px] font-black text-fluent-accent hover:text-fluent-accent-light flex items-center gap-2 ml-2 transition-colors uppercase tracking-widest">
            Official Repository <CheckCircle2 size={10} />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* ── Extracción General Android ─────────────────── */}
        <div className="fluent-mica p-6 rounded-xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-[4px] text-blue-400 shadow-lg">
              <Smartphone size={22} strokeWidth={2.5} />
            </div>
            <h2 className="font-bold text-white text-lg tracking-tight">Standard Android Acquisition</h2>
          </div>
          
          <div className="space-y-6">
            <div className="relative pl-8">
              <div className="absolute left-2 top-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
              <div className="absolute left-[11px] top-6 w-px h-full bg-white/10"></div>
              <h3 className="text-xs font-black text-white mb-1.5 uppercase tracking-wider">1. Terminal Preparation</h3>
              <p className="text-[11px] text-fluent-text-muted leading-relaxed font-medium opacity-70">
                Activate "Developer Options" and enable <strong>USB Debugging</strong>. 
                Establish physical connection and authorize RSA cryptographic handshake on the device screen.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-2 top-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
              <div className="absolute left-[11px] top-6 w-px h-full bg-white/10"></div>
              <h3 className="text-xs font-black text-white mb-1.5 uppercase tracking-wider">2. Extraction Engine Setup</h3>
              <p className="text-[11px] text-fluent-text-muted leading-relaxed font-medium opacity-70">
                Launch Avilla Engine and select <strong>Avilla App Full Extraction</strong>. 
                Specify a forensic workstation target path (avoid User Desktop to prevent permission conflicts).
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-2 top-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
              <h3 className="text-xs font-black text-white mb-1.5 uppercase tracking-wider">3. Execution Flow</h3>
              <p className="text-[11px] text-fluent-text-muted leading-relaxed font-medium opacity-70">
                Initialize acquisition. The system will automate data transfer while generating 
                real-time integrity logs with <code>.avilla</code> extension.
              </p>
            </div>
          </div>
        </div>

        {/* ── Extracción WhatsApp (Audios) ───────────────── */}
        <div className="fluent-mica p-6 rounded-xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-500/10 rounded-[4px] text-green-400 shadow-lg">
              <Mic size={22} strokeWidth={2.5} />
            </div>
            <h2 className="font-bold text-white text-lg tracking-tight">Messaging Artifacts (Audio)</h2>
          </div>
          
          <div className="space-y-6">
            <div className="relative pl-8">
              <div className="absolute left-2 top-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <div className="absolute left-[11px] top-6 w-px h-full bg-white/10"></div>
              <h3 className="text-xs font-black text-white mb-1.5 uppercase tracking-wider">1. Cryptographic Downgrade</h3>
              <p className="text-[11px] text-fluent-text-muted leading-relaxed font-medium opacity-70">
                To bypass WhatsApp database encryption (Crypt15), initiate <strong>APK Downgrade</strong>. 
                The system will swap the binary for a legacy version enabling ADB backup functionality.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-2 top-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <div className="absolute left-[11px] top-6 w-px h-full bg-white/10"></div>
              <h3 className="text-xs font-black text-white mb-1.5 uppercase tracking-wider">2. Artifact Localization</h3>
              <p className="text-[11px] text-fluent-text-muted leading-relaxed font-medium opacity-70">
                Voice artifacts are identified at <code>\com.whatsapp\Media\WhatsApp Voice Notes</code>. 
                Avilla Forensics automatically extracts and indexes these <code>.opus</code> files.
              </p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-2 top-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <h3 className="text-xs font-black text-white mb-1.5 uppercase tracking-wider">3. NLP Transcription</h3>
              <p className="text-[11px] text-fluent-text-muted leading-relaxed font-medium opacity-70">
                Deploy <strong>FormOpus.cs</strong> for automated batch transcription. 
                Generates a structured report mapping text content to chat sessions and original hashes.
              </p>
            </div>
          </div>
        </div>

        {/* ── Extracción de Fotos ────────────────────────── */}
        <div className="fluent-mica p-6 rounded-xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-[4px] text-purple-400 shadow-lg">
              <ImageIcon size={22} strokeWidth={2.5} />
            </div>
            <h2 className="font-bold text-white text-lg tracking-tight">Multimedia Evidence</h2>
          </div>
          
          <div className="space-y-6">
            <div className="relative pl-8">
              <div className="absolute left-2 top-2 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
              <div className="absolute left-[11px] top-6 w-px h-full bg-white/10"></div>
              <h3 className="text-xs font-black text-white mb-1.5 uppercase tracking-wider">1. High-Speed Surface Scan</h3>
              <p className="text-[11px] text-fluent-text-muted leading-relaxed font-medium opacity-70">
                Deploy <strong>Fast Scan</strong> or <strong>FormCopyAll.cs</strong> for accelerated identification 
                of graphical extensions (.jpg, .png, .webp, .heic) across the internal storage.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-2 top-2 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
              <h3 className="text-xs font-black text-white mb-1.5 uppercase tracking-wider">2. EXIF & Geodata Extraction</h3>
              <p className="text-[11px] text-fluent-text-muted leading-relaxed font-medium opacity-70">
                The <strong>Image Finder</strong> module parses EXIF metadata for geolocation tags, 
                enabling automated mapping of interest points via Google Earth (.kml) output.
              </p>
            </div>
          </div>
        </div>

        {/* ── Validación y Autenticidad (MUY IMPORTANTE) ── */}
        <div className="fluent-mica p-8 rounded-xl border border-fluent-accent/20 bg-fluent-accent/[0.02] shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-fluent-accent/10 rounded-[4px] text-fluent-accent shadow-lg shadow-fluent-accent/10">
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
            <h2 className="font-bold text-white text-lg tracking-tight">Integrity & Chain of Custody</h2>
          </div>
          
          <p className="text-[11px] text-fluent-text-muted leading-relaxed mb-6 font-medium opacity-80 uppercase tracking-widest">
            Advanced cryptographic validation framework ensuring data non-repudiation.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-black/40 border border-white/5 group hover:border-fluent-accent/20 transition-all">
              <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-tight">SHA-256 Collision-Free Hashing</h4>
                <p className="text-[11px] text-fluent-text-muted mt-1 opacity-70">Calculates unique signatures for every artifact (Audio, Image, DB) at the point of acquisition.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-black/40 border border-white/5 group hover:border-fluent-accent/20 transition-all">
              <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-tight">AES-256 Encrypted Registry</h4>
                <p className="text-[11px] text-fluent-text-muted mt-1 opacity-70">The acquisition log (<code>.avilla</code>) is physically encrypted to prevent tampering by unauthorized users.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-black/40 border border-white/5 group hover:border-fluent-accent/20 transition-all">
              <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-tight">HMAC HMAC Signature Layer</h4>
                <p className="text-[11px] text-fluent-text-muted mt-1 opacity-70">Secondary authentication layer to verify file integrity post-extraction, ensuring a technical Chain of Custody.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Precauciones ───────────────────────────────── */}
      <div className="fluent-mica p-8 rounded-xl border border-yellow-500/10 bg-yellow-500/[0.01] mt-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500/20" />
        <h3 className="font-black text-yellow-500 text-sm flex items-center gap-3 mb-4 uppercase tracking-[0.2em]">
          <AlertTriangle size={18} strokeWidth={2.5} />
          Technical Precautions
        </h3>
        <ul className="space-y-3">
          {[
            { t: 'Storage Hierarchy', d: 'Always output to root directories like C:\\ForensicAcq\\ to avoid Windows OS permission isolation.' },
            { t: 'RF Isolation', d: 'Maintain "Airplane Mode" throughout the extraction to prevent remote wipe commands via GSM/WiFi.' },
            { t: 'Crypt15 Decryption', d: 'Utilize the integrated Python scripts for forcing decryption using the binary key extracted during downgrade.' }
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-xs">
              <div className="w-1 h-1 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
              <p className="text-fluent-text-muted font-medium opacity-80 leading-relaxed">
                <span className="text-white font-bold">{item.t}:</span> {item.d}
              </p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
