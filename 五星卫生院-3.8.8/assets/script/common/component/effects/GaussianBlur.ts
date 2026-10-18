import { getNodeWidth, getNodeHeight, setNodeWidth, setNodeHeight } from '../../NodeCompat';
import { DEV as CC_DEV, EDITOR as CC_EDITOR } from 'cc/env';
import { Component, EffectAsset, Material, Sprite, _decorator, resources, v2, warn } from 'cc';
const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple, executionOrder } = _decorator;

import EditorAsset from "../../manager/EditorAsset";
// /**
//  * 高斯模糊 Shader 组件，该组件需要对应的 Effect 才能正常使用！
//  * @see GaussianBlur.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/GaussianBlur.ts
//  * @see eazax-gaussian-blur-adjustable.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-gaussian-blur-adjustable.effect
//  */

@ccclass('GaussianBlur')
@requireComponent(Sprite)@executeInEditMode@disallowMultiple@executionOrder(-100)
export default class GaussianBlur extends Component
{
    private _effect: EffectAsset | null = null;
    @property({ type: EffectAsset, tooltip: CC_DEV && 'Effect 资源', readonly: true })
    public get effect() { return this._effect; }
    public set effect(value: EffectAsset) { this._effect = value; this.init(); }
    @property private _radius: number = 10;
    @property({ tooltip: CC_DEV && '模糊半径' })
    public get radius() { return this._radius; }
    public set radius(value: number) { this._radius = value > 50 ? 50 : value; this.updateProperties(); }
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
                const path = 'eazax-cresources/effects/eazax-gaussian-blur-adjustable.effect';
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
//     * 更新材质属性
//     */
    private updateProperties()
    {
        this.material.setProperty('size', this.getNodeSize());
        this.material.setProperty('radius', this.radius);
    }
//    /**
//     * 获取节点尺寸
//     */
    private getNodeSize()
    {
        return v2(getNodeWidth(this.node), getNodeHeight(this.node));
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import EditorAsset from "../../manager/EditorAsset";
// 
// const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple, executionOrder } = cc._decorator;
// 
// /**
//  * 高斯模糊 Shader 组件，该组件需要对应的 Effect 才能正常使用！
//  * @see GaussianBlur.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/GaussianBlur.ts
//  * @see eazax-gaussian-blur-adjustable.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-gaussian-blur-adjustable.effect
//  */
// @ccclass
// @requireComponent(cc.Sprite)
// @executeInEditMode
// @disallowMultiple
// @executionOrder(-100)
// export default class GaussianBlur extends cc.Component
// {
// 
//     @property private _effect: cc.EffectAsset = null;
//     @property({ type: cc.EffectAsset, tooltip: CC_DEV && 'Effect 资源', readonly: true })
//     public get effect() { return this._effect; }
//     public set effect(value: cc.EffectAsset) { this._effect = value; this.init(); }
// 
//     @property private _radius: number = 10;
//     @property({ tooltip: CC_DEV && '模糊半径' })
//     public get radius() { return this._radius; }
//     public set radius(value: number) { this._radius = value > 50 ? 50 : value; this.updateProperties(); }
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
//                 const path = 'eazax-ccc/resources/effects/eazax-gaussian-blur-adjustable.effect';
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
//         this.material.setProperty('size', this.getNodeSize());
//         this.material.setProperty('radius', this.radius);
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
// }
