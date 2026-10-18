import { _decorator, Component } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('StateManager')
@menu("按钮组件/StateManager")
export default class StateManager extends Component
{
    public nowState: number = 0;
    static use_buildings: any;
//    //public allState: number = 0;
    start()
    {
//        //this.allState = this.node.childrenCount;
    }
    async stateChange(v: number)
    {
        for (let i: number = 0; i < this.node.children.length; i++)
        {
            this.node.children[i].active = false;
        }
        if (v >= 0 && v < this.node.children.length)
        {
            this.nowState = v;
            this.node.children[v].active = true;
            return this.node.children[v];
        }
    }
//    //全部展示
    stateAll(v: number)
    {
        if (v >= 0 && v < this.node.children.length)
        {
            for (let i: number = 0; i < v; i++)
            {
                this.node.children[i].active = true;
            }
        }
    }
//    //全部隐藏
    stateHide()
    {
        for (let i: number = 0; i < this.node.children.length; i++)
        {
            this.node.children[i].active = false;
        }
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// const { ccclass, property, menu } = cc._decorator;
// 
// @ccclass
// @menu("按钮组件/StateManager")
// export default class StateManager extends cc.Component
// {
//     public nowState: number = 0;
//     static use_buildings: any;
//     //public allState: number = 0;
// 
//     start()
//     {
//         //this.allState = this.node.childrenCount;
//     }
// 
//     async stateChange(v: number)
//     {
//         for (let i: number = 0; i < this.node.children.length; i++)
//         {
//             this.node.children[i].active = false;
//         }
//         if (v >= 0 && v < this.node.children.length)
//         {
//             this.nowState = v;
//             this.node.children[v].active = true;
//             return this.node.children[v];
//         }
//     }
//     //全部展示
//     stateAll(v: number)
//     {
//         if (v >= 0 && v < this.node.children.length)
//         {
//             for (let i: number = 0; i < v; i++)
//             {
//                 this.node.children[i].active = true;
//             }
//         }
//     }
//     //全部隐藏
//     stateHide()
//     {
//         for (let i: number = 0; i < this.node.children.length; i++)
//         {
//             this.node.children[i].active = false;
//         }
//     }
// }
