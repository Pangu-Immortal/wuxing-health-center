import { Canvas, Component, Director, Node, _decorator, director, log, profiler } from 'cc';
import "../NodeCompat";  // 3.8.8 内核适配：2.x Node API 兼容补丁（副作用 import，保证任何场景入口都加载）
import { GameLog } from "../GameLogPanel";  // 3.8.8 内核适配：实时日志面板+全局异常捕获（副作用 import）
const { ccclass, property } = _decorator;

import Game from "./Game";
import { Config, TipLab, LEVELLOCK } from "./Config";
import Audio from "../component/Audio";
import SDK from "../sdk/SDK";
import Http from "../net/Http";
import TTAPI from "../sdk/TTApi";
import OppoApi from "../sdk/OPPOApi";
import VIVOApi from "../sdk/VivoApi";
import DataManager from "./DataManager";
import BDApi from "../sdk/BDApi";

@ccclass('GameSys')
export default class GameSys extends Component
{
    static share: boolean = false;
    static hint: number = 0;
    static answer: number = 0;
    static shareDesc: "仙界厕所美景尽揽于此！！！"
    static shareTitle: "五星卫生院"
    static imageUrl: string = "http://123.56.5.6/static/game/lhmsShare.jpg";

    static audio: Audio = null;
    static sdk: SDK = null;
    static http: Http = null;
    static level: number = 0;//当前等级
    // 3.8.8 内核适配：懒加载引导。2.x 运行时入口为 loading 场景（Loading 组件调 init），
    // 3.x 预览/构建可能直接从 game 场景启动，故在首次读取 game 时自动补初始化（幂等）。
    private static _booted: boolean = false;
    private static _game: Game = null;
    static get game(): Game
    {
        // 3.8.8 内核适配：init() 为 async，首次读 game 时 _game 可能尚未建立 →
        // 业务 onLoad 早于 init 完成会拿到 null（xBind/xGet 崩）。先同步引导（幂等）。
        GameSys.bootSync();
        if (!GameSys._booted)
        {
            GameSys._booted = true;
            GameSys.init().catch(e => console.error('[GameSys] init error:', e));
        }
        return GameSys._game;
    }
    static set game(v: Game) { GameSys._game = v; }

