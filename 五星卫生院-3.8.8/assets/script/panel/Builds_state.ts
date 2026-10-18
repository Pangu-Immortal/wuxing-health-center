import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
let BINDER_NAME: string = ''

@ccclass('BuildsState')
export default class Builds_State extends Component
{
    @property
    index: number = 0
    onEnable()
    {
//        // console.error(this.node.name)
//        // if (this.index == 0)
//        // {
//        //     GameSys.game.xSet(Config.BUILDINGSAPP, false)
//        //     GameSys.game.xSet(Config.BUILDINGSUP, true)
//        // }
//        // else
//        // {
//        //     GameSys.game.xSet(Config.BUILDINGSUP, false)
//        //     GameSys.game.xSet(Config.BUILDINGSAPP, true)
//        // }
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import { Config } from "../common/manager/Config";
// import GameSys from "../common/manager/GameSys";
// 
// const { ccclass, property } = cc._decorator;
// 
// let BINDER_NAME: string = ''
// @ccclass
// export default class Builds_State extends cc.Component
// {
//     @property()
//     index: number = 0
//     onEnable()
//     {
//         // console.error(this.node.name)
//         // if (this.index == 0)
//         // {
//         //     GameSys.game.xSet(Config.BUILDINGSAPP, false)
//         //     GameSys.game.xSet(Config.BUILDINGSUP, true)
//         // }
//         // else
//         // {
//         //     GameSys.game.xSet(Config.BUILDINGSUP, false)
//         //     GameSys.game.xSet(Config.BUILDINGSAPP, true)
//         // }
//     }
// }
