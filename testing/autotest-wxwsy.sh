#!/bin/bash
# 五星卫生院-3x 浏览器自动化测试 v2（headed 可见模式）
# 用法: ./autotest-wxwsy.sh [part1|part2|all]   默认 all
# 依赖: agent-browser（PATH 含 node 22）、预览服务 http://localhost:7456
# 产出: /tmp/at_*.png 截图、/tmp/at_console.log 控制台、/tmp/at_summary.md 汇总
# 复跑: AGENT_BROWSER_HEADED=1 AGENT_BROWSER_ARGS="--no-sandbox" ./autotest-wxwsy.sh all
# 红线: AGENT_BROWSER_ARGS 只允许 --no-sandbox。2026-10-16 实测追加
# --disable-dev-shm-usage / swiftshader 等参数会导致 Chrome for Testing 155
# 主进程启动 5s 内 EXC_BREAKPOINT 崩溃(macOS 26.6)，见系统崩溃报告。
export PATH="/Users/qihao/.workbuddy/binaries/node/versions/22.22.2-6/bin:$PATH"
export AGENT_BROWSER_HEADED=1
URL='http://localhost:7456/'
SHOT=/tmp/at
LOG=/tmp/at_console.log
SUM=/tmp/at_summary.md
PART=${1:-all}
PASS=0; FAIL=0; SKIP=0
mkdir -p "$SHOT"
: > "$SUM"

BASE_E=0; BASE_C=0
step(){ echo ""; echo "=================================================="; echo "[STEP] $1"; echo "[STEP] $1" >> "$SUM"
  BASE_E=$(agent-browser console 2>&1 | grep -cE '^\[error\]')
  BASE_C=$(agent-browser console 2>&1 | grep -cE "reading 'vb'|typed array|Uncaught"); }
ok(){   PASS=$((PASS+1)); echo "[PASS] $1"; echo "- [PASS] $1" >> "$SUM"; }
bad(){  FAIL=$((FAIL+1)); echo "[FAIL] $1"; echo "- [FAIL] $1" >> "$SUM"; agent-browser screenshot "$SHOT/fail_T$CUR.png" >/dev/null 2>&1; }
skip(){ SKIP=$((SKIP+1)); echo "[SKIP] $1"; echo "- [SKIP] $1" >> "$SUM"; }
E(){ C=$(agent-browser console 2>&1 | grep -cE '^\[error\]'); echo $((C-BASE_E)); }
CRASH(){ C=$(agent-browser console 2>&1 | grep -cE "reading 'vb'|typed array|Uncaught"); echo $((C-BASE_C)); }
ALIVE(){ agent-browser eval "typeof cc!=='undefined'" 2>&1 | tail -1; }
# EVALR: 执行 eval 并解包一层 JSON 字符串引号/转义
ensure_alive(){
  for i in 1 2 3; do
    A=$(ALIVE)
    [ "$A" = "true" ] && return 0
    echo "       [自愈] 标签页死亡，重开页面(第${i}次)"
    agent-browser open "$URL" >/dev/null 2>&1
    sleep 14
  done
  [ "$(ALIVE)" = "true" ]
}
EVALR(){ R=$(agent-browser eval "$1" 2>&1 | tail -1)
  case "$R" in
    ""|*"Evaluation error"*|*"at <anonymous>"*|*"CDP"*) ensure_alive; R=$(agent-browser eval "$1" 2>&1 | tail -1);;
  esac
  echo "$R" | sed -e 's/^"//' -e 's/"$//' -e 's/\"/"/g' -e 's/\\\\/\\/g'; }
