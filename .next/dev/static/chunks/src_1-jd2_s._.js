(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/db/platformAPI.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "platformAPI",
    ()=>platformAPI
]);
const platformAPI = {
    get platform () {
        return window.electronAPI?.platform || 'browser';
    },
    get operationMode () {
        return window.electronAPI?.operationMode || 'production';
    },
    dialog: {
        selectFile: async (filters)=>{
            if (window.electronAPI?.dialog?.selectFile) {
                return window.electronAPI.dialog.selectFile(filters);
            }
            return {
                canceled: true,
                filePaths: []
            };
        }
    },
    file: {
        writeJson: async (filePath, data)=>{
            if (window.electronAPI?.file?.writeJson) {
                return window.electronAPI.file.writeJson(filePath, data);
            }
            return {
                success: false,
                error: 'No electronAPI'
            };
        },
        readJson: async (filePath)=>{
            if (window.electronAPI?.file?.readJson) {
                return window.electronAPI.file.readJson(filePath);
            }
            return {
                success: false,
                error: 'No electronAPI'
            };
        }
    },
    hash: {
        calculate: async (filePath, algorithm = 'sha256')=>{
            if (window.electronAPI?.hash?.calculate) {
                return window.electronAPI.hash.calculate(filePath, algorithm);
            }
            return {
                success: false,
                hash: '',
                algorithm,
                verified: false,
                error: 'No electronAPI'
            };
        }
    },
    db: {
        getCasos: async (userId = 1)=>{
            if (window.electronAPI?.db?.getCasos) {
                return window.electronAPI.db.getCasos(userId);
            }
            return [];
        },
        addCaso: async (caso)=>{
            if (window.electronAPI?.db?.addCaso) {
                return window.electronAPI.db.addCaso(caso);
            }
            return {
                success: false,
                error: 'No electronAPI'
            };
        },
        updateCaso: async (id, data)=>{
            if (window.electronAPI?.db?.updateCaso) {
                return window.electronAPI.db.updateCaso(id, data);
            }
            return false;
        },
        deleteCaso: async (id)=>{
            if (window.electronAPI?.db?.deleteCaso) {
                return window.electronAPI.db.deleteCaso(id);
            }
            return false;
        },
        saveState: async (userId, state)=>{
            if (window.electronAPI?.db?.saveState) {
                return window.electronAPI.db.saveState(userId, state);
            }
            return {
                success: false
            };
        },
        loadState: async (userId)=>{
            if (window.electronAPI?.db?.loadState) {
                return window.electronAPI.db.loadState(userId);
            }
            return null;
        },
        getUsers: async ()=>{
            if (window.electronAPI?.db?.getUsers) {
                return window.electronAPI.db.getUsers();
            }
            return [];
        },
        addUser: async (userIdMaker, user)=>{
            if (window.electronAPI?.db?.addUser) {
                return window.electronAPI.db.addUser(userIdMaker, user);
            }
            return {
                success: false,
                error: 'No electronAPI'
            };
        },
        updateUser: async (userIdMaker, userId, data)=>{
            if (window.electronAPI?.db?.updateUser) {
                return window.electronAPI.db.updateUser(userIdMaker, userId, data);
            }
            return {
                success: false,
                error: 'No electronAPI'
            };
        },
        getAuditLogs: async ()=>{
            if (window.electronAPI?.db?.getAuditLogs) {
                return window.electronAPI.db.getAuditLogs();
            }
            return [];
        },
        addAuditLog: async (log)=>{
            if (window.electronAPI?.db?.addAuditLog) {
                return window.electronAPI.db.addAuditLog(log);
            }
            return false;
        }
    },
    auth: {
        login: async (credentials)=>{
            if (window.electronAPI?.auth?.login) {
                return window.electronAPI.auth.login(credentials);
            }
            return {
                success: false,
                message: 'No electronAPI'
            };
        },
        validate: async (token)=>{
            if (window.electronAPI?.auth?.validate) {
                return window.electronAPI.auth.validate(token);
            }
            return {
                success: false
            };
        },
        logout: async (token)=>{
            if (window.electronAPI?.auth?.logout) {
                return window.electronAPI.auth.logout(token);
            }
            return {
                success: true
            };
        },
        changePassword: async (userId, newPassword)=>{
            if (window.electronAPI?.auth?.changePassword) {
                return window.electronAPI.auth.changePassword(userId, newPassword);
            }
            return {
                success: false,
                error: 'No electronAPI'
            };
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/authStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/platformAPI.ts [app-client] (ecmascript)");
;
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isFirstLogin: false,
        login: async (username, password)=>{
            set({
                isLoading: true,
                error: null
            });
            // Esperar hasta 2s a que el shim de main.tsx esté listo
            let attempts = 0;
            while(!window.electronAPI?.auth && attempts < 20){
                await new Promise((r)=>setTimeout(r, 100));
                attempts++;
            }
            if (!window.electronAPI?.auth) {
                set({
                    error: 'Sistema de autenticación no disponible. Recarga la página.',
                    isLoading: false
                });
                return false;
            }
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformAPI"].auth.login({
                    username,
                    password
                });
                if (result.success) {
                    // BUG-021: Si el usuario es admin y clave es admin, marcar primer login
                    const isFirstLogin = username === 'admin' && password === 'admin';
                    set({
                        user: result.user,
                        isAuthenticated: true,
                        isFirstLogin,
                        isLoading: false
                    });
                    return true;
                }
                set({
                    error: result.message || 'Credenciales incorrectas',
                    isLoading: false
                });
                return false;
            } catch (error) {
                set({
                    error: 'Error de conexión con el sistema de autenticación',
                    isLoading: false
                });
                return false;
            }
        },
        logout: async ()=>{
            const { user } = get();
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformAPI"].auth && user?.token) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformAPI"].auth.logout(user.token);
                } catch (e) {
                    console.error('Error logging out from server:', e);
                }
            }
            set({
                user: null,
                isAuthenticated: false,
                error: null,
                isFirstLogin: false
            });
        },
        validateSession: async ()=>{
            const { user } = get();
            if (!user?.token) {
                set({
                    isAuthenticated: false
                });
                return false;
            }
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformAPI"].auth) {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformAPI"].auth.validate(user.token);
                if (!result.success) {
                    set({
                        user: null,
                        isAuthenticated: false
                    });
                    return false;
                }
                return true;
            }
            try {
                const stored = localStorage.getItem('sha256_active_session');
                if (!stored) {
                    set({
                        user: null,
                        isAuthenticated: false
                    });
                    return false;
                }
                const session = JSON.parse(stored);
                if (session.token !== user.token) {
                    set({
                        user: null,
                        isAuthenticated: false
                    });
                    return false;
                }
                return true;
            } catch  {
                set({
                    user: null,
                    isAuthenticated: false
                });
                return false;
            }
        },
        clearError: ()=>set({
                error: null
            }),
        changePassword: async (newPassword)=>{
            const { user } = get();
            if (!user) return {
                success: false,
                error: 'No hay usuario autenticado'
            };
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformAPI"].auth?.changePassword) {
                try {
                    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformAPI"].auth.changePassword(user.id, newPassword);
                    if (result.success) {
                        set({
                            isFirstLogin: false
                        });
                    }
                    return result;
                } catch (e) {
                    console.error('[AuthStore] Error cambiando clave:', e);
                    return {
                        success: false,
                        error: e.message || 'Error de comunicación'
                    };
                }
            } else {
                set({
                    isFirstLogin: false
                });
                return {
                    success: true
                };
            }
        },
        updateProfileImage: (imgBase64)=>{
            const { user } = get();
            if (user) {
                set({
                    user: {
                        ...user,
                        profileImage: imgBase64
                    }
                });
            }
        }
    }), {
    name: 'sha256-auth',
    version: 1
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/atoms/AppleIcon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Activity",
    ()=>Activity,
    "AlertCircle",
    ()=>AlertCircle,
    "AlertOctagon",
    ()=>AlertOctagon,
    "AlertTriangle",
    ()=>AlertTriangle,
    "Archive",
    ()=>Archive,
    "ArrowLeft",
    ()=>ArrowLeft,
    "Award",
    ()=>Award,
    "BarChart3",
    ()=>BarChart3,
    "Book",
    ()=>Book,
    "BookOpen",
    ()=>BookOpen,
    "Briefcase",
    ()=>Briefcase,
    "Calendar",
    ()=>Calendar,
    "Camera",
    ()=>Camera,
    "Check",
    ()=>Check,
    "CheckCheck",
    ()=>CheckCheck,
    "CheckCircle2",
    ()=>CheckCircle2,
    "CheckSquare",
    ()=>CheckSquare,
    "ChevronDown",
    ()=>ChevronDown,
    "ChevronRight",
    ()=>ChevronRight,
    "ChevronUp",
    ()=>ChevronUp,
    "Circle",
    ()=>Circle,
    "ClipboardList",
    ()=>ClipboardList,
    "Clock",
    ()=>Clock,
    "Copy",
    ()=>Copy,
    "Database",
    ()=>Database,
    "Edit",
    ()=>Edit,
    "ExternalLink",
    ()=>ExternalLink,
    "Eye",
    ()=>Eye,
    "EyeOff",
    ()=>EyeOff,
    "FileCheck",
    ()=>FileCheck,
    "FileSearch",
    ()=>FileSearch,
    "FileText",
    ()=>FileText,
    "Filter",
    ()=>Filter,
    "Fingerprint",
    ()=>Fingerprint,
    "FolderOpen",
    ()=>FolderOpen,
    "Gavel",
    ()=>Gavel,
    "Globe",
    ()=>Globe,
    "Grid",
    ()=>Grid,
    "HardDrive",
    ()=>HardDrive,
    "Hash",
    ()=>Hash,
    "History",
    ()=>History,
    "Home",
    ()=>Home,
    "ImageIcon",
    ()=>ImageIcon,
    "Info",
    ()=>Info,
    "Key",
    ()=>Key,
    "LayoutDashboard",
    ()=>LayoutDashboard,
    "List",
    ()=>List,
    "ListChecks",
    ()=>ListChecks,
    "ListTodo",
    ()=>ListTodo,
    "Lock",
    ()=>Lock,
    "LogOut",
    ()=>LogOut,
    "Mail",
    ()=>Mail,
    "Menu",
    ()=>Menu,
    "MessageSquare",
    ()=>MessageSquare,
    "Mic",
    ()=>Mic,
    "Moon",
    ()=>Moon,
    "Package",
    ()=>Package,
    "Pause",
    ()=>Pause,
    "Phone",
    ()=>Phone,
    "Play",
    ()=>Play,
    "Plus",
    ()=>Plus,
    "PlusCircle",
    ()=>PlusCircle,
    "Printer",
    ()=>Printer,
    "RefreshCw",
    ()=>RefreshCw,
    "RotateCcw",
    ()=>RotateCcw,
    "Save",
    ()=>Save,
    "Scale",
    ()=>Scale,
    "Search",
    ()=>Search,
    "Settings",
    ()=>Settings,
    "Shield",
    ()=>Shield,
    "ShieldAlert",
    ()=>ShieldAlert,
    "ShieldCheck",
    ()=>ShieldCheck,
    "ShieldOff",
    ()=>ShieldOff,
    "Smartphone",
    ()=>Smartphone,
    "Square",
    ()=>Square,
    "Star",
    ()=>Star,
    "Sun",
    ()=>Sun,
    "Terminal",
    ()=>Terminal,
    "Trash2",
    ()=>Trash2,
    "TrendingUp",
    ()=>TrendingUp,
    "Trophy",
    ()=>Trophy,
    "Upload",
    ()=>Upload,
    "User",
    ()=>User,
    "UserPlus",
    ()=>UserPlus,
    "Users",
    ()=>Users,
    "X",
    ()=>X,
    "XCircle",
    ()=>XCircle,
    "Zap",
    ()=>Zap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// Helper para renderizar los iconos utilizando Google Material Design (Font)
function MaterialIcon({ name, size = 20, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `material-icons-outlined select-none shrink-0 align-middle ${className}`,
        style: {
            fontSize: `${size}px`,
            width: `${size}px`,
            height: `${size}px`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        children: name
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c = MaterialIcon;
function ArrowLeft(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "arrow_back",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 41,
        columnNumber: 10
    }, this);
}
_c1 = ArrowLeft;
function ChevronDown(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "expand_more",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 44,
        columnNumber: 10
    }, this);
}
_c2 = ChevronDown;
function ChevronUp(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "expand_less",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 47,
        columnNumber: 10
    }, this);
}
_c3 = ChevronUp;
function ChevronRight(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "chevron_right",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 50,
        columnNumber: 10
    }, this);
}
_c4 = ChevronRight;
function Home(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "home",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 53,
        columnNumber: 10
    }, this);
}
_c5 = Home;
function LogOut(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "logout",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 56,
        columnNumber: 10
    }, this);
}
_c6 = LogOut;
function ExternalLink(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "open_in_new",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 59,
        columnNumber: 10
    }, this);
}
_c7 = ExternalLink;
function Plus(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "add",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 64,
        columnNumber: 10
    }, this);
}
_c8 = Plus;
function PlusCircle(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "add_circle_outline",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 67,
        columnNumber: 10
    }, this);
}
_c9 = PlusCircle;
function X(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "close",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 70,
        columnNumber: 10
    }, this);
}
_c10 = X;
function XCircle(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "highlight_off",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 73,
        columnNumber: 10
    }, this);
}
_c11 = XCircle;
function Circle(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "radio_button_unchecked",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 76,
        columnNumber: 10
    }, this);
}
_c12 = Circle;
function Check(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "check",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 79,
        columnNumber: 10
    }, this);
}
_c13 = Check;
function CheckCheck(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "done_all",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 82,
        columnNumber: 10
    }, this);
}
_c14 = CheckCheck;
function CheckCircle2(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "check_circle",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 85,
        columnNumber: 10
    }, this);
}
_c15 = CheckCircle2;
function CheckSquare(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "check_box",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 88,
        columnNumber: 10
    }, this);
}
_c16 = CheckSquare;
function Square(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "check_box_outline_blank",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 91,
        columnNumber: 10
    }, this);
}
_c17 = Square;
function Trash2(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "delete",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 94,
        columnNumber: 10
    }, this);
}
_c18 = Trash2;
function Edit(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "edit",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 97,
        columnNumber: 10
    }, this);
}
_c19 = Edit;
function Copy(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "content_copy",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 100,
        columnNumber: 10
    }, this);
}
_c20 = Copy;
function Search(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "search",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 103,
        columnNumber: 10
    }, this);
}
_c21 = Search;
function Filter(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "filter_alt",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 106,
        columnNumber: 10
    }, this);
}
_c22 = Filter;
function Printer(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "print",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 109,
        columnNumber: 10
    }, this);
}
_c23 = Printer;
function Play(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "play_arrow",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 112,
        columnNumber: 10
    }, this);
}
_c24 = Play;
function Pause(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "pause",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 115,
        columnNumber: 10
    }, this);
}
_c25 = Pause;
function RefreshCw(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "refresh",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 118,
        columnNumber: 10
    }, this);
}
_c26 = RefreshCw;
function RotateCcw(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "replay",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 121,
        columnNumber: 10
    }, this);
}
_c27 = RotateCcw;
function Zap(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "bolt",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 124,
        columnNumber: 10
    }, this);
}
_c28 = Zap;
function AlertCircle(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "error_outline",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 129,
        columnNumber: 10
    }, this);
}
_c29 = AlertCircle;
function AlertTriangle(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "warning_amber",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 132,
        columnNumber: 10
    }, this);
}
_c30 = AlertTriangle;
function AlertOctagon(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "report_gmailerrorred",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 135,
        columnNumber: 10
    }, this);
}
_c31 = AlertOctagon;
function Info(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "info",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 138,
        columnNumber: 10
    }, this);
}
_c32 = Info;
function FileText(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "description",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 143,
        columnNumber: 10
    }, this);
}
_c33 = FileText;
function FileSearch(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "find_in_page",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 146,
        columnNumber: 10
    }, this);
}
_c34 = FileSearch;
function FileCheck(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "fact_check",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 149,
        columnNumber: 10
    }, this);
}
_c35 = FileCheck;
function ClipboardList(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "assignment",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 152,
        columnNumber: 10
    }, this);
}
_c36 = ClipboardList;
function FolderOpen(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "folder_open",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 155,
        columnNumber: 10
    }, this);
}
_c37 = FolderOpen;
function BookOpen(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "book_open",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 158,
        columnNumber: 10
    }, this);
}
_c38 = BookOpen;
function Book(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "book",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 161,
        columnNumber: 10
    }, this);
}
_c39 = Book;
function User(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "person",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 166,
        columnNumber: 10
    }, this);
}
_c40 = User;
function Users(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "group",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 169,
        columnNumber: 10
    }, this);
}
_c41 = Users;
function UserPlus(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "person_add",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 172,
        columnNumber: 10
    }, this);
}
_c42 = UserPlus;
function Shield(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "shield",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 177,
        columnNumber: 10
    }, this);
}
_c43 = Shield;
function ShieldCheck(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "verified_user",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 180,
        columnNumber: 10
    }, this);
}
_c44 = ShieldCheck;
function ShieldAlert(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "security",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 183,
        columnNumber: 10
    }, this);
}
_c45 = ShieldAlert;
function ShieldOff(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "shield",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 186,
        columnNumber: 10
    }, this);
}
_c46 = ShieldOff;
function Lock(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "lock",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 189,
        columnNumber: 10
    }, this);
}
_c47 = Lock;
function Fingerprint(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "fingerprint",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 192,
        columnNumber: 10
    }, this);
}
_c48 = Fingerprint;
function Eye(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "visibility",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 195,
        columnNumber: 10
    }, this);
}
_c49 = Eye;
function EyeOff(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "visibility_off",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 198,
        columnNumber: 10
    }, this);
}
_c50 = EyeOff;
function Mail(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "mail",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 203,
        columnNumber: 10
    }, this);
}
_c51 = Mail;
function Phone(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "phone",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 206,
        columnNumber: 10
    }, this);
}
_c52 = Phone;
function Smartphone(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "smartphone",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 211,
        columnNumber: 10
    }, this);
}
_c53 = Smartphone;
function Camera(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "photo_camera",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 214,
        columnNumber: 10
    }, this);
}
_c54 = Camera;
function HardDrive(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "album",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 217,
        columnNumber: 10
    }, this);
}
_c55 = HardDrive;
function Database(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "storage",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 220,
        columnNumber: 10
    }, this);
}
_c56 = Database;
function Terminal(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "terminal",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 223,
        columnNumber: 10
    }, this);
}
_c57 = Terminal;
function Mic(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "mic",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 226,
        columnNumber: 10
    }, this);
}
_c58 = Mic;
function Clock(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "schedule",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 231,
        columnNumber: 10
    }, this);
}
_c59 = Clock;
function Calendar(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "calendar_today",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 234,
        columnNumber: 10
    }, this);
}
_c60 = Calendar;
function History(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "history",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 237,
        columnNumber: 10
    }, this);
}
_c61 = History;
function Activity(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "query_stats",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 242,
        columnNumber: 10
    }, this);
}
_c62 = Activity;
function TrendingUp(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "trending_up",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 245,
        columnNumber: 10
    }, this);
}
_c63 = TrendingUp;
function BarChart3(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "bar_chart",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 248,
        columnNumber: 10
    }, this);
}
_c64 = BarChart3;
function ListChecks(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "playlist_add_check",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 251,
        columnNumber: 10
    }, this);
}
_c65 = ListChecks;
function ListTodo(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "format_list_bulleted",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 254,
        columnNumber: 10
    }, this);
}
_c66 = ListTodo;
function Package(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "inventory_2",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 259,
        columnNumber: 10
    }, this);
}
_c67 = Package;
function Archive(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "archive",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 262,
        columnNumber: 10
    }, this);
}
_c68 = Archive;
function Globe(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "public",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 265,
        columnNumber: 10
    }, this);
}
_c69 = Globe;
function Hash(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "tag",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 268,
        columnNumber: 10
    }, this);
}
_c70 = Hash;
function Award(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "emoji_events",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 271,
        columnNumber: 10
    }, this);
}
_c71 = Award;
function Trophy(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "emoji_events",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 274,
        columnNumber: 10
    }, this);
}
_c72 = Trophy;
function Star(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "star",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 277,
        columnNumber: 10
    }, this);
}
_c73 = Star;
function Key(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "key",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 280,
        columnNumber: 10
    }, this);
}
_c74 = Key;
function Briefcase(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "work",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 283,
        columnNumber: 10
    }, this);
}
_c75 = Briefcase;
function ImageIcon(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "image",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 286,
        columnNumber: 10
    }, this);
}
_c76 = ImageIcon;
function Gavel(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "gavel",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 289,
        columnNumber: 10
    }, this);
}
_c77 = Gavel;
function Scale(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "balance",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 292,
        columnNumber: 10
    }, this);
}
_c78 = Scale;
function LayoutDashboard(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "dashboard",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 295,
        columnNumber: 10
    }, this);
}
_c79 = LayoutDashboard;
function Save(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "save",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 298,
        columnNumber: 10
    }, this);
}
_c80 = Save;
function Upload(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "upload",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 301,
        columnNumber: 10
    }, this);
}
_c81 = Upload;
function MessageSquare(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "message",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 304,
        columnNumber: 10
    }, this);
}
_c82 = MessageSquare;
function Sun(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "light_mode",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 307,
        columnNumber: 10
    }, this);
}
_c83 = Sun;
function Moon(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "dark_mode",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 310,
        columnNumber: 10
    }, this);
}
_c84 = Moon;
function Menu(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "menu",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 313,
        columnNumber: 10
    }, this);
}
_c85 = Menu;
function Settings(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "settings",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 316,
        columnNumber: 10
    }, this);
}
_c86 = Settings;
function List(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "view_list",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 319,
        columnNumber: 10
    }, this);
}
_c87 = List;
function Grid(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialIcon, {
        name: "grid_view",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/AppleIcon.tsx",
        lineNumber: 322,
        columnNumber: 10
    }, this);
}
_c88 = Grid;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19, _c20, _c21, _c22, _c23, _c24, _c25, _c26, _c27, _c28, _c29, _c30, _c31, _c32, _c33, _c34, _c35, _c36, _c37, _c38, _c39, _c40, _c41, _c42, _c43, _c44, _c45, _c46, _c47, _c48, _c49, _c50, _c51, _c52, _c53, _c54, _c55, _c56, _c57, _c58, _c59, _c60, _c61, _c62, _c63, _c64, _c65, _c66, _c67, _c68, _c69, _c70, _c71, _c72, _c73, _c74, _c75, _c76, _c77, _c78, _c79, _c80, _c81, _c82, _c83, _c84, _c85, _c86, _c87, _c88;
__turbopack_context__.k.register(_c, "MaterialIcon");
__turbopack_context__.k.register(_c1, "ArrowLeft");
__turbopack_context__.k.register(_c2, "ChevronDown");
__turbopack_context__.k.register(_c3, "ChevronUp");
__turbopack_context__.k.register(_c4, "ChevronRight");
__turbopack_context__.k.register(_c5, "Home");
__turbopack_context__.k.register(_c6, "LogOut");
__turbopack_context__.k.register(_c7, "ExternalLink");
__turbopack_context__.k.register(_c8, "Plus");
__turbopack_context__.k.register(_c9, "PlusCircle");
__turbopack_context__.k.register(_c10, "X");
__turbopack_context__.k.register(_c11, "XCircle");
__turbopack_context__.k.register(_c12, "Circle");
__turbopack_context__.k.register(_c13, "Check");
__turbopack_context__.k.register(_c14, "CheckCheck");
__turbopack_context__.k.register(_c15, "CheckCircle2");
__turbopack_context__.k.register(_c16, "CheckSquare");
__turbopack_context__.k.register(_c17, "Square");
__turbopack_context__.k.register(_c18, "Trash2");
__turbopack_context__.k.register(_c19, "Edit");
__turbopack_context__.k.register(_c20, "Copy");
__turbopack_context__.k.register(_c21, "Search");
__turbopack_context__.k.register(_c22, "Filter");
__turbopack_context__.k.register(_c23, "Printer");
__turbopack_context__.k.register(_c24, "Play");
__turbopack_context__.k.register(_c25, "Pause");
__turbopack_context__.k.register(_c26, "RefreshCw");
__turbopack_context__.k.register(_c27, "RotateCcw");
__turbopack_context__.k.register(_c28, "Zap");
__turbopack_context__.k.register(_c29, "AlertCircle");
__turbopack_context__.k.register(_c30, "AlertTriangle");
__turbopack_context__.k.register(_c31, "AlertOctagon");
__turbopack_context__.k.register(_c32, "Info");
__turbopack_context__.k.register(_c33, "FileText");
__turbopack_context__.k.register(_c34, "FileSearch");
__turbopack_context__.k.register(_c35, "FileCheck");
__turbopack_context__.k.register(_c36, "ClipboardList");
__turbopack_context__.k.register(_c37, "FolderOpen");
__turbopack_context__.k.register(_c38, "BookOpen");
__turbopack_context__.k.register(_c39, "Book");
__turbopack_context__.k.register(_c40, "User");
__turbopack_context__.k.register(_c41, "Users");
__turbopack_context__.k.register(_c42, "UserPlus");
__turbopack_context__.k.register(_c43, "Shield");
__turbopack_context__.k.register(_c44, "ShieldCheck");
__turbopack_context__.k.register(_c45, "ShieldAlert");
__turbopack_context__.k.register(_c46, "ShieldOff");
__turbopack_context__.k.register(_c47, "Lock");
__turbopack_context__.k.register(_c48, "Fingerprint");
__turbopack_context__.k.register(_c49, "Eye");
__turbopack_context__.k.register(_c50, "EyeOff");
__turbopack_context__.k.register(_c51, "Mail");
__turbopack_context__.k.register(_c52, "Phone");
__turbopack_context__.k.register(_c53, "Smartphone");
__turbopack_context__.k.register(_c54, "Camera");
__turbopack_context__.k.register(_c55, "HardDrive");
__turbopack_context__.k.register(_c56, "Database");
__turbopack_context__.k.register(_c57, "Terminal");
__turbopack_context__.k.register(_c58, "Mic");
__turbopack_context__.k.register(_c59, "Clock");
__turbopack_context__.k.register(_c60, "Calendar");
__turbopack_context__.k.register(_c61, "History");
__turbopack_context__.k.register(_c62, "Activity");
__turbopack_context__.k.register(_c63, "TrendingUp");
__turbopack_context__.k.register(_c64, "BarChart3");
__turbopack_context__.k.register(_c65, "ListChecks");
__turbopack_context__.k.register(_c66, "ListTodo");
__turbopack_context__.k.register(_c67, "Package");
__turbopack_context__.k.register(_c68, "Archive");
__turbopack_context__.k.register(_c69, "Globe");
__turbopack_context__.k.register(_c70, "Hash");
__turbopack_context__.k.register(_c71, "Award");
__turbopack_context__.k.register(_c72, "Trophy");
__turbopack_context__.k.register(_c73, "Star");
__turbopack_context__.k.register(_c74, "Key");
__turbopack_context__.k.register(_c75, "Briefcase");
__turbopack_context__.k.register(_c76, "ImageIcon");
__turbopack_context__.k.register(_c77, "Gavel");
__turbopack_context__.k.register(_c78, "Scale");
__turbopack_context__.k.register(_c79, "LayoutDashboard");
__turbopack_context__.k.register(_c80, "Save");
__turbopack_context__.k.register(_c81, "Upload");
__turbopack_context__.k.register(_c82, "MessageSquare");
__turbopack_context__.k.register(_c83, "Sun");
__turbopack_context__.k.register(_c84, "Moon");
__turbopack_context__.k.register(_c85, "Menu");
__turbopack_context__.k.register(_c86, "Settings");
__turbopack_context__.k.register(_c87, "List");
__turbopack_context__.k.register(_c88, "Grid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/atoms/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const Button = ({ children, variant = 'secondary', size = 'md', className = '', iconOnly = false, ...props })=>{
    const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-200 outline-none select-none active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:pointer-events-none gap-2";
    const variants = {
        primary: "bg-[var(--co-accent)] text-[var(--co-accent-fg)] border-none hover:brightness-[1.08] shadow-[0_1px_2px_rgba(0,0,0,0.1)]",
        secondary: "bg-[var(--co-surface-2)] text-[var(--apple-text)] border-none hover:bg-[var(--apple-surface-hover)] dark:hover:bg-[rgba(255,255,255,0.08)]",
        destructive: "bg-[var(--co-red)] text-white border-none hover:brightness-[1.08]",
        ghost: "bg-transparent text-[var(--co-accent)] hover:bg-[rgba(0,113,227,0.1)] border-none"
    };
    const sizes = {
        sm: "h-8 px-3.5 text-[13px] rounded-[8px]",
        md: "h-10 px-4.5 text-[15px] rounded-[10px]",
        lg: "h-12 px-5.5 text-[17px] rounded-[12px]"
    };
    // Adjust width if it's an icon-only button
    const iconSizeStyle = iconOnly ? size === 'sm' ? 'w-8 p-0' : size === 'lg' ? 'w-12 p-0' : 'w-10 p-0' : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `${baseStyle} ${variants[variant]} ${sizes[size]} ${iconSizeStyle} ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/atoms/Button.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Button;
const __TURBOPACK__default__export__ = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/atoms/Input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$AppleIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/atoms/AppleIcon.tsx [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c = ({ label, error, helpText, className = '', id, ...props }, ref)=>{
    const inputId = id || `input-${Math.random().toString(36).slice(2, 6)}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full flex flex-col items-start",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: inputId,
                className: "block text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--co-gray-1)] mb-1.5 select-none",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/atoms/Input.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: ref,
                id: inputId,
                className: `
          w-full text-[15px] bg-[var(--co-surface-2)] text-[var(--apple-text)]
          border rounded-[10px] px-3.5 py-2.5 outline-none transition-all duration-200
          placeholder-[var(--co-gray-2)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]
          ${error ? 'border-[var(--co-red)] focus:border-[var(--co-red)] focus:ring-[3px] focus:ring-[var(--co-red)]/15' : 'border-[var(--co-gray-5)] focus:border-[var(--co-accent)] focus:ring-[3px] focus:ring-[var(--co-accent)]/20'}
          ${className}
        `,
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/atoms/Input.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[13px] text-[var(--co-red)] mt-1.5 flex items-center gap-1.5 font-medium apple-fade-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$AppleIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertCircle"], {
                        size: 12,
                        className: "shrink-0 text-[var(--co-red)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/atoms/Input.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/components/atoms/Input.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/atoms/Input.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : helpText ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[12px] text-[var(--co-gray-1)] mt-1.5",
                children: helpText
            }, void 0, false, {
                fileName: "[project]/src/components/atoms/Input.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/atoms/Input.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = 'Input';
const __TURBOPACK__default__export__ = Input;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/page-components/LoginPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$AppleIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/atoms/AppleIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/atoms/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/atoms/Input.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function LoginPage() {
    _s();
    const { login, isFirstLogin, changePassword, logout, isLoading, error, clearError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showPass, setShowPass] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Estados para cambio obligatorio de contraseña (BUG-021)
    const [newPassword, setNewPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [changeError, setChangeError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [changeSuccess, setChangeSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        clearError();
        if (!username.trim() || !password.trim()) return;
        await login(username.trim(), password);
    };
    const handleChangePassword = async (e)=>{
        e.preventDefault();
        setChangeError(null);
        if (newPassword.length < 4) {
            setChangeError('La contraseña debe tener al menos 4 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setChangeError('Las contraseñas no coinciden.');
            return;
        }
        const res = await changePassword(newPassword);
        if (res.success) {
            setChangeSuccess(true);
            setTimeout(()=>{
                // Forzar recarga o redirección tras guardar la clave
                window.location.reload();
            }, 1500);
        } else {
            setChangeError(res.error || 'Error al cambiar la contraseña.');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden selection:bg-[rgba(0,113,227,0.25)] relative bg-[var(--apple-bg)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 pointer-events-none",
                style: {
                    background: 'var(--login-bg)'
                }
            }, void 0, false, {
                fileName: "[project]/src/page-components/LoginPage.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-[380px] flex flex-col items-center apple-fade-in z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-20 h-20 rounded-full bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-6 shadow-[var(--co-shadow-2)] backdrop-blur-[10px] transition-all duration-300",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg",
                            alt: "SHA256.US",
                            className: "w-11 h-11"
                        }, void 0, false, {
                            fileName: "[project]/src/page-components/LoginPage.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/page-components/LoginPage.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-[28px] font-bold text-[var(--apple-text)] tracking-[-0.03em] mb-0.5",
                                children: "SHA256.US"
                            }, void 0, false, {
                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[13px] text-[var(--co-gray-1)] font-medium tracking-[-0.01em]",
                                children: "Sistema de Peritaje Forense Digital"
                            }, void 0, false, {
                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/page-components/LoginPage.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full bg-white/70 dark:bg-white/5 rounded-[20px] border border-[var(--co-separator)] dark:border-white/10 p-7 shadow-[var(--co-shadow-modal)] backdrop-blur-[30px] transition-all duration-300",
                        children: isFirstLogin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleChangePassword,
                            className: "space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[14px] text-[var(--co-orange)] font-semibold uppercase tracking-wider",
                                            children: "Cambio de Clave Obligatorio"
                                        }, void 0, false, {
                                            fileName: "[project]/src/page-components/LoginPage.tsx",
                                            lineNumber: 75,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] text-[var(--co-gray-1)] mt-1.5 leading-relaxed",
                                            children: "Por motivos de seguridad forense, debe reemplazar las credenciales por defecto (admin/admin) para continuar."
                                        }, void 0, false, {
                                            fileName: "[project]/src/page-components/LoginPage.tsx",
                                            lineNumber: 76,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, this),
                                changeError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FF453A]/[0.08] border border-[#FF453A]/15 animate-apple-fadeIn",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$AppleIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertCircle"], {
                                            size: 15,
                                            className: "shrink-0 text-[var(--co-red)]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/page-components/LoginPage.tsx",
                                            lineNumber: 83,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[13px] text-[var(--co-red)] font-medium",
                                            children: changeError
                                        }, void 0, false, {
                                            fileName: "[project]/src/page-components/LoginPage.tsx",
                                            lineNumber: 84,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                    lineNumber: 82,
                                    columnNumber: 17
                                }, this),
                                changeSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2.5 p-3 rounded-[10px] bg-[#30D158]/[0.08] border border-[#30D158]/15 animate-apple-fadeIn",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[13px] text-[var(--co-green)] font-medium",
                                        children: "Contraseña actualizada. Redirigiendo..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/page-components/LoginPage.tsx",
                                        lineNumber: 90,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                    lineNumber: 89,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    id: "new-password",
                                    type: "password",
                                    label: "Nueva Contraseña",
                                    value: newPassword,
                                    onChange: (e)=>setNewPassword(e.target.value),
                                    placeholder: "Mínimo 4 caracteres",
                                    className: "bg-white/60 dark:bg-white/5 border-[var(--co-separator)] dark:border-white/10 text-[var(--apple-text)] focus:border-[var(--co-accent)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                    lineNumber: 94,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    id: "confirm-password",
                                    type: "password",
                                    label: "Confirmar Contraseña",
                                    value: confirmPassword,
                                    onChange: (e)=>setConfirmPassword(e.target.value),
                                    placeholder: "Confirme la contraseña",
                                    className: "bg-white/60 dark:bg-white/5 border-[var(--co-separator)] dark:border-white/10 text-[var(--apple-text)] focus:border-[var(--co-accent)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                    lineNumber: 104,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            type: "button",
                                            variant: "ghost",
                                            onClick: logout,
                                            className: "w-1/3 text-[var(--apple-text)]/70 dark:text-white/70",
                                            children: "Cancelar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/page-components/LoginPage.tsx",
                                            lineNumber: 115,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            type: "submit",
                                            variant: "primary",
                                            className: "w-2/3",
                                            disabled: isLoading || !newPassword || !confirmPassword || changeSuccess,
                                            children: "Guardar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/page-components/LoginPage.tsx",
                                            lineNumber: 123,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/page-components/LoginPage.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-5",
                            children: [
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FF453A]/[0.08] border border-[#FF453A]/15 animate-apple-fadeIn",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$AppleIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertCircle"], {
                                            size: 15,
                                            className: "shrink-0 text-[var(--co-red)]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/page-components/LoginPage.tsx",
                                            lineNumber: 137,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[13px] text-[var(--co-red)] font-medium",
                                            children: error
                                        }, void 0, false, {
                                            fileName: "[project]/src/page-components/LoginPage.tsx",
                                            lineNumber: 138,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                    lineNumber: 136,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    id: "login-username",
                                    label: "Usuario",
                                    value: username,
                                    onChange: (e)=>setUsername(e.target.value),
                                    placeholder: "Nombre de usuario",
                                    autoComplete: "username",
                                    autoFocus: true,
                                    className: "bg-white/60 dark:bg-white/5 border-[var(--co-separator)] dark:border-white/10 focus:border-[var(--co-accent)] text-[var(--apple-text)] focus:ring-[var(--co-accent)]/20"
                                }, void 0, false, {
                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5 flex flex-col items-start w-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "login-password",
                                            className: "block text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-[0.05em] select-none",
                                            children: "Contraseña"
                                        }, void 0, false, {
                                            fileName: "[project]/src/page-components/LoginPage.tsx",
                                            lineNumber: 154,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "login-password",
                                                    type: showPass ? 'text' : 'password',
                                                    value: password,
                                                    onChange: (e)=>setPassword(e.target.value),
                                                    placeholder: "Contraseña",
                                                    className: "w-full text-[15px] bg-white/60 dark:bg-white/5 border border-[var(--co-separator)] dark:border-white/10 rounded-[10px] px-3.5 py-2.5 pr-10 outline-none transition-all duration-200 placeholder-[var(--co-gray-2)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:border-[var(--co-accent)] focus:ring-[3px] focus:ring-[var(--co-accent)]/20 text-[var(--apple-text)]",
                                                    autoComplete: "current-password"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setShowPass(!showPass),
                                                    className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--co-gray-1)] hover:text-[var(--apple-text)] dark:hover:text-white p-1 rounded-[6px] hover:bg-black/5 dark:hover:bg-white/10 transition-all",
                                                    title: showPass ? 'Ocultar contraseña' : 'Mostrar contraseña',
                                                    children: showPass ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$AppleIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EyeOff"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/page-components/LoginPage.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 33
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$AppleIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Eye"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/page-components/LoginPage.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 56
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/page-components/LoginPage.tsx",
                                            lineNumber: 157,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                    lineNumber: 153,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    id: "login-submit",
                                    type: "submit",
                                    variant: "primary",
                                    size: "lg",
                                    disabled: isLoading || !username.trim() || !password.trim(),
                                    className: "w-full",
                                    children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/page-components/LoginPage.tsx",
                                        lineNumber: 187,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$atoms$2f$AppleIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShieldCheck"], {
                                                size: 16,
                                                strokeWidth: 2.5
                                            }, void 0, false, {
                                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                                lineNumber: 190,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Iniciar Sesión"
                                            }, void 0, false, {
                                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                                lineNumber: 191,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/src/page-components/LoginPage.tsx",
                                    lineNumber: 178,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/page-components/LoginPage.tsx",
                            lineNumber: 134,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/page-components/LoginPage.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 w-full text-center space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3.5 rounded-[12px] bg-[var(--co-orange)]/5 border border-[var(--co-orange)]/15 text-left flex items-start gap-2.5 max-w-[340px] mx-auto transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px] font-bold text-[var(--co-orange)] bg-[var(--co-orange)]/10 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5",
                                        children: "AVISO LEGAL"
                                    }, void 0, false, {
                                        fileName: "[project]/src/page-components/LoginPage.tsx",
                                        lineNumber: 203,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-[var(--co-gray-1)] leading-relaxed font-normal",
                                        children: [
                                            "El acceso no autorizado será registrado y procesado penalmente conforme al ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Art. 187 del COPP"
                                            }, void 0, false, {
                                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                                lineNumber: 207,
                                                columnNumber: 90
                                            }, this),
                                            " y la ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Ley sobre Mensajes de Datos y Firmas Electrónicas"
                                            }, void 0, false, {
                                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                                lineNumber: 207,
                                                columnNumber: 130
                                            }, this),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/page-components/LoginPage.tsx",
                                        lineNumber: 206,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-2 flex flex-col items-center space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-1 h-1 rounded-full bg-black/20 dark:bg-white/20"
                                            }, void 0, false, {
                                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                                lineNumber: 214,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-1.5 h-1.5 rounded-full bg-[var(--co-accent)]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                                lineNumber: 215,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-1 h-1 rounded-full bg-black/20 dark:bg-white/20"
                                            }, void 0, false, {
                                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                                lineNumber: 216,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/page-components/LoginPage.tsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] font-semibold text-[var(--apple-text)]/90 dark:text-white/90 tracking-tight",
                                        children: [
                                            "SHA256.US v2.0 ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[var(--apple-text)]/45 dark:text-white/45 font-light",
                                                children: "·"
                                            }, void 0, false, {
                                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                                lineNumber: 221,
                                                columnNumber: 30
                                            }, this),
                                            " Laboratorio de Informática Forense"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/page-components/LoginPage.tsx",
                                        lineNumber: 220,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[9.5px] text-[var(--co-gray-1)] leading-relaxed max-w-[290px] font-medium opacity-80",
                                        children: [
                                            "Av. 6 con calle 7, Edif. Mercantil La Ceiba, Piso 1, Ofc. Nº 8.",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                                lineNumber: 226,
                                                columnNumber: 78
                                            }, this),
                                            "Quíbor, Municipio Jiménez, Estado Lara."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/page-components/LoginPage.tsx",
                                        lineNumber: 225,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[8.5px] text-[var(--apple-text)]/30 dark:text-white/30 font-semibold uppercase tracking-[0.15em] pt-1",
                                        children: [
                                            "powered by ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[var(--apple-text)] dark:text-white font-bold",
                                                children: "jull"
                                            }, void 0, false, {
                                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                                lineNumber: 232,
                                                columnNumber: 26
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/page-components/LoginPage.tsx",
                                        lineNumber: 231,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/page-components/LoginPage.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/page-components/LoginPage.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/page-components/LoginPage.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/page-components/LoginPage.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "3mDeAboJOCym/ynoAf5Qzxi2McU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(auth)/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPageRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$page$2d$components$2f$LoginPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/page-components/LoginPage.tsx [app-client] (ecmascript)");
'use client';
;
;
function LoginPageRoute() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$page$2d$components$2f$LoginPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/src/app/(auth)/login/page.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
_c = LoginPageRoute;
var _c;
__turbopack_context__.k.register(_c, "LoginPageRoute");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1-jd2_s._.js.map