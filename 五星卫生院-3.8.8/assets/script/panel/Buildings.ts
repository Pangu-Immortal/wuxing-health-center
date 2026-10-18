import { _decorator, Prefab, Node, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import PopupBase from "../common/component/popups/PopupBase";
import { BUILDINGS, Config, In_Save_Buildings } from "../common/manager/Config";

@ccclass('Buildings')
export default class Buildings extends PopupBase<string>
{
    @property(Prefab)
    item: Prefab | null = null;
    @property(Node)
    content: Node | null = null;
    onLoad()
    {
        for (let i = 0; i <= BUILDINGS[BUILDINGS.length - 1].index; i++)
        {
            let item = instantiate(this.item)
            item.parent = this.content;
        }
    }
    onTouchClose()
    {
        this.hide();
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import PopupBase from "../common/component/popups/PopupBase";
// import { BUILDINGS, Config, In_Save_Buildings } from "../common/manager/Config";
// 
// const { ccclass, property } = cc._decorator;
// 
// @ccclass
// export default class Buildings extends PopupBase<string>
// {
//     @property(cc.Prefab)
//     item: cc.Prefab = null;
//     @property(cc.Node)
//     content: cc.Node = null;
//     onLoad()
//     {
//         for (let i = 0; i <= BUILDINGS[BUILDINGS.length - 1].index; i++)
//         {
//             let item = cc.instantiate(this.item)
//             item.parent = this.content;
//         }
//     }
//     onTouchClose()
//     {
//         this.hide();
//     }
// }
