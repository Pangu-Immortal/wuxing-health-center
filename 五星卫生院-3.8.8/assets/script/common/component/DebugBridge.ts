import { Component, EventKeyboard, Input, KeyCode, _decorator, input } from 'cc';
const { ccclass } = _decorator;

import { APPEARANCE, BUILDINGS, Config, LEVELLOCK, LOCK_ROOM, RECRUIT, SHOP, WAREHOUSE } from "../manager/Config";
import GameSys from "../manager/GameSys";
import Caches from "../manager/Caches";
import StaticManager from "../manager/StaticManager";

/**
 * DebugBridge —— adb 驱动的购买/成长/通关注入桥（测试专用，随 debug APK）
 * keyevent（Android KEYCODE_F8=138 / F9=139 / F10=140 / F11=141，引擎 AndroidKeyCodes 已映射 F1~F12）：
 *   F11(141) = [DBG-STATE] 全状态 dump（金币/等级/道具/商品/员工/建筑/外观/房间）
 *   F10(140) = [DBG-BUYALL] 独立触发全部购买+成长+通关（走游戏自身 xSet 落盘链路）
 *   F9(139)  = [DBG-DONE] 通关校验汇总
 * 所有写操作均通过与 UI 购买按钮相同的 xSet(Config.*) 事件链完成（change_warehouse/
 * change_Shop/change_recruitState/change_buildings/change_lock），并经 Caches 落盘。
 */
@ccclass('DebugBridge')
export default class DebugBridge extends Component
{
    protected onEnable()
    {
        input.on(Input.EventType.KEY_DOWN, this._onKey, this);
        console.log('[DBG-REG] DebugBridge 已挂载');
    }
    protected onDisable()
    {
        input.off(Input.EventType.KEY_DOWN, this._onKey, this);
    }
    private _onKey(e: EventKeyboard)
    {
        console.log('[DBG-KEY] code=' + e.keyCode);
        if (e.keyCode === KeyCode.F11) this.state('STATE');
        else if (e.keyCode === KeyCode.F10) this.buyAll();
        else if (e.keyCode === KeyCode.F9) this.state('DONE');
        else if (e.keyCode === KeyCode.F8) this.goldOnly();
    }

    /** F8：仅注金币+标记引导完成（不代购），供 UI 真实购买测试 */
    goldOnly()
    {
        try
        {
            Caches.set(Caches.newGuide, true);
            GameSys.gold(999999999);
            console.log('[DBG-GOLDONLY] gold=' + GameSys.game.xGet(Config.GOLD).v + ' level=' + GameSys.level);
        } catch (e) { console.log('[DBG-GOLDONLY-ERR] ' + (e as any).message); }
    }

    private counts()
    {
        const g: any = GameSys.game;
        const wh: number[] = g.xGet(Config.WAREHOUSE) || [];
        const shop: any[] = g.xGet(Config.SHOP) || [];
        const rec: number[] = g.xGet(Config.RECRUIT) || [];
        const bld: any[] = g.xGet(Config.BUILDINGS) || [];
        const app: any[] = g.xGet(Config.APPEARANCE) || [];
        const lock: boolean[] = g.xGet(Config.LOCKROOM) || [];
        const shopFull = shop.filter((s, i) => s && SHOP[i] && s.count >= SHOP[i].overlay).length;
        const shopCount = shop.reduce((a, s) => a + (s ? (s.count | 0) : 0), 0);
        const recHired = rec.filter(v => v === 1).length;
        const appA = app.filter((a, i) => i < APPEARANCE.length && a && a.geta).length;
        const appS = app.filter((a, i) => i < APPEARANCE.length && a && a.gets).length;
        const lockOpen = lock.filter(v => v).length;
        return { wh, shop, rec, bld, app, lock, shopFull, shopCount, recHired, appA, appS, lockOpen };
    }