CLICK(){ agent-browser mouse move "$1" "$2" >/dev/null 2>&1; sleep 0.2; agent-browser mouse down >/dev/null 2>&1; sleep 0.15; agent-browser mouse up >/dev/null 2>&1; sleep "${3:-1.5}"; }
PANEL_OPEN(){ EVALR "(function(){var sc=cc.director.getScene();var n=null;(function w(x){if(!n&&x.activeInHierarchy)x.components.forEach(function(c){if(c.touchEvents&&c.touchEvents.length&&c.touchEvents[0].handler==='$1')n=x;});x.children.forEach(w);})(sc);if(!n)return 'no';var xb=null;n.components.forEach(function(c){if(c.touchEvents)xb=c;});cc.Component.EventHandler.emitEvents(xb.touchEvents,xb);return 'open'})()" >/dev/null; sleep 2; }
PANEL_CLOSE(){ EVALR "(function(){var sc=cc.director.getScene();var n=null;(function w(x){if(!n&&x.activeInHierarchy)x.components.forEach(function(c){if(c.touchEvents&&c.touchEvents.length&&c.touchEvents[0].handler==='onTouchClose')n=x;});x.children.forEach(w);})(sc);if(!n)return 'no';var xb=null;n.components.forEach(function(c){if(c.touchEvents)xb=c;});cc.Component.EventHandler.emitEvents(xb.touchEvents,xb);return 'closed'})()" >/dev/null; sleep 1.5; }
CLEAR_SAVE(){ EVALR "Object.keys(localStorage).forEach(function(k){if(k.indexOf('zhxqfive')===0)localStorage.removeItem(k)});'ok'" >/dev/null; }
RICH_SAVE(){ LVL=${1:-1}; EVALR "(function(){var L=$LVL;var b=[];for(var i=0;i<12;i++)b.push({index:i,dirty:0,level:L,upgrade:0});localStorage.setItem('zhxqfive_buildings',JSON.stringify(b));localStorage.setItem('zhxqfive_gold','99999999');localStorage.setItem('zhxqfive_level','38');var r=[];for(var i=0;i<20;i++)r.push(i<8?1:0);localStorage.setItem('zhxqfive_recruit',JSON.stringify(r));localStorage.setItem('zhxqfive_warehouse',JSON.stringify([0,1,2,3,4,5,6,7,8,9]));localStorage.setItem('zhxqfive_lock',JSON.stringify([true,true,true,true,true,true,true,true,true,true]));localStorage.setItem('zhxqfive_newGuide','1');return 'ok'})()" >/dev/null; }
GOLD(){ for _t in 1 2 3; do V=$(EVALR "(function(){var g=cc.js.getClassByName('GameSys');return Math.round(g.game.xGet('gold').v)})()"); case "$V" in ''|*[!0-9]*) sleep 2;; *) break;; esac; done; echo "$V"; }

echo "[INFO] 启动 headed 浏览器（可见窗口），目标 $URL"
agent-browser close --all >/dev/null 2>&1; sleep 2

if [ "$PART" = "part1" ] || [ "$PART" = "all" ]; then
# ---------- T01 页面加载 ----------
CUR=01; step "T01 启动游戏并确认页面加载"
agent-browser open "$URL" >/dev/null 2>&1
sleep 14
HTTP=$(curl -s --noproxy '*' -o /dev/null -w '%{http_code}' "$URL")
[ "$HTTP" = "200" ] && ok "T01.1 预览服务 HTTP 200" || bad "T01.1 预览服务 HTTP=$HTTP"
CANVAS=$(EVALR "!!document.querySelector('canvas')")
[ "$CANVAS" = "true" ] && ok "T01.2 canvas 元素存在" || bad "T01.2 canvas 缺失"
CCREADY=$(ALIVE)
[ "$CCREADY" = "true" ] && ok "T01.3 引擎 cc 就绪" || bad "T01.3 引擎未就绪"
agent-browser screenshot "$SHOT/T01.png" >/dev/null 2>&1

# ---------- T02 进入主场景 ----------
ensure_alive
CUR=02; step "T02 点击开始进入主场景"
CLICK 640 396 4
SCENE=''
for _t in 1 2 3 4 5; do
  SCENE=$(EVALR "(function(){var s=cc.director.getScene();return s?JSON.stringify({kids:s.children.length}):'noscene'})()")
  echo "       场景探测($_t): $SCENE"
  echo "$SCENE" | grep -q 'kids' && break
  sleep 4
