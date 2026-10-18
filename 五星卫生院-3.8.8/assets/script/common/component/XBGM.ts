// /******************************************************************
//  * Copyright(C)
//  *
//  * 音乐
//  *
//  *
//  ******************************************************************/

import { _decorator, Component, AudioClip, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

import Logger from "../manager/Log";
import GameSys from "../manager/GameSys";

@ccclass('XBGM')
export default class XBGM extends Component
{
	@property({ type: AudioClip, displayName: '背景音乐' })
	bgmAudio: AudioClip | null = null;
	@property({
		type: AudioClip,
		displayName: "背景音乐"
	})
	@property({
		displayName: "静默播放"
	})
	slientPlay: boolean = false;
	@property({
		type: CCFloat,
		displayName: "音量比"
	})
	volumeRate: number = 0.8;
	start()
	{
		if (!this.bgmAudio)
		{
			Logger.error("没有添加背景音乐");
			GameSys.audio.stopBGM();
			return;
		}
		var vol = GameSys.audio.xGet("bgmVolume");
		if (vol <= 0.001 && !this.slientPlay)
		{
			Logger.info("音量太小或没有允许播放", vol);
			return;
		}
//		// 播放
		this.scheduleOnce(() =>
		{
			Logger.info("开始播放音乐", this.bgmAudio);
			GameSys.audio.playBGM(this.bgmAudio, this.volumeRate);
		}, 0.05);
	}
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import Logger from "../manager/Log";
// import GameSys from "../manager/GameSys";
// 
// 
// /******************************************************************
//  * Copyright(C)
//  *
//  * 音乐
//  *
//  *
//  ******************************************************************/
// const { ccclass, property } = cc._decorator;
// @ccclass
// export default class XBGM extends cc.Component
// {
// 	@property({
// 		type: cc.AudioClip,
// 		displayName: "背景音乐"
// 	})
// 	bgmAudio: cc.AudioClip = null;
// 
// 	@property({
// 		displayName: "静默播放"
// 	})
// 	slientPlay: boolean = false;
// 
// 	@property({
// 		type: cc.Float,
// 		displayName: "音量比"
// 	})
// 	volumeRate: number = 0.8;
// 
// 	start()
// 	{
// 		if (!this.bgmAudio)
// 		{
// 			Logger.error("没有添加背景音乐");
// 			GameSys.audio.stopBGM();
// 			return;
// 		}
// 
// 		var vol = GameSys.audio.xGet("bgmVolume");
// 		if (vol <= 0.001 && !this.slientPlay)
// 		{
// 			Logger.info("音量太小或没有允许播放", vol);
// 			return;
// 		}
// 
// 		// 播放
// 		this.scheduleOnce(() =>
// 		{
// 			Logger.info("开始播放音乐", this.bgmAudio);
// 			GameSys.audio.playBGM(this.bgmAudio, this.volumeRate);
// 		}, 0.05);
// 	}
// }
