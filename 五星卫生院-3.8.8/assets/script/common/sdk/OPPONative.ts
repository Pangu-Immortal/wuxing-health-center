import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import { Config } from "../manager/Config";
import GameSys from "../manager/GameSys";
let BINDER_NAME: string = ''

@ccclass('OPPONative')
export default class OPPONatived extends Component
{
    onLoad() { }
    onDestory()
    {
        console.log("销毁节点")
//        // GameSys.game.xSet(Config.OPPO, false)
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import { Config } from "../manager/Config";
// import GameSys from "../manager/GameSys";
// 
// const { ccclass, property } = cc._decorator;
// 
// let BINDER_NAME: string = ''
// @ccclass
// export default class OPPONatived extends cc.Component
// {
//     onLoad() { }
//     onDestory()
//     {
//         console.log("销毁节点")
//         // GameSys.game.xSet(Config.OPPO, false)
//     }
// }
