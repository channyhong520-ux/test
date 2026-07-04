module.exports = [
"[project]/node_modules/qrcode/lib/index.js [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/node_modules_0lgt-6k._.js",
  "server/chunks/[externals]_fs_0eo4gmu._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/node_modules/qrcode/lib/index.js [app-route] (ecmascript)");
    });
});
}),
"[project]/src/app/api/checkout/generate/route.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/src/app/api/checkout/generate/route.ts [app-route] (ecmascript)");
    });
});
}),
];