module.exports = [
"[project]/src/db/platformAPI.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/store/authStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/platformAPI.ts [app-ssr] (ecmascript)");
;
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
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
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["platformAPI"].auth.login({
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
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["platformAPI"].auth && user?.token) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["platformAPI"].auth.logout(user.token);
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
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["platformAPI"].auth) {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["platformAPI"].auth.validate(user.token);
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
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["platformAPI"].auth?.changePassword) {
                try {
                    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$platformAPI$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["platformAPI"].auth.changePassword(user.id, newPassword);
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
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/authStore.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Home() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isAuthenticated) {
            router.replace('/dashboard');
        } else {
            router.replace('/login');
        }
    }, [
        isAuthenticated,
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen w-screen bg-[var(--apple-bg)] flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-8 h-8 border-4 border-cms-accent/30 border-t-cms-accent rounded-full animate-spin"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_04hz1gm._.js.map