    state(tag: string)
    {
        try
        {
            const c = this.counts();
            const gold = GameSys.game.xGet(Config.GOLD);
            const bLevels = c.bld.map(b => b ? b.level : -1).join(',');
            console.log(`[DBG-${tag}] gold=${gold ? gold.v : -1} level=${GameSys.level}/${LEVELLOCK.length - 1}`
                + ` wh=${c.wh.length}/${WAREHOUSE.length} shopFull=${c.shopFull}/${SHOP.length} shopCount=${c.shopCount}`
                + ` recruit=${c.recHired}/${RECRUIT.length} bld=[${bLevels}]`
                + ` appA=${c.appA}/${APPEARANCE.length} appS=${c.appS}/${APPEARANCE.length}`
                + ` lock=${c.lockOpen}/${c.lock.length} guide=${Caches.get(Caches.newGuide) ? 1 : 0}`);
        } catch (e) { console.log('[DBG-STATE-ERR] ' + (e as any).message); }
    }

    buyAll()
    {
        try
        {
            const g: any = GameSys.game;
            // 0) 标记引导完成，避免引导拦截 UI/事件
            Caches.set(Caches.newGuide, true);
            // 1) 金币注满（走 GameSys.gold → xSet(GOLD) → HeadInfo.change_lvl 同步升级链到满级）
            GameSys.gold(999999999);
            console.log('[DBG-BUY] gold+level done level=' + GameSys.level);
            // 2) 全部道具（仓库 44 件）：走 change_warehouse 落盘链
            const wh: number[] = g.xGet(Config.WAREHOUSE) || [];
            for (let i = 0; i < WAREHOUSE.length; i++)
            {
                const id = WAREHOUSE[i].ID - 1;
                if (wh.indexOf(id) === -1) g.xSet(Config.WAREHOUSECHNAGE, id);
            }
            console.log('[DBG-BUY] warehouse done ' + (g.xGet(Config.WAREHOUSE) || []).length + '/' + WAREHOUSE.length);
            // 3) 全部商品购满（走 change_Shop 落盘链，count=overlay 上限）
            for (let i = 0; i < SHOP.length; i++)
            {
                g.xSet(Config.SHOPCHANGE, { ID: i, count: SHOP[i].overlay });
            }
            console.log('[DBG-BUY] shop done ' + SHOP.length);
            // 4) 全员招募（走 change_recruitState 落盘链）
            for (let i = 0; i < RECRUIT.length; i++)
            {
                g.xSet(Config.RECRUITCHANGE, { index: i, state: 1 });
            }
            console.log('[DBG-BUY] recruit done ' + RECRUIT.length);
            // 5) 全部建筑升至各自满级（走 change_buildings 落盘链）
            const maxLv: number[] = [];
            for (let i = 0; i < 12; i++) maxLv[i] = 0;
            for (const b of BUILDINGS)
            {
                const idx = (b as any).index | 0;
                if (idx >= 0 && idx < 12 && b.level > maxLv[idx]) maxLv[idx] = b.level;
            }
            for (let i = 0; i < 12; i++)
            {
                g.xSet(Config.BUILDINGSCHANGE, { index: i, level: maxLv[i], dirty: 0, upgrade: 0 });
            }
            console.log('[DBG-BUY] buildings done [' + maxLv.join(',') + ']');
            // 6) 全部外观解锁（geta/gets 置 true 并落盘）
            const app: any[] = g.xGet(Config.APPEARANCE) || [];
            for (let i = 0; i < APPEARANCE.length && i < app.length; i++)
            {
                app[i].geta = true; app[i].gets = true;
            }
            g.xSet(Config.APPEARANCE, app);
            Caches.set(Caches.appearance, app);
            console.log('[DBG-BUY] appearance done ' + APPEARANCE.length);
            // 7) 全部房间解锁（走 change_lock 落盘链 + open_buildings 同步）
            const lock: boolean[] = g.xGet(Config.LOCKROOM) || [];
            for (let i = 0; i < lock.length; i++)
            {
                g.xSet(Config.LOCKROOMCHANGE, { index: i, state: true });
            }
            const sm = StaticManager.getInstance();
            for (let i = 0; i < LOCK_ROOM.length; i++)
            {
                if (sm.open_buildings.indexOf(i) === -1) sm.open_buildings.push(i);
            }
            console.log('[DBG-BUY] rooms done ' + lock.length);
            // 8) 等级落盘
            Caches.set(Caches.level, GameSys.level);
            g.xSet(Config.TIP, '已全部购买并完成通关成长');
            console.log('[DBG-BUYALL-END] ok');
            this.state('AFTER-BUY');
        } catch (e)
        {
            console.log('[DBG-BUY-ERR] ' + ((e as any).message || e) + '\n' + ((e as any).stack || ''));
        }
    }
}
