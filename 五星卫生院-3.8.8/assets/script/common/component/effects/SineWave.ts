import { DEV as CC_DEV, EDITOR as CC_EDITOR } from 'cc/env';
import { Component, EffectAsset, Enum, Material, Sprite, SpriteFrame, _decorator, resources, warn } from 'cc';
const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple, executionOrder } = _decorator;

import EditorAsset from "../../manager/EditorAsset";
// /** 波浪方向 */
export enum SineWaveDirection
{
//     /** 左 */
    Left = 1,
//     /** 右 */
    Right
}
// /**
//  * 正弦波浪 Shader 组件，该组件需要对应的 Effect 才能正常使用！
//  * @see SineWave.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/SineWave.ts
//  * @see eazax-sine-wave.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-sine-wave.effect
//  */

@ccclass('SineWave')
@requireComponent(Sprite)@executeInEditMode@disallowMultiple@executionOrder(-100)
export default class SineWave extends Component
{
    private _effect: EffectAsset | null = null;
    @property({ type: EffectAsset, tooltip: CC_DEV && 'Effect 资源', readonly: true })
    public get effect() { return this._effect; }
    public set effect(value: EffectAsset) { this._effect = value; this.init(); }
    @property private _amplitude: number = 0.05;
    @property({ tooltip: CC_DEV && '振幅（节点高度比例）' })
    public get amplitude() { return this._amplitude; }
    public set amplitude(value: number) { this._amplitude = value; this.updateProperties(); }
    @property private _angularVelocity: number = 10;
    @property({ tooltip: CC_DEV && '角速度' })
    public get angularVelocity() { return this._angularVelocity; }
    public set angularVelocity(value: number) { this._angularVelocity = value; this.updateProperties(); }
    @property private _frequency: number = 10;
    @property({ tooltip: CC_DEV && '频率' })
    public get frequency() { return this._frequency; }
    public set frequency(value: number) { this._frequency = value; this.updateProperties(); }
    @property private _height: number = 0.5;
    @property({ tooltip: CC_DEV && '顶端高度（节点高度比例）' })
    public get height() { return this._height; }
    public set height(value: number) { this._height = value; this.updateProperties(); }
    @property private _direction: SineWaveDirection = SineWaveDirection.Left;
    @property({ type: Enum(SineWaveDirection), tooltip: CC_DEV && '波浪方向' })
    public get direction() { return this._direction; }
    public set direction(value: SineWaveDirection) { this._direction = value; this.updateProperties(); }
    private sprite: Sprite | null = null;
    private material: Material | null = null;
    protected onLoad()
    {
        this.init();
    }
    public resetInEditor()
    {
        this.init();
    }
//    /**
//     * 初始化
//     */
    public async init()
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
                const path = 'eazax-cresources/effects/eazax-sine-wave.effect';
                EditorAsset.load(path, 'effect', (err: Error, result: EffectAsset) =>
                {
                    if (err) warn(`[${this['__proto__']['__classname__']}]`, '请手动指定组件的 Effect 资源！');
                    else this._effect = result;
                    res(result);
                });
            });
        }
        if (!this._effect) return;
//        // 使用自定义 Effect 需禁用纹理的 packable 属性（因为动态合图之后无法正确获取纹理 UV 坐标）
//        // 详情请看：https://docs.cocos.com/creator/manual/zh/asset-workflow/sprite.html#packable
        this.sprite = this.node.getComponent(Sprite);
        if (this.sprite.spriteFrame) this.sprite.spriteFrame.packable = false;
//        // 生成并应用材质
        this.material = (() => { const _m = new Material(); _m.initialize({ effectAsset: this._effect }); return _m; })();
        this.sprite.setMaterial(this.material, 0);
//        // 更新材质属性
        this.updateProperties();
    }
//    /**
//     * 设置图像
//     * @param spriteFrame 精灵
//     */
    public setSpriteFrame(spriteFrame: SpriteFrame)
    {
        this.sprite.spriteFrame = spriteFrame;
        this.sprite.spriteFrame.packable = false;
//        // 更新材质属性
        this.updateProperties();
    }
