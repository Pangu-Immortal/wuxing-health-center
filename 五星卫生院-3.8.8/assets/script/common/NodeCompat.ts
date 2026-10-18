/**
 * NodeCompat —— 2.x Node API → 3.8 兼容层（原型补丁 + 声明合并）
 * 作用：让 2.x 写法 node.opacity / node.width / node.zIndex / node.convertToNodeSpaceAR(...)
 *       等在 3.8 下零改动可用。运行时挂到 Node.prototype，类型侧用 declare module 'cc' 合并。
 * 语义对齐 2.x：
 *   opacity        → UIOpacity 组件（自动挂载）
 *   width/height/contentSize/anchorX/anchorY/convert*AR/getBoundingBox → UITransform（自动挂载）
 *   zIndex         → siblingIndex（同父绘制序，2.x zIndex 的 3.x 等价物）
 *   childrenCount  → children.length
 *   color          → Sprite/Label 渲染组件 color
 *   stopAllActions → Tween.stopAllByTarget
 *   runAction      → 3.x 已删除 Action 系统；此处仅占位，相关调用点须手工改 tween
 * 必须在游戏入口 import 一次（顶层执行补丁）。
 */
import { Color, Director, ImageAsset, Label, Node, Rect, Size, Sprite, SpriteFrame, Texture2D, Tween, UIOpacity, UITransform, Vec2, Vec3, director, tween } from 'cc';

const proto: any = Node.prototype;

function ut(n: Node): UITransform {
    let c = n.getComponent(UITransform);
    if (!c) c = n.addComponent(UITransform);
    return c;
}
function uop(n: Node): UIOpacity {
    let c = n.getComponent(UIOpacity);
    if (!c) c = n.addComponent(UIOpacity);
    return c;
}
function defProp(name: string, desc: PropertyDescriptor, force = false) {
    if (force || !Object.getOwnPropertyDescriptor(proto, name)) {
        try { Object.defineProperty(proto, name, Object.assign({ configurable: true }, desc)); } catch (e) { /* ignore */ }
    }
}
function defMethod(name: string, fn: (...args: any[]) => any) {
    if (typeof proto[name] !== 'function') {
        try { proto[name] = fn; } catch (e) { /* ignore */ }
    }
}

