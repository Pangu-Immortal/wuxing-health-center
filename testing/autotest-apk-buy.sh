#!/bin/bash
# 道具购买+成长+通关 验证（模拟器）
# 阶段1: UI 真实购买复现（仓库买抹布/商店买手纸/招募员工）——验证"道具无法购买"是否修复
# 阶段2: DebugBridge F10 独立触发全部购买+满级+解锁（通关态）
# 阶段3: F11/F9 dump 校验通关完成度；重启后持久化校验
export PATH="$PATH:$HOME/Library/Android/sdk/platform-tools"
PKG=com.wxwsy.guide
APK="$HOME/CocosProjects/五星卫生院-3x/build/android/proj/build/wuxing-hospital-3x/outputs/apk/debug/wuxing-hospital-3x-debug.apk"
REP=/tmp/buy_report.md; SHOT=/tmp/buy
mkdir -p "$SHOT"; : > "$REP"
PASS=0; FAIL=0
ok(){ PASS=$((PASS+1)); echo "[PASS] $1"; echo "- [PASS] $1" >> "$REP"; }
bad(){ FAIL=$((FAIL+1)); echo "[FAIL] $1"; echo "- [FAIL] $1" >> "$REP"; }
ALIVE(){ adb shell pidof $PKG 2>/dev/null | tr -d '\r'; }
J(){ adb logcat -d 2>/dev/null | grep "$1" | tail -"${2:-1}"; }
BOOT(){ # 启动（带 gfxstream 崩溃重试）
  for TRY in 1 2 3; do
    adb shell am force-stop $PKG
    adb logcat -c
    adb shell monkey -p $PKG -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1
    sleep 20
    [ -n "$(ALIVE)" ] && return 0
  done
  return 1
}
FG(){ adb shell dumpsys window 2>/dev/null | grep mCurrentFocus | grep -q $PKG; }

echo "[STEP] B0 安装启动"
adb install -r "$APK" >/dev/null 2>&1
adb shell pm clear $PKG >/dev/null 2>&1
BOOT && ok "B0 启动成功" || { bad "B0 三次启动均崩"; exit 1; }
# 跳过公告（竖屏 1080x2400 标定）
adb shell input tap 532 1598; sleep 4
FG || { adb shell am start -n $PKG/com.cocos.game.AppActivity >/dev/null 2>&1; sleep 5; }
# 若引导未走完，等 watchdog 走完（约 4 分钟太长；直接 F10 注入前先看状态）
adb logcat -c; adb shell input keyevent 141; sleep 2
echo "  初始状态: $(J 'DBG-STATE')"
echo "  初始状态: $(J 'DBG-STATE')" >> "$REP"

echo "[STEP] B1 UI 真实购买复现（仓库道具1 抹布 15金）"
# 开仓库面板：主场景仓库按钮（dump 定位）
adb logcat -c; adb shell input keyevent 141; sleep 1.5
WH=$(adb logcat -d | grep 'TD-NODE' | grep 'button_warehouse' | tail -1 | grep -oE 'rect=\[[^]]*\]' | tr -d 'rect=[]')
if [ -n "$WH" ]; then
  IFS=',' read -r X1 Y1 X2 Y2 <<< "$WH"
  SX=$(awk -v x="$(((X1+X2)/2))" 'BEGIN{printf "%d",(x+375)*1.44}')
  SY=$(awk -v y="$(((Y1+Y2)/2))" 'BEGIN{printf "%d",(667-y)*1.44}')
  adb shell input tap $SX $SY; sleep 4
  # 仓库面板内第一个购买按钮（buy 节点）
  adb logcat -c; adb shell input keyevent 141; sleep 1.5
  BUY=$(adb logcat -d | grep 'TD-NODE' | grep -E 'buy' | head -1 | grep -oE 'rect=\[[^]]*\]' | tr -d 'rect=[]')
  if [ -n "$BUY" ]; then
    IFS=',' read -r X1 Y1 X2 Y2 <<< "$BUY"
    SX=$(awk -v x="$(((X1+X2)/2))" 'BEGIN{printf "%d",(x+375)*1.44}')
    SY=$(awk -v y="$(((Y1+Y2)/2))" 'BEGIN{printf "%d",(667-y)*1.44}')
    adb logcat -c
    adb shell input tap $SX $SY; sleep 3
    WLOG=$(J 'JS: 仓库')
    if echo "$WLOG" | grep -qE '\[.*[0-9]'; then ok "B1 UI 购买仓库道具触发落盘($WLOG)"; else bad "B1 UI 购买无落盘日志"; fi
  else
    bad "B1 仓库面板未 dump 到购买按钮"
  fi
  adb shell input keyevent KEYCODE_BACK; sleep 2
