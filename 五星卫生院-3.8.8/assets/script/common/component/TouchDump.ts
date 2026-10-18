import { Button, Canvas as CanvasComp, Component, EventKeyboard, EventTouch, Input, KeyCode, Node, UITransform, Vec2, _decorator, director, input, view } from 'cc';
const { ccclass } = _decorator;

/**
 * TouchDump —— adb 全控件点击遍历配套埋点（3.8.8 原生/浏览器通用）
 * 触发方式（adb shell input keyevent）：
 *   F12(143) = dump 当前场景全部可交互控件（[TD-NODE] 行：路径+世界包围盒）
 *   F11(142) = dump 视图状态（canvas/design/visible 尺寸，用于坐标换算核对）
 * 常驻：每次 TOUCH_START 输出 [TD-TOUCH]（触点 UI 坐标 + 命中的最深层可交互控件路径）
 * 用途：证明点击是否到达引擎、是否命中目标控件、点击后是否有响应/报错。
 */
@ccclass('TouchDump')
export default class TouchDump extends Component
{
    protected onEnable()
    {
        input.on(Input.EventType.KEY_DOWN, this._onKey, this);
        input.on(Input.EventType.TOUCH_START, this._onTouch, this);
        // 3.8.8 原生适配：input.on 触摸广播在 jsb 不触发；3.x 触摸按 pick→冒泡 派发。
        // 监听 Canvas 节点（所有 UI 的祖先，且 parent=scene 非 null——引擎 _sortByPriority
        // 读 processor.node.parent，场景根节点 parent=null 会使其崩溃，故不能挂在根上）。
        const cv = this.node.getComponentInChildren(CanvasComp) || this.node.getComponent(CanvasComp);
        const host = cv ? cv.node : this.node.parent;
        if (host && host !== this.node)
        {
            host.on(Node.EventType.TOUCH_START, this._onProbeTouch, this);
            this._host = host;
        }
        console.log('[TD-REG] TouchDump 已挂载 host=' + (this._host ? this._host.name : 'none'));
    }
    protected onDisable()
    {
        input.off(Input.EventType.KEY_DOWN, this._onKey, this);
        input.off(Input.EventType.TOUCH_START, this._onTouch, this);
        if (this._host) { this._host.off(Node.EventType.TOUCH_START, this._onProbeTouch, this); this._host = null; }
    }
    private _host: Node | null = null;
    private _onProbeTouch(e: EventTouch)
    {
        try
        {
            let x = 0, y = 0, src = 'ui';
            try
            {
                const ui = e.getUILocation();
                x = ui.x; y = ui.y;
            } catch (e1)
            {
                const loc = e.getLocation();
                const cs = view.getCanvasSize();
                x = loc.x; y = cs.height - loc.y; src = 'screen';
            }
            const hit = this.hitTest(x, y);
            console.log(`[TD-TOUCH] ui=(${x.toFixed(0)},${y.toFixed(0)}) src=${src} hit=${hit || 'NONE'}`);
        } catch (err) { console.log('[TD-TOUCH-ERR] ' + (err && (err as any).message)); }
    }
    private _onKey(e: EventKeyboard)
    {
        // 3.8.8 原生适配：AndroidKeyCodes 仅映射到 F11（AKEYCODE_F11=141），F12 未映射。
        // 约定：F11(141)=dump 控件；F10(140)=dump 视图状态
        if (e.keyCode === KeyCode.F11) this.dump();
        else if (e.keyCode === KeyCode.F10) this.dumpState();
    }
    private _onTouch(e: EventTouch)
    {
        try
        {
            // 3.8.8 原生适配：getUILocation 在部分 jsb 路径抛异常，降级用 getLocation（屏幕像素，左上原点）换算
            let x = 0, y = 0, src = 'ui';
            try
            {
                const ui = e.getUILocation();
                x = ui.x; y = ui.y;
            } catch (e1)
            {
                const loc = e.getLocation();
                const cs = view.getCanvasSize();
                x = loc.x; y = cs.height - loc.y; src = 'screen';
            }
            const hit = this.hitTest(x, y);
            console.log(`[TD-TOUCH] ui=(${x.toFixed(0)},${y.toFixed(0)}) src=${src} hit=${hit || 'NONE'}`);
        } catch (err) { console.log('[TD-TOUCH-ERR] ' + (err && (err as any).message)); }
    }
    private path(n: Node): string
    {
        const parts: string[] = [];
        let cur: Node | null = n;
        while (cur && parts.length < 6)
        {
            parts.unshift(cur.name);
            cur = cur.parent;
        }
        return parts.join('/');
    }
    /** 可交互判定：注册了 touch/click 事件或挂 Button 组件 */
    private isInteractive(n: Node): boolean
    {
        try
        {
            if (n.getComponent(Button)) return true;
            if (n.hasEventListener(Node.EventType.TOUCH_END)) return true;
            if (n.hasEventListener(Node.EventType.TOUCH_START)) return true;
            if (n.hasEventListener('click')) return true;
        } catch (e) { /* ignore */ }
        return false;
    }
    hitTest(x: number, y: number): string | null
    {
        let best: string | null = null; let bestArea = Infinity;
        const sc = director.getScene(); if (!sc) return null;
        const walk = (n: Node) => {
            if (!n.activeInHierarchy) return;
            if (this.isInteractive(n))
            {
                const ut = n.getComponent(UITransform);
                if (ut)
                {
                    const r = ut.getBoundingBoxToWorld();
                    if (r.width > 4 && r.height > 4 && r.contains(new Vec2(x, y)))
                    {
                        const area = r.width * r.height;
                        if (area < bestArea) { bestArea = area; best = this.path(n); }
                    }
                }
            }
            const kids = n.children;
            for (let i = 0; i < kids.length; i++) walk(kids[i]);
        };
        walk(sc);
        return best;
    }
    dumpState()
    {
        try
        {
            const sc = director.getScene();
            const cs = view.getCanvasSize(), ds = view.getDesignResolutionSize(), vs = view.getVisibleSize();
            console.log(`[TD-STATE] scene=${sc ? sc.name : 'null'} canvas=${cs.width.toFixed(0)}x${cs.height.toFixed(0)} design=${ds.width.toFixed(0)}x${ds.height.toFixed(0)} visible=${vs.width.toFixed(0)}x${vs.height.toFixed(0)}`);
        } catch (e) { /* ignore */ }
    }
    dump()
    {
        this.dumpState();
        const sc = director.getScene(); if (!sc) { console.log('[TD-DUMP-END] count=0'); return; }
        let idx = 0; let visited = 0; let inter = 0;
        const walk = (n: Node) => {
            if (!n.activeInHierarchy) return;
            visited++;
            const kidsFirst = n.children;
            for (let i = 0; i < kidsFirst.length; i++) walk(kidsFirst[i]);
            if (this.isInteractive(n))
            {
                inter++;
                const ut = n.getComponent(UITransform);
                if (ut)
                {
                    const r = ut.getBoundingBoxToWorld();
                    if (r.width >= 16 && r.height >= 16 && r.width <= 1600 && r.height <= 1600)
                    {
                        console.log(`[TD-NODE] i=${idx} name=${this.path(n)} rect=[${r.xMin.toFixed(0)},${r.yMin.toFixed(0)},${r.xMax.toFixed(0)},${r.yMax.toFixed(0)}]`);
                        idx++;
                    }
                }
            }
        };
        walk(sc);
        console.log(`[TD-DUMP-END] count=${idx} visited=${visited} interactive=${inter}`);
    }
}