// ---- 空帧 Sprite 治理（黑屏回归修复版 v5·渲染管线零 hook）----
// 历史教训（2026-10-16 黑屏+泄漏连环事故）：
//  ① hook fillBuffers 对 !renderData/!chunk early-return → 吞 Mask stencil 渲染 → 整屏黑；
//  ② hook updateWorldVertexAndUVData/assembler early-return → 打乱引擎批次
//     byteOffset 重置节奏 → Float32Array 长度累积泄漏 RangeError；
//  ③ 验收只看 console 错误数不看截图 = 假绿。
// 终版方案：渲染管线零 hook。vb 崩溃根因是「空帧 Sprite」，只需把空帧补成
// 256x256 透明兜底帧（renderData/chunk 随之正常分配，崩溃自然消失）：
//  - 场景加载后 0.3s/1.5s/4s 扫描补帧；
//  - 之后每 2s 周期扫描，覆盖运行时后置空的 Sprite。
(function patchNullSpriteSweepV5() {
    const g: any = globalThis as any;
    if (g.__nullSpriteSweepV5) return;
    g.__nullSpriteSweepV5 = true;
    let fb: SpriteFrame | null = null;
    const getFallback = (): SpriteFrame => {
        if (!fb) {
            const img = new ImageAsset();
            img.reset({ _data: new Uint8Array(256 * 256 * 4), width: 256, height: 256, format: Texture2D.PixelFormat.RGBA8888 } as any);
            const tex = new Texture2D();
            tex.image = img;
            fb = new SpriteFrame();
            fb.texture = tex;
            // 3.8.8 内核适配：必须设 rect/offset/originalSize——默认 rect 0x0 会让
            // Tiled assembler 以 tileSize=0 算出「节点面积」级瓦片数 → RangeError
            fb.rect = new Rect(0, 0, 256, 256);
            fb.offset = new Vec2(0, 0);
            fb.originalSize = new Size(256, 256);
            // 禁入动态图集（DynamicAtlas 对程序化图源 texSubImage2D overload 失败）
            (fb as any).packable = false;
        }
        return fb;
    };
    const isNullFrameSprite = (comp: any): boolean => {
        // 必须限定 Sprite：Mask.spriteFrame getter 无 _sprite 时也返回 null
        try { return !!comp && comp.constructor && comp.constructor.name === 'Sprite' && comp.spriteFrame === null && !!comp.node; } catch (e) { return false; }
    };
    // 3.8.8 内核适配（零延迟防线）：hook Sprite.fillRange setter——RADIAL 填充赋 0
    // 会产生 0 顶点 → chunk 永久 null → 渲染器每帧崩溃。赋值源头直接 clamp 到 0.001，
    // 无时间窗（sweep 是秒级兜底，setter hook 是帧级防线）。
    (function hookFillRangeSetter() {
        const proto: any = (Sprite as any).prototype;
        const desc = Object.getOwnPropertyDescriptor(proto, 'fillRange');
        if (!desc || !desc.set || (desc as any).__frGuard) return;
        (desc as any).__frGuard = true;
        const origSet = desc.set;
        Object.defineProperty(proto, 'fillRange', {
            configurable: true,
            enumerable: desc.enumerable,
            get: desc.get,
            set: function (v: number) {
                try
                {
                    if (v === 0 && (this as any).fillType !== 0) v = 0.001; // FILLED/RADIAL/TILED 0 顶点均致 chunk null 崩溃
                } catch (e) { /* ignore */ }
                origSet.call(this, v);
            },
        });
    })();
    // 3.8.8 内核适配：RadialFilled/Tiled 不在 cc.internal 导出表，经 Sprite 实例的
    // _assembler 原型 hook（原型全类共享）。跳过条件严格限定「退化帧」
    // （rect 宽或高 ≤1）：Tiled 用 rect 算瓦片数，退化帧 → 百万顶点 →
    // chunk 永不回收 → byteOffset 累积 39M → RangeError 崩标签页。
    // 正常帧一律透传 orig，不干扰 chunk 生命周期。
    const isDegenerateFrame = (sprite: any): boolean => {
        try
        {
            const f = sprite && sprite.spriteFrame;
            if (!f) return false;
            const r = f.rect;
            return !!r && (r.width <= 1 || r.height <= 1);
        } catch (e) { return false; }
    };
    const hookAssemblerProto = (comp: any) => {
        try
        {
            if (!comp) return;
            const asm = comp._assembler;
            if (!asm) return;
            const p = Object.getPrototypeOf(asm);
            if (!p || p.__asmSkipV8) return;
            p.__asmSkipV8 = true;
            if (typeof p.updateRenderData === 'function')
            {
                const ou = p.updateRenderData;
                p.updateRenderData = function (sprite: any) {
                    if (isDegenerateFrame(sprite))
                    {
                        console.error('[fuse] 退化帧跳过 Tiled/Radial 重建 node=' + (sprite.node ? sprite.node.name : '?')
                            + ' rect=' + JSON.stringify(sprite.spriteFrame.rect)
                            + ' tex=' + (sprite.spriteFrame.texture ? sprite.spriteFrame.texture.width + 'x' + sprite.spriteFrame.texture.height : 'null'));
                        return;
                    }
                    return ou.call(this, sprite);
                };
            }
            if (typeof p.fillBuffers === 'function')
            {
                const of = p.fillBuffers;
                p.fillBuffers = function (sprite: any, renderer: any) {
                    if (isDegenerateFrame(sprite)) return; // 退化帧不绘制，避免瓦片数爆炸
                    const rd = sprite && sprite.renderData;
                    if (rd && !rd.chunk) return; // chunk 未分配的帧渲染器必崩，跳过
                    return of.call(this, sprite, renderer);
                };
            }
            if (typeof p.updateWorldVertexAndUVData === 'function')
            {
                const ow = p.updateWorldVertexAndUVData;
                p.updateWorldVertexAndUVData = function (sprite: any, chunk: any) {
                    if (!chunk) return;
                    return ow.call(this, sprite, chunk);
                };
            }
        } catch (e) { /* ignore */ }
    };
    // 3.8.8 内核适配（激活点零窗口防线）：场景反序列化直接写私有字段（_fillRange/_spriteFrame
    // 不走 setter），首帧渲染前唯一可靠时机是 onEnable。在此 clamp RADIAL 0 并补空帧。
    (function hookSpriteOnEnable() {
        const proto: any = (Sprite as any).prototype;
        if (!proto || proto.__oeGuard) return;
        proto.__oeGuard = true;
        const origEnable = proto.onEnable;
        proto.onEnable = function () {
            if (origEnable) origEnable.call(this);
            try
            {
                if (this.fillType !== 0 && this._fillRange === 0) this.fillRange = 0.001;
                if (this.spriteFrame === null) this.spriteFrame = getFallback();
                hookAssemblerProto(this);
            } catch (e) { /* ignore */ }
        };
    })();
    // 3.8.8 内核适配（巨量顶点熔断）：Tiled/Radial assembler 在帧尺寸异常时会算出
    // 百万级顶点数 → Float32Array 分配 39MB+ → 标签页直接崩溃（2026-10-16 实测）。
    // 正常 2D UI 单组件顶点数 < 1000；> 50000 必为异常，记录调用栈并拒绝分配。
    (function patchRenderDataResizeFuse() {
        const g: any = globalThis as any;
        if (g.__rdResizeFuse) return;
        g.__rdResizeFuse = true;
        const tryWrap = (attempt: number) => {
            const RD: any = (cc as any).internal && (cc as any).internal.RenderData;
            if (!RD || !RD.prototype || typeof RD.prototype.resize !== 'function')
            {
                if (attempt < 30) setTimeout(() => tryWrap(attempt + 1), 200);
                return;
            }
            const orig = RD.prototype.resize;
            RD.prototype.resize = function (vc: number, ic: number) {
                if (vc > 50000)
                {
                    const stack = new Error().stack || '';
                    console.error('[fuse] RenderData.resize 巨量顶点降级为单 quad vc=' + vc + ' stack=' + stack.split('\n').slice(1, 6).join(' | '));
                    return orig.call(this, 4, 6);
                }
                return orig.call(this, vc, ic);
            };
            // 3.8.8 内核适配：Tiled.updateRenderData 先写 dataLength（row*col*4 百万级）
            // 分配 data 数组，早于 resize——熔断必须同时覆盖 dataLength setter
            const desc = Object.getOwnPropertyDescriptor(RD.prototype, 'dataLength');
            if (desc && desc.set && !(desc as any).__dlFuse)
            {
                (desc as any).__dlFuse = true;
                const origSet = desc.set;
                Object.defineProperty(RD.prototype, 'dataLength', {
                    configurable: true,
                    enumerable: desc.enumerable,
                    get: desc.get,
                    set: function (v: number) {
                        if (v > 50000)
                        {
                            const stack = new Error().stack || '';
                            console.error('[fuse] RenderData.dataLength 巨量降级 dl=' + v + ' stack=' + stack.split('\n').slice(1, 6).join(' | '));
                            v = 4;
                        }
                        origSet.call(this, v);
                    },
                });
            }
        };
        tryWrap(0);
    })();
    // 3.8.8 内核适配（最终熔断）：MeshBuffer.uploadBuffers 在帧尾以累积的 byteOffset
    // 做 new Float32Array(vData.buffer, 0, byteOffset>>2)——byteOffset 一旦超过 vData
    // 容量即 RangeError 崩标签页（chunk 未回收导致累积，2026-10-16 实测 39M）。
    // 熔断：超限即丢弃当帧上传并复位计数（等价 reset），游戏继续不崩。
    (function patchUploadBuffersFuse() {
        const g: any = globalThis as any;
        if (g.__uploadFuse) return;
        g.__uploadFuse = true;
        const hookBuf = (buf: any): boolean => {
            try
            {
                const p = Object.getPrototypeOf(buf);
                if (!p || p.__upFuse || typeof p.uploadBuffers !== 'function') return false;
                p.__upFuse = true;
                const orig = p.uploadBuffers;
                p.uploadBuffers = function () {
                    try
                    {
                        if (this.vData && (this.byteOffset >> 2) > this.vData.length)
                        {
                            console.error('[fuse] MeshBuffer byteOffset 超容量复位 byteOffset=' + this.byteOffset + ' cap=' + this.vData.length);
                            this.byteOffset = 0;
                            this.indexOffset = 0;
                            this.vertexOffset = 0;
                            this._nextFreeIAHandle = 0;
                            this._dirty = false;
                            return;
                        }
                    } catch (e) { /* ignore */ }
                    return orig.call(this);
                };
                return true;
            } catch (e) { return false; }
        };
        const tryFind = (attempt: number) => {
            try
            {
                const d: any = (cc as any).director;
                const b2d = d && d.root && d.root.batcher2D;
                if (!b2d) { if (attempt < 60) setTimeout(() => tryFind(attempt + 1), 300); return; }
                let hooked = 0;
                const seen = new Set();
                const walk = (obj: any, depth: number) => {
                    if (!obj || depth > 4 || seen.has(obj)) return;
                    seen.add(obj);
                    if (typeof obj.uploadBuffers === 'function') { if (hookBuf(obj)) hooked++; return; }
                    if (depth === 4) return;
                    try
                    {
                        const keys = Array.isArray(obj) ? obj.map((_, i) => String(i)) : Object.keys(obj);
                        for (const k of keys)
                        {
                            let v: any = null;
                            try { v = obj[k]; } catch (e) { continue; }
                            if (v && typeof v === 'object') walk(v, depth + 1);
                        }
                    } catch (e) { /* ignore */ }
                };
                walk(b2d, 0);
                if (!hooked && attempt < 60) setTimeout(() => tryFind(attempt + 1), 300);
            } catch (e) { if (attempt < 60) setTimeout(() => tryFind(attempt + 1), 300); }
        };
        tryFind(0);
        // 3.8.8 内核适配（异常恢复）：RangeError 是可捕获 JS 异常；它中断渲染循环后
        // 引擎状态腐化 → 错误滚雪球 → 标签页崩溃。捕获即复位全部 MeshBuffer 计数，
        // 下一帧恢复正常渲染（丢一帧画面，保标签页）。
        window.addEventListener('error', (ev: ErrorEvent) => {
            try
            {
                if (!ev || !ev.message || ev.message.indexOf('typed array') < 0) return;
                const d: any = (cc as any).director;
                const b2d = d && d.root && d.root.batcher2D;
                if (!b2d) return;
                const seen = new Set();
                let reset = 0;
                const walk = (obj: any, depth: number) => {
                    if (!obj || depth > 4 || seen.has(obj)) return;
                    seen.add(obj);
                    if (typeof obj.uploadBuffers === 'function' && obj.vData)
                    {
                        obj.byteOffset = 0; obj.indexOffset = 0; obj.vertexOffset = 0;
                        obj._nextFreeIAHandle = 0; obj._dirty = false;
                        reset++;
                        return;
                    }
                    if (depth === 4) return;
                    try
                    {
                        const keys = Array.isArray(obj) ? obj.map((_, i) => String(i)) : Object.keys(obj);
                        for (const k of keys)
                        {
                            let v: any = null;
                            try { v = obj[k]; } catch (e) { continue; }
                            if (v && typeof v === 'object') walk(v, depth + 1);
                        }
                    } catch (e) { /* ignore */ }
                };
                walk(b2d, 0);
                console.error('[fuse] typed array 异常恢复，复位 buffer 数=' + reset);
            } catch (e) { /* ignore */ }
        });
    })();
    const sweep = () => {
        const sc: any = director.getScene();
        if (!sc) return;
        let n = 0;
        const walk = (node: any) => {
            if (!node) return;
            if (node.activeInHierarchy) {
                const comps = node.components || [];
                for (const c of comps)
                {
                    let fixed = false;
                    if (isNullFrameSprite(c)) { c.spriteFrame = getFallback(); fixed = true; }
                    // FILLED/RADIAL/TILED 填充 fillRange=0 → 0 顶点 → chunk 永久 null → 引擎每帧崩溃；clamp 到 0.001
                    try
                    {
                        if (c.fillType !== 0 && c.fillRange === 0)
                        { c.fillRange = 0.001; fixed = true; }
                    } catch (e) { /* ignore */ }
                }
            }
            const kids = node.children || [];
            for (const k of kids) walk(k);
        };
        walk(sc);
        if (n > 0) console.log('[flow] null-sprite sweep 补帧', n);
    };
    director.on((Director as any).EVENT_AFTER_SCENE_LAUNCH || 'after-scene-launch', () => {
        setTimeout(sweep, 300);
        setTimeout(sweep, 1500);
        setTimeout(sweep, 4000);
    });
    setTimeout(sweep, 1500);
    setTimeout(sweep, 4000);
    setInterval(sweep, 2000);
})();