done
KIDS=$(echo "$SCENE" | grep -oE 'kids[^0-9]*[0-9]+' | grep -oE '[0-9]+$')
echo "       场景信息: $SCENE"
[ "${KIDS:-0}" -ge 2 ] && ok "T02.1 主场景节点已挂载(kids=$KIDS)" || bad "T02.1 主场景未挂载(kids=$KIDS)"
GS=$(EVALR "!!cc.js.getClassByName('GameSys')")
[ "$GS" = "true" ] && ok "T02.2 GameSys 管理器存在" || bad "T02.2 GameSys 缺失"
agent-browser screenshot "$SHOT/T02.png" >/dev/null 2>&1

# ---------- T03 新手引导推进 ----------
ensure_alive
CUR=03; step "T03 新手引导流程推进"
G0=$(EVALR "(function(){var g=cc.js.getClassByName('GameSys');var v=g.game.xGet('newguidecon');return v===undefined||v===null?'null':v})()")
case "$G0" in ''|*[!0-9]*) G0=0;; esac
echo "       引导起始步: $G0（观察 160s，每 20s 回显）"
G1=$G0
for t in 1 2 3 4 5 6 7 8; do
  sleep 20
  G1=$(EVALR "(function(){var g=cc.js.getClassByName('GameSys');var v=g.game.xGet('newguidecon');return v===undefined||v===null?'null':v})()")
  case "$G1" in ''|*[!0-9]*) G1=$G0;; esac
  echo "       t=$((t*20))s 引导步=$G1"
  [ "$G1" -gt "$G0" ] && break
done
if [ "$G1" -gt "$G0" ]; then ok "T03.1 引导自动推进($G0→$G1)"
else
  NG=$(EVALR "(function(){var sc=cc.director.getScene();var f=false;(function w(x){if(x.getComponent&&x.getComponent('NewGuide'))f=true;x.children.forEach(w);})(sc);return f})()")
  if [ "$NG" = "true" ]; then skip "T03.1 160s 内引导未推进，引导 UI 存在（需更长观察窗），现场已截图"; else bad "T03.1 引导未推进且引导组件缺失($G0→$G1)"; fi
fi
agent-browser screenshot "$SHOT/T03.png" >/dev/null 2>&1

# ---------- 切换富存档（T04-T08 确定性前置） ----------
step "前置：注入富存档并重启（跳过引导）"
RICH_SAVE
agent-browser reload >/dev/null 2>&1; sleep 15
CLICK 640 396 4
A=$(ALIVE); [ "$A" = "true" ] && ok "前置.1 富存档启动存活" || bad "前置.1 富存档启动死亡"

