#!/bin/bash
# 五星卫生院 APK 全控件 adb 点击遍历 + 全程日志监控（模拟器/真机通用）
# 依赖：APK 内含 TouchDump 埋点（F12=143 dump 控件、F11=142 dump 视图、触点 [TD-TOUCH]）
# 用法: ./autotest-apk-sweep.sh [max_nodes_per_state] [monkey_events]
# 产出: /tmp/sweep_report.md /tmp/sweep_logcat.log /tmp/sweep/*.png
export PATH="$PATH:$HOME/Library/Android/sdk/platform-tools"
PKG=com.wxwsy.guide
MAXN=${1:-40}
MONKEY=${2:-800}
SHOT=/tmp/sweep; LOG=/tmp/sweep_logcat.log; REP=/tmp/sweep_report.md
mkdir -p "$SHOT"; : > "$REP"
PASS=0; NORESP=0; MISS=0; CRASH=0; WHITE=0; SKIP=0
SCRW=$(adb shell wm size 2>/dev/null | grep -oE '[0-9]+x[0-9]+' | tail -1 | cut -dx -f1)
SCRH=$(adb shell wm size 2>/dev/null | grep -oE '[0-9]+x[0-9]+' | tail -1 | cut -dx -f2)
# 通用映射：读 TD-STATE 的 visible（适配 SHOW_ALL/FIX_HEIGHT 任一策略）
# sx=(wx+VW/2)*SCALE ; sy=(VH/2-wy)*SCALE ; SCALE=SCRW/VW
REFRESH_MAP(){
  local VS=$(adb logcat -d 2>/dev/null | grep -o 'visible=[0-9]*x[0-9]*' | tail -1 | cut -d= -f2)
  VW=$(echo "$VS" | cut -dx -f1); VH=$(echo "$VS" | cut -dx -f2)
  [ -z "$VW" ] && VW=750; [ -z "$VH" ] && VH=1334
  SCALE=$(awk -v w="$SCRW" -v vw="$VW" 'BEGIN{printf "%.6f", w/vw}')
  echo "[INFO] visible=${VW}x${VH} scale=$SCALE screen=${SCRW}x${SCRH}"
}
ok(){ PASS=$((PASS+1)); echo "[PASS] $1"; echo "- [PASS] $1" >> "$REP"; }
nresp(){ NORESP=$((NORESP+1)); echo "[NORESP] $1"; echo "- [NORESP] $1" >> "$REP"; }
miss(){ MISS=$((MISS+1)); echo "[MISS] $1"; echo "- [MISS] $1" >> "$REP"; }
crash(){ CRASH=$((CRASH+1)); echo "[CRASH] $1"; echo "- [CRASH] $1" >> "$REP"; }
white(){ WHITE=$((WHITE+1)); echo "[WHITE] $1"; echo "- [WHITE] $1" >> "$REP"; }
skip(){ SKIP=$((SKIP+1)); echo "[SKIP] $1"; echo "- [SKIP] $1" >> "$REP"; }
ALIVE(){ adb shell pidof $PKG 2>/dev/null | tr -d '\r'; }
DUMP(){ adb logcat -c; adb shell input keyevent 141; sleep 1.2; adb logcat -d 2>/dev/null | grep -E 'TD-NODE' | grep -oE 'i=[0-9]+ name=[^ ]+ rect=\[[^]]*\]'; }
STATE(){ adb logcat -d 2>/dev/null | grep 'TD-NODE' | grep -oE 'name=[^ ]+' | sort | md5 -q 2>/dev/null || adb logcat -d 2>/dev/null | grep -c 'TD-NODE'; }
WSHOT(){ adb exec-out screencap -p > "$1" 2>/dev/null; }
WCHK(){ # 白屏/黑屏检测：返回 white|black|ok
  /Users/qihao/.workbuddy/binaries/python/envs/default/bin/python - "$1" << 'PYEOF'
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('L'); px=list(im.getdata())
n=len(px); m=sum(px)/n
if m>245: print('white')
elif m<8: print('black')
else: print('ok')
PYEOF
}
TAPW(){ # 世界坐标中心 → 屏幕 tap（通用：visible 中心对齐）
  SX=$(awk -v x="$1" -v vw="$VW" -v s="$SCALE" 'BEGIN{printf "%d", (x+vw/2)*s}')
  SY=$(awk -v y="$2" -v vh="$VH" -v s="$SCALE" 'BEGIN{printf "%d", (vh/2-y)*s}')
  [ -n "$SX" ] && [ -n "$SY" ] && adb shell input tap "$SX" "$SY" || echo "  [WARN] TAPW 参数无效($1,$2)"
}
ENSURE_FG(){ # 确保游戏在前台（monkey/系统弹窗会抢焦点）
  local F=$(adb shell dumpsys window 2>/dev/null | grep mCurrentFocus | head -1)
  if ! echo "$F" | grep -q "$PKG"; then
    adb shell input keyevent KEYCODE_BACK >/dev/null 2>&1
    adb shell am start -n $PKG/com.cocos.game.AppActivity >/dev/null 2>&1
    sleep 4
  fi
}

