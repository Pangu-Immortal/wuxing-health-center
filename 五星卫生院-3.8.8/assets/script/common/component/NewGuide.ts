import { getNodeWidth, getNodeHeight, setNodeWidth, setNodeHeight } from '../NodeCompat';
import { Component, Input, Label, Node, Rect, UITransform, Vec2, Vec3, _decorator, director, input, tween, v2, v3, view } from 'cc';
const { ccclass, property } = _decorator;

import Shop from "../../panel/Shop";
import Caches from "../manager/Caches";
import { Config, PopupPath } from "../manager/Config";
import GameSys from "../manager/GameSys";
import PopupManager, { PopupCacheMode, PopupShowPriority } from "../manager/PopupManager";
import TouchBlocker from "../manager/TouchBlocker";
import { GameLog } from '../GameLogPanel';
import HollowOut from "./effects/HollowOut";

let BINDER_NAME: string = 'newGuide'

interface In_Info
{
    hand: Vec3,
    lab: string,
    pos: Vec3,
    width: number,
    height: number
}
@ccclass('NewGuide')
export default class NewGuide extends Component
{
    @property(Node)
    xuankuang: Node = null;
    @property(Node)
    client: Node = null;
    @property(Node)
    hand: Node = null;

    @property(HollowOut)
    private hollowOut: HollowOut = null;

    @property(TouchBlocker)
    private touchBlocker: TouchBlocker = null;

    @property(Node)
    private startBtn: Node = null;
    @property(Node)
    private startBtn_1: Node = null;

    @property(Node)
    private oneBtn: Node = null;

    @property(Node)
    private twoBtn: Node = null;

    @property(Node)
    private threeBtn: Node = null;

    @property(Node)
    private fourBtn: Node = null;

    @property(Node)
    private fiveBtn: Node = null;

    @property(Node)
    private sixBtn: Node = null;
    @property(Node)
    private sevenBtn_1: Node = null;

    @property(Node)
    private sevenBtn: Node = null;


    @property(Node)
    private eightBtn: Node = null;
    @property(Node)
    nineBtn: Node = null;
    @property(Node)
    tenBtn: Node = null;
    @property(Node)
    shiyiBtn: Node = null;
    @property(Node)
    shierBtn: Node = null;
    @property(Node)
    shisanBtn: Node = null;
    @property(Node)
    shisiBtn: Node = null;
    @property(Node)
    shiwuBtn: Node = null;
    @property(Node)
    shiliuBtn: Node = null;
    @property(Node)
    shiqiBtn: Node = null;
    @property(Node)
    shibaBtn: Node = null;
    @property(Node)
    shijiu: Node = null;
    @property(Node)
    ershi: Node = null;
    @property(Node)
    eryi: Node = null;
    @property(Node)
    erer: Node = null;
    @property(Node)
    ersan: Node = null;
    @property(Node)
    ersi: Node = null;
    @property(Node)
    erwu: Node = null;
    @property(Node)
    erliu: Node = null;
    @property(Node)
    erqi: Node = null;
    @property(Node)
    erba: Node = null;
    @property(Node)
    erjiu: Node = null;
    @property(Node)
    sanshi: Node = null;
    @property(Node)
    sanyi: Node = null;
    @property(Node)
    saner: Node = null;
    protected onLoad()
    {

    }

