import { _decorator, Component, Node, Sprite, Label, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

import { Config, In_Save_Shop, In_SHOP, TipLab } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import UtilsManager from "../common/manager/UtilsManager";
let BINDER_NAME: string = 'shop_item'

@ccclass('ShopItem')
export default class Shop_Item extends Component
{
    @property(Node)
    red: Node | null = null;
    @property(Sprite)
    spr: Sprite | null = null;
    @property(Node)
    select: Node | null = null;
    @property(Node)
    select_1: Node | null = null;
    @property(Label)
    name_lab: Label | null = null;
    private index: number
    async init(_data: In_SHOP, index: number, selectIndex: number)
    {
        this.index = index
        this.name_lab.string = _data.name
        let path = 'shop/' + _data.name
        this.spr.spriteFrame = await UtilsManager.loadImage(path) as SpriteFrame
        this.select_item(selectIndex)
        GameSys.game.xBind(Config.SELECTSHOP, this.select_item.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.STOCKOUT, this.change_red.bind(this), BINDER_NAME)
        this.node.on(Node.EventType.TOUCH_END, this.onTouchSelect.bind(this))
        let data = GameSys.game.xGet(Config.STOCKOUT)
        if (data)
        {
            this.change_red(data)
        }
    }
    change_red(data: { index: number, v: boolean })
    {
        if (data.index == this.index)
        {
            this.red.active = data.v
        }
    }
    select_item(index: number)
    {
        if (index == this.index)
        {
            this.select.active = true;
            this.select_1.active = true
        }
        else
        {
            this.select.active = false;
            this.select_1.active = false
        }
    }
    onTouchSelect()
    {
        GameSys.audio.playSFX("audios/close");
        GameSys.game.xSet(Config.SELECTSHOP, this.index)
    }
    onDestroy()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import { Config, In_Save_Shop, In_SHOP, TipLab } from "../common/manager/Config";
// import GameSys from "../common/manager/GameSys";
// import UtilsManager from "../common/manager/UtilsManager";
// 
// const { ccclass, property } = cc._decorator;
// 
// let BINDER_NAME: string = 'shop_item'
// @ccclass
// export default class Shop_Item extends cc.Component
// {
//     @property(cc.Node)
//     red: cc.Node = null;
// 
//     @property(cc.Sprite)
//     spr: cc.Sprite = null;
//     @property(cc.Node)
//     select: cc.Node = null;
//     @property(cc.Node)
//     select_1: cc.Node = null;
//     @property(cc.Label)
//     name_lab: cc.Label = null;
// 
//     private index: number
//     async init(_data: In_SHOP, index: number, selectIndex: number)
//     {
//         this.index = index
//         this.name_lab.string = _data.name
//         let path = 'shop/' + _data.name
//         this.spr.spriteFrame = await UtilsManager.loadImage(path) as cc.SpriteFrame
//         this.select_item(selectIndex)
//         GameSys.game.xBind(Config.SELECTSHOP, this.select_item.bind(this), BINDER_NAME)
//         GameSys.game.xBind(Config.STOCKOUT, this.change_red.bind(this), BINDER_NAME)
//         this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchSelect.bind(this))
//         let data = GameSys.game.xGet(Config.STOCKOUT)
//         if (data)
//         {
//             this.change_red(data)
//         }
//     }
//     change_red(data: { index: number, v: boolean })
//     {
//         if (data.index == this.index)
//         {
//             this.red.active = data.v
//         }
//     }
//     select_item(index: number)
//     {
//         if (index == this.index)
//         {
//             this.select.active = true;
//             this.select_1.active = true
//         }
//         else
//         {
//             this.select.active = false;
//             this.select_1.active = false
//         }
//     }
//     onTouchSelect()
//     {
//         GameSys.audio.playSFX("audios/close");
//         GameSys.game.xSet(Config.SELECTSHOP, this.index)
//     }
//     onDestroy()
//     {
//         GameSys.game.xUnbind(BINDER_NAME)
//     }
// }