else
  bad "B1 主场景未 dump 到仓库按钮"
fi

echo "[STEP] B2 DebugBridge F10 独立触发全部购买+成长+通关"
FG || { adb shell am start -n $PKG/com.cocos.game.AppActivity >/dev/null 2>&1; sleep 5; }
adb logcat -c
adb shell input keyevent 140
sleep 6
BUYEND=$(J 'DBG-BUYALL-END')
ERR=$(J 'DBG-BUY-ERR')
if [ -n "$BUYEND" ]; then ok "B2 注入完成($BUYEND)"; else bad "B2 注入未完成 err=$ERR"; fi
AFTER=$(J 'DBG-AFTER-BUY')
echo "  注入后: $AFTER"
echo "  注入后: $AFTER" >> "$REP"

echo "[STEP] B3 通关校验（F9）"
adb logcat -c; adb shell input keyevent 139; sleep 2
DONE=$(J 'DBG-DONE')
echo "  通关态: $DONE"
echo "$DONE" | grep -oE 'wh=[0-9]+/[0-9]+' | grep -qE 'wh=44/44' && ok "B3 道具 44/44" || bad "B3 道具未满($DONE)"
echo "$DONE" | grep -oE 'shopFull=[0-9]+/[0-9]+' | grep -qE 'shopFull=88/88' && ok "B3 商品购满 88/88" || bad "B3 商品未满($DONE)"
echo "$DONE" | grep -oE 'recruit=[0-9]+/[0-9]+' | grep -qE 'recruit=132/132' && ok "B3 员工 132/132" || bad "B3 员工未满($DONE)"
echo "$DONE" | grep -qE 'level=38/38' && ok "B3 等级满 38/38" || bad "B3 等级未满($DONE)"
echo "$DONE" | grep -qE 'lock=10/10' && ok "B3 房间全解锁 10/10" || bad "B3 房间未满($DONE)"

echo "[STEP] B4 持久化校验（重启后状态保留）"
BOOT
sleep 4
adb logcat -c; adb shell input keyevent 141; sleep 2
PERSIST=$(J 'DBG-STATE')
echo "  重启后: $PERSIST"
echo "$PERSIST" | grep -qE 'wh=44/44' && ok "B4 道具持久化" || bad "B4 道具未持久化($PERSIST)"
echo "$PERSIST" | grep -qE 'level=38/38' && ok "B4 等级持久化" || bad "B4 等级未持久化($PERSIST)"
adb exec-out screencap -p > "$SHOT/final.png" 2>/dev/null

echo "[STEP] B5 全程日志健康"
JSERR=$(adb logcat -d 2>/dev/null | grep -cE 'Uncaught Exception|JS:.*TypeError')
echo "- 日志: Uncaught/TypeError=$JSERR" >> "$REP"
{
  echo ""
  echo "## 购买+成长+通关验证汇总 $(date '+%F %T')"
  echo "- PASS=$PASS FAIL=$FAIL"
  echo "- 截图: $SHOT/final.png"
} >> "$REP"
echo ""; echo "======== 汇总 ========"; cat "$REP"; echo "PASS=$PASS FAIL=$FAIL"