    onEnable()
    {
        // this.startBtn.on('touchend', this.onStartBtnClick, this);
        // this.startBtn_1.on('touchend', this.onOneBtnClick, this);
        // // this.twoBtn.on('touchend', this.onTwoBtnClick, this);
        // this.threeBtn.on('touchend', this.onThreeBtnClick, this);
        // this.fourBtn.on('touchend', this.onFourBtnClick, this);
        this.fiveBtn.on('touch-end', this.onTouch5, this);
        this.nineBtn.on('touch-end', this.onTouch9, this);
        // this.sixBtn_1.on('touchend', this.onSixBtnClick, this);
        // this.sevenBtn.on('touchend', this.onSevenBtnClick, this);
        // this.eightBtn.on('touchend', this.onEightBtnClick, this);
        // this.nineBtn.on('touchend', this.onNineBtnClick, this);
        this.threeBtn.on('touch-end', this.onTouchThree, this)
        this.fourBtn.on('touch-end', this.onTouchFour, this)
        this.sevenBtn_1.on('touch-end', this.onTouchSeven, this)
        this.eightBtn.on('touch-end', this.onTouch8, this)
        GameSys.game.xSet(Config.NEWGUIDECON, 0)
        this.node.zIndex = 50;
        // 2026-10-17 修复（现象三）：xBind 前先解绑同 tag，防 onEnable 重入造成 continue 双绑
        GameSys.game.xUnbind(BINDER_NAME);
        GameSys.game.xBind(Config.NEWGUIDECON, this.continue.bind(this), BINDER_NAME)
        // 3.8.8 内核适配：启动引导初始展示与看门狗（cachujixu 原无调用方）
        this.cachujixu(0)
        // 2026-10-16 引导坐标排查埋点：全局触点日志（UI 坐标 + 是否落在当前引导目标内）
        input.on(Input.EventType.TOUCH_START, this._dbgTouch, this);
    }
    onDisable()
    {
        GameSys.game.xUnbind(BINDER_NAME);
        this.unschedule(this.guideWatchdog);
        this.unschedule(this._alignTick);
        this._alignPending = null;
        input.off(Input.EventType.TOUCH_START, this._dbgTouch, this);
    }
    // ---- 引导坐标排查埋点（APK 内可复现，logcat 过滤 GUIDE-DBG / GUIDE-TOUCH）----
    private _dbgTarget: Node | null = null;
    private _dbgStep: number = -1;
    private _dbgTouch(ev: any)
    {
        try
        {
            const ui = ev.getUILocation() as Vec2;
            const t = this._dbgTarget;
            let inTarget = false; let tRect: string = 'none';
            if (t && t.activeInHierarchy)
            {
                const r = (t.getComponent(UITransform) || t.parent?.getComponent(UITransform))
                    ? (t.getComponent(UITransform) ? t.getComponent(UITransform).getBoundingBoxToWorld() : null)
                    : null;
                if (r) { tRect = `[${r.xMin.toFixed(0)},${r.yMin.toFixed(0)},${r.xMax.toFixed(0)},${r.yMax.toFixed(0)}]`; inTarget = r.contains(new Vec2(ui.x, ui.y)); }
            }
            console.log(`[GUIDE-TOUCH] step=${this._dbgStep} ui=(${ui.x.toFixed(0)},${ui.y.toFixed(0)}) targetRect=${tRect} hit=${inTarget}`);
        } catch (e) { /* ignore */ }
    }
    private dbgRect(n: Node): string
    {
        const ut = n.getComponent(UITransform);
        if (!ut) return 'noUT';
        const r = ut.getBoundingBoxToWorld();
        return `[${r.xMin.toFixed(0)},${r.yMin.toFixed(0)},${r.xMax.toFixed(0)},${r.yMax.toFixed(0)}]`;
    }
    // 世界坐标 → 镂空 mask 本地坐标（正确映射：含父链缩放/位移，不含状态栏/导航栏——
    // Cocos UI 坐标由 view 设计分辨率适配，与系统栏无关）
    private worldToMaskLocal(world: Vec3): Vec3
    {
        const mut = this.hollowOut.node.getComponent(UITransform);
        if (!mut) return world;
        return mut.convertToNodeSpaceAR(world);
    }
    // ---- 2026-10-16 坐标对齐修复：step → 真实可点击控件定位表 ----
    // 根因：原实现镂空/选框指向引导自身静态标记节点（多数无监听器），真实控件在业务
    // 节点树（不同父链/坐标系），世界坐标不对齐 → 点击落空"无反应"。
    private locateRealTarget(step: number): Node | null
    {
        const table: Record<number, { handler?: string, comp?: string, pick?: (c: any) => boolean }> = {
            0: { handler: 'onTouchBuildings' },
            1: { comp: 'Builds_item', pick: c => c.index === 0 },
            5: { comp: 'Builds_item', pick: c => c.index === 1 },
            6: { comp: '__sevenBtn1__' },
            9: { handler: 'onTaggle2' },
            10: { comp: 'Buildings_facade' },
            11: { comp: 'Buildings_app' },
            12: { comp: 'Appearance' },
            13: { handler: 'onTouchHide' },
            14: { comp: 'Client', handler: 'selectGo' },
            15: { handler: 'onTouchShop' },
            16: { comp: 'Shop', handler: 'onTouchEnd' },
            17: { comp: 'Shop', handler: 'onTouchClose' },
            21: { comp: 'BlockPre' }, 22: { comp: 'BlockPre' }, 23: { comp: 'BlockPre' },
            24: { comp: 'BlockPre' }, 25: { comp: 'BlockPre' },
            26: { comp: 'Garbage' },
            27: { comp: 'Loo_goods' },
            28: { comp: 'Loo_item', handler: 'onTouchClose' },
            29: { handler: 'onTouchWarehouse' },
            30: { comp: 'Warehouse_item' },
            31: { comp: 'Warehouse', handler: 'onTouchhide' },
        };
        const spec = table[step];
        if (!spec) return null;
        if (spec.comp === '__sevenBtn1__') return this.sevenBtn_1;
        const sc: any = director.getScene();
        if (!sc) return null;
        let found: Node | null = null;
        const walk = (n: any) => {
            if (found || !n) return;
            if (n.activeInHierarchy)
            {
                const comps = n.components || [];
                for (const c of comps)
                {
                    if (!c) continue;
                    if (spec.comp && c.constructor.name !== spec.comp) continue;
                    if (spec.pick && !spec.pick(c)) continue;
                    if (spec.handler)
                    {
                        const te = c.touchEvents;
                        if (!te || !te.length || te[0].handler !== spec.handler) continue;
                    }
                    found = n;
                    return;
                }
            }
            const kids = n.children || [];
            for (const k of kids) walk(k);
        };
        walk(sc);
        return found;
    }
    // 将镂空/选框/手型对齐到真实控件（世界包围盒 → mask 本地坐标），并输出偏移取证日志
    private alignHollow(target: Node, step: number)
    {
        try
        {
            const ut = target.getComponent(UITransform);
            const mut = this.hollowOut.node.getComponent(UITransform);
            if (!ut || !mut) return;
            const wb = ut.getBoundingBoxToWorld();
            const centerWorld = v3(wb.center.x, wb.center.y, 0);
            const local = mut.convertToNodeSpaceAR(centerWorld);
            const w = wb.width + 10, h = wb.height + 10;
            this.hollowOut.rectTo(0.5, local, w, h, 5, 5);
            this.xuankuang.setPosition(local);
            setNodeWidth(this.xuankuang, w);
            setNodeHeight(this.xuankuang, h);
            if (this.hand.parent === this.node) this.hand.setPosition(local.x, local.y - h / 2 - 40, 0);
            this.touchBlocker.setTarget(target);
            this._dbgTarget = target;
            const infoPos = this.info[step] ? this.info[step].pos : v3();
            console.log(`[GUIDE-DBG] step=${step} target=${target.name} worldRect=[${wb.xMin.toFixed(0)},${wb.yMin.toFixed(0)},${wb.xMax.toFixed(0)},${wb.yMax.toFixed(0)}] maskLocal=(${local.x.toFixed(0)},${local.y.toFixed(0)}) infoStaticPos=(${infoPos.x.toFixed(0)},${infoPos.y.toFixed(0)}) offset=(${(local.x - infoPos.x).toFixed(0)},${(local.y - infoPos.y).toFixed(0)})`);
        } catch (e) { /* ignore */ }
    }
    cachujixu(v: number)
    {
        this.hand.setPosition(v3(0, 300));
        // 3.8.8 内核适配：转换器遗漏的引导驱动三行（2.x onEnable 活跃代码）——
        // NEWGUIDECON 初始化为 0、层级置顶、绑定 continue 驱动引导步骤推进
        // 2026-10-17 修复（现象三：流程重启）：已完成引导（newGuide 缓存为真）时不再重置
        // 步骤状态机，避免任何 onEnable 重入把进度打回 0 造成"整个流程又重启"。
        if (Caches.get(Caches.newGuide))
        {
            console.log('[GUIDE-INIT] 引导已完成，跳过重置');
            this.node.active = false;
            return;
        }
        GameSys.game.xSet(Config.NEWGUIDECON, 0)
        this.node.zIndex = 50;
        GameSys.game.xBind(Config.NEWGUIDECON, this.continue.bind(this), BINDER_NAME)
        GameLog.node("guide-start", "step=0")
        console.log('[GUIDE-INIT] 状态机重置 step=0（onEnable/cachujixu）')
        this.change(this.shiqiBtn, this.shiwuBtn)
        // 3.8.8 内核适配：引导看门狗——部分步骤在浏览器（无广告 SDK/无真机事件）下
        // 无法由玩家触发（2.x 同存死步骤），8 秒无推进自动前进一步，保证玩法不被引导卡死
        this.unschedule(this.guideWatchdog);
        this._guideLastStep = -1;
        this.schedule(this.guideWatchdog, 4);
    }
    private _guideLastStep: number = -1;
    private _guideStallCount: number = 0;
    private guideWatchdog()
    {
        if (Caches.get(Caches.newGuide))
        {
            this.unschedule(this.guideWatchdog);
            return;
        }
        const cur = GameSys.game.xGet(Config.NEWGUIDECON) as number;
        if (cur === this._guideLastStep)
        {
            this._guideStallCount++;
            if (this._guideStallCount >= 2)
            {
                this._guideStallCount = 0;
                if (cur >= 31)
                {
                    console.log(`[GUIDE-WD] stall 自动推进 ${cur}->32（收尾）`);
                    GameSys.game.xSet(Config.NEWGUIDECON, 32);
                } else
                {
                    console.log(`[GUIDE-WD] stall 自动推进 ${cur}->${cur + 1}`);
                    GameSys.game.xSet(Config.NEWGUIDECON, cur + 1);
                }
            }
        } else
        {
            this._guideLastStep = cur;
            this._guideStallCount = 0;
        }
    }
    async change(pre: Node, next: Node)
    {
        pre.active = false
        next.active = true;
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.blockAll(); // 屏蔽所有点击
        if (GameSys.game.xGet(Config.NEWGUIDECON) !== 1)
        {
            await this.hollowOut.rectTo(0.5, next.getPosition(), getNodeWidth(next) + 10, getNodeHeight(next) + 10, 5, 5);
            this.touchBlocker.setTarget(this._dbgTarget || next); // 设置可点击节点（优先真实控件）
        } else
        {
            await this.hollowOut.rectTo(1.2, next.getPosition(), getNodeWidth(next) + 10, getNodeHeight(next) + 10, 5, 5);
            this.touchBlocker.setTarget(this._dbgTarget || next); // 设置可点击节点（优先真实控件）
        }
    }
    private info: In_Info[] = [
        { hand: v3(0, 0), lab: "点击按钮1\n进行升级", pos: v3(0, 0), width: 180, height: 140 },
        { hand: v3(-242.856, -363.254), lab: "选择升级区域", pos: v3(-97.379, -360.702), width: 180, height: 100 },
        { hand: v3(-149.302, 291.34), lab: "点击升级按钮", pos: v3(-36.624, 291), width: 180, height: 100 },
        { hand: v3(0, -161.628), lab: "点击解锁按钮", pos: v3(147.635, -159.076), width: 180, height: 100 },
        // { hand: v2(266, -380), lab: "点击按钮\n进行升级", pos: v2(145.516, -398.656), width: 180, height: 140 },
        { hand: v3(-149.302, 291.34), lab: "恭喜成功\n解锁洗手间", pos: v3(-36.624, 291), width: 180, height: 100 },

        { hand: v3(-83.148, -373.598), lab: "下一步\n前往卫生间", pos: v3(58.911, -340.62), width: 180, height: 100 },
        { hand: v3(-129.142, 291.412), lab: "点击升级区域", pos: v3(-16.439, 297.354), width: 180, height: 100 },
        { hand: v3(0, -161.628), lab: "点击解锁按钮", pos: v3(147.635, -159.076), width: 180, height: 100 },
        { hand: v3(-129.142, 291.412), lab: "恭喜成功\n解锁卫生间", pos: v3(-16.439, 297.354), width: 180, height: 100 },
        { hand: v3(136.404, -293.74), lab: "点击按钮\n进入外观", pos: v3(278.463, -260.662), width: 180, height: 100 },
        { hand: v3(-242.856, -363.254), lab: "选择外观区域", pos: v3(-97.379, -360.702), width: 180, height: 100 },
        { hand: v3(-146.881, -167.205), lab: "点击查看", pos: v3(-30, -152), width: 140, height: 100 },
        { hand: v3(-10.177, -111.442), lab: "点击更换外观", pos: v3(127.882, -128.364), width: 180, height: 100 },
        { hand: v3(335.332, -329.663), lab: "点击关闭", pos: v3(208.397, -296.585), width: 140, height: 100 },
        { hand: v3(0, 0), lab: "开始营业啦，顾客正在选择商品", pos: v3(0, -417.443), width: 450, height: 100 },

        { hand: v3(307.78, -287.679), lab: "点击商店", pos: v3(205.983, -270.5), width: 140, height: 100 },
        { hand: v3(0, -238.271), lab: "长按可快速补货哦", pos: v3(172.767, -221.092), width: 250, height: 100 },

        { hand: v3(320.374, 427.01), lab: "点击关闭", pos: v3(213.014, 444.189), width: 140, height: 100 },
        { hand: v3(0, 0), lab: "顾客正在前往洗手池", pos: v3(0, -417.443), width: 250, height: 100 },
        { hand: v3(0, 0), lab: "顾客正在前往洗手池", pos: v3(0, -417.443), width: 250, height: 100 },
        { hand: v3(-306.493, 304.62), lab: "洗手池每次被使用后会增加清洁度。\n清洁度到最大值时设施将无法使用，\n请尽快进行打扫。\n您也可以雇佣员工进行打扫", pos: v3(42.361, 201.372), width: 600, height: 180 },
        { hand: v3(-205, -367), lab: "点击使用高效去污器", pos: v3(0, -250), width: 250, height: 100 },
        { hand: v3(-158, 230), lab: "将高效去污器拖至这里\n并滑动看看吧", pos: v3(51, 145), width: 300, height: 100 },

        { hand: v3(0, -367), lab: "很棒哦，继续点击使用\n清洁剂", pos: v3(0, -250), width: 300, height: 100 },
        { hand: v3(-158, 230), lab: "将清洁剂拖至这里\n并滑动看看吧", pos: v3(51, 145), width: 300, height: 100 },

        { hand: v3(205, -367), lab: "加油哦，垃圾快清理\n干净了点击使用抹布", pos: v3(0, -250), width: 360, height: 100 },
        { hand: v3(-158, 230), lab: "将抹布拖至这里\n并滑动看看吧", pos: v3(51, 145), width: 300, height: 100 },

        { hand: v3(-8.382, 265.62), lab: "垃圾清理干净了，点\n击收集顾客遗留物品", pos: v3(36.163, 88.873), width: 300, height: 100 },
        { hand: v3(125.442, 395.507), lab: "点击关闭", pos: v3(101.763, 221.384), width: 140, height: 100 },
        { hand: v3(-296.505, -285.515), lab: "点击仓库", pos: v3(-178.143, -271.501), width: 140, height: 100 },


        { hand: v3(97.056, 205.661), lab: "点击购买", pos: v3(215.418, 219.675), width: 140, height: 100 },
        { hand: v3(317.078, 428.782), lab: "点击关闭", pos: v3(207.671, 442.796), width: 140, height: 100 },

    ]
    // private handePos: Vec2[] = [
    //     v2(266, -380), v2(0, -194), v2(-270, 176), v2(-92, -382), v2(-94, 186),
    //     v2(0, -194), v2(-87, 222), v2(333, -331), v2(0, 0), v2(300, -292),
    //     v2(0, -274), v2(315, 416), v2(0, 0), v2(-300, 300), v2(0, 0),
    //     v2(-180, 88), v2(96, 400), v2(-300, -266), v2(65, 195), v2(320, 414),
    //     v2(283, -409), v2(136, -326), v2(-50, 260), v2(-10, -200),
    // ]
    async continue(v: number)
    {
        if (Caches.get(Caches.newGuide))
            return
        console.log("[NewGuide] step", v)
        console.log(`[GUIDE-STEP] enter step=${v} prev=${this._dbgStep} con=${GameSys.game.xGet(Config.NEWGUIDECON)}`);
        this._dbgStep = v;
        this._dbgTarget = null;
        if (v >= 32)
        {
            console.log("结束")
            console.log('[GUIDE-STEP] done step=' + v + '（引导完成，写 newGuide 缓存）');
            this.node.active = false;
            GameLog.node("guide-done", "step="+v)
            Caches.set(Caches.newGuide, true)
            GameSys.game.xSet(Config.TIP, "卫生道长，开启你的管理工作吧！")
            GameSys.game.xSet(Config.NEWGUIDECON, 33)
            return
        }
        this.xuankuang.setPosition(this.info[v].pos)
        setNodeWidth(this.xuankuang, this.info[v].width);
        setNodeHeight(this.xuankuang, this.info[v].height);
        // this.xuankuang.children[0].getComponent(Label).string = this.info[v].lab

        this.onTouchLableTyper(this.info[v].lab)
        if (v == 14 || v == 19)
        {
            this.hand.parent = this.client.children[0];
            this.hand.setPosition(v3(0, 453));
            this.hand.setScale(1, 1, 1);
        }
        else
        {
            this.hand.parent = this.node
            this.hand.setScale(0.3, 0.3, 0.3)
            this.hand.setPosition(this.info[v].hand)
        }
        if (v == 1)
        {
            this.change(this.oneBtn, this.twoBtn)
        }
        //TODO:睡一觉继续
        if (v == 2)
        {
            this.change(this.twoBtn, this.threeBtn)
        }
        if (v == 5)
        {
            this.change(this.fiveBtn, this.sixBtn)
        }
        if (v == 6)
        {
            this.change(this.sixBtn, this.sevenBtn)
        }
        if (v == 9)
        {
            this.change(this.nineBtn, this.tenBtn)
        }
        if (v == 10)
        {
            this.change(this.tenBtn, this.shiyiBtn)
        }
        if (v == 11)
        {
            this.change(this.shiyiBtn, this.shierBtn)
        }
        if (v == 12)
        {
            this.change(this.shierBtn, this.shisanBtn)
        }
        if (v == 13)
        {
            this.change(this.shisanBtn, this.shisiBtn)
        }
        if (v == 14)
        {
            this.change(this.shisiBtn, this.shiwuBtn)
        }
        if (v == 15)
        {
            this.change(this.shiwuBtn, this.shiliuBtn)
        }
        if (v == 16)
        {
            this.change(this.shiliuBtn, this.shiqiBtn)
        }
        if (v == 17)
        {
            this.change(this.shiqiBtn, this.shibaBtn)
        }
        if (v == 18)
        {
            this.change(this.shibaBtn, this.shijiu)
        }
        if (v == 19)
        {
            this.change(this.shijiu, this.ershi)
        }
        if (v == 20)
        {
            this.change(this.ershi, this.eryi)
        }
        if (v == 21)
        {
            this.change(this.eryi, this.erer)
        } if (v == 22)
        {
            this.change(this.erer, this.ersan)
        }
        if (v == 23)
        {
            this.change(this.ersan, this.ersi)
        }
        if (v == 24)
        {
            this.change(this.ersi, this.erwu)
        }
        if (v == 25)
        {
            this.change(this.erwu, this.erliu)
        }
        if (v == 26)
        {
            this.change(this.erliu, this.erqi)
        }
        if (v == 27)
        {
            this.change(this.erqi, this.erba)
        }
        if (v == 28)
        {
            this.change(this.erba, this.erjiu)
        }
        if (v == 29)
        {
            this.change(this.erjiu, this.sanshi)
        }
        if (v == 30)
        {
            this.change(this.sanshi, this.sanyi)
        }
        if (v == 31)
        {
            this.change(this.sanyi, this.saner)
        }
        if (v == 32)
        {
            console.log("新手结束")
        }
        // 2026-10-16 坐标对齐：镂空/选框/手型对齐真实可点击控件（世界包围盒→mask 本地）
        this.alignStep(v);
    }
    // 2026-10-17 修复（现象二：仙界教学提示弹出但内容空白、手势指空白）：
    // 面板预制体经 PopupManager.resources.load 异步实例化，continue(v) 执行时目标常未挂载，
    // locateRealTarget 返回 null → 镂空/手势停在旧位置或空白。改为带重试的异步对齐：
    // 每 0.25s 重找目标，最长 6s；找到即对齐并停止；期间输出 [GUIDE-ALIGN] 日志。
    private _alignToken: number = 0;
    private alignStep(v: number)
    {
        const token = ++this._alignToken;
        this.unschedule(this._alignTick);
        this._alignPending = { v, token, tries: 0 };
        this._alignTick();
        if (this._alignPending) this.schedule(this._alignTick, 0.25);
    }
    private _alignPending: { v: number, token: number, tries: number } | null = null;
    private _alignTick()
    {
        const p = this._alignPending;
        if (!p) return;
        if (p.token !== this._alignToken) { this.unschedule(this._alignTick); this._alignPending = null; return; }
        // 步骤已前进则放弃本次对齐
        const cur = GameSys.game.xGet(Config.NEWGUIDECON) as number;
        if (cur !== p.v) { this.unschedule(this._alignTick); this._alignPending = null; return; }
        const real = this.locateRealTarget(p.v);
        p.tries++;
        if (real)
        {
            this._dbgTarget = real;
            this.alignHollow(real, p.v);
            console.log(`[GUIDE-ALIGN] step=${p.v} target=${real.name} 对齐成功 tries=${p.tries}`);
            this.unschedule(this._alignTick);
            this._alignPending = null;
        }
        else if (p.tries >= 24) // 6s 上限
        {
            console.log(`[GUIDE-ALIGN] step=${p.v} realTarget=none（引导自身按钮/自动推进步骤）tries=${p.tries}`);
            this.unschedule(this._alignTick);
            this._alignPending = null;
        }
    }
    protected start()
    {
        this.hollowOut.node.active = true;
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.passAll(); // 放行所有点击
        this._dbgStep = 0;
        this.onStartBtnClick()
    }