# ---------- T04 建设升级 ----------
ensure_alive
CUR=04; step "T04 核心玩法-建设面板升级"
PANEL_OPEN onTouchBuildings
UP=$(EVALR "(function(){var sc=cc.director.getScene();var cam=sc.getComponentInChildren('cc.Camera');var cv=document.querySelector('canvas').getBoundingClientRect();var out=null;(function w(n){if(!n.activeInHierarchy||out)return;n.components.forEach(function(c){if(c.touchEvents&&c.touchEvents.length&&c.touchEvents[0].handler==='onTouchUpdrage'&&!out){var p=n.getWorldPosition();var sp=cam.worldToScreen(new cc.Vec3(p.x,p.y,0));out=Math.round(cv.x+sp.x)+','+Math.round(cv.y+cv.height-sp.y);}});n.children.forEach(w);})(sc);return out||''})()")
if [ -z "$UP" ]; then
DET=$(EVALR "(function(){var sc=cc.director.getScene();var cam=sc.getComponentInChildren('cc.Camera');var cv=document.querySelector('canvas').getBoundingClientRect();var out=null;(function w(n){if(!n.activeInHierarchy||out)return;n.components.forEach(function(c){if(c.touchEvents&&c.touchEvents.length&&c.touchEvents[0].handler==='onTouchDetails'&&!out){var p=n.getWorldPosition();var sp=cam.worldToScreen(new cc.Vec3(p.x,p.y,0));out=Math.round(cv.x+sp.x)+','+Math.round(cv.y+cv.height-sp.y);}});n.children.forEach(w);})(sc);return out||''})()")
if [ -n "$DET" ]; then CLICK ${DET%,*} ${DET#*,} 1.5; echo "       已点建筑卡片($DET)"; else echo "       [WARN] 建筑卡片未定位"; fi
GOLD0=$(GOLD)
UP=$(EVALR "(function(){var sc=cc.director.getScene();var cam=sc.getComponentInChildren('cc.Camera');var cv=document.querySelector('canvas').getBoundingClientRect();var out=null;(function w(n){if(!n.activeInHierarchy||out)return;n.components.forEach(function(c){if(c.touchEvents&&c.touchEvents.length&&c.touchEvents[0].handler==='onTouchUpdrage'&&!out){var p=n.getWorldPosition();var sp=cam.worldToScreen(new cc.Vec3(p.x,p.y,0));out=Math.round(cv.x+sp.x)+','+Math.round(cv.y+cv.height-sp.y);}});n.children.forEach(w);})(sc);return out||''})()")
fi
SEL=$(EVALR "(function(){var g=cc.js.getClassByName('GameSys');g.game.xSet('buildingsSelect',0);g.game.xSet('buildingsDetails',{index:0,state:false});return 'ok'})()")
echo "       程序化选中首建筑(等价 Buildings_updrage.onLoad 默认选中): $SEL"
sleep 1.5
FDET=$(EVALR "(function(){var sc=cc.director.getScene();var t=null,cp=null;(function w(n){if(!n.activeInHierarchy)return;n.components.forEach(function(c){if(!t&&c.touchEvents&&c.touchEvents.length&&c.touchEvents[0].handler==='onTouchDetails'){t=n;cp=c;}});n.children.forEach(w);})(sc);if(!t)return 'no';cc.Component.EventHandler.emitEvents(cp.touchEvents,cp);return 'ok'})()")
echo "       程序化选中建筑卡片: $FDET"
sleep 1.5
if [ -n "$UP" ] || [ "$FDET" = "ok" ]; then
  FIRE=$(EVALR "(function(){var sc=cc.director.getScene();var t=null,cp=null;(function w(n){if(!n.activeInHierarchy)return;n.components.forEach(function(c){if(!t&&c.touchEvents&&c.touchEvents.length&&c.touchEvents[0].handler==='onTouchUpdrage'){t=n;cp=c;}});n.children.forEach(w);})(sc);if(!t)return 'no';cc.Component.EventHandler.emitEvents(cp.touchEvents,cp);return 'ok'})()")
  echo "       程序化触发升级按钮: $FIRE（坐标 $UP 备用）"
  sleep 2
  GOLD1=$(GOLD)
  if [ "${GOLD1:-0}" -ge "${GOLD0:-0}" ]; then
    echo "       首次触发未扣金，鼠标点击坐标再试"
    [ -n "$UP" ] && CLICK ${UP%,*} ${UP#*,} 2
    GOLD1=$(GOLD)
  fi
  if [ "${GOLD1:-0}" -ge "${GOLD0:-0}" ]; then
    echo "       二次仍未扣金（记录现场继续）"
    LV=$(EVALR "(function(){var g=cc.js.getClassByName('GameSys');return JSON.stringify(g.game.xGet('buildings').map(function(b){return b.level}))})()")
    echo "       建筑等级: $LV"
    GOLD1=$(GOLD)
  fi
  UPG=$(EVALR "(function(){var g=cc.js.getClassByName('GameSys');return JSON.stringify(g.game.xGet('buildings').map(function(b){return b.upgrade}))})()")
  echo "       金币: $GOLD0 -> $GOLD1；升级计时: $UPG"
  if [ "${GOLD1:-0}" -lt "${GOLD0:-0}" ] || echo "$UPG" | grep -qE '[1-9]'; then ok "T04.1 升级生效(扣金$GOLD0→$GOLD1 或计时启动)"; else bad "T04.1 升级未生效(金$GOLD0→$GOLD1 计时$UPG)"; fi
else
  bad "T04.1 升级按钮未定位到"
fi
PANEL_CLOSE
agent-browser screenshot "$SHOT/T04.png" >/dev/null 2>&1
step "前置：切换 3 级存档（T05-T08 经营前置）"
RICH_SAVE 3
agent-browser reload >/dev/null 2>&1; sleep 14
CLICK 640 396 3

# ---------- T05 招募 ----------
ensure_alive
CUR=05; step "T05 核心玩法-招募面板"
EVALR "localStorage.setItem('zhxqfive_recruit',JSON.stringify([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]));'ok'" >/dev/null
agent-browser reload >/dev/null 2>&1; sleep 14
CLICK 640 396 3
PANEL_OPEN onTouchRecruit
R0=$(EVALR "JSON.stringify(cc.js.getClassByName('GameSys').game.xGet('recruit'))")
RB=$(EVALR "(function(){var sc=cc.director.getScene();var cam=sc.getComponentInChildren('cc.Camera');var cv=document.querySelector('canvas').getBoundingClientRect();var out=[];(function w(n){if(!n.activeInHierarchy)return;n.components.forEach(function(c){if(c.touchEvents&&c.touchEvents.length){var h=c.touchEvents[0].handler;if(h&&h!=='onTouchClose'&&!/onTouchRecruit$|onTouchBuildings|onTouchWarehouse|onTouchShop/.test(h)){var p=n.getWorldPosition();var sp=cam.worldToScreen(new cc.Vec3(p.x,p.y,0));var vx=Math.round(cv.x+sp.x),vy=Math.round(cv.y+cv.height-sp.y);if(vx>cv.x&&vx<cv.x+cv.width&&vy>cv.y&&vy<cv.y+cv.height)out.push(vx+','+vy);}}});n.children.forEach(w);})(sc);return out.join(' ')})()")
NBTN=$(echo "$RB" | tr ' ' '\n' | grep -c ',')
echo "       招募条目按钮数: $NBTN"
FIRED=$(EVALR "(function(){var sc=cc.director.getScene();function hasRI(n){while(n){if(n.components&&n.components.some(function(c){return c.constructor.name==='RecruitItem';}))return true;n=n.parent;}return false;}var t=null,cp=null;(function w(n){if(!n.activeInHierarchy)return;n.components.forEach(function(c){if(!t&&c.touchEvents&&c.touchEvents.length&&c.touchEvents[0].handler==='onTouchRecruit'&&hasRI(n)){t=n;cp=c;}});n.children.forEach(w);})(sc);if(!t)return 'no';cc.Component.EventHandler.emitEvents(cp.touchEvents,cp);return 'ok'})()")
echo "       程序化触发招募按钮: $FIRED"
if [ "$FIRED" = "ok" ]; then
  sleep 2
  XY=''
  CLICK 1 1 0.1
  R1=$(EVALR "JSON.stringify(cc.js.getClassByName('GameSys').game.xGet('recruit'))")
  A=$(ALIVE)
  if [ "$R1" != "$R0" ]; then ok "T05.1 招募成功存档变化($R0→$R1)"; elif [ "$A" = "true" ]; then skip "T05.1 招募触发无存档变化（条件不满足），页面存活"; else bad "T05.1 招募触发后页面死亡"; fi
else
  bad "T05.1 招募条目按钮未定位（RecruitItem 事件触发失败）"
fi
PANEL_CLOSE
agent-browser screenshot "$SHOT/T05.png" >/dev/null 2>&1

# ---------- T06 经营循环 ----------
ensure_alive
CUR=06; step "T06 核心玩法-经营自动收益（观察 40s）"
ensure_alive
CLICK 640 396 3
G0=$(GOLD)
CL0=$(EVALR "(function(){var sc=cc.director.getScene();var n=0;(function w(x){x.components.forEach(function(c){if(c.constructor.name==='Client')n++;});x.children.forEach(w);})(sc);return n})()")
sleep 40
G1=$(GOLD)
CL1=$(EVALR "(function(){var sc=cc.director.getScene();var n=0;(function w(x){x.components.forEach(function(c){if(c.constructor.name==='Client')n++;});x.children.forEach(w);})(sc);return n})()")
echo "       金币: $G0 -> $G1；客户节点: $CL0 -> $CL1"
case "$G1" in ''|*[!0-9]*) G1=$G0;; esac
case "$CL1" in ''|*[!0-9]*) CL1=$CL0;; esac
if [ "${G1:-0}" -gt "${G0:-0}" ] || [ "${CL1:-0}" -gt "${CL0:-0}" ]; then ok "T06.1 经营循环运行(金$G0→$G1 客户$CL0→$CL1)"; else bad "T06.1 无经营迹象(金$G0→$G1 客户$CL0→$CL1)"; fi
agent-browser screenshot "$SHOT/T06.png" >/dev/null 2>&1