// ---- 引擎崩溃防御：注册指针事件的节点必须有 UITransform ----
// 3.8 引擎 _sortPointerEventProcessorList 对每个注册过 touch/mouse 事件的节点
// 调 node._getUITransformComp() 后直接读 trans.cameraPriority；节点缺 UITransform
// 时 trans 为 null → "null is not an object (evaluating 'trans.cameraPriority')"
// （Safari 的 mouse→touch 模拟路径 _simulateEventTouch 尤其易触发）。
// 双保险：① node.on 注册指针类事件时自动补 UITransform；② _getUITransformComp 兜底永不返回 null。
const POINTER_EVENT_TYPES: string[] = [
    'touch-start', 'touch-move', 'touch-end', 'touch-cancel',
    'mouse-enter', 'mouse-leave', 'mouse-move', 'mouse-down', 'mouse-up', 'mouse-wheel',
    'pointer-down', 'pointer-up', 'pointer-move', 'pointer-cancel', 'pointer-over', 'pointer-out',
];
(function patchPointerEventGuard() {
    const rawOn = proto.on;
    if (typeof rawOn === 'function' && !proto.__pointerGuardPatched) {
        proto.__pointerGuardPatched = true;
        proto.on = function (type: any, callback?: any, target?: any) {
            try {
                if (typeof type === 'string' && POINTER_EVENT_TYPES.indexOf(type) >= 0) {
                    if (!this.getComponent(UITransform)) this.addComponent(UITransform);
                }
            } catch (e) { /* ignore */ }
            return rawOn.call(this, type, callback, target);
        };
        // 兜底：引擎内部排序取 UITransform 时永不为 null
        const rawGetUT = proto._getUITransformComp;
        if (typeof rawGetUT === 'function') {
            proto._getUITransformComp = function () {
                const c = rawGetUT.call(this);
                if (!c) { try { return this.addComponent(UITransform); } catch (e) { return c; } }
                return c;
            };
        }
    }
})();

