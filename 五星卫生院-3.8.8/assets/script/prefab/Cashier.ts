import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
let BINDER_NAME: string = 'Cashier'

@ccclass('Cashier')
export default class Cashier extends Component
{
    onLoad()
    {
        GameSys.game.xBind(Config.HIDEALL, this.change_hide.bind(this), BINDER_NAME)
    }
    change_hide(v: boolean)
    {
        v ? this.node.opacity = 0 : this.node.opacity = 255
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
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
// let BINDER_NAME: string = 'Cashier'
// @ccclass
// export default class Cashier extends cc.Component
// {
//     onLoad()
//     {
//         GameSys.game.xBind(Config.HIDEALL, this.change_hide.bind(this), BINDER_NAME)
//     }
//     change_hide(v: boolean)
//     {
//         v ? this.node.opacity = 0 : this.node.opacity = 255
//     }
//     onDestory()
//     {
//         GameSys.game.xUnbind(BINDER_NAME)
//     }
// }
