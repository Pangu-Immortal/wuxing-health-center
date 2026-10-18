import { Component, Node, _decorator, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

import Caches from "../common/manager/Caches";
import { Config, PopupPath } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import PopupManager, { PopupCacheMode, PopupShowPriority } from "../common/manager/PopupManager";
let BINDER_NAME: string = 'ttrec'

@ccclass('TTRec')
export default class TTRec extends Component
{
    @property(Node)
    bg: Node | null = null;
    onLoad()
    {
        if (GameSys.channel == "tt")
        {
//            // if (!Caches.get)
            GameSys.startRec()
            this.time = Math.floor(Math.random() * 20) + 40;
            console.log("[flow] TTRec time", this.time)
            GameSys.game.xBind(Config.TTOVER, this.change_over.bind(this), BINDER_NAME)
            this.bg.on(Node.EventType.TOUCH_START, this.onTouchRec.bind(this))
        }
    }
    change_over()
    {
        console.log("++++++")
        GameSys.startRec();
        this.keeping = 0;
        this.click = false;
        this.unscheduleAllCallbacks()
        this.bg.stopAllActions();
        this.bg.active = false;
        this.time = Math.floor(Math.random() * 20) + 40
        this.over = false;
    }
    anim()
    {
        GameSys.stopRec();
        this.keeping = 0;
        this.over = true
        this.bg.active = true
        tween(this.bg)
            .to(0.3, { scale: v3(1.2, 1.2, 1.2)})
            .delay(0.1)
            .to(0.3, { scale: v3(1, 1, 1)})
            .delay(0.1)
            .union().repeatForever()
            .start()
        this.scheduleOnce(() =>
        {
            this.bg.stopAllActions();
            this.bg.active = false;
            this.time = Math.floor(Math.random() * 20) + 40
            this.over = false;
            GameSys.startRec();
        }, 5)
    }
    onTouchRec()
    {
        if (this.click)
            return
        this.click = true;
        this.unscheduleAllCallbacks();
        const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
        PopupManager.show(PopupPath.ttrec, options, PopupCacheMode.Frequent, PopupShowPriority.None)
    }
    onDestroy()
    {
        GameSys.game.xUnbind(BINDER_NAME);
    }
    time: number = 0;
    keeping: number = 0;
    over: boolean = false;
    click: boolean = false;
    update(dt)
    {
        if (GameSys.channel !== "tt")
            return
        if (this.over)
            return
        if (this.click)
            return
        this.keeping += dt
        if (this.keeping > this.time)
        {
            this.anim();
        }
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import Caches from "../common/manager/Caches";
// import { Config, PopupPath } from "../common/manager/Config";
// import GameSys from "../common/manager/GameSys";
// import PopupManager, { PopupCacheMode, PopupShowPriority } from "../common/manager/PopupManager";
// 
// const { ccclass, property } = cc._decorator;
// 
// let BINDER_NAME: string = 'ttrec'
// @ccclass
// export default class TTRec extends cc.Component
// {
// 
//     @property(cc.Node)
//     bg: cc.Node = null;
// 
//     onLoad()
//     {
//         if (GameSys.channel == "tt")
//         {
//             // if (!Caches.get)
//             GameSys.startRec()
//             this.time = Math.floor(Math.random() * 20) + 40;
//             console.error("=====", this.time)
//             GameSys.game.xBind(Config.TTOVER, this.change_over.bind(this), BINDER_NAME)
//             this.bg.on(cc.Node.EventType.TOUCH_START, this.onTouchRec.bind(this))
//         }
//     }
//     change_over()
//     {
//         console.log("++++++")
//         GameSys.startRec();
//         this.keeping = 0;
//         this.click = false;
//         this.unscheduleAllCallbacks()
//         this.bg.stopAllActions();
//         this.bg.active = false;
//         this.time = Math.floor(Math.random() * 20) + 40
//         this.over = false;
//     }
//     anim()
//     {
//         GameSys.stopRec();
//         this.keeping = 0;
//         this.over = true
//         this.bg.active = true
//         cc.tween(this.bg)
//             .to(0.3, { scale: 1.2 })
//             .delay(0.1)
//             .to(0.3, { scale: 1 })
//             .delay(0.1)
//             .union().repeatForever()
//             .start()
//         this.scheduleOnce(() =>
//         {
//             this.bg.stopAllActions();
//             this.bg.active = false;
//             this.time = Math.floor(Math.random() * 20) + 40
//             this.over = false;
//             GameSys.startRec();
//         }, 5)
//     }
//     onTouchRec()
//     {
//         if (this.click)
//             return
//         this.click = true;
//         this.unscheduleAllCallbacks();
//         const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
//         PopupManager.show(PopupPath.ttrec, options, PopupCacheMode.Frequent, PopupShowPriority.None)
//     }
//     onDestroy()
//     {
//         GameSys.game.xUnbind(BINDER_NAME);
//     }
//     time: number = 0;
//     keeping: number = 0;
//     over: boolean = false;
//     click: boolean = false;
//     update(dt)
//     {
//         if (GameSys.channel !== "tt")
//             return
//         if (this.over)
//             return
//         if (this.click)
//             return
//         this.keeping += dt
//         if (this.keeping > this.time)
//         {
// 
//             this.anim();
//         }
//     }
// }
