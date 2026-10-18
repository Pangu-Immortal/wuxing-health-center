import { getNodeWidth, getNodeHeight, setNodeWidth, setNodeHeight } from '../common/NodeCompat';
import { Component, Graphics, Intersection2D, Mask, Node, Rect, Sprite, SpriteFrame, Vec2, _decorator, color, geometry, rect , UITransform } from 'cc';
const { ccclass, property } = _decorator;

import Caches from "../common/manager/Caches";
import { CLEANGARBAGE, Config, In_Save_Buildings } from "../common/manager/Config";
import DataManager from "../common/manager/DataManager";
import GameSys from "../common/manager/GameSys";
import StaticManager from "../common/manager/StaticManager";
import UtilsManager from "../common/manager/UtilsManager";

const CALC_RECT_WIDTH = 40;
const CLEAR_LINE_WIDTH = 40;
@ccclass('Garbage_Smear')
export default class Garbage_Smear extends Component 
{
    @property(Sprite)
    spr: Sprite = null;
    @property(Node)
    maskNode: Node = null;
    @property(Node)
    ticketNode: Node = null;
    static instance: Garbage_Smear

    opacity: number = 0;
    binder_name: string = ''
    changeGarbageNode(index: number)
    {
        if (index == 3) return;
        if (index == -1) return
        let num: number;
        if (index == 0)
        {
            num = DataManager.getInstance().cleanGarbageInfo.transparency1
            console.log("查看", DataManager.getInstance().cleanGarbageInfo)
            this.node.opacity = this.node.opacity - (255 * num)
            this.opacity = this.node.opacity
        }
        else if (index == 1)
        {
            num = DataManager.getInstance().cleanGarbageInfo.transparency2
            this.node.opacity = this.node.opacity - (255 * num)
            this.opacity = this.node.opacity
        }
        else if (index == 2)
        {
            // num = DataManager.getInstance().cleanGarbageInfo.transparency3
            DataManager.getInstance().garbageItem.on(Node.EventType.TOUCH_START, this.touchStartEvent, this);
            DataManager.getInstance().garbageItem.on(Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
            DataManager.getInstance().garbageItem.on(Node.EventType.TOUCH_END, this.touchEndEvent, this);
            DataManager.getInstance().garbageItem.on(Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this);
        }


        // if (index == 2)
        // {
        //     this.cleanOver();
        // }
    }
    private redIndex: number;
    async init(_path: string, index: number, binder: string)
    {
        // console.error("进来", _path, index)
        this.binder_name = binder;
        this.redIndex = index;
        this.spr.spriteFrame = await UtilsManager.loadImage("garbage/" + _path) as SpriteFrame
        this.node.getComponent(UITransform).setContentSize(this.spr.node.getComponent(UITransform).contentSize);

        // DataManager.getInstance().garbageNode = this.node;

    }
    onLoad()
    {
        this.reset();
        // this.ticketNode.on(Node.EventType.TOUCH_START, this.touchStartEvent, this);
        // this.ticketNode.on(Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
        // this.ticketNode.on(Node.EventType.TOUCH_END, this.touchEndEvent, this);
        // this.ticketNode.on(Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this);

    }
    onEnable()
    {
        this.node.opacity = 255
        GameSys.game.xBind(Config.GARBAGEOPACITY, this.changeGarbageNode.bind(this), this.binder_name)
    }
    change_active(data: { show: boolean, index: number })
    {
        if (data.index == this.redIndex)
        {
            this.node.active = data.show;
        }
    }
    beforeDestroy()
    {
        this.ticketNode.off(Node.EventType.TOUCH_START, this.touchStartEvent, this);
        this.ticketNode.off(Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
        this.ticketNode.on(Node.EventType.TOUCH_END, this.touchEndEvent, this);
        this.ticketNode.on(Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this);
    }

    touchStartEvent(event)
    {
        let point = this.ticketNode.convertToNodeSpaceAR(event.getLocation());
        this.clearMask(point);
        this.node.opacity = this.opacity
    }

    touchMoveEvent(event)
    {
        let point = this.ticketNode.convertToNodeSpaceAR(event.getLocation());
        this.clearMask(point);
        this.node.opacity = this.opacity
    }

    touchEndEvent()
    {
        this.tempDrawPoints = [];
        this.calcProgress();
        this.node.opacity = this.opacity
    }

    calcDebugger: boolean = false; // 辅助开关，开启则会绘制划开涂层所属的小格子
    calcProgress()
    {

        let hitItemCount = 0;
        let ctx = this.ticketNode.getComponent(Graphics);
        this.polygonPointsList.forEach((item) =>
        {
            if (!item.isHit) return;
            hitItemCount += 1;

            if (!this.calcDebugger) return;
            ctx.rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
            ctx.fillColor = color(216, 18, 18, 255);
            ctx.fill();
        });

        let per: number = Math.ceil((hitItemCount / this.polygonPointsList.length) * 100);
        console.log(`已经刮开了 ${Math.ceil((hitItemCount / this.polygonPointsList.length) * 100)}%`)
        // this.progerss.string = `已经刮开了 ${Math.ceil((hitItemCount / this.polygonPointsList.length) * 100)}%`;


        if (per >= 40)
        {
            // if (!Caches.get(Caches.newGuide))
            // {
            //     if (GameSys.game.xGet(Config.NEWGUIDECON) == 21)
            //     {
            //         GameSys.game.xSet(Config.NEWGUIDECON, 22)
            //     }
            // }
            GameSys.game.xSet(Config.GARBAGEOPACITY, 3)
            if (!Caches.get(Caches.newGuide))
            {
                if (GameSys.game.xGet(Config.NEWGUIDECON) == 26)
                {
                    GameSys.game.xSet(Config.NEWGUIDECON, 27)
                }
            }
            GameSys.audio.playSFX("audios/gold");
            StaticManager.getInstance().falllings[this.redIndex][1] = 0
            GameSys.game.xSet(Config.FALLINGRED, this.redIndex)
            this.node.destroy();
            if (this.redIndex < 3)
            {
                GameSys.game.xSet(Config.TIP, "洗手间焕然一新")
            }
            else
            {
                GameSys.game.xSet(Config.TIP, "卫生间焕然一新")
            }
            let buildings: In_Save_Buildings[] = GameSys.game.xGet(Config.BUILDINGS)
            GameSys.game.xSet(Config.BUILDINGSCHANGE, {
                index: this.redIndex,
                level: buildings[this.redIndex].level,
                dirty: 0,
                upgrade: buildings[this.redIndex].upgrade
            })

            //这里还要判断是否有人在使用，如果有就不发事件
            if (DataManager.getInstance().getClean(this.redIndex))
            {
                StaticManager.getInstance().use_buildings[this.redIndex] = false;
                DataManager.getInstance().setClean(this.redIndex, false)
                if (Math.floor(this.redIndex / 3) == 0)
                {
                    //清洁完以后发送通知
                    GameSys.game.xSet(Config.LEAVELOO, 0);
                }
                else if (Math.floor(this.redIndex / 3) == 1)
                {
                    GameSys.game.xSet(Config.LEAVETOILETONE, 1);
                }
                else if (Math.floor(this.redIndex / 3) == 2)
                {
                    GameSys.game.xSet(Config.LEAVETOILETTWO, 2);
                } else if (Math.floor(this.redIndex / 3) == 3)
                {
                    GameSys.game.xSet(Config.LEAVETOILETTHERE, 3);
                }
            }
            DataManager.getInstance().cleanGarbageInfo = null;
            DataManager.getInstance().garbageItem = null;
        }
    }

    cleanOver()
    {
        if (this.node.opacity <= 10)
        {
            if (!Caches.get(Caches.newGuide))
            {
                if (GameSys.game.xGet(Config.NEWGUIDECON) == 21)
                {
                    GameSys.game.xSet(Config.NEWGUIDECON, 22)
                }
            }
            GameSys.audio.playSFX("audios/gold");
            StaticManager.getInstance().falllings[this.redIndex][1] = 0
            GameSys.game.xSet(Config.FALLINGRED, this.redIndex)
            DataManager.getInstance().cleanGarbageInfo = null;
            this.node.destroy();
            if (this.redIndex < 3)
            {
                GameSys.game.xSet(Config.TIP, "洗手间焕然一新")
            }
            else
            {
                GameSys.game.xSet(Config.TIP, "卫生间焕然一新")
            }
            let buildings: In_Save_Buildings[] = GameSys.game.xGet(Config.BUILDINGS)
            GameSys.game.xSet(Config.BUILDINGSCHANGE, {
                index: this.redIndex,
                level: buildings[this.redIndex].level,
                dirty: 0,
                upgrade: buildings[this.redIndex].upgrade
            })

            //这里还要判断是否有人在使用，如果有就不发事件
            if (DataManager.getInstance().getClean(this.redIndex))
            {
                StaticManager.getInstance().use_buildings[this.redIndex] = false;
                DataManager.getInstance().setClean(this.redIndex, false)
                if (Math.floor(this.redIndex / 3) == 0)
                {
                    //清洁完以后发送通知
                    GameSys.game.xSet(Config.LEAVELOO, 0);
                }
                else if (Math.floor(this.redIndex / 3) == 1)
                {
                    GameSys.game.xSet(Config.LEAVETOILETONE, 1);
                }
                else if (Math.floor(this.redIndex / 3) == 2)
                {
                    GameSys.game.xSet(Config.LEAVETOILETTWO, 2);
                } else if (Math.floor(this.redIndex / 3) == 3)
                {
                    GameSys.game.xSet(Config.LEAVETOILETTHERE, 3);
                }
            }

        }
    }
    tempDrawPoints: Vec2[] = [];
    clearMask(pos)
    {
        let mask: any = this.maskNode.getComponent(Mask);
        let stencil = mask._graphics;
        const len = this.tempDrawPoints.length;
        this.tempDrawPoints.push(pos);

        if (len <= 1)
        {
            // 只有一个点，用圆来清除涂层
            stencil.circle(pos.x, pos.y, CLEAR_LINE_WIDTH / 2);
            stencil.fill();

            // 记录点所在的格子
            this.polygonPointsList.forEach((item) =>
            {
                if (item.isHit) return;
                const xFlag = pos.x > item.rect.x && pos.x < item.rect.x + item.rect.width;
                const yFlag = pos.y > item.rect.y && pos.y < item.rect.y + item.rect.height;
                if (xFlag && yFlag) item.isHit = true;
            });
        } else
        {
            // 存在多个点，用线段来清除涂层
            let prevPos = this.tempDrawPoints[len - 2];
            let curPos = this.tempDrawPoints[len - 1];

            stencil.moveTo(prevPos.x, prevPos.y);
            stencil.lineTo(curPos.x, curPos.y);
            stencil.lineWidth = CLEAR_LINE_WIDTH;
            stencil.lineCap = Graphics.LineCap.ROUND;
            stencil.lineJoin = Graphics.LineJoin.ROUND;
            stencil.strokeColor = color(255, 255, 255, 255);
            stencil.stroke();

            // 记录线段经过的格子
            this.polygonPointsList.forEach((item) =>
            {
                item.isHit = item.isHit || Intersection2D.lineRect(prevPos, curPos, item.rect);
            });
        }
    }

    polygonPointsList: { rect: Rect; isHit: boolean }[] = [];
    reset()
    {
        this.node.opacity = 255
        let mask: any = this.maskNode.getComponent(Mask);
        // 3.8.8 内核适配：2.x Mask 恒有 _graphics；3.x 仅 GRAPHICS_* 类型创建。
        // 刮刮卡靠 graphics 绘制揭示区，RECT 类型时强制切 GRAPHICS_RECT 以生成 _graphics。
        if (mask && !mask._graphics)
        {
            mask.type = Mask.Type.GRAPHICS_RECT;
        }
        if (mask && mask._graphics) mask._graphics.clear();

        this.tempDrawPoints = [];
        this.polygonPointsList = [];
        // this.progerss.string = '已经刮开了 0%';
        this.ticketNode.getComponent(Graphics).clear();

        // 生成小格子，用来辅助统计涂层的刮开比例
        for (let x = 0; x < getNodeWidth(this.ticketNode); x += CALC_RECT_WIDTH)
        {
            for (let y = 0; y < getNodeHeight(this.ticketNode); y += CALC_RECT_WIDTH)
            {
                this.polygonPointsList.push({
                    rect: rect(x - getNodeWidth(this.ticketNode) / 2, y - getNodeHeight(this.ticketNode) / 2, CALC_RECT_WIDTH, CALC_RECT_WIDTH),
                    isHit: false
                });
            }
        }
    }
    onDisable()
    {
        this.reset()
        GameSys.game.xUnbind(this.binder_name)
    }
    onDestroy()
    {
        GameSys.game.xUnbind(this.binder_name)
    }
}