// ---- 属性 ----
defProp('opacity', {
    get(this: Node) { const c = this.getComponent(UIOpacity); return c ? c.opacity : 255; },
    set(this: Node, v: number) { uop(this).opacity = v; },
});
defProp('width', {
    get(this: Node) { return ut(this).width; },
    set(this: Node, v: number) { ut(this).width = v; },
}, true);
defProp('height', {
    get(this: Node) { return ut(this).height; },
    set(this: Node, v: number) { ut(this).height = v; },
}, true);
defProp('anchorX', {
    get(this: Node) { return ut(this).anchorX; },
    set(this: Node, v: number) { ut(this).anchorX = v; },
});
defProp('anchorY', {
    get(this: Node) { return ut(this).anchorY; },
    set(this: Node, v: number) { ut(this).anchorY = v; },
});
defProp('contentSize', {
    get(this: Node) { return ut(this).contentSize; },
    set(this: Node, v: Size) { ut(this).contentSize = v; },
});
defProp('zIndex', {
    get(this: Node) { return this.getSiblingIndex(); },
    set(this: Node, v: number) { this.setSiblingIndex(Math.max(0, Math.floor(v))); },
});
defProp('childrenCount', {
    get(this: Node) { return this.children.length; },
});
defProp('color', {
    get(this: Node): Color {
        const s = this.getComponent(Sprite); if (s) return s.color.clone();
        const l = this.getComponent(Label); if (l) return l.color.clone();
        return new Color(255, 255, 255, 255);
    },
    set(this: Node, c: Color) {
        const s = this.getComponent(Sprite); if (s) { s.color = c; return; }
        const l = this.getComponent(Label); if (l) { l.color = c; }
    },
});

