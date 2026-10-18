import { Color, Component, Label, Node, Prefab, Sprite, SpriteFrame, _decorator, instantiate, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

import Caches from "../common/manager/Caches";
import { APPEARANCE, Config, In_Save_Apperance } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import StateManager from "../common/manager/StateManager";
import UtilsManager from "../common/manager/UtilsManager";
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html

let BINDER_NAME: string = 'Appearance'
@ccclass('Appearance')
export default class Appearance extends Component
{
    @property(Node)
    S: Node = null;
    @property(Node)
    lockS: Node = null;
    @property(Node)
    goldA: Node = null
    @property(Node)
    goldS: Node = null
    @property(Prefab)
    reduce: Prefab = null;
    @property(Sprite)
    A_spr: Sprite = null;
    @property(Sprite)
    B_spr: Sprite = null;
    @property(Sprite)
    S_spr: Sprite = null;

    @property(Label)
    A_lab: Label = null;
    @property(Label)
    S_lab: Label = null;

    @property(StateManager)
    lock_A: StateManager = null;
    @property(StateManager)
    lock_S: StateManager = null;

    @property(Node)
    select: Node = null;

    private index: number = 0;
    private appearance: In_Save_Apperance

    private selectPos: number[] = [-128, -5, 112]
    init(_index: number)
    {
        this.change_data({ index: _index, state: true })
    }
    onEnable()
    {
        GameSys.game.xBind(Config.APPITEM, this.change_data.bind(this), BINDER_NAME)
        this.node.setScale(0, 0, 0);
    }
    private watchvideoA: boolean = false
    private watchvideoS: boolean = false
    async change_data(data: { index: number, state: boolean })
    {
        let cb = async () =>
        {
            this.S.color = Color.WHITE
            this.A_lab.string = ''
            this.S_lab.string = ''
            this.touch = [false, false, false]
            this.touch[data.index] = true;
            this.watchvideoA = false;
            this.watchvideoS = false;
            this.appearance = GameSys.game.xGet(Config.APPEARANCE)[data.index]
            this.select.x = this.selectPos[this.appearance.index]
            this.index = data.index;

            if (APPEARANCE[data.index].lock_A > GameSys.level)
            {
                this.lock_A.stateChange(0)
                this.A_lab.string = APPEARANCE[data.index].lock_A.toString() + "级解锁"
            }
            else
            {
                this.lock_A.stateChange(1)

                if (this.appearance.geta)
                {
                    // this.A_lab.string = "A级" + APPEARANCE[index].name
                    // this.A_lab.string = '已解锁'
                    this.lock_A.node.children[this.lock_A.nowState].children[0].active = false
                }
                else
                {
                    this.touch[data.index] = false;
                    this.A_lab.string = '-' + APPEARANCE[data.index].gold_A.toString()
                    GameSys.judgeGold(APPEARANCE[data.index].gold_A, () =>
                    {
                        // console.log("金币不足")
                        this.watchvideoA = true;
                        this.lock_A.node.children[this.lock_A.nowState].children[0].active = true
                    }, () =>
                    {
                        // console.log("金币足够")
                        this.watchvideoA = false;
                        this.lock_A.node.children[this.lock_A.nowState].children[0].active = false
                    })
                }
            }

            if (APPEARANCE[data.index].lock_S > GameSys.level)
            {
                this.lock_S.stateChange(0)
                this.lockS.active = true;
                this.S_lab.string = APPEARANCE[data.index].lock_S.toString() + "级解锁"
                this.S.color = Color.GRAY
            }
            else
            {
                this.lock_S.stateChange(1)
                this.lockS.active = false;
                if (this.appearance.gets)
                {
                    // this.S_lab.string = "S级" + APPEARANCE[index].name
                    // this.S_lab.string = ''
                    this.lock_S.node.children[this.lock_S.nowState].children[0].active = false
                }
                else
                {
                    this.touch[data.index] = false;
                    this.S_lab.string = '-' + APPEARANCE[data.index].gold_S.toString()
                    GameSys.judgeGold(APPEARANCE[data.index].gold_S, () =>
                    {
                        // console.log("金币不足")
                        this.watchvideoS = true;
                        this.lock_S.node.children[this.lock_S.nowState].children[0].active = true
                    }, () =>
                    {
                        // console.log("金币足够")
                        this.watchvideoS = false;
                        this.lock_S.node.children[this.lock_S.nowState].children[0].active = false
                    })
                }
            }
            // this.B_lab.string = "B级" + APPEARANCE[index].name
            this.B_spr.spriteFrame = await UtilsManager.loadImage(`appearanceB/B${data.index}`) as SpriteFrame
            this.A_spr.spriteFrame = await UtilsManager.loadImage(`appearanceA/A${data.index}`) as SpriteFrame
            this.S_spr.spriteFrame = await UtilsManager.loadImage(`appearanceS/S${data.index}`) as SpriteFrame

        }
        if (data.state)
        {
            tween(this.node)
                .to(0.1, { scale: v3(0, 0, 0)})
                .call(() =>
                {
                    cb && cb()
                })
                .to(0.1, { scale: v3(1, 1, 1)})
                .start()

        }
    }
    touch: boolean[] = [false, false, false]
    onTouchB()
    {
        this.appearance = GameSys.game.xGet(Config.APPEARANCE)[this.index]
        if (this.touch[0])
            return
        this.touch[0] = true;
        this.touch[1] = false;
        this.touch[2] = false;
        GameSys.game.xSet(Config.APPEARANCECHANGE, {
            index: this.index,
            state: 0,
            geta: this.appearance.geta,
            gets: this.appearance.gets
        })
        this.anim(0)
    }
    anim(index: number)
    {
        tween(this.select)
            .to(0, { x: this.selectPos[index] })
            .start()
    }
    onTouchA()
    {
        this.appearance = GameSys.game.xGet(Config.APPEARANCE)[this.index]
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 12)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 13)
            }
        }
        if (this.touch[1])
            return

        let cb = () =>
        {
            this.touch[1] = true;
            this.touch[0] = false;
            this.touch[2] = false;
            this.anim(1)
            GameSys.game.xSet(Config.APPEARANCECHANGE, {
                index: this.index,
                state: 1,
                geta: true,
                gets: this.appearance.gets
            })
            this.A_lab.string = ''
            GameSys.audio.playSFX("audios/shengji_2");
            this.lock_A.node.children[this.lock_A.nowState].children[0].active = false
            GameSys.game.xSet(Config.ALLRED)
        }

        if (this.appearance.geta)
        {
            GameSys.audio.playSFX("audios/shengji_2");
            GameSys.game.xSet(Config.APPEARANCECHANGE, {
                index: this.index,
                state: 1,
                geta: this.appearance.geta,
                gets: this.appearance.gets
            })
            this.anim(1)
            this.touch[1] = true;
            this.touch[0] = false;
            this.touch[2] = false;
        }
        else
        {
            if (this.watchvideoA)
            {
                GameSys.watchVideo(2, cb)
            }
            else
            {
                GameSys.useGold(-APPEARANCE[this.index].gold_A, () =>
                {
                    this.goldAnim(this.goldA, APPEARANCE[this.index].gold_A)
                    cb()
                })
            }

        }
    }
    goldAnim(node: Node, price: number)
    {
        let goldAnim: Node = instantiate(this.reduce);
        node.addChild(goldAnim);
        goldAnim.y = -40;
        goldAnim.x = 0;
        goldAnim.children[0].getComponent(Label).string = "-" + price.toFixed(0);
        goldAnim.children[0].color = Color.BLACK
        tween(goldAnim)
            .to(1, { y: goldAnim.y - 20, opacity: 100 })
            .call(() =>
            {
                goldAnim.destroy();
            })
            .start()
    }
    onTouchS()
    {
        this.appearance = GameSys.game.xGet(Config.APPEARANCE)[this.index]
        if (this.touch[2])
            return

        let cb = () =>
        {
            this.touch[2] = true;
            this.touch[1] = false;
            this.touch[0] = false;
            this.anim(2)
            GameSys.game.xSet(Config.APPEARANCECHANGE, {
                index: this.index,
                state: 2,
                geta: this.appearance.geta,
                gets: true,
            })
            this.S_lab.string = ""
            GameSys.audio.playSFX("audios/shengji_2");
            this.lock_S.node.children[this.lock_A.nowState].children[0].active = false
            GameSys.game.xSet(Config.ALLRED)
        }
        if (this.appearance.gets)
        {
            GameSys.audio.playSFX("audios/shengji_2");
            this.anim(2)
            GameSys.game.xSet(Config.APPEARANCECHANGE, {
                index: this.index,
                state: 2,
                geta: this.appearance.geta,
                gets: this.appearance.gets
            })
            this.touch[2] = true;
            this.touch[1] = false;
            this.touch[0] = false;
        }
        else
        {
            if (this.watchvideoS)
            {
                GameSys.watchVideo(3, cb)
            }
            else
            {
                GameSys.useGold(-APPEARANCE[this.index].gold_S, () =>
                {
                    this.goldAnim(this.goldS, APPEARANCE[this.index].gold_S)
                    cb()
                })
            }

        }
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
