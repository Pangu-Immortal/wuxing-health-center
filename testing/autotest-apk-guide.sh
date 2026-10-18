#!/bin/bash
# 五星卫生院 APK 新手引导自动走完（模拟器，竖屏 FIX_HEIGHT 坐标系）
# 坐标换算（实测标定 1080x2400）：scale=screenH/1334=1.7991，canvas 满屏无黑边
#   sx = wx*scale ; sy = (1334-wy)*scale
# 可用 GUIDE_SCALE 覆盖（不同分辨率机型按 screenH/1334 传入）
export PATH="$PATH:$HOME/Library/Android/sdk/platform-tools"
SUM=/tmp/gd_summary.md
SHOT=/tmp/gd
mkdir -p "$SHOT"
: > "$SUM"
PASS=0; FAIL=0; SKIP=0
ok(){ PASS=$((PASS+1)); echo "[PASS] $1"; echo "- [PASS] $1" >> "$SUM"; }
bad(){ FAIL=$((FAIL+1)); echo "[FAIL] $1"; echo "- [FAIL] $1" >> "$SUM"; }
skip(){ SKIP=$((SKIP+1)); echo "[SKIP] $1"; echo "- [SKIP] $1" >> "$SUM"; }
STEP(){ adb logcat -d 2>/dev/null | grep -oE '\[NewGuide\] step [0-9]+' | tail -1 | grep -oE '[0-9]+'; }
DBGLINE(){ adb logcat -d 2>/dev/null | grep "GUIDE-DBG] step=$1 " | tail -1; }
SCRW=$(adb shell wm size 2>/dev/null | grep -oE '[0-9]+x[0-9]+' | tail -1 | cut -dx -f1)
REFRESH_MAP(){
  local VS=$(adb logcat -d 2>/dev/null | grep -o 'visible=[0-9]*x[0-9]*' | tail -1 | cut -d= -f2)
  VW=$(echo "$VS" | cut -dx -f1); VH=$(echo "$VS" | cut -dx -f2)
  [ -z "$VW" ] && VW=750; [ -z "$VH" ] && VH=1334
  SCALE=$(awk -v w="$SCRW" -v vw="$VW" 'BEGIN{printf "%.6f", w/vw}')
}
REFRESH_MAP
TAPW(){ # 世界坐标中心 → 屏幕 tap（通用：visible 中心对齐）
  SX=$(awk -v x="$1" -v vw="$VW" -v s="$SCALE" 'BEGIN{printf "%d", (x+vw/2)*s}')
  SY=$(awk -v y="$2" -v vh="$VH" -v s="$SCALE" 'BEGIN{printf "%d", (vh/2-y)*s}')
  adb shell input tap "$SX" "$SY"
}
echo "[INFO] 引导自动走完开始 $(date '+%T')"
LAST=-1; STUCK=0
for i in $(seq 1 60); do
  S=$(STEP)
  [ -z "$S" ] && { echo "       无引导日志，等待"; sleep 5; continue; }
  if [ "$S" -ge 32 ]; then ok "引导完成 step=$S"; break; fi
  if [ "$S" = "$LAST" ]; then STUCK=$((STUCK+1)); else STUCK=0; LAST=$S; fi
  LINE=$(DBGLINE "$S")
  if echo "$LINE" | grep -q 'worldRect'; then
    WR=$(echo "$LINE" | grep -oE 'worldRect=\[[^]]*\]' | tr -d 'worldRect=[]')
    IFS=',' read -r X1 Y1 X2 Y2 <<< "$WR"
    CX=$(( (X1+X2)/2 )); CY=$(( (Y1+Y2)/2 ))
    echo "       step=$S 真实控件 worldRect=[$WR] → tap 世界中心($CX,$CY)"
    TAPW "$CX" "$CY"
    sleep 3
  else
    echo "       step=$S 无真实控件（引导自身按钮/自动步骤），等 watchdog"
    sleep 9
  fi
  S2=$(STEP)
  if [ "${S2:-$S}" -gt "$S" ]; then
    ok "step $S → $S2 推进"
  elif [ "$STUCK" -ge 3 ]; then
    skip "step=$S 三次未推进（watchdog 应兜底），继续观察"
    STUCK=0
  fi
  adb exec-out screencap -p > "$SHOT/walk_s$S.png" 2>/dev/null
done
DONE=$(adb logcat -d 2>/dev/null | grep -cE '新手结束|guide-done')
[ "$DONE" -ge 1 ] && ok "引导完成埋点出现（新手结束/guide-done，原生模式 GameLog 仅缓冲故以 console 为准）" || bad "无引导完成埋点"
adb exec-out screencap -p > "$SHOT/walk_final.png" 2>/dev/null
{
  echo ""
  echo "## 引导走完汇总 $(date '+%F %T')"
  echo "- PASS=$PASS FAIL=$FAIL SKIP=$SKIP"
  echo "- 截图: $SHOT/walk_*.png"
} >> "$SUM"
echo ""; echo "======== 汇总 ========"; cat "$SUM"