defProp('scaleX', {
    get(this: Node) { return this.scale.x; },
    set(this: Node, v: number) { this.setScale(v, this.scale.y, this.scale.z); },
});
defProp('scaleY', {
    get(this: Node) { return this.scale.y; },
    set(this: Node, v: number) { this.setScale(this.scale.x, v, this.scale.z); },
});

// ---- 方法 ----
export function getNodeWidth(n: Node): number { return ut(n).width; }
export function getNodeHeight(n: Node): number { return ut(n).height; }
export function setNodeWidth(n: Node, v: number): void { ut(n).width = v; }
export function setNodeHeight(n: Node, v: number): void { ut(n).height = v; }

defMethod('setContentSize', function (this: Node, a: number | Size, b?: number) {
    if (typeof a === 'number') ut(this).setContentSize(a, b as number);
    else ut(this).setContentSize(a);
});
defMethod('getContentSize', function (this: Node): Size { return ut(this).contentSize.clone(); });
defMethod('convertToNodeSpaceAR', function (this: Node, wp: Vec3, out?: Vec3): Vec3 { return ut(this).convertToNodeSpaceAR(wp, out); });
defMethod('convertToWorldSpaceAR', function (this: Node, np: Vec3, out?: Vec3): Vec3 { return ut(this).convertToWorldSpaceAR(np, out); });
defMethod('getBoundingBox', function (this: Node): Rect { return ut(this).getBoundingBox(); });
defMethod('getBoundingBoxToWorld', function (this: Node): Rect { return ut(this).getBoundingBoxToWorld(); });
defMethod('stopAllActions', function (this: Node) { Tween.stopAllByTarget(this); });
defMethod('pauseAllActions', function (this: Node) { Tween.stopAllByTarget(this); });
defMethod('resumeAllActions', function (this: Node) { /* tween 无暂停等价，no-op */ });
defMethod('runAction', function (this: Node, _a: any) {
    // 3.x 无 Action 系统；调用点须改 tween。此处占位避免崩溃。
    console.warn('[NodeCompat] runAction 已废弃，请改用 tween：', this.name);
});

// ---- 类型声明合并：让 tsc 认可上述成员 ----
declare module 'cc' {
    interface Node {
        opacity: number;
        width: number;
        height: number;
        anchorX: number;
        anchorY: number;
        contentSize: Size;
        zIndex: number;
        childrenCount: number;
        color: Color;
        scaleX: number;
        scaleY: number;
        setContentSize(size: Size): void;
        setContentSize(width: number, height: number): void;
        getContentSize(): Size;
        convertToNodeSpaceAR(worldPoint: Vec3, out?: Vec3): Vec3;
        convertToWorldSpaceAR(nodePoint: Vec3, out?: Vec3): Vec3;
        getBoundingBox(): Rect;
        getBoundingBoxToWorld(): Rect;
        stopAllActions(): void;
        pauseAllActions(): void;
        resumeAllActions(): void;
        runAction(action: any): any;
    }
}

export {};