    //static channel: string = "ml"
    //static channel: string = "vivo"
    //static channel: string = "wx"
    static channel: string = "oppo"
    // static channel: string = "vivo"
    // static channel: string = "blank"
    //static channel: string = "android"
    //static channel: string = "qq"
    // static channel: string = "baidu"
    // static channel: string = "tt"
    //static channel: string = "uc" 
    //static channel: string = "mz"
    //static channel: string = "qtt"
    //static channel: string = "kk"
    static async init()
    {
        GameSys.bootSync();
    }
    // 3.8.8 内核适配：同步引导。async init 的 generator 体执行时机不可靠，
    // 拆出纯同步段保证「读 game 之前单例必已建立」。
    static bootSync()
    {
        if (GameSys._game) return;
        // 2026-10-18：非编辑器环境隐藏引擎统计面板（FPS/DrawCall），发布/预览截图不带调试信息
        try { profiler.hideStats(); } catch (e) { /* ignore */ }
        GameSys._game = new Game();
        GameSys.audio = new Audio();
        GameSys.http = new Http();
        GameSys.sdk = new SDK();

        // 3.8.8 内核适配：存档 level 越界 clamp（LEVELLOCK 表为等级上限），损坏存档不崩溃
        GameSys.level = Math.min(Math.max(GameSys._game.xGet(Config.LEVEL) | 0, 0), LEVELLOCK.length - 1);
        log("当前等级", GameSys.level)

        // 3.8.8 内核适配：2.x 运行时入口为 loading 场景（Loading 组件调 initData）。
        // 直接从 game 场景启动时补调（initData 内部幂等 guard 防重复）。
        DataManager.getInstance().initData();

        if (GameSys.channel == "tt")
        {
            // 3.8.8 机型适配：仅当平台全局存在时实例化，避免浏览器/其他端崩溃
            if (typeof tt !== 'undefined') { new TTAPI(); GameSys.share = true }
        }
        else if (GameSys.channel == "oppo")
        {
            if (typeof qg !== 'undefined') { new OppoApi(); GameSys.share = false }
        } else if (GameSys.channel == "vivo")
        {
            if (typeof qg !== 'undefined') { new VIVOApi(); GameSys.share = true }
        }
        else if (GameSys.channel == "baidu")
        {
            if (typeof swan !== 'undefined') { new BDApi(); GameSys.share = true }
        }
    }
    static loadScene(v: string)
    {
        director.loadScene(v)
    }
    static gold(_v: number): boolean
    {
        if (_v < 0)
        {
            if (this.game.xGet(Config.GOLD).v + _v < 0)
            {
                // this.game.xSet(Config.TIP, Tip.gold_not)
                return false;
            }
        }
        this.game.xSet(Config.GOLD, { v: this.game.xGet(Config.GOLD).v + _v, index: _v })
        return true;
    }
    static judgeGold(usegold: number, call: () => void, cb: () => void)
    {
        if (this.game.xGet(Config.GOLD).v < Math.abs(usegold))
        {
            call && call();
        }
        else
        {
            cb && cb()
        }
    }
    static useGold(_usegold: number, call: () => void)
    {
        if (this.game.xGet(Config.GOLD).v < Math.abs(_usegold))
        {
            this.game.xSet(Config.TIP, TipLab.gold_not);
            //TODO:可以弹出加加加加金币页面
        }
        else
        {
            this.gold(_usegold)
            //TODO:同时调用装修动画
            call && call();
        }
    }
    //添加至桌面
    static shortCut()
    {
        this.sdk.xSet('shortcut')
    }
    //原生
    static showNativeAd(native: Node)
    {
        if (this.channel == "oppo" || this.channel == "vivo")
        {
            DataManager.getInstance().oppoNatived = native;
            this.sdk.xSet('showNativeAd')
        }
    }
    //插屏
    static showInter()
    {
        if (GameSys.channel == "blank")
        {
            return
        }
        this.sdk.xSet('showInter')
    }
    static showBanner()
    {
        if (GameSys.channel == "blank")
        {
            return
        }
        this.sdk.xSet('createBanner')
    }
    static hideBanner()
    {
        if (GameSys.channel == "blank")
        {
            return
        }
        if (this.channel != "oppo")
        {
            this.sdk.xSet("hideBanner")
        }
    }
    static async watchVideo(pos: number, success: () => void)
    {
        // 3.8.8 内核适配：blank 渠道或无小游戏 SDK（浏览器/编辑器预览）时，
        // 广告不可用，按 blank 渠道同等语义直接放行，保证玩法可玩；真机 SDK 存在时走正常广告流程。
        if (GameSys.channel == "blank" || !GameSys.sdk || !GameSys.sdk.Instance)
        {
            console.log("watchVideo: 无 SDK 环境（浏览器/blank），直接放行");
            success()
            return
        }

        // console.log("观看视频位置", pos)
        let res: boolean = await GameSys.sdk.watchVideo() as boolean;
        if (res)
        {
            success()
            if (this.channel == 'tt')
            {
                if (pos == 1)
                {
                    //提示区域的广告
                    this.statistical('video', `${1}提示视频成功`, pos)
                }
                else
                {
                    this.statistical('video', `${1}观看视频成功`, pos)
                }
            }
        }
        else
        {
            this.fail()
            if (this.channel == 'tt')
            {
                if (pos == 1)
                {
                    //提示区域的广告
                    this.statistical('video', `${1}提示视频失败`, -pos)
                }
                else
                {
                    this.statistical('video', `${1}观看视频失败`, -pos)
                }
            }
        }
    }
    static fail()
    {
        this.game.xSet(Config.TIP, TipLab.not_reward)
    }
    static startRec()
    {
        if (this.channel == 'tt')
        {
            this.sdk.xSet('startRec')
        }
    }
    static stopRec()
    {
        if (this.channel == 'tt')
        {
            this.sdk.xSet('stopRec')
        }
    }
    static statistical(v: string, _message: string, _pos: number)//数据统计
    {
        // if (this.TGDA)
        // {
        //     TDGA.onEvent(v, { message: _message, pos: _pos });
        //     return
        // }
        if (this.channel == "tt")
        {
            // console.log("埋点", v, _message, _pos)
            tt.reportAnalytics(v, {
                value: _message,
                pos: _pos
            });
        }
    }
    //包围盒
    static checkOnTarget(location)
    {
        // let node: Node = DataManager.getInstance().garbageNode;
        // console.log("---", node)
        //获取target节点在父容器的包围盒，返回一个矩形对象
        // let rect = node.getBoundingBoxToWorld();
        //console.log(node)
        let point = location
        //if (cc.rectContainsPoint(rect, targetPoint)) {
        //Creator2.0使用rect的成员contains方法
        // if (rect.contains(point))
        // {
        //     return true;
        // } else
        // {
        //     return false
        // }
    }
}

// 3.8.8 内核适配（adb 全控件遍历配套）：场景加载后自动挂载 TouchDump 埋点组件，
// 使 F12(keyevent 143) dump 可交互控件、F11(142) dump 视图状态、触点输出 [TD-TOUCH]。
import TouchDump from "../component/TouchDump";
director.on(Director.EVENT_AFTER_SCENE_LAUNCH, (sc: any) =>
{
    try
    {
        const root = director.getScene();
        if (root && !root.getComponentInChildren(TouchDump)) root.addComponent(TouchDump);
    } catch (e) { /* ignore */ }
});

// 测试注入桥（DebugBridge）：F11 dump 状态 / F10 全购买通关 / F9 通关校验
import DebugBridge from "../component/DebugBridge";
// 2026-10-18 letterbox 空白带填充（消除粉白"白屏"观感）
import ScreenEdgeFill from "../component/ScreenEdgeFill";
director.on(Director.EVENT_AFTER_SCENE_LAUNCH, (sc2: any) =>
{
    try
    {
        const root = director.getScene();
        if (root && !root.getComponentInChildren(DebugBridge)) root.addComponent(DebugBridge);
        // Canvas 挂 ScreenEdgeFill（letterbox 延伸带 + clearColor 同色）
        const cv = root.getComponentInChildren(Canvas);
        if (cv && !cv.node.getComponent(ScreenEdgeFill)) cv.node.addComponent(ScreenEdgeFill);
    } catch (e) { /* ignore */ }
});
