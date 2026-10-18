import { GameLog } from './common/GameLogPanel';
import { Component, ProgressBar, _decorator, director } from 'cc';
const { ccclass, property } = _decorator;

import "./common/NodeCompat";  // 2.x Node API 兼容补丁（必须最先加载，副作用 import）

import DataManager from "./common/manager/DataManager";
import GameSys from "./common/manager/GameSys";
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html

@ccclass('Loading')
export default class Loading extends Component
{
    @property(ProgressBar)
    progress: ProgressBar = null;

    start()
    {
        GameSys.init();

        DataManager.getInstance().initData();//提前初始化数据
        director.preloadScene('game', (num, num1) =>
        {
            this.progress.progress = num / num1
            if (num == num1)
            {
                console.log("加载完成")
            }
        }, () =>
        {
            GameLog.node("load-scene", "game")
        GameSys.loadScene('game')
        })
    }
}
