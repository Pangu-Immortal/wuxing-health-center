import { _decorator, Component, Label, tween } from 'cc';
const { ccclass, property } = _decorator;

import { Config } from "../manager/Config";
import GameSys from "../manager/GameSys";

@ccclass('TIp')
export default class Tip extends Component
{
    @property(Label)
    public label: Label | null = null;
    init(_label: string)
    {
        this.label.string = _label;
        this.node.zIndex = 120;
        tween(this.node)
            .to(0.2, { y: this.node.y + 100 })
            .delay(0.5)
            .to(0.5, { opacity: 0 })
            .call(() =>
            {
                this.label.string = '';
                this.node.destroy();
            })
            .start()
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import { Config } from "../manager/Config";
// import GameSys from "../manager/GameSys";
// 
// const { ccclass, property } = cc._decorator;
// @ccclass
// export default class Tip extends cc.Component
// {
//     @property(cc.Label)
//     public label: cc.Label = null;
// 
//     init(_label: string)
//     {
//         this.label.string = _label;
//         this.node.zIndex = 120;
//         cc.tween(this.node)
//             .to(0.2, { y: this.node.y + 100 })
//             .delay(0.5)
//             .to(0.5, { opacity: 0 })
//             .call(() =>
//             {
//                 this.label.string = '';
//                 this.node.destroy();
//             })
//             .start()
//     }
// }