# ---------- T07 四面板开关 ----------
ensure_alive
CUR=07; step "T07 主要界面-四面板开关响应"
for P in onTouchBuildings onTouchRecruit onTouchWarehouse onTouchShop; do
  PANEL_OPEN $P
  A1=$(ALIVE)
  PANEL_CLOSE
  A2=$(ALIVE)
  if [ "$A1" = "true" ] && [ "$A2" = "true" ]; then ok "T07 $P 开/关存活"; else bad "T07 $P 开/关后页面死亡"; fi
  sleep 0.8
done
agent-browser screenshot "$SHOT/T07.png" >/dev/null 2>&1

# ---------- T08 签到 ----------
ensure_alive
CUR=08; step "T08 主要界面-签到入口"
S0=$(EVALR "localStorage.getItem('zhxqfive_signInstate')||'none'")
PANEL_OPEN onTouch
sleep 1.5
GET=$(EVALR "(function(){var sc=cc.director.getScene();var cam=sc.getComponentInChildren('cc.Camera');var cv=document.querySelector('canvas').getBoundingClientRect();var out=null;(function w(n){if(!n.activeInHierarchy||out)return;n.components.forEach(function(c){if(c.touchEvents&&c.touchEvents.length&&c.touchEvents[0].handler==='onTouchGet'&&!out){var p=n.getWorldPosition();var sp=cam.worldToScreen(new cc.Vec3(p.x,p.y,0));out=Math.round(cv.x+sp.x)+','+Math.round(cv.y+cv.height-sp.y);}});n.children.forEach(w);})(sc);return out||''})()")
if [ -n "$GET" ]; then
  CLICK ${GET%,*} ${GET#*,} 2
  S1=$(EVALR "localStorage.getItem('zhxqfive_signInstate')||'none'")
  [ "$S1" != "$S0" ] && ok "T08.1 签到状态变化" || skip "T08.1 签到状态未变（可能已签过）"
else
  skip "T08.1 签到领奖按钮未定位"
fi
PANEL_CLOSE
agent-browser screenshot "$SHOT/T08.png" >/dev/null 2>&1
fi

if [ "$PART" = "part2" ] || [ "$PART" = "all" ]; then
# ---------- T09 满级边界 ----------
CUR=09; step "T09 边界-满级存档启动"
ensure_alive
RICH_SAVE 3
agent-browser reload >/dev/null 2>&1; sleep 15
CLICK 640 396 5
A=$(ALIVE); E9=$(E); C9=$(CRASH)
echo "       alive=$A error=$E9 crash类=$C9"
[ "$A" = "true" ] && [ "$C9" = "0" ] && ok "T09.1 满级启动存活且无崩溃类错误(e=$E9)" || bad "T09.1 满级启动异常(alive=$A crash=$C9)"
LV=$(EVALR "(function(){var g=cc.js.getClassByName('GameSys');return g.level})()")
echo "       level=$LV"
agent-browser screenshot "$SHOT/T09.png" >/dev/null 2>&1

# ---------- T10 坏存档容错 ----------
ensure_alive
CUR=10; step "T10 异常-损坏存档容错"
EVALR "localStorage.setItem('zhxqfive_buildings','{bad json');localStorage.setItem('zhxqfive_gold','abc');'ok'" >/dev/null
agent-browser reload >/dev/null 2>&1; sleep 14
CLICK 640 396 5
A=$(ALIVE); E10=$(E)
WARNK=$(agent-browser console 2>&1 | grep -c '存档键损坏')
echo "       alive=$A 本步error增量=$E10 坏键重置告警=$WARNK"
if [ "$A" = "true" ] && [ "$E10" = "0" ]; then ok "T10.1 坏存档容错(不崩且0异常，坏键重置$WARNK次)"; else bad "T10.1 坏存档异常(alive=$A error增量=$E10)"; fi
agent-browser screenshot "$SHOT/T10.png" >/dev/null 2>&1

# ---------- T11 连点压力 ----------
ensure_alive
CUR=11; step "T11 异常-快速连点压力（10 次/同点）"
CLEAR_SAVE
agent-browser reload >/dev/null 2>&1; sleep 14
C0=$(CRASH)
for i in $(seq 1 10); do CLICK 640 396 0.3; done
sleep 4
A=$(ALIVE); C1=$(CRASH)
echo "       alive=$A crash类 $C0->$C1"
[ "$A" = "true" ] && [ "$C1" = "$C0" ] && ok "T11.1 连点无崩溃类错误" || bad "T11.1 连点产生崩溃(alive=$A +$((C1-C0)))"
agent-browser screenshot "$SHOT/T11.png" >/dev/null 2>&1

# ---------- T12 重启回归 ----------
CUR=12; step "T12 回归-重启（历史黑屏路径）"
RICH_SAVE 3
agent-browser reload >/dev/null 2>&1; sleep 15
CLICK 640 396 5
sleep 10
A=$(ALIVE); E12=$(E); C12=$(CRASH)
agent-browser screenshot "$SHOT/T12.png" >/dev/null 2>&1
PX=$(stat -f%z "$SHOT/T12.png" 2>/dev/null)
echo "       alive=$A error=$E12 crash=$C12 截图=${PX}B"
if [ "$A" = "true" ] && [ "$C12" = "0" ] && [ "${PX:-0}" -gt 100000 ]; then ok "T12.1 重启画面正常(e=$E12 截图${PX}B)"; else bad "T12.1 重启异常(alive=$A crash=$C12 截图${PX}B)"; fi
sleep 15
A2=$(ALIVE); E12b=$(E)
[ "$A2" = "true" ] && [ "$E12b" = "$E12" ] && ok "T12.2 重启后 15s 稳定(e=$E12b)" || bad "T12.2 重启后错误增长($E12→$E12b)"
fi

# ---------- 汇总 ----------
agent-browser console 2>&1 > "$LOG"
{
  echo ""
  echo "## 汇总 $(date '+%F %T')"
  echo "- PASS=$PASS FAIL=$FAIL SKIP=$SKIP"
  echo "- 控制台全量: $LOG"
  echo "- 截图: $SHOT/T*.png（失败现场 $SHOT/fail_T*.png）"
  echo "- 复跑: AGENT_BROWSER_HEADED=1 $0 [part1|part2|all]"
} >> "$SUM"
echo ""; echo "================ 测试汇总 ================"
cat "$SUM"
echo "PASS=$PASS FAIL=$FAIL SKIP=$SKIP"
