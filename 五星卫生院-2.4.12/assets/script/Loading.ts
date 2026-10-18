import DataManager from "./common/manager/DataManager";
import GameSys from "./common/manager/GameSys";
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html
const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component
{
    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;

    start()
    {
        GameSys.init();

        DataManager.getInstance().initData();//提前初始化数据
        cc.director.preloadScene('game', (num, num1) =>
        {
            this.progress.progress = num / num1
            if (num == num1)
            {
                console.log("加载完成")
            }
        }, () =>
        {
            GameSys.loadScene('game')
        })
    }
}
