import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property } = _decorator;

import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
let BINDER_NAME: string = 'LockShop'

@ccclass('LockShop')
export default class LockShop extends Component
{
    @property
    lock: number = 0;
    onLoad()
    {
        GameSys.game.xBind(Config.LEVEL, this.change_state.bind(this), BINDER_NAME)
        this.change_state()
    }
    change_state()
    {
        if (GameSys.level >= this.lock)
        {
            this.node.getComponent(Sprite).enabled = true;
        }
        else
        {
            this.node.getComponent(Sprite).enabled = false;
        }
    }
    onDestroy()
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
// let BINDER_NAME: string = 'LockShop'
// @ccclass
// export default class LockShop extends cc.Component
// {
//     @property()
//     lock: number = 0;
// 
//     onLoad()
//     {
//         GameSys.game.xBind(Config.LEVEL, this.change_state.bind(this), BINDER_NAME)
//         this.change_state()
//     }
//     change_state()
//     {
//         if (GameSys.level >= this.lock)
//         {
//             this.node.getComponent(cc.Sprite).enabled = true;
//         }
//         else
//         {
//             this.node.getComponent(cc.Sprite).enabled = false;
//         }
//     }
//     onDestroy()
//     {
//         GameSys.game.xUnbind(BINDER_NAME)
//     }
// }
