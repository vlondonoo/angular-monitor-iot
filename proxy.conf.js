const PROXY_CONFIG = [
    {
        context: [
            "/read",
            "/readName/*",
            "/readOne",
            "/add",
            "/deleteOne",
            "/update",
        ],
        target: "https://z0p9ki9uw2.execute-api.us-east-1.amazonaws.com",
        secure: false,
        logLevel: "debug",
        pathRewrite: {"^/" : "https://z0p9ki9uw2.execute-api.us-east-1.amazonaws.com/"},
        changeOrigin: true,
    }
]

module.exports = PROXY_CONFIG;