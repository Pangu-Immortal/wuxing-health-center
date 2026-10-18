import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

let BINDER_NAME: string = ''

@ccclass('ZIndex')
export default class NewClass extends Component
{
    @property
    index: number = 0;
    onLoad()
    {
        this.node.zIndex = this.index
    }
    onDestory() { }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// const { ccclass, property } = cc._decorator;
// 
// let BINDER_NAME: string = ''
// @ccclass
// export default class NewClass extends cc.Component
// {
// 
//     @property()
//     index: number = 0;
// 
//     onLoad()
//     {
//         this.node.zIndex = this.index
//     }
//     onDestory() { }
// }