echo "[INFO] 启动 logcat 全量监控"
adb logcat -c
( adb logcat -v time > "$LOG" 2>/dev/null ) &
LPID=$!
trap "kill $LPID 2>/dev/null" EXIT

echo "[STEP] S0 安装启动"
adb install -r "$HOME/CocosProjects/五星卫生院-3x/build/android/proj/build/wuxing-hospital-3x/outputs/apk/debug/wuxing-hospital-3x-debug.apk" >/dev/null 2>&1
BOOTED=0
for TRY in 1 2 3; do
  adb shell am force-stop $PKG
  adb shell monkey -p $PKG -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1
  sleep 20
  if [ -n "$(ALIVE)" ]; then BOOTED=1; echo "[INFO] 第 $TRY 次启动成功"; break; fi
  echo "[WARN] 第 $TRY 次启动进程死亡（模拟器 gfxstream 概率性 SIGSEGV），重试"
  sleep 3
done
[ "$BOOTED" = "1" ] || { crash "S0 三次启动均崩（见 /tmp/sweep_logcat.log Fatal signal 堆栈）"; cat "$REP"; exit 1; }
ok "S0 进程存活"
adb logcat -c; adb shell input keyevent 141; sleep 1.2; REFRESH_MAP
WSHOT "$SHOT/s0.png"; W=$(WCHK "$SHOT/s0.png")
[ "$W" = "ok" ] && ok "S0 画面非白非黑" || white "S0 启动画面异常($W)"

echo "[STEP] S1 主场景控件遍历（多轮，覆盖弹窗开关后的新控件）"
for ROUND in 1 2 3; do
  echo "  --- 第 $ROUND 轮 ---"
  ENSURE_FG
  [ -z "$(ALIVE)" ] && { echo "  进程死亡，重启"; adb shell monkey -p $PKG -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1; sleep 18; }
  NODES=$(DUMP)
  REFRESH_MAP
  HALF=$((VW/2)); VHALF=$((VH/2))
  NODES=$(echo "$NODES" | awk -v h="$HALF" -v vh="$VHALF" '{
    match($0,/rect=\[[-0-9]+,[-0-9]+,[-0-9]+,[-0-9]+\]/);
    if (RSTART==0) next;
    r=substr($0,RSTART+6,RLENGTH-7); split(r,a,",");
    cx=(a[1]+a[3])/2; cy=(a[2]+a[4])/2;
    if (cx>=-h && cx<=h && cy>=-vh && cy<=vh) print $0;
  }')
  CNT=$(echo "$NODES" | grep -c 'i=')
  echo "  dump 可视区控件 $CNT 个（visible宽=$VW）"
  [ "$CNT" -eq 0 ] && { echo "  无控件，等待重试"; sleep 6; continue; }
  echo "$NODES" | head -"$MAXN" > /tmp/sweep_nodes.txt
  while IFS= read -r LINE <&3; do
    NAME=$(echo "$LINE" | sed -n 's/.*name=\([^ ]*\) rect=.*/\1/p')
    RECT=$(echo "$LINE" | sed -n 's/.*rect=\[\([^]]*\)\].*/\1/p')
    X1=$(echo "$RECT" | cut -d, -f1); Y1=$(echo "$RECT" | cut -d, -f2)
    X2=$(echo "$RECT" | cut -d, -f3); Y2=$(echo "$RECT" | cut -d, -f4)
    CX=$(( (X1+X2)/2 )); CY=$(( (Y1+Y2)/2 ))
    [ -z "$(ALIVE)" ] && { echo "  进程死亡，重启"; adb shell monkey -p $PKG -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1; sleep 18; ENSURE_FG; }
    BEFORE=$(DUMP | md5 -q 2>/dev/null)
    adb logcat -c
    TAPW "$CX" "$CY"
    sleep 2.2
    TL=$(adb logcat -d 2>/dev/null | grep 'TD-TOUCH' | tail -1)
    HIT=$(echo "$TL" | sed -n 's/.*hit=//p')
    ERR=$(adb logcat -d 2>/dev/null | grep -cE 'Uncaught Exception|JS:.*TypeError|JS:.*Error')
    WSHOT "$SHOT/tap_r${ROUND}_$(echo "$NAME" | tr '/ ' '__' | cut -c1-40).png"
    WC=$(WCHK "$SHOT/tap_r${ROUND}_$(echo "$NAME" | tr '/ ' '__' | cut -c1-40).png")
    AFTER=$(DUMP | md5 -q 2>/dev/null)
    CHG=$([ "$BEFORE" != "$AFTER" ] && echo yes || echo no)
    if [ -z "$(ALIVE)" ]; then
      crash "$NAME 点击后进程死亡"
    elif [ "$WC" != "ok" ]; then
      white "$NAME 点击后画面异常($WC)"
    elif [ -z "$TL" ]; then
      skip "$NAME 触点未被任何节点拾取（控件可能被遮挡/隐藏，rect=[$RECT]）"
    elif [ "$HIT" = "NONE" ]; then
      miss "$NAME 触点落空(hit=NONE rect=[$RECT])"
    elif [ "$CHG" = "yes" ]; then
      ok "$NAME 命中且状态变化(hit=$HIT)"
    elif [ "${ERR:-0}" -gt 0 ]; then
      nresp "$NAME 命中但抛错(err=$ERR hit=$HIT)"
    else
      nresp "$NAME 命中无状态变化(hit=$HIT，可能为纯展示控件)"
    fi
    adb shell input keyevent KEYCODE_BACK >/dev/null 2>&1
    sleep 0.8
    ENSURE_FG
  done 3< /tmp/sweep_nodes.txt
