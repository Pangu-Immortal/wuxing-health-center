import { getNodeWidth, getNodeHeight, setNodeWidth, setNodeHeight } from '../../NodeCompat';
import { DEV as CC_DEV, EDITOR as CC_EDITOR, JSB as CC_JSB } from 'cc/env';
import { Color, Component, EffectAsset, Enum, Graphics, Material, Node, Sprite, Tween, UITransform, Vec2, Vec3, _decorator, assetManager, resources, tween, v2, v3, warn } from 'cc';
const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple, executionOrder } = _decorator;

import EditorAsset from "../../manager/EditorAsset";
// /** 镂空形状 */
export enum HollowOutShape
{
//     /** 矩形 */
    Rect = 1,
//     /** 圆形 */
    Circle
}
// /**
//  * 挖孔 Shader 组件，该组件需要对应的 Effect 才能正常使用！
//  * @see HollowOut.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/HollowOut.ts
//  * @see eazax-hollowout.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-hollowout.effect
//  */

@ccclass('HollowOut')
@requireComponent(Sprite)@executeInEditMode@disallowMultiple@executionOrder(-100)
export default class HollowOut extends Component
{
    private _effect: EffectAsset | null = null;
    @property({ type: EffectAsset, tooltip: CC_DEV && 'Effect 资源', readonly: true })
    public get effect() { return this._effect; }
    public set effect(value: EffectAsset) { this._effect = value; this.init(); }
    @property private _shape: HollowOutShape = HollowOutShape.Rect;
    @property({ type: Enum(HollowOutShape), tooltip: CC_DEV && '镂空形状' })
    public get shape() { return this._shape; }
    public set shape(value: HollowOutShape) { this._shape = value; this.updateProperties(); }
    @property private _center: Vec3 = v3();
    @property({ tooltip: CC_DEV && '中心坐标' })
    public get center() { return this._center; }
    public set center(value: Vec3) { this._center = value; this.updateProperties(); }
    @property private _width: number = 300;
    @property({ tooltip: CC_DEV && '宽', visible() { return this.shape === HollowOutShape.Rect; } })
    public get width() { return this._width; }
    public set width(value: number) { this._width = value; this.updateProperties(); }
    @property private _height: number = 300;
    @property({ tooltip: CC_DEV && '高', visible() { return this.shape === HollowOutShape.Rect; } })
    public get height() { return this._height; }
    public set height(value: number) { this._height = value; this.updateProperties(); }
    @property private _round: number = 1;
    @property({ tooltip: CC_DEV && '圆角半径', visible() { return this.shape === HollowOutShape.Rect; } })
    public get round() { return this._round; }
    public set round(value: number) { this._round = value; this.updateProperties(); }
    @property private _radius: number = 200;
    @property({ tooltip: CC_DEV && '半径', visible() { return this.shape === HollowOutShape.Circle; } })
    public get radius() { return this._radius; }
    public set radius(value: number) { this._radius = value; this.updateProperties(); }
    @property private _feather: number = 0.5;
    @property({ tooltip: CC_DEV && '边缘虚化宽度', visible() { return this.shape === HollowOutShape.Circle || this.round > 0; } })
    public get feather() { return this._feather; }
    public set feather(value: number) { this._feather = value; this.updateProperties(); }
    private sprite: Sprite | null = null;
    private material: Material | null = null;
    private _nativeMask = false;
    private tweenRes: () => void = null;
    protected onLoad()
    {
        // 3.8.8 内核适配：反序列化不走 setter，init 可能未执行；且场景加载早期 bundle 配置
        // 未就绪时 loadAny 会失败，故轮询重试 init 直到 material 生成（最多 20 次 × 500ms）
        this.tryInit(0);
    }
    private tryInit(attempt: number)
    {
        if (this.material || !this.isValid) return;
        if (attempt >= 30) return;
        // 3.8.8 内核适配：init 内部任何异常不得断重试链（catch 兜底）
        this.init().catch(() => { /* ignore, retry below */ }).then(() =>
        {
            if (!this.material)
            {
                this.scheduleOnce(() => this.tryInit(attempt + 1), 0.5);
            }
        });
    }
    public resetInEditor()
    {
        this.init();
    }
//    /**
//     * 初始化组件
//     */
    private async init()
    {
//        /**
//         * 编辑器环境下自动绑定 Effect 资源
//         * 依赖于 EditorAsset 模块，没有该模块请将此代码块以及顶部导入语句去除
//         * @see EditorAsset.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/misc/EditorAsset.ts
//         */
        if (CC_EDITOR && !this._effect)
        {
            await new Promise(res =>
            {
                const path = 'eazax-cresources/effects/eazax-hollowout.effect';
                EditorAsset.load(path, 'effect', (err: Error, result: EffectAsset) =>
                {
                    if (err) warn(`[${this['__proto__']['__classname__']}]`, '请手动指定组件的 Effect 资源！');
                    else this._effect = result;
                    res(result);
                });
            });
        }
        // 3.8.8 内核适配：运行时 _effect 序列化引用可能丢失（场景反序列化后为 null），
        // 且 effect 不进 resources bundle paths 表，用 uuid loadAny 兜底（实测可用）
        if (!this._effect && !CC_EDITOR)
        {
            await new Promise(res =>
            {
                assetManager.loadAny({ uuid: 'ad322569-d205-4d94-ad8d-7a591d59dfcb' }, (err: Error, result: EffectAsset) =>
                {
                    if (!err && result) this._effect = result;
                    res(result);
                });
            });
        }
        if (!this._effect) return;
        // 2026-10-18 修复（白屏根因）：自定义 hollowout shader 在原生（jsb/gfxstream）渲染异常，
        // 表现为整屏粉白半透遮罩盖住全部内容。原生端一律走确定性 Graphics 四带遮罩（drawMaskFallback），
        // 不创建/不应用自定义材质；浏览器端保留原 shader 路径。
        if (CC_JSB)
        {
            this._nativeMask = true;
            // 关键：禁用 mask 节点 Sprite（无自定义材质时它会以默认材质渲染整屏粉白=白屏观感）
            const sp0 = this.node.getComponent(Sprite);
            if (sp0) sp0.enabled = false;
            this.updateProperties();
            return;
        }
//        // 使用自定义 Effect 需禁用纹理的 packable 属性（因为动态合图之后无法正确获取纹理 UV 坐标）
//        // 详情请看：https://docs.cocos.com/creator/manual/zh/asset-workflow/sprite.html#packable
        this.sprite = this.node.getComponent(Sprite);
        // 3.8.8 内核适配：sprite/spriteFrame 可能未就绪，加 guard 防中断
        if (!this.sprite) return;
        if (this.sprite.spriteFrame) this.sprite.spriteFrame.packable = false;
//        // 生成并应用材质
        this.material = (() => { const _m = new Material(); _m.initialize({ effectAsset: this._effect }); return _m; })();
        this.sprite.setMaterial(this.material, 0);
//        // 更新材质属性
        this.updateProperties();
    }
//    /**
//     * 更新材质属性
//     */
    // 3.8.8 内核适配：自定义 effect 不可用时的 Graphics 遮罩回退——
    // 在镂空矩形外画四条半透明遮罩带（上/下/左/右），视觉等价于镂空遮罩
    private drawMaskFallback()
    {
        // 3.8.8 内核适配：Graphics 与 Sprite 同节点会触发 renderable 冲突警告，
        // 回退遮罩画在独立子节点上
        let host = this.node.getChildByName('__mask_fb__');
        if (!host)
        {
            host = new Node('__mask_fb__');
            host.layer = this.node.layer;
            host.addComponent(UITransform);
            host.setParent(this.node);
            host.setPosition(v3(0, 0, 0));
        }
        let g = host.getComponent(Graphics);
        if (!g) g = host.addComponent(Graphics);
        const hut = host.getComponent(UITransform);
        const nut = this.node.getComponent(UITransform);
        if (hut && nut) hut.setContentSize(nut.contentSize);
        g.clear();
        if (!nut) return;
        const W = nut.width, H = nut.height;
        const cx = this._center.x, cy = this._center.y;
        const hw = this._width / 2, hh = this._height / 2;
        g.fillColor = new Color(0, 0, 0, 160);
        // 上带
        g.rect(-W / 2, cy + hh, W, H / 2 - (cy + hh));
        g.fill();
        // 下带
        g.rect(-W / 2, -H / 2, W, (cy - hh) + H / 2);
        g.fill();
        // 左带（镂空区高度内）
        g.rect(-W / 2, cy - hh, (cx - hw) + W / 2, hh * 2);
        g.fill();
        // 右带
        g.rect(cx + hw, cy - hh, W / 2 - (cx + hw), hh * 2);
        g.fill();
    }
    private updateProperties()
    {
        // 2026-10-18：原生端 Graphics 遮罩模式直接放行（rect/circle 内部走 drawMaskFallback）
        if (this._nativeMask)
        {
            switch (this._shape)
            {
                case HollowOutShape.Rect:
                    this.rect(this._center, this._width, this._height, this._round, this._feather);
                    break;
                case HollowOutShape.Circle:
                    this.circle(this._center, this._radius, this._feather);
                    break;
            }
            return;
        }
        // 3.8.8 内核适配：material 未就绪时自愈重试，不静默丢弃本次属性更新后的状态
        if (!this.material)
        {
            this.tryInit(0);
            return;
        }
        switch (this._shape)
        {
            case HollowOutShape.Rect:
                this.rect(this._center, this._width, this._height, this._round, this._feather);
                break;
            case HollowOutShape.Circle:
                this.circle(this._center, this._radius, this._feather);
                break;
        }
    }
//    /**
//     * 矩形镂空
//     * @param center 中心坐标
//     * @param width 宽
//     * @param height 高
//     * @param round 圆角半径
//     * @param feather 边缘虚化宽度
//     */
    public rect(center?: Vec3, width?: number, height?: number, round?: number, feather?: number)
    {
        this._shape = HollowOutShape.Rect;
        if (center !== null) this._center = center;
        if (width !== null) this._width = width;
        if (height !== null) this._height = height;
        if (round !== null)
        {
            this._round = round >= 0 ? round : 0;
            const min = Math.min(this._width / 2, this._height / 2);
            this._round = this._round <= min ? this._round : min;
        }
        if (feather !== null)
        {
            this._feather = feather >= 0 ? feather : 0;
            this._feather = this._feather <= this._round ? this._feather : this._round;
        }
        // 3.8.8 内核适配：material 未就绪（sprite/effect 缺失）时用 Graphics 遮罩带兜底，
        // 保证引导镂空可见且不崩溃；material 就绪后走原 shader 路径
        if (!this.material)
        {
            this.drawMaskFallback();
            return;
        }
        this.material.setProperty('size', this.getNodeSize());
        this.material.setProperty('center', this.getCenter(this._center));
        this.material.setProperty('width', this.getWidth(this._width));
        this.material.setProperty('height', this.getHeight(this._height));
        this.material.setProperty('round', this.getRound(this._round));
        this.material.setProperty('feather', this.getFeather(this._feather));
    }
//    /**
//     * 圆形镂空
//     * @param center 中心坐标
//     * @param radius 半径
//     * @param feather 边缘虚化宽度
//     */
    public circle(center?: Vec3, radius?: number, feather?: number)
    {
        this._shape = HollowOutShape.Circle;
        if (center !== null) this._center = center;
        if (radius !== null) this._radius = radius;
        if (feather !== null) this._feather = feather >= 0 ? feather : 0;
        // 2026-10-18：原生 Graphics 模式用矩形带近似圆遮罩（引导仅用 Rect，此分支保底）
        if (this._nativeMask)
        {
            this.drawMaskFallback();
            return;
        }
        // 3.8.8 内核适配：material 未就绪时跳过
        if (!this.material) return;
        this.material.setProperty('size', this.getNodeSize());
        this.material.setProperty('center', this.getCenter(this._center));
        this.material.setProperty('width', this.getWidth(this._radius * 2));
        this.material.setProperty('height', this.getHeight(this._radius * 2));
        this.material.setProperty('round', this.getRound(this._radius));
        this.material.setProperty('feather', this.getFeather(this._feather));
    }
//    /**
//     * 缓动镂空（矩形）
//     * @param time 时间
//     * @param center 中心坐标
//     * @param width 宽
//     * @param height 高
//     * @param round 圆角半径
//     * @param feather 边缘虚化宽度
//     */
    public rectTo(time: number, center: Vec3, width: number, height: number, round: number = 0, feather: number = 0): Promise<void>
    {
        return new Promise(res =>
        {
            Tween.stopAllByTarget(this);
            this.unscheduleAllCallbacks();
            this.tweenRes && this.tweenRes();
            this.tweenRes = res;
            if (round > width / 2) round = width / 2;
            if (round > height / 2) round = height / 2;
            if (feather > round) feather = round;
            this._shape = HollowOutShape.Rect;
            tween<HollowOut>(this)
                .to(time, {
                    center: center,
                    width: width,
                    height: height,
                    round: round,
                    feather: feather
                })
                .call(() =>
                {
                    this.scheduleOnce(() =>
                    {
                        if (this.tweenRes)
                        {
                            this.tweenRes();
                            this.tweenRes = null;
                        }
                    });
                })
                .start();
        });
    }
//    /**
//     * 缓动镂空（圆形）
//     * @param time 时间
//     * @param center 中心坐标
//     * @param radius 半径
//     * @param feather 边缘虚化宽度
//     */
    public circleTo(time: number, center: Vec3, radius: number, feather: number = 0): Promise<void>
    {
        return new Promise(res =>
        {
            Tween.stopAllByTarget(this);
            this.unscheduleAllCallbacks();
            this.tweenRes && this.tweenRes();
            this.tweenRes = res;
            this._shape = HollowOutShape.Circle;
            tween<HollowOut>(this)
                .to(time, {
                    center: center,
                    radius: radius,
                    feather: feather
                })
                .call(() =>
                {
                    this.scheduleOnce(() =>
                    {
                        if (this.tweenRes)
                        {
                            this.tweenRes();
                            this.tweenRes = null;
                        }
                    });
                })
                .start();
        });
    }
//    /**
//     * 取消所有挖孔
//     */
    public reset()
    {
        this.rect(v3(), 0, 0, 0, 0);
    }
//    /**
//     * 挖孔设为节点大小（就整个都挖没了）
//     */
    public nodeSize()
    {
        this._radius = Math.sqrt(getNodeWidth(this.node) * getNodeWidth(this.node) + getNodeHeight(this.node) * getNodeHeight(this.node)) / 2;
        this.rect(this.node.getPosition(), getNodeWidth(this.node), getNodeHeight(this.node), 0, 0);
    }
//    /**
//     * 获取中心点
//     * @param center 
//     */
    private getCenter(center: Vec3)
    {
        let x = (center.x + (getNodeWidth(this.node) / 2)) / getNodeWidth(this.node);
        let y = (-center.y + (getNodeHeight(this.node) / 2)) / getNodeHeight(this.node);
        // 3.8.8 内核适配：shader uniform 为 vec2(FLOAT2)，必须返回 v2 而非 v3
        return v2(x, y);
    }
//    /**
//     * 获取节点尺寸
//     */
    private getNodeSize()
    {
        // 3.8.8 内核适配：shader uniform 为 vec2(FLOAT2)
        return v2(getNodeWidth(this.node), getNodeHeight(this.node));
    }
//    /**
//     * 获取挖孔宽度
//     * @param width 
//     */
    private getWidth(width: number)
    {
        return width / getNodeWidth(this.node);
    }
//    /**
//     * 获取挖孔高度
//     * @param height 
//     */
    private getHeight(height: number)
    {
        return height / getNodeWidth(this.node);
    }
//    /**
//     * 获取圆角半径
//     * @param round 
//     */
    private getRound(round: number)
    {
        return round / getNodeWidth(this.node);
    }
//    /**
//     * 获取边缘虚化宽度
//     * @param feather 
//     */
    private getFeather(feather: number)
    {
        return feather / getNodeWidth(this.node);
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import EditorAsset from "../../manager/EditorAsset";
// 
// const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple, executionOrder } = cc._decorator;
// 
// /** 镂空形状 */
// export enum HollowOutShape
// {
//     /** 矩形 */
//     Rect = 1,
//     /** 圆形 */
//     Circle
// }
// 
// /**
//  * 挖孔 Shader 组件，该组件需要对应的 Effect 才能正常使用！
//  * @see HollowOut.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/HollowOut.ts
//  * @see eazax-hollowout.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-hollowout.effect
//  */
// @ccclass
// @requireComponent(cc.Sprite)
// @executeInEditMode
// @disallowMultiple
// @executionOrder(-100)
// export default class HollowOut extends cc.Component
// {
// 
//     @property private _effect: cc.EffectAsset = null;
//     @property({ type: cc.EffectAsset, tooltip: CC_DEV && 'Effect 资源', readonly: true })
//     public get effect() { return this._effect; }
//     public set effect(value: cc.EffectAsset) { this._effect = value; this.init(); }
// 
//     @property private _shape: HollowOutShape = HollowOutShape.Rect;
//     @property({ type: cc.Enum(HollowOutShape), tooltip: CC_DEV && '镂空形状' })
//     public get shape() { return this._shape; }
//     public set shape(value: HollowOutShape) { this._shape = value; this.updateProperties(); }
// 
//     @property private _center: cc.Vec2 = cc.v2();
//     @property({ tooltip: CC_DEV && '中心坐标' })
//     public get center() { return this._center; }
//     public set center(value: cc.Vec2) { this._center = value; this.updateProperties(); }
// 
//     @property private _width: number = 300;
//     @property({ tooltip: CC_DEV && '宽', visible() { return this.shape === HollowOutShape.Rect; } })
//     public get width() { return this._width; }
//     public set width(value: number) { this._width = value; this.updateProperties(); }
// 
//     @property private _height: number = 300;
//     @property({ tooltip: CC_DEV && '高', visible() { return this.shape === HollowOutShape.Rect; } })
//     public get height() { return this._height; }
//     public set height(value: number) { this._height = value; this.updateProperties(); }
// 
//     @property private _round: number = 1;
//     @property({ tooltip: CC_DEV && '圆角半径', visible() { return this.shape === HollowOutShape.Rect; } })
//     public get round() { return this._round; }
//     public set round(value: number) { this._round = value; this.updateProperties(); }
// 
//     @property private _radius: number = 200;
//     @property({ tooltip: CC_DEV && '半径', visible() { return this.shape === HollowOutShape.Circle; } })
//     public get radius() { return this._radius; }
//     public set radius(value: number) { this._radius = value; this.updateProperties(); }
// 
//     @property private _feather: number = 0.5;
//     @property({ tooltip: CC_DEV && '边缘虚化宽度', visible() { return this.shape === HollowOutShape.Circle || this.round > 0; } })
//     public get feather() { return this._feather; }
//     public set feather(value: number) { this._feather = value; this.updateProperties(); }
// 
//     private sprite: cc.Sprite = null;
// 
//     private material: cc.Material = null;
// 
//     private tweenRes: () => void = null;
// 
//     protected onLoad()
//     {
//         this.init();
//     }
// 
//     protected resetInEditor()
//     {
//         this.init();
//     }
// 
//     /**
//      * 初始化组件
//      */
//     private async init()
//     {
//         /**
//          * 编辑器环境下自动绑定 Effect 资源
//          * 依赖于 EditorAsset 模块，没有该模块请将此代码块以及顶部导入语句去除
//          * @see EditorAsset.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/misc/EditorAsset.ts
//          */
//         if (CC_EDITOR && !this._effect)
//         {
//             await new Promise(res =>
//             {
//                 const path = 'eazax-ccc/resources/effects/eazax-hollowout.effect';
//                 EditorAsset.load(path, 'effect', (err: Error, result: cc.EffectAsset) =>
//                 {
//                     if (err) cc.warn(`[${this['__proto__']['__classname__']}]`, '请手动指定组件的 Effect 资源！');
//                     else this._effect = result;
//                     res(result);
//                 });
//             });
//         }
//         if (!this._effect) return;
// 
//         // 使用自定义 Effect 需禁用纹理的 packable 属性（因为动态合图之后无法正确获取纹理 UV 坐标）
//         // 详情请看：https://docs.cocos.com/creator/manual/zh/asset-workflow/sprite.html#packable
//         this.sprite = this.node.getComponent(cc.Sprite);
//         if (this.sprite.spriteFrame) this.sprite.spriteFrame.packable = false;
//         // 生成并应用材质
//         this.material = cc.(() => { const _m = new Material(); _m.initialize({ effectAsset: this._effect }); return _m; })();
//         this.sprite.setMaterial(0, this.material);
//         // 更新材质属性
//         this.updateProperties();
//     }
// 
//     /**
//      * 更新材质属性
//      */
//     private updateProperties()
//     {
//         switch (this._shape)
//         {
//             case HollowOutShape.Rect:
//                 this.rect(this._center, this._width, this._height, this._round, this._feather);
//                 break;
//             case HollowOutShape.Circle:
//                 this.circle(this._center, this._radius, this._feather);
//                 break;
//         }
//     }
// 
//     /**
//      * 矩形镂空
//      * @param center 中心坐标
//      * @param width 宽
//      * @param height 高
//      * @param round 圆角半径
//      * @param feather 边缘虚化宽度
//      */
//     public rect(center?: cc.Vec2, width?: number, height?: number, round?: number, feather?: number)
//     {
//         this._shape = HollowOutShape.Rect;
// 
//         if (center !== null) this._center = center;
//         if (width !== null) this._width = width;
//         if (height !== null) this._height = height;
//         if (round !== null)
//         {
//             this._round = round >= 0 ? round : 0;
//             const min = Math.min(this._width / 2, this._height / 2);
//             this._round = this._round <= min ? this._round : min;
//         }
//         if (feather !== null)
//         {
//             this._feather = feather >= 0 ? feather : 0;
//             this._feather = this._feather <= this._round ? this._feather : this._round;
//         }
// 
//         this.material.setProperty('size', this.getNodeSize());
//         this.material.setProperty('center', this.getCenter(this._center));
//         this.material.setProperty('width', this.getWidth(this._width));
//         this.material.setProperty('height', this.getHeight(this._height));
//         this.material.setProperty('round', this.getRound(this._round));
//         this.material.setProperty('feather', this.getFeather(this._feather));
//     }
// 
//     /**
//      * 圆形镂空
//      * @param center 中心坐标
//      * @param radius 半径
//      * @param feather 边缘虚化宽度
//      */
//     public circle(center?: cc.Vec2, radius?: number, feather?: number)
//     {
//         this._shape = HollowOutShape.Circle;
// 
//         if (center !== null) this._center = center;
//         if (radius !== null) this._radius = radius;
//         if (feather !== null) this._feather = feather >= 0 ? feather : 0;
// 
//         this.material.setProperty('size', this.getNodeSize());
//         this.material.setProperty('center', this.getCenter(this._center));
//         this.material.setProperty('width', this.getWidth(this._radius * 2));
//         this.material.setProperty('height', this.getHeight(this._radius * 2));
//         this.material.setProperty('round', this.getRound(this._radius));
//         this.material.setProperty('feather', this.getFeather(this._feather));
//     }
// 
//     /**
//      * 缓动镂空（矩形）
//      * @param time 时间
//      * @param center 中心坐标
//      * @param width 宽
//      * @param height 高
//      * @param round 圆角半径
//      * @param feather 边缘虚化宽度
//      */
//     public rectTo(time: number, center: cc.Vec2, width: number, height: number, round: number = 0, feather: number = 0): Promise<void>
//     {
//         return new Promise(res =>
//         {
//             cc.Tween.stopAllByTarget(this);
//             this.unscheduleAllCallbacks();
// 
//             this.tweenRes && this.tweenRes();
//             this.tweenRes = res;
// 
//             if (round > width / 2) round = width / 2;
//             if (round > height / 2) round = height / 2;
//             if (feather > round) feather = round;
// 
//             this._shape = HollowOutShape.Rect;
// 
//             cc.tween<HollowOut>(this)
//                 .to(time, {
//                     center: center,
//                     width: width,
//                     height: height,
//                     round: round,
//                     feather: feather
//                 })
//                 .call(() =>
//                 {
//                     this.scheduleOnce(() =>
//                     {
//                         if (this.tweenRes)
//                         {
//                             this.tweenRes();
//                             this.tweenRes = null;
//                         }
//                     });
//                 })
//                 .start();
//         });
//     }
// 
//     /**
//      * 缓动镂空（圆形）
//      * @param time 时间
//      * @param center 中心坐标
//      * @param radius 半径
//      * @param feather 边缘虚化宽度
//      */
//     public circleTo(time: number, center: cc.Vec2, radius: number, feather: number = 0): Promise<void>
//     {
//         return new Promise(res =>
//         {
//             cc.Tween.stopAllByTarget(this);
//             this.unscheduleAllCallbacks();
// 
//             this.tweenRes && this.tweenRes();
//             this.tweenRes = res;
// 
//             this._shape = HollowOutShape.Circle;
// 
//             cc.tween<HollowOut>(this)
//                 .to(time, {
//                     center: center,
//                     radius: radius,
//                     feather: feather
//                 })
//                 .call(() =>
//                 {
//                     this.scheduleOnce(() =>
//                     {
//                         if (this.tweenRes)
//                         {
//                             this.tweenRes();
//                             this.tweenRes = null;
//                         }
//                     });
//                 })
//                 .start();
//         });
//     }
// 
//     /**
//      * 取消所有挖孔
//      */
//     public reset()
//     {
//         this.rect(cc.v2(), 0, 0, 0, 0);
//     }
// 
//     /**
//      * 挖孔设为节点大小（就整个都挖没了）
//      */
//     public nodeSize()
//     {
//         this._radius = Math.sqrt(this.node.width * this.node.width + this.node.height * this.node.height) / 2;
//         this.rect(this.node.getPosition(), this.node.width, this.node.height, 0, 0);
//     }
// 
//     /**
//      * 获取中心点
//      * @param center 
//      */
//     private getCenter(center: cc.Vec2)
//     {
//         let x = (center.x + (this.node.width / 2)) / this.node.width;
//         let y = (-center.y + (this.node.height / 2)) / this.node.height;
//         return cc.v2(x, y);
//     }
// 
//     /**
//      * 获取节点尺寸
//      */
//     private getNodeSize()
//     {
//         return cc.v2(this.node.width, this.node.height);
//     }
// 
//     /**
//      * 获取挖孔宽度
//      * @param width 
//      */
//     private getWidth(width: number)
//     {
//         return width / this.node.width;
//     }
// 
//     /**
//      * 获取挖孔高度
//      * @param height 
//      */
//     private getHeight(height: number)
//     {
//         return height / this.node.width;
//     }
// 
//     /**
//      * 获取圆角半径
//      * @param round 
//      */
//     private getRound(round: number)
//     {
//         return round / this.node.width;
//     }
// 
//     /**
//      * 获取边缘虚化宽度
//      * @param feather 
//      */
//     private getFeather(feather: number)
//     {
//         return feather / this.node.width;
//     }
// 
// }
