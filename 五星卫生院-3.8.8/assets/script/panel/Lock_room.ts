import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import StaticManager from "../common/manager/StaticManager";
let BINDER_NAME: string = 'lock_room'

@ccclass('LockRoom')
export default class Lock_Room extends Component
{
    @property(Node)
    toilet_3: Node | null = null;
    @property(Node)
    heye: Node | null = null;
    @property(Node)
    toilet_3_32: Node | null = null;
    onLoad()
    {
        if (StaticManager.getInstance().open_buildings.length >= 4)
        {
            this.toilet_3_32.active = true
            this.toilet_3.active = true;
            this.heye.active = true;
        }
        GameSys.game.xBind(Config.LOCKROOM, this.changeSate.bind(this), BINDER_NAME)
    }
    changeSate()
    {
        this.toilet_3.active = true;
        let y = this.toilet_3.y
        let heyeY = this.heye.y
        this.toilet_3.y = y + 200;
        this.heye.y = heyeY + 200
        tween(this.toilet_3)
            .to(1, { y: y })
            .start()
        tween(this.heye)
            .to(1, { y: heyeY })
            .start()
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
// import StaticManager from "../common/manager/StaticManager";
// 
// const { ccclass, property } = cc._decorator;
// 
// let BINDER_NAME: string = 'lock_room'
// @ccclass
// export default class Lock_Room extends cc.Component
// {
//     @property(cc.Node)
//     toilet_3: cc.Node = null;
//     @property(cc.Node)
//     heye: cc.Node = null;
//     @property(cc.Node)
//     toilet_3_32: cc.Node = null;
// 
//     onLoad()
//     {
//         if (StaticManager.getInstance().open_buildings.length >= 4)
//         {
//             this.toilet_3_32.active = true
//             this.toilet_3.active = true;
//             this.heye.active = true;
//         }
//         GameSys.game.xBind(Config.LOCKROOM, this.changeSate.bind(this), BINDER_NAME)
//     }
//     changeSate()
//     {
//         this.toilet_3.active = true;
//         let y = this.toilet_3.y
//         let heyeY = this.heye.y
//         this.toilet_3.y = y + 200;
//         this.heye.y = heyeY + 200
//         cc.tween(this.toilet_3)
//             .to(1, { y: y })
//             .start()
//         cc.tween(this.heye)
//             .to(1, { y: heyeY })
//             .start()
//     }
//     onDestory()
//     {
//         GameSys.game.xUnbind(BINDER_NAME)
//     }
// }
