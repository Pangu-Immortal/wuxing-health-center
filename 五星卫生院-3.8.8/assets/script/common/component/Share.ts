import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import GameSys from "../manager/GameSys";

@ccclass('Share')
export default class Share extends Component
{
    onLoad()
    {
        this.node.active = GameSys.share;
        this.node.on(Node.EventType.TOUCH_START, this.onTouchShare.bind(this))
    }
    async onTouchShare()
    {
        GameSys.audio.playSFX("audios/click");
        let res = await GameSys.sdk.shareApp() as boolean;
        if (res)
        {
        }
        else
        {
        }
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import GameSys from "../manager/GameSys";
// 
// const { ccclass, property } = cc._decorator;
// 
// @ccclass
// export default class Share extends cc.Component
// {
//     onLoad()
//     {
//         this.node.active = GameSys.share;
//         this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchShare.bind(this))
//     }
// 
//     async onTouchShare()
//     {
//         GameSys.audio.playSFX("audios/click");
// 
//         let res = await GameSys.sdk.shareApp() as boolean;
//         if (res)
//         {
// 
//         }
//         else
//         {
// 
//         }
//     }
// 
// }
