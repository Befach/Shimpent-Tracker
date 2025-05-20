/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./contexts/AuthContext.tsx":
/*!**********************************!*\
  !*** ./contexts/AuthContext.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction AuthProvider({ children }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [isAdmin, setIsAdmin] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Check if user is logged in from localStorage\n        const checkAuth = ()=>{\n            const storedUser = localStorage.getItem(\"shiptrack_user\");\n            if (storedUser) {\n                try {\n                    const userData = JSON.parse(storedUser);\n                    setUser(userData);\n                    setIsAdmin(userData.role === \"admin\");\n                } catch (e) {\n                    console.error(\"Error parsing stored user:\", e);\n                    localStorage.removeItem(\"shiptrack_user\");\n                    setUser(null);\n                    setIsAdmin(false);\n                }\n            } else {\n                setUser(null);\n                setIsAdmin(false);\n            }\n            setIsLoading(false);\n        };\n        checkAuth();\n    }, []);\n    // Login function using environment variables\n    const login = async (email, password)=>{\n        // Get admin credentials from environment variables\n        const adminEmail = \"admin@shiptrack.com\" || 0;\n        const adminPassword = process.env.ADMIN_PASSWORD || \"shiptrack123\"; // Fallback password\n        // Check if credentials match\n        if (email === adminEmail && password === adminPassword) {\n            const userData = {\n                email,\n                role: \"admin\",\n                name: \"Admin User\"\n            };\n            // Store user in localStorage\n            localStorage.setItem(\"shiptrack_user\", JSON.stringify(userData));\n            setUser(userData);\n            setIsAdmin(true);\n            return true;\n        }\n        return false;\n    };\n    // Logout function\n    const signOut = ()=>{\n        localStorage.removeItem(\"shiptrack_user\");\n        setUser(null);\n        setIsAdmin(false);\n        router.push(\"/admin/login\");\n    };\n    const value = {\n        user,\n        isLoading,\n        isAdmin,\n        login,\n        signOut\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"D:\\\\Shipment Tracker\\\\contexts\\\\AuthContext.tsx\",\n        lineNumber: 85,\n        columnNumber: 10\n    }, this);\n}\nfunction useAuth() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (context === undefined) {\n        throw new Error(\"useAuth must be used within an AuthProvider\");\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0cy9BdXRoQ29udGV4dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQThFO0FBQ3RDO0FBVXhDLE1BQU1NLDRCQUFjTCxvREFBYUEsQ0FBOEJNO0FBRXhELFNBQVNDLGFBQWEsRUFBRUMsUUFBUSxFQUFpQztJQUN0RSxNQUFNLENBQUNDLE1BQU1DLFFBQVEsR0FBR1AsK0NBQVFBLENBQWE7SUFDN0MsTUFBTSxDQUFDUSxXQUFXQyxhQUFhLEdBQUdULCtDQUFRQSxDQUFDO0lBQzNDLE1BQU0sQ0FBQ1UsU0FBU0MsV0FBVyxHQUFHWCwrQ0FBUUEsQ0FBQztJQUN2QyxNQUFNWSxTQUFTWCxzREFBU0E7SUFFeEJGLGdEQUFTQSxDQUFDO1FBQ1IsK0NBQStDO1FBQy9DLE1BQU1jLFlBQVk7WUFDaEIsTUFBTUMsYUFBYUMsYUFBYUMsT0FBTyxDQUFDO1lBQ3hDLElBQUlGLFlBQVk7Z0JBQ2QsSUFBSTtvQkFDRixNQUFNRyxXQUFXQyxLQUFLQyxLQUFLLENBQUNMO29CQUM1QlAsUUFBUVU7b0JBQ1JOLFdBQVdNLFNBQVNHLElBQUksS0FBSztnQkFDL0IsRUFBRSxPQUFPQyxHQUFHO29CQUNWQyxRQUFRQyxLQUFLLENBQUMsOEJBQThCRjtvQkFDNUNOLGFBQWFTLFVBQVUsQ0FBQztvQkFDeEJqQixRQUFRO29CQUNSSSxXQUFXO2dCQUNiO1lBQ0YsT0FBTztnQkFDTEosUUFBUTtnQkFDUkksV0FBVztZQUNiO1lBQ0FGLGFBQWE7UUFDZjtRQUVBSTtJQUNGLEdBQUcsRUFBRTtJQUVMLDZDQUE2QztJQUM3QyxNQUFNWSxRQUFRLE9BQU9DLE9BQWVDO1FBQ2xDLG1EQUFtRDtRQUNuRCxNQUFNQyxhQUFhQyxxQkFBbUMsSUFBSTtRQUMxRCxNQUFNRyxnQkFBZ0JILFFBQVFDLEdBQUcsQ0FBQ0csY0FBYyxJQUFJLGdCQUFnQixvQkFBb0I7UUFFeEYsNkJBQTZCO1FBQzdCLElBQUlQLFVBQVVFLGNBQWNELGFBQWFLLGVBQWU7WUFDdEQsTUFBTWYsV0FBVztnQkFDZlM7Z0JBQ0FOLE1BQU07Z0JBQ05jLE1BQU07WUFDUjtZQUVBLDZCQUE2QjtZQUM3Qm5CLGFBQWFvQixPQUFPLENBQUMsa0JBQWtCakIsS0FBS2tCLFNBQVMsQ0FBQ25CO1lBQ3REVixRQUFRVTtZQUNSTixXQUFXO1lBQ1gsT0FBTztRQUNUO1FBRUEsT0FBTztJQUNUO0lBRUEsa0JBQWtCO0lBQ2xCLE1BQU0wQixVQUFVO1FBQ2R0QixhQUFhUyxVQUFVLENBQUM7UUFDeEJqQixRQUFRO1FBQ1JJLFdBQVc7UUFDWEMsT0FBTzBCLElBQUksQ0FBQztJQUNkO0lBRUEsTUFBTUMsUUFBUTtRQUNaakM7UUFDQUU7UUFDQUU7UUFDQWU7UUFDQVk7SUFDRjtJQUVBLHFCQUFPLDhEQUFDbkMsWUFBWXNDLFFBQVE7UUFBQ0QsT0FBT0E7a0JBQVFsQzs7Ozs7O0FBQzlDO0FBRU8sU0FBU29DO0lBQ2QsTUFBTUMsVUFBVTVDLGlEQUFVQSxDQUFDSTtJQUMzQixJQUFJd0MsWUFBWXZDLFdBQVc7UUFDekIsTUFBTSxJQUFJd0MsTUFBTTtJQUNsQjtJQUNBLE9BQU9EO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaGlwbWVudC10cmFja2VyLy4vY29udGV4dHMvQXV0aENvbnRleHQudHN4PzZkODEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcic7XG5cbnR5cGUgQXV0aENvbnRleHRUeXBlID0ge1xuICB1c2VyOiBhbnkgfCBudWxsO1xuICBpc0xvYWRpbmc6IGJvb2xlYW47XG4gIGlzQWRtaW46IGJvb2xlYW47XG4gIGxvZ2luOiAoZW1haWw6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT4gUHJvbWlzZTxib29sZWFuPjtcbiAgc2lnbk91dDogKCkgPT4gdm9pZDtcbn07XG5cbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxBdXRoQ29udGV4dFR5cGUgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBBdXRoUHJvdmlkZXIoeyBjaGlsZHJlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUgfSkge1xuICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZTxhbnkgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbaXNBZG1pbiwgc2V0SXNBZG1pbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gQ2hlY2sgaWYgdXNlciBpcyBsb2dnZWQgaW4gZnJvbSBsb2NhbFN0b3JhZ2VcbiAgICBjb25zdCBjaGVja0F1dGggPSAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZWRVc2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NoaXB0cmFja191c2VyJyk7XG4gICAgICBpZiAoc3RvcmVkVXNlcikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHVzZXJEYXRhID0gSlNPTi5wYXJzZShzdG9yZWRVc2VyKTtcbiAgICAgICAgICBzZXRVc2VyKHVzZXJEYXRhKTtcbiAgICAgICAgICBzZXRJc0FkbWluKHVzZXJEYXRhLnJvbGUgPT09ICdhZG1pbicpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcGFyc2luZyBzdG9yZWQgdXNlcjonLCBlKTtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnc2hpcHRyYWNrX3VzZXInKTtcbiAgICAgICAgICBzZXRVc2VyKG51bGwpO1xuICAgICAgICAgIHNldElzQWRtaW4oZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRVc2VyKG51bGwpO1xuICAgICAgICBzZXRJc0FkbWluKGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgfTtcblxuICAgIGNoZWNrQXV0aCgpO1xuICB9LCBbXSk7XG5cbiAgLy8gTG9naW4gZnVuY3Rpb24gdXNpbmcgZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gIGNvbnN0IGxvZ2luID0gYXN5bmMgKGVtYWlsOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICAvLyBHZXQgYWRtaW4gY3JlZGVudGlhbHMgZnJvbSBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAgICBjb25zdCBhZG1pbkVtYWlsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQURNSU5fRU1BSUwgfHwgJ2FkbWluQHNoaXB0cmFjay5jb20nO1xuICAgIGNvbnN0IGFkbWluUGFzc3dvcmQgPSBwcm9jZXNzLmVudi5BRE1JTl9QQVNTV09SRCB8fCAnc2hpcHRyYWNrMTIzJzsgLy8gRmFsbGJhY2sgcGFzc3dvcmRcblxuICAgIC8vIENoZWNrIGlmIGNyZWRlbnRpYWxzIG1hdGNoXG4gICAgaWYgKGVtYWlsID09PSBhZG1pbkVtYWlsICYmIHBhc3N3b3JkID09PSBhZG1pblBhc3N3b3JkKSB7XG4gICAgICBjb25zdCB1c2VyRGF0YSA9IHtcbiAgICAgICAgZW1haWwsXG4gICAgICAgIHJvbGU6ICdhZG1pbicsXG4gICAgICAgIG5hbWU6ICdBZG1pbiBVc2VyJ1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgLy8gU3RvcmUgdXNlciBpbiBsb2NhbFN0b3JhZ2VcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzaGlwdHJhY2tfdXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXJEYXRhKSk7XG4gICAgICBzZXRVc2VyKHVzZXJEYXRhKTtcbiAgICAgIHNldElzQWRtaW4odHJ1ZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIExvZ291dCBmdW5jdGlvblxuICBjb25zdCBzaWduT3V0ID0gKCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdzaGlwdHJhY2tfdXNlcicpO1xuICAgIHNldFVzZXIobnVsbCk7XG4gICAgc2V0SXNBZG1pbihmYWxzZSk7XG4gICAgcm91dGVyLnB1c2goJy9hZG1pbi9sb2dpbicpO1xuICB9O1xuXG4gIGNvbnN0IHZhbHVlID0ge1xuICAgIHVzZXIsXG4gICAgaXNMb2FkaW5nLFxuICAgIGlzQWRtaW4sXG4gICAgbG9naW4sXG4gICAgc2lnbk91dCxcbiAgfTtcblxuICByZXR1cm4gPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0+e2NoaWxkcmVufTwvQXV0aENvbnRleHQuUHJvdmlkZXI+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlQXV0aCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xuICBpZiAoY29udGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoIG11c3QgYmUgdXNlZCB3aXRoaW4gYW4gQXV0aFByb3ZpZGVyJyk7XG4gIH1cbiAgcmV0dXJuIGNvbnRleHQ7XG59ICJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJ1c2VSb3V0ZXIiLCJBdXRoQ29udGV4dCIsInVuZGVmaW5lZCIsIkF1dGhQcm92aWRlciIsImNoaWxkcmVuIiwidXNlciIsInNldFVzZXIiLCJpc0xvYWRpbmciLCJzZXRJc0xvYWRpbmciLCJpc0FkbWluIiwic2V0SXNBZG1pbiIsInJvdXRlciIsImNoZWNrQXV0aCIsInN0b3JlZFVzZXIiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwidXNlckRhdGEiLCJKU09OIiwicGFyc2UiLCJyb2xlIiwiZSIsImNvbnNvbGUiLCJlcnJvciIsInJlbW92ZUl0ZW0iLCJsb2dpbiIsImVtYWlsIiwicGFzc3dvcmQiLCJhZG1pbkVtYWlsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX0FETUlOX0VNQUlMIiwiYWRtaW5QYXNzd29yZCIsIkFETUlOX1BBU1NXT1JEIiwibmFtZSIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJzaWduT3V0IiwicHVzaCIsInZhbHVlIiwiUHJvdmlkZXIiLCJ1c2VBdXRoIiwiY29udGV4dCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./contexts/AuthContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/AuthContext */ \"./contexts/AuthContext.tsx\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    // Clear any old authentication data on app start\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        // Check if we're using the new auth system\n        const storedUser = localStorage.getItem(\"shiptrack_user\");\n        // If not, clear any old auth data\n        if (!storedUser) {\n            localStorage.removeItem(\"dummyAdminLogin\");\n            localStorage.removeItem(\"adminEmail\");\n            localStorage.removeItem(\"redirectAfterLogin\");\n        }\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__.AuthProvider, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_4___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        children: \"Befach International - Global Shipping & Logistics\"\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Shipment Tracker\\\\pages\\\\_app.tsx\",\n                        lineNumber: 24,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"description\",\n                        content: \"Track your international shipments with Befach International's real-time tracking system\"\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Shipment Tracker\\\\pages\\\\_app.tsx\",\n                        lineNumber: 25,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        href: \"/favicon.ico\"\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Shipment Tracker\\\\pages\\\\_app.tsx\",\n                        lineNumber: 26,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"apple-touch-icon\",\n                        sizes: \"180x180\",\n                        href: \"/apple-touch-icon.png\"\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Shipment Tracker\\\\pages\\\\_app.tsx\",\n                        lineNumber: 27,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        type: \"image/png\",\n                        sizes: \"32x32\",\n                        href: \"/favicon-32x32.png\"\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Shipment Tracker\\\\pages\\\\_app.tsx\",\n                        lineNumber: 28,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        type: \"image/png\",\n                        sizes: \"16x16\",\n                        href: \"/favicon-16x16.png\"\n                    }, void 0, false, {\n                        fileName: \"D:\\\\Shipment Tracker\\\\pages\\\\_app.tsx\",\n                        lineNumber: 29,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"D:\\\\Shipment Tracker\\\\pages\\\\_app.tsx\",\n                lineNumber: 23,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"D:\\\\Shipment Tracker\\\\pages\\\\_app.tsx\",\n                lineNumber: 31,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"D:\\\\Shipment Tracker\\\\pages\\\\_app.tsx\",\n        lineNumber: 22,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErQjtBQUV3QjtBQUNyQjtBQUNMO0FBRTdCLFNBQVNHLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDL0MsaURBQWlEO0lBQ2pESixnREFBU0EsQ0FBQztRQUNSLDJDQUEyQztRQUMzQyxNQUFNSyxhQUFhQyxhQUFhQyxPQUFPLENBQUM7UUFFeEMsa0NBQWtDO1FBQ2xDLElBQUksQ0FBQ0YsWUFBWTtZQUNmQyxhQUFhRSxVQUFVLENBQUM7WUFDeEJGLGFBQWFFLFVBQVUsQ0FBQztZQUN4QkYsYUFBYUUsVUFBVSxDQUFDO1FBQzFCO0lBQ0YsR0FBRyxFQUFFO0lBRUwscUJBQ0UsOERBQUNULCtEQUFZQTs7MEJBQ1gsOERBQUNFLGtEQUFJQTs7a0NBQ0gsOERBQUNRO2tDQUFNOzs7Ozs7a0NBQ1AsOERBQUNDO3dCQUFLQyxNQUFLO3dCQUFjQyxTQUFROzs7Ozs7a0NBQ2pDLDhEQUFDQzt3QkFBS0MsS0FBSTt3QkFBT0MsTUFBSzs7Ozs7O2tDQUN0Qiw4REFBQ0Y7d0JBQUtDLEtBQUk7d0JBQW1CRSxPQUFNO3dCQUFVRCxNQUFLOzs7Ozs7a0NBQ2xELDhEQUFDRjt3QkFBS0MsS0FBSTt3QkFBT0csTUFBSzt3QkFBWUQsT0FBTTt3QkFBUUQsTUFBSzs7Ozs7O2tDQUNyRCw4REFBQ0Y7d0JBQUtDLEtBQUk7d0JBQU9HLE1BQUs7d0JBQVlELE9BQU07d0JBQVFELE1BQUs7Ozs7Ozs7Ozs7OzswQkFFdkQsOERBQUNaO2dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7OztBQUc5QjtBQUVBLGlFQUFlRixLQUFLQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hpcG1lbnQtdHJhY2tlci8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xyXG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnO1xyXG5pbXBvcnQgeyBBdXRoUHJvdmlkZXIgfSBmcm9tICcuLi9jb250ZXh0cy9BdXRoQ29udGV4dCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IEhlYWQgZnJvbSAnbmV4dC9oZWFkJztcclxuXHJcbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcclxuICAvLyBDbGVhciBhbnkgb2xkIGF1dGhlbnRpY2F0aW9uIGRhdGEgb24gYXBwIHN0YXJ0XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIC8vIENoZWNrIGlmIHdlJ3JlIHVzaW5nIHRoZSBuZXcgYXV0aCBzeXN0ZW1cclxuICAgIGNvbnN0IHN0b3JlZFVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2hpcHRyYWNrX3VzZXInKTtcclxuICAgIFxyXG4gICAgLy8gSWYgbm90LCBjbGVhciBhbnkgb2xkIGF1dGggZGF0YVxyXG4gICAgaWYgKCFzdG9yZWRVc2VyKSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdkdW1teUFkbWluTG9naW4nKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FkbWluRW1haWwnKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3JlZGlyZWN0QWZ0ZXJMb2dpbicpO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPEF1dGhQcm92aWRlcj5cclxuICAgICAgPEhlYWQ+XHJcbiAgICAgICAgPHRpdGxlPkJlZmFjaCBJbnRlcm5hdGlvbmFsIC0gR2xvYmFsIFNoaXBwaW5nICYgTG9naXN0aWNzPC90aXRsZT5cclxuICAgICAgICA8bWV0YSBuYW1lPVwiZGVzY3JpcHRpb25cIiBjb250ZW50PVwiVHJhY2sgeW91ciBpbnRlcm5hdGlvbmFsIHNoaXBtZW50cyB3aXRoIEJlZmFjaCBJbnRlcm5hdGlvbmFsJ3MgcmVhbC10aW1lIHRyYWNraW5nIHN5c3RlbVwiIC8+XHJcbiAgICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIGhyZWY9XCIvZmF2aWNvbi5pY29cIiAvPlxyXG4gICAgICAgIDxsaW5rIHJlbD1cImFwcGxlLXRvdWNoLWljb25cIiBzaXplcz1cIjE4MHgxODBcIiBocmVmPVwiL2FwcGxlLXRvdWNoLWljb24ucG5nXCIgLz5cclxuICAgICAgICA8bGluayByZWw9XCJpY29uXCIgdHlwZT1cImltYWdlL3BuZ1wiIHNpemVzPVwiMzJ4MzJcIiBocmVmPVwiL2Zhdmljb24tMzJ4MzIucG5nXCIgLz5cclxuICAgICAgICA8bGluayByZWw9XCJpY29uXCIgdHlwZT1cImltYWdlL3BuZ1wiIHNpemVzPVwiMTZ4MTZcIiBocmVmPVwiL2Zhdmljb24tMTZ4MTYucG5nXCIgLz5cclxuICAgICAgPC9IZWFkPlxyXG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XHJcbiAgICA8L0F1dGhQcm92aWRlcj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNeUFwcDsgIl0sIm5hbWVzIjpbIkF1dGhQcm92aWRlciIsInVzZUVmZmVjdCIsIkhlYWQiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInN0b3JlZFVzZXIiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwicmVtb3ZlSXRlbSIsInRpdGxlIiwibWV0YSIsIm5hbWUiLCJjb250ZW50IiwibGluayIsInJlbCIsImhyZWYiLCJzaXplcyIsInR5cGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();