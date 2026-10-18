import { DEBUG as CC_DEBUG } from 'cc/env';
import { Component, Label, Node, Sprite, SpriteFrame, _decorator, error, loader, resources, tween } from 'cc';
const { ccclass, property } = _decorator;

export type PictureData = {
    index: number//下标
    path: string//路径
}

@ccclass('ScrollItemPre')
export default class ScrollItemPre extends Component
{
    @property(Sprite)
    picSprite: Sprite | null = null;
    @property(Label)
    descLabel: Label | null = null;
    @property(Node)
    placeHolderContentNode: Node | null = null;
    @property(Node)
    placeHolderLoadingNode: Node | null = null;
    private data: PictureData = null;
    onLoad()
    {
        this.node.opacity = 0;
    }
    init(_data: PictureData)
    {
        this.data = _data;
    }
//    /**
//         * 本Item进入ScrollView的时候回调
//         */
    onEnterSrcollView()
    {
        this.node.opacity = 255;
        this._loadAndShowPic();
    }
//    /**
//     * 本Item离开ScrollView的时候回调
//     */
    onExitScrollView()
    {
        this.node.opacity = 0;
    }
    private _showPlaceHolder()
    {
        this.placeHolderContentNode.active = true;
        this.placeHolderContentNode.stopAllActions();
        this.placeHolderContentNode.opacity = 255;
        this.placeHolderLoadingNode.stopAllActions();
        tween(this.placeHolderContentNode)
            .by(1, { angle: 360 })
            .union().repeatForever()
            .start()
//        //this.placeHolderLoadingNode.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
    }
    async _loadAndShowPic()
    {
        this._showPlaceHolder();
        await new Promise((resolve, reject) =>
        {
            setTimeout(() =>
            {
                resolve(null as any)
            }, 160);
        })
//        //this.picSprite.spriteFrame = await this.loadSpriteFrameFromResources(this.data.path) as cc.SpriteFrame
//        //this.descLabel.string = `${this.data.index}: ${this.data.path}`;
//        //this.descLabel.string = `${this.data.index}`
        this._hidePlaceHolder();
    }
    private _hidePlaceHolder()
    {
        this.placeHolderContentNode.stopAllActions();
        tween(this.placeHolderContentNode)
            .delay(0.24)
            .call(() =>
            {
                this.placeHolderContentNode.active = false;
                this.placeHolderLoadingNode.stopAllActions();
            })
            .start()
//        // this.placeHolderContentNode.runAction(
//        //     cc.sequence(
//        //         cc.fadeOut(0.24),
//        //         cc.callFunc(() =>
//        //         {
//        //             this.placeHolderContentNode.active = false;
//        //             this.placeHolderLoadingNode.stopAllActions();
//        //         }, this)
//        //     )
//        // );
    }
    loadSpriteFrameFromResources(spriteFrameUrl: string)
    {
        return new Promise<SpriteFrame>((resolve, reject) =>
        {
            resources.load(spriteFrameUrl, SpriteFrame, (error: Error, spriteFrame) =>
            {
                if (error != null)
                {
                    // 3.8.8 内核适配：SpriteFrame 在 /spriteFrame 子资产路径，主路径失败时回退
                    resources.load(spriteFrameUrl + '/spriteFrame', SpriteFrame, (error2: Error, spriteFrame2) =>
                    {
                        if (error2 != null)
                        {
                            if (CC_DEBUG)
                            {
                                console.error(`load (${spriteFrameUrl}) failed!`);
                                console.error(error2);
                            }
                            reject(error2);
                            return;
                        }
                        resolve(spriteFrame2);
                    });
                    return;
                }
                resolve(spriteFrame);
            });
        });
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// const { ccclass, property } = cc._decorator;
// 
// export type PictureData = {
//     index: number//下标
//     path: string//路径
// }
// @ccclass
// export default class ScrollItemPre extends cc.Component
// {
//     @property(cc.Sprite)
//     picSprite: cc.Sprite = null;
// 
//     @property(cc.Label)
//     descLabel: cc.Label = null;
// 
//     @property(cc.Node)
//     placeHolderContentNode: cc.Node = null;
// 
//     @property(cc.Node)
//     placeHolderLoadingNode: cc.Node = null;
// 
//     private data: PictureData = null;
//     onLoad()
//     {
//         this.node.opacity = 0;
//     }
// 
//     init(_data: PictureData)
//     {
//         this.data = _data;
//     }
//     /**
//          * 本Item进入ScrollView的时候回调
//          */
//     onEnterSrcollView()
//     {
//         this.node.opacity = 255;
//         this._loadAndShowPic();
//     }
//     /**
//      * 本Item离开ScrollView的时候回调
//      */
//     onExitScrollView()
//     {
//         this.node.opacity = 0;
//     }
//     private _showPlaceHolder()
//     {
//         this.placeHolderContentNode.active = true;
//         this.placeHolderContentNode.stopAllActions();
//         this.placeHolderContentNode.opacity = 255;
// 
//         this.placeHolderLoadingNode.stopAllActions();
//         cc.tween(this.placeHolderContentNode)
//             .by(1, { angle: 360 })
//             .union().repeatForever()
//             .start()
// 
//         //this.placeHolderLoadingNode.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
//     }
// 
//     async _loadAndShowPic()
//     {
//         this._showPlaceHolder();
// 
//         await new Promise((resolve, reject) =>
//         {
//             setTimeout(() =>
//             {
//                 resolve()
//             }, 160);
//         })
//         //this.picSprite.spriteFrame = await this.loadSpriteFrameFromResources(this.data.path) as cc.SpriteFrame
//         //this.descLabel.string = `${this.data.index}: ${this.data.path}`;
//         //this.descLabel.string = `${this.data.index}`
//         this._hidePlaceHolder();
//     }
//     private _hidePlaceHolder()
//     {
//         this.placeHolderContentNode.stopAllActions();
//         cc.tween(this.placeHolderContentNode)
//             .delay(0.24)
//             .call(() =>
//             {
//                 this.placeHolderContentNode.active = false;
//                 this.placeHolderLoadingNode.stopAllActions();
//             })
//             .start()
// 
// 
//         // this.placeHolderContentNode.runAction(
//         //     cc.sequence(
//         //         cc.fadeOut(0.24),
//         //         cc.callFunc(() =>
//         //         {
//         //             this.placeHolderContentNode.active = false;
//         //             this.placeHolderLoadingNode.stopAllActions();
//         //         }, this)
//         //     )
//         // );
//     }
//     loadSpriteFrameFromResources(spriteFrameUrl: string)
//     {
//         return new Promise<cc.SpriteFrame>((resolve, reject) =>
//         {
//             resources.load(spriteFrameUrl, cc.SpriteFrame, (error: Error, spriteFrame) =>
//             {
//                 if (error != null)
//                 {
//                     if (CC_DEBUG)
//                     {
//                         cc.error(`load (${spriteFrameUrl}) failed!`);
//                         cc.error(error);
//                     }
//                     reject(error);
//                     return;
//                 }
//                 resolve(spriteFrame);
//             });
//         });
//     }
// }