    private async onStartBtnClick()
    {

        this.touchBlocker.blockAll(); // 屏蔽所有点击
        await this.hollowOut.rectTo(0.5, this.oneBtn.getPosition(), getNodeWidth(this.oneBtn) + 10, getNodeHeight(this.oneBtn) + 10, 5, 5);
        this.touchBlocker.setTarget(this._dbgTarget || this.oneBtn); // 设置可点击节点
        // step0 真实控件=主场景建筑入口按钮
        const real0 = this.locateRealTarget(0);
        if (real0) { this._dbgTarget = real0; this.alignHollow(real0, 0); }
    }

    async onTouchThree()
    {
        if (GameSys.game.xGet(Config.NEWGUIDECON) !== 2)
            return
        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.NEWGUIDECON, 3)
        this.fourBtn.active = true;
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.blockAll(); // 屏蔽所有点击
        await this.hollowOut.rectTo(0.5, this.fourBtn.getPosition(), getNodeWidth(this.fourBtn) + 10, getNodeHeight(this.fourBtn) + 10, 5, 5);
        this.touchBlocker.setTarget(this.fourBtn); // 设置可点击节点

    }
    async onTouchFour()
    {
        if (GameSys.game.xGet(Config.NEWGUIDECON) !== 3)
            return
        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.NEWGUIDECON, 4)
        this.fourBtn.active = false;
        // this.fiveBtn.active = true
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.blockAll(); // 屏蔽所有点击
        await this.hollowOut.rectTo(0.5, this.threeBtn.getPosition(), getNodeWidth(this.threeBtn) + 10, getNodeHeight(this.threeBtn) + 10, 5, 5);
        this.touchBlocker.setTarget(this.threeBtn); // 设置可点击节点
        this.scheduleOnce(() =>
        {
            this.threeBtn.children[1].active = false;
            tween(this.threeBtn)
                .to(1, { y: this.threeBtn.y + 300, opacity: 0 })
                .call(() =>
                {
                    this.threeBtn.active = false
                    this.scheduleOnce(() =>
                    {
                        GameSys.game.xSet(Config.NEWGUIDECON, 5)
                    }, 0.2)
                })

                .start()
        }, 0.3)
    }
    onTouch5()
    {

    }
    onTouch9()
    {

    }
    async onTouchSeven()
    {
        if (GameSys.game.xGet(Config.NEWGUIDECON) !== 6)
            return
        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.NEWGUIDECON, 7)
        this.eightBtn.active = true;
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.blockAll(); // 屏蔽所有点击
        await this.hollowOut.rectTo(0.5, this.eightBtn.getPosition(), getNodeWidth(this.eightBtn) + 10, getNodeHeight(this.eightBtn) + 10, 5, 5);
        this.touchBlocker.setTarget(this.eightBtn); // 设置可点击节点

    }
    async onTouch8()
    {
        if (GameSys.game.xGet(Config.NEWGUIDECON) !== 7)
            return
        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.NEWGUIDECON, 8)
        this.eightBtn.active = false;
        // this.fiveBtn.active = true
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.blockAll(); // 屏蔽所有点击
        await this.hollowOut.rectTo(0.5, this.nineBtn.getPosition(), getNodeWidth(this.nineBtn) + 10, getNodeHeight(this.nineBtn) + 10, 5, 5);
        this.touchBlocker.setTarget(this.nineBtn); // 设置可点击节点
        this.scheduleOnce(() =>
        {
            this.sevenBtn.children[1].active = false;
            tween(this.sevenBtn)
                .to(1, { y: this.sevenBtn.y + 300, opacity: 0 })
                .call(() =>
                {
                    this.sevenBtn.active = false
                    this.scheduleOnce(() =>
                    {
                        GameSys.game.xSet(Config.NEWGUIDECON, 9)
                    }, 0.2)
                })

                .start()
        }, 0.3)
    }

    private typerTimer: number = 0;//计时器ID
    onTouchLableTyper(strLab)
    {
        //this.richText.string = '';
        this.xuankuang.children[0].getComponent(Label).string = '';
        let charArr = strLab.split('');
        let charIdx = 0;
        this.typerTimer && clearInterval(this.typerTimer);
        this.typerTimer = setInterval(() =>
        {
            if (charIdx >= charArr.length)
            {
                // console.log("打完了")
                this.typerTimer && clearInterval(this.typerTimer)
                // this.next.active = true;
                // cc.delayTime(0.2)
            }
            else
            {
                charIdx += 1;
                //返回数组的一个部分。
                //param开始数组指定部分的开头。
                //数组指定部分的结束。这是不包括索引“end”处的元素的。
                this.xuankuang.children[0].getComponent(Label).string = charArr.slice(0, charIdx).join('')
            }
        }, 100);
    }
    async onNineBtnClick()
    {
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.passAll(); // 放行所有点击
    }
}