done
PASS=$(grep -c '^\- \[PASS\]' "$REP"); NORESP=$(grep -c '^\- \[NORESP\]' "$REP"); MISS=$(grep -c '^\- \[MISS\]' "$REP"); CRASH=$(grep -c '^\- \[CRASH\]' "$REP"); WHITE=$(grep -c '^\- \[WHITE\]' "$REP"); SKIP=$(grep -c '^\- \[SKIP\]' "$REP")

echo "[STEP] S2 monkey 随机压力 $MONKEY 事件"
adb logcat -c
adb shell monkey -p $PKG --throttle 120 --ignore-crashes --ignore-timeouts -v $MONKEY > /tmp/sweep_monkey.log 2>&1
sleep 5
# monkey 随机事件可能打开系统页（如 Play 商店"核对信息"），回前台再判定画面
adb shell input keyevent KEYCODE_BACK >/dev/null 2>&1
sleep 1
adb shell input keyevent KEYCODE_BACK >/dev/null 2>&1
sleep 1
ENSURE_FG
sleep 3
[ -n "$(ALIVE)" ] && ok "S2 monkey 后进程存活" || crash "S2 monkey 后进程死亡"
WSHOT "$SHOT/monkey.png"; WM=$(WCHK "$SHOT/monkey.png")
[ "$WM" = "ok" ] && ok "S2 monkey 后画面正常" || white "S2 monkey 后画面异常($WM)"

echo "[STEP] S3 日志错误汇总"
JSE=$(grep -cE 'JS:.*(Error|TypeError|ReferenceError)' "$LOG")
EC=$(grep -c 'E Cocos' "$LOG")
FATAL=$(grep -c 'Fatal signal' "$LOG")
ANR=$(grep -c 'ANR in' "$LOG")
echo "- 日志统计: JS异常=$JSE E_Cocos=$EC Fatal=$FATAL ANR=$ANR" >> "$REP"
{
  echo ""
  echo "## 全控件遍历汇总 $(date '+%F %T')"
  echo "- PASS=$PASS NORESP=$NORESP MISS=$MISS CRASH=$CRASH WHITE=$WHITE SKIP=$SKIP"
  echo "- logcat: $LOG；monkey: /tmp/sweep_monkey.log；截图: $SHOT/"
} >> "$REP"
echo ""; echo "======== 汇总 ========"; cat "$REP"
