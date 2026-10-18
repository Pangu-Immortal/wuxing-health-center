import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import PopupManager, { PopupCacheMode, PopupShowPriority } from "./common/manager/PopupManager";
import TestPopup from "./TestPopup";

@ccclass('PopupTest')
export default class PopupTest extends Component
{
    @property(Node)
    btn: Node | null = null;
    protected onLoad()
    {
        this.registerEvent();
    }
    protected onDestroy()
    {
        this.unregisterEvent();
    }
    private registerEvent()
    {
        this.btn.on(Node.EventType.TOUCH_END, this.onClick, this);
    }
    private unregisterEvent()
    {
        this.btn.off(Node.EventType.TOUCH_END, this.onClick, this);
    }
    private onClick()
    {
        const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
        PopupManager.show(TestPopup.path, options, PopupCacheMode.Frequent, PopupShowPriority.None)
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import PopupManager, { PopupCacheMode, PopupShowPriority } from "./common/manager/PopupManager";
// import TestPopup from "./TestPopup";
// 
// const { ccclass, property } = cc._decorator;
// 
// @ccclass
// export default class PopupTest extends cc.Component
// {
// 
//     @property(cc.Node)
//     btn: cc.Node = null;
// 
//     protected onLoad()
//     {
//         this.registerEvent();
//     }
// 
//     protected onDestroy()
//     {
//         this.unregisterEvent();
//     }
// 
//     private registerEvent()
//     {
//         this.btn.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
//     }
//     private unregisterEvent()
//     {
//         this.btn.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
//     }
// 
//     private onClick()
//     {
//         const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
// 
//         PopupManager.show(TestPopup.path, options, PopupCacheMode.Frequent, PopupShowPriority.None)
//     }
// }
