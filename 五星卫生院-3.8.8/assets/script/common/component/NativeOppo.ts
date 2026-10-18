import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import GameSys from "../manager/GameSys";

@ccclass('NativeOppo')
export default class Transit extends Component
{
    onTouchClose()
    {
        let value: number = Math.random()
        if (value < 0.1)
        {
            this.node.parent.destroy()
            GameSys.sdk.xSet("hideNative")
        }
    }
    onDestroy()
    {
        this.node.parent.destroy()
        GameSys.sdk.xSet("hideNative")
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
// export default class Transit extends cc.Component
// {
//     onTouchClose()
//     {
//         let value: number = Math.random()
//         if (value < 0.1)
//         {
//             this.node.parent.destroy()
//             GameSys.sdk.xSet("hideNative")
//         }
//     }
//     onDestroy()
//     {
//         this.node.parent.destroy()
//         GameSys.sdk.xSet("hideNative")
//     }
// }
