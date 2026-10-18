import { Node, Prefab, _decorator, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import PopupBase from "../common/component/popups/PopupBase";
import Caches from "../common/manager/Caches";
import { Config, WAREHOUSE } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import Warehouse_item from "./Warehouse_item";
let BINDER_NAME: string = ''

@ccclass('Warehouse')
export default class Warehouse extends PopupBase<string>
{
    @property(Node)
    content: Node | null = null;
    @property(Prefab)
    item: Prefab | null = null;
    private index: number = 0;
    onLoad()
    {
        for (let i = 0; i < 3; i++)
        {
            let item: Node = instantiate(this.item)
            item.parent = this.content;
            item.getComponent(Warehouse_item).init(WAREHOUSE[i], i);
        }
    }
    onEnable()
    {
        this.node.zIndex = 10;
//        // console.log("//////", this.index,)
        for (let i = 0; i < this.content.children.length; i++)
        {
//            // console.error(i + this.index * 3)
            this.content.children[i].getComponent(Warehouse_item).init(WAREHOUSE[i + this.index * 3], i);
        }
//        // this.index = 0;
//        // this.content.destroyAllChildren();
        if (Caches.get(Caches.newGuide))
        {
            GameSys.game.xSet(Config.OPPO, true)
            GameSys.showBanner();
            GameSys.showInter();
        }
    }
    onTouchLeft()
    {
        if (this.index == 0)
            return;
        this.index--;
        console.log(this.index)
        GameSys.game.xSet(Config.WAREHOUSEANIM, this.index)
    }
    onTouchRight()
    {
        if (this.index == 3)
            return;
        this.index++;
        console.log(this.index)
        GameSys.game.xSet(Config.WAREHOUSEANIM, this.index)
    }
    onTouchhide()
    {
        if (Caches.get(Caches.newGuide))
        {
            GameSys.hideBanner();
        }
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 31)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 32)
            }
        }
        this.hide();
    }
    onDestory()
    {
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import PopupBase from "../common/component/popups/PopupBase";
// import Caches from "../common/manager/Caches";
// import { Config, WAREHOUSE } from "../common/manager/Config";
// import GameSys from "../common/manager/GameSys";
// import Warehouse_item from "./Warehouse_item";
// 
// const { ccclass, property } = cc._decorator;
// 
// let BINDER_NAME: string = ''
// @ccclass
// export default class Warehouse extends PopupBase<string>
// {
//     @property(cc.Node)
//     content: cc.Node = null;
//     @property(cc.Prefab)
//     item: cc.Prefab = null;
// 
//     private index: number = 0;
// 
//     onLoad()
//     {
//         for (let i = 0; i < 3; i++)
//         {
//             let item: cc.Node = cc.instantiate(this.item)
//             item.parent = this.content;
//             item.getComponent(Warehouse_item).init(WAREHOUSE[i], i);
//         }
// 
//     }
//     onEnable()
//     {
//         this.node.zIndex = 10;
//         // console.log("//////", this.index,)
//         for (let i = 0; i < this.content.childrenCount; i++)
//         {
//             // console.error(i + this.index * 3)
//             this.content.children[i].getComponent(Warehouse_item).init(WAREHOUSE[i + this.index * 3], i);
//         }
//         // this.index = 0;
//         // this.content.destroyAllChildren();
//         if (Caches.get(Caches.newGuide))
//         {
//             GameSys.game.xSet(Config.OPPO, true)
//             GameSys.showBanner();
//             GameSys.showInter();
//         }
//     }
// 
//     onTouchLeft()
//     {
//         if (this.index == 0)
//             return;
//         this.index--;
//         console.log(this.index)
//         GameSys.game.xSet(Config.WAREHOUSEANIM, this.index)
//     }
//     onTouchRight()
//     {
//         if (this.index == 3)
//             return;
//         this.index++;
//         console.log(this.index)
//         GameSys.game.xSet(Config.WAREHOUSEANIM, this.index)
//     }
//     onTouchhide()
//     {
//         if (Caches.get(Caches.newGuide))
//         {
//             GameSys.hideBanner();
//         }
//         if (!Caches.get(Caches.newGuide))
//         {
//             if (GameSys.game.xGet(Config.NEWGUIDECON) == 31)
//             {
//                 GameSys.game.xSet(Config.NEWGUIDECON, 32)
//             }
//         }
//         this.hide();
//     }
//     onDestory()
//     {
// 
//     }
// }
