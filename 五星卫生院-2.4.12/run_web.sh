#!/bin/zsh
# 五星卫生院 · 一键运行脚本（web-mobile 独立构建包）
# 用法：zsh run_web.sh          —— 有构建产物就直接起服务；没有就先构建
# 构建产物在 build/web-mobile；服务端口 8090；浏览器打开 http://localhost:8090
set -e
P="$(cd "$(dirname "$0")" && pwd)"
CREATOR="/Applications/Cocos/Creator/2.4.12/CocosCreator.app/Contents/MacOS/CocosCreator"
NODE_BIN="$(ls /Users/qihao/.workbuddy/binaries/node/versions/*/bin/node 2>/dev/null | head -1)"
[ -z "$NODE_BIN" ] && NODE_BIN="$(command -v node)"

if [ ! -f "$P/build/web-mobile/index.html" ]; then
  echo "[run_web] 无构建产物，先执行 CLI 构建（约 1-2 分钟）..."
  # 关键：清掉 WorkBuddy 注入的 ELECTRON_RUN_AS_NODE / NODE_OPTIONS，否则 Electron 会当 node 跑报 bad option
  env -u ELECTRON_RUN_AS_NODE -u NODE_OPTIONS "$CREATOR" --path "$P" --build "platform=web-mobile;debug=true" --nologin --force
fi

[ -f "$P/phone.html" ] && cp "$P/phone.html" "$P/build/web-mobile/phone.html" && echo "[run_web] 已同步手机竖屏预览页 /phone.html"
echo "[run_web] 启动静态服务 http://localhost:8090 ..."
cd "$P/build/web-mobile"
exec "$NODE_BIN" -e '
const http=require("http"),fs=require("fs"),path=require("path");
const mime={".html":"text/html",".js":"application/javascript",".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".mp3":"audio/mpeg",".wav":"audio/wav",".css":"text/css",".ico":"image/x-icon",".ttf":"font/ttf",".bin":"application/octet-stream",".plist":"application/xml",".fnt":"text/plain"};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split("?")[0]);
  if(p==="/")p="/index.html";
  const f=path.join(process.cwd(),p);
  fs.readFile(f,(e,d)=>{
    if(e){res.writeHead(404);res.end("nf");return}
    res.writeHead(200,{"Content-Type":mime[path.extname(f)]||"application/octet-stream","Cache-Control":"no-store"});
    res.end(d);
  });
}).listen(8090,()=>console.log("[run_web] serving http://localhost:8090 (Ctrl+C 退出)"));
'
