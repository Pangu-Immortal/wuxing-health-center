import { _decorator, Component, Prefab, Node, Label, find, v3, instantiate, tween } from 'cc';
const { ccclass, property } = _decorator;

import { Config } from "../manager/Config";
import GameSys from "../manager/GameSys";
let BINDER_NAME = 'lab_gold'

@ccclass('Gold')
export default class Gold extends Component
{
    @property(Prefab)
    reduce: Prefab | null = null;
    @property(Node)
    goldPos: Node | null = null;
    @property(Label)
    label: Label | null = null;
//    // initReducePos: cc.Vec3
    onLoad()
    {
        this.label.string = GameSys.game.xGet(Config.GOLD).v.toString()
        GameSys.game.xBind(Config.GOLD, this.goldChange.bind(this), BINDER_NAME)
        let canvas = find('Canvas')
        GameSys.game.xSet(Config.GOLDPOS, canvas.convertToNodeSpaceAR(this.goldPos.convertToWorldSpaceAR(v3(0, 0, 0))))
    }
    goldChange(_data: { v: number, index: number })
    {
        console.log("金币", _data.index)
        if (_data.index > 0)
        {
            let reduce = instantiate(this.reduce)
            reduce.children[0].getComponent(Label).string = `+${_data.index}`
            this.node.addChild(reduce)
            tween(reduce)
                .to(1, { y: reduce.y + 60, opacity: 255 })
                .to(0, { y: reduce.y - 60, opacity: 0 })
                .start()
        }
        else
        {
            let reduce = instantiate(this.reduce)
            this.node.addChild(reduce)
            reduce.children[0].getComponent(Label).string = `${_data.index}`
            tween(reduce)
                .to(1, { y: reduce.y - 60, opacity: 255 })
                .to(0, { y: reduce.y + 60, opacity: 0 })
                .call(() =>
                {
                    reduce.destroy();
                })
                .start()
        }
        this.label.string = _data.v.toString()
    }
    onTouchGoldPanel()
    {
//        //点击调用金币面板
    }
    onDestroy()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import { Config } from "../manager/Config";
// import GameSys from "../manager/GameSys";
// 
// const { ccclass, property } = cc._decorator;
// let BINDER_NAME = 'lab_gold'
// @ccclass
// export default class Gold extends cc.Component
// {
//     @property(cc.Prefab)
//     reduce: cc.Prefab = null;
//     @property(cc.Node)
//     goldPos: cc.Node = null;
//     @property(cc.Label)
//     label: cc.Label = null;
// 
//     // initReducePos: cc.Vec3
//     onLoad()
//     {
//         this.label.string = GameSys.game.xGet(Config.GOLD).v.toString()
//         GameSys.game.xBind(Config.GOLD, this.goldChange.bind(this), BINDER_NAME)
// 
//         let canvas = cc.find('Canvas')
//         GameSys.game.xSet(Config.GOLDPOS, canvas.convertToNodeSpaceAR(this.goldPos.convertToWorldSpaceAR(cc.v3(0, 0, 0))))
//     }
//     goldChange(_data: { v: number, index: number })
//     {
//         console.log("金币", _data.index)
//         if (_data.index > 0)
//         {
//             let reduce = cc.instantiate(this.reduce)
//             reduce.children[0].getComponent(cc.Label).string = `+${_data.index}`
//             this.node.addChild(reduce)
//             cc.tween(reduce)
//                 .to(1, { y: reduce.y + 60, opacity: 255 })
//                 .to(0, { y: reduce.y - 60, opacity: 0 })
//                 .start()
// 
//         }
//         else
//         {
//             let reduce = cc.instantiate(this.reduce)
//             this.node.addChild(reduce)
//             reduce.children[0].getComponent(cc.Label).string = `${_data.index}`
// 
//             cc.tween(reduce)
//                 .to(1, { y: reduce.y - 60, opacity: 255 })
//                 .to(0, { y: reduce.y + 60, opacity: 0 })
//                 .call(() =>
//                 {
//                     reduce.destroy();
//                 })
//                 .start()
//         }
//         this.label.string = _data.v.toString()
//     }
//     onTouchGoldPanel()
//     {
//         //点击调用金币面板
//     }
//     onDestroy()
//     {
//         GameSys.game.xUnbind(BINDER_NAME)
//     }
// }