//    /**
//     * 更新材质属性
//     */
    public updateProperties()
    {
        if (!this.effect) return warn('[SineWave]', '请指定 Effect 资源！');
        this.material.setProperty('amplitude', this._amplitude);
        this.material.setProperty('angularVelocity', this._angularVelocity);
        this.material.setProperty('frequency', this._frequency);
        this.material.setProperty('offset', ((1.0 - this._height) + this._amplitude));
        this.material.setProperty('toLeft', this._direction === SineWaveDirection.Left ? 1 : 0);
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import EditorAsset from "../../manager/EditorAsset";
// 
// const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple, executionOrder } = cc._decorator;
// 
// /** 波浪方向 */
// export enum SineWaveDirection
// {
//     /** 左 */
//     Left = 1,
//     /** 右 */
//     Right
// }
// 
// /**
//  * 正弦波浪 Shader 组件，该组件需要对应的 Effect 才能正常使用！
//  * @see SineWave.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/SineWave.ts
//  * @see eazax-sine-wave.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-sine-wave.effect
//  */
// @ccclass
// @requireComponent(cc.Sprite)
// @executeInEditMode
// @disallowMultiple
// @executionOrder(-100)
// export default class SineWave extends cc.Component
// {
// 
//     @property private _effect: cc.EffectAsset = null;
//     @property({ type: cc.EffectAsset, tooltip: CC_DEV && 'Effect 资源', readonly: true })
//     public get effect() { return this._effect; }
//     public set effect(value: cc.EffectAsset) { this._effect = value; this.init(); }
// 
//     @property private _amplitude: number = 0.05;
//     @property({ tooltip: CC_DEV && '振幅（节点高度比例）' })
//     public get amplitude() { return this._amplitude; }
//     public set amplitude(value: number) { this._amplitude = value; this.updateProperties(); }
// 
//     @property private _angularVelocity: number = 10;
//     @property({ tooltip: CC_DEV && '角速度' })
//     public get angularVelocity() { return this._angularVelocity; }
//     public set angularVelocity(value: number) { this._angularVelocity = value; this.updateProperties(); }
// 
//     @property private _frequency: number = 10;
//     @property({ tooltip: CC_DEV && '频率' })
//     public get frequency() { return this._frequency; }
//     public set frequency(value: number) { this._frequency = value; this.updateProperties(); }
// 
//     @property private _height: number = 0.5;
//     @property({ tooltip: CC_DEV && '顶端高度（节点高度比例）' })
//     public get height() { return this._height; }
//     public set height(value: number) { this._height = value; this.updateProperties(); }
// 
//     @property private _direction: SineWaveDirection = SineWaveDirection.Left;
//     @property({ type: cc.Enum(SineWaveDirection), tooltip: CC_DEV && '波浪方向' })
//     public get direction() { return this._direction; }
//     public set direction(value: SineWaveDirection) { this._direction = value; this.updateProperties(); }
// 
//     private sprite: cc.Sprite = null;
// 
//     private material: cc.Material = null;
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
//      * 初始化
//      */
//     public async init()
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
//                 const path = 'eazax-ccc/resources/effects/eazax-sine-wave.effect';
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
//      * 设置图像
//      * @param spriteFrame 精灵
//      */
//     public setSpriteFrame(spriteFrame: cc.SpriteFrame)
//     {
//         this.sprite.spriteFrame = spriteFrame;
//         this.sprite.(spriteFrame.texture as any).packable = false;
//         // 更新材质属性
//         this.updateProperties();
//     }
// 
//     /**
//      * 更新材质属性
//      */
//     public updateProperties()
//     {
//         if (!this.effect) return cc.warn('[SineWave]', '请指定 Effect 资源！');
//         this.material.setProperty('amplitude', this._amplitude);
//         this.material.setProperty('angularVelocity', this._angularVelocity);
//         this.material.setProperty('frequency', this._frequency);
//         this.material.setProperty('offset', ((1.0 - this._height) + this._amplitude));
//         this.material.setProperty('toLeft', this._direction === SineWaveDirection.Left ? 1 : 0);
//     }
// 
// }
