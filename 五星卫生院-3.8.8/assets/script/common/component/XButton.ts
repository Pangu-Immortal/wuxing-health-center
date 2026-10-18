// /******************************************************************
//  * Copyright(C)
//  *
//  * 按钮
//  *
//  *
//  ******************************************************************/

import { AudioClip, CCFloat, Component, EventHandler, Node, Tween, _decorator, tween, v3 } from 'cc';
const { ccclass, property, menu } = _decorator;

import GameSys from "../manager/GameSys";

@ccclass('XButton')
@menu("按钮组件/XButton")
export default class XButton extends Component
{
    @property({ type: AudioClip })
    public touchAudio: AudioClip | null = null;
	@property({
		type: AudioClip,
		displayName: "触摸音"
	})
	@property({
		displayName: "触摸动画"
	})
	public touchAnim: boolean = false;
	@property({
		type: CCFloat,
		displayName: "点击间隔"
	})
	public clickInterval: number = 0.4;
	@property({
		type: EventHandler,
		displayName: "触摸回调"
	})
	public touchEvents: Array<EventHandler> = [];
	public touchStartEvents: Array<EventHandler> = [];
	public touchCancelEvents: Array<EventHandler> = [];
	public isDown: boolean = false;
	public rawScale: number = 0;
	public clickTime: any = null;
	onLoad()
	{
		this.rawScale = this.node.scale.x;
//		// if (this.touchAnim == true)
//		// {
//		// 	this.node.runAction(
//		// 		cc.sequence(
//		// 			cc.scaleTo(0.5, 0.95),
//		// 			cc.scaleTo(0.5, 1),
//		// 			cc.callFunc(() =>
//		// 			{
//		// 			})
//		// 		).repeatForever()
//		// 	);
//		// }
//		// 按钮绑定
		this.node.on("touch-start", this.touchStart.bind(this), this.node);
		this.node.on("touch-end", this.touchEnd.bind(this), this.node);
		this.node.on("touch-cancel", this.touchCancel.bind(this), this.node);
	}
	public initScale: number = 1;
	touchStart(event)
	{
		if (this.enabled == false || this.isDown)
		{
			return;
		}
		this.initScale = this.node.scale.x;
		this.isDown = true;
		if (this.touchAudio)
		{
			GameSys.audio.playSFX(this.touchAudio);
		}
		else
		{
			GameSys.audio.playSFX("audios/close");
		}
		if (this.touchAnim)
		{
			Tween.stopAllByTarget(this.node);
			tween(this.node)
				.to(0.1, { scale: v3(1.1, 1.1, 1.1) })
				.start();
		}
		if (this.touchStartEvents.length > 0)
		{
			EventHandler.emitEvents(this.touchStartEvents);
		}
	}
	touchEnd(event)
	{
		if (this.enabled == false)
		{
			return;
		}
		if (this.touchAnim)
		{
			Tween.stopAllByTarget(this.node);
			tween(this.node)
				.to(0.1, { scale: v3(this.initScale, this.initScale, this.initScale) })
				.call(() =>
				{
					this.isDown = false;
				})
				.start();
		} else
		{
			this.isDown = false;
		}
		let now: any = new Date();
		let ms: number = this.clickInterval * 1000;
		if (now.getTime() - this.clickTime < ms)
		{
			return;
		}
		this.clickTime = now.getTime();
		if (this.touchEvents.length > 0)
		{
			EventHandler.emitEvents(this.touchEvents);
		}
	}
	touchCancel(event)
	{
		if (this.enabled == false)
		{
			return;
		}
		if (this.touchAnim)
		{
			if (this.touchAnim)
			{
				Tween.stopAllByTarget(this.node);
				tween(this.node)
					.to(0.1, { scale: v3(1, 1, 1) })
					.call(() =>
					{
						this.isDown = false;
					})
					.start();
			} else
			{
				this.isDown = false;
			}
		}
		if (this.touchCancelEvents.length > 0)
		{
			EventHandler.emitEvents(this.touchCancelEvents);
		}
	}
	addTouchStartEvent(_targetNode: Node, _componentName: string, _handlerName: string, _customEventData: any = "")
	{
		let handler = new EventHandler();
		handler.target = _targetNode;
		handler.component = _componentName;
		handler.customEventData = _customEventData + "";
		handler.handler = _handlerName;
		this.touchStartEvents.push(handler);
	}
	addTouchEvent(_targetNode: Node, _componentName: string, _handlerName: string, _customEventData: any = "")
	{
		let handler = new EventHandler();
		handler.target = _targetNode;
		handler.component = _componentName;
		handler.customEventData = _customEventData + "";
		handler.handler = _handlerName;
		this.touchEvents.push(handler);
	}
	addTouchCancelEvent(_targetNode: Node, _componentName: string, _handlerName: string, _customEventData: any = "")
	{
		let handler = new EventHandler();
		handler.target = _targetNode;
		handler.component = _componentName;
		handler.customEventData = _customEventData + "";
		handler.handler = _handlerName;
		this.touchCancelEvents.push(handler);
	}
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import GameSys from "../manager/GameSys";
// 
// /******************************************************************
//  * Copyright(C)
//  *
//  * 按钮
//  *
//  *
//  ******************************************************************/
// const { ccclass, property, menu } = cc._decorator;
// @ccclass
// @menu("按钮组件/XButton")
// export default class XButton extends cc.Component
// {
// 	@property({
// 		type: cc.AudioClip,
// 		displayName: "触摸音"
// 	})
// 	public touchAudio: cc.AudioClip = null;
// 
// 	@property({
// 		displayName: "触摸动画"
// 	})
// 	public touchAnim: boolean = false;
// 
// 	@property({
// 		type: cc.Float,
// 		displayName: "点击间隔"
// 	})
// 	public clickInterval: number = 0.4;
// 
// 	@property({
// 		type: cc.EventHandler,
// 		displayName: "触摸回调"
// 	})
// 	public touchEvents: Array<cc.EventHandler> = [];
// 
// 	public touchStartEvents: Array<cc.EventHandler> = [];
// 	public touchCancelEvents: Array<cc.EventHandler> = [];
// 
// 	public isDown: boolean = false;
// 	public rawScale: number = 0;
// 	public clickTime: any = null;
// 
// 	onLoad()
// 	{
// 		this.rawScale = this.node.scale;
// 		// if (this.touchAnim == true)
// 		// {
// 		// 	this.node.runAction(
// 		// 		cc.sequence(
// 		// 			cc.scaleTo(0.5, 0.95),
// 		// 			cc.scaleTo(0.5, 1),
// 		// 			cc.callFunc(() =>
// 		// 			{
// 		// 			})
// 		// 		).repeatForever()
// 		// 	);
// 		// }
// 		// 按钮绑定
// 		this.node.on("touchstart", this.touchStart.bind(this), this.node);
// 		this.node.on("touchend", this.touchEnd.bind(this), this.node);
// 		this.node.on("touchcancel", this.touchCancel.bind(this), this.node);
// 	}
// 
// 	public initScale: number = 1;
// 	touchStart(event)
// 	{
// 		if (this.enabled == false || this.isDown)
// 		{
// 			return;
// 		}
// 		this.initScale = this.node.scale;
// 
// 		this.isDown = true;
// 
// 		if (this.touchAudio)
// 		{
// 			GameSys.audio.playSFX(this.touchAudio);
// 		}
// 		else
// 		{
// 			GameSys.audio.playSFX("audios/close");
// 		}
// 
// 		if (this.touchAnim)
// 		{
// 			this.node.stopAllActions();
// 			this.node.runAction(
// 				cc.sequence(
// 					cc.scaleTo(0.1, 1.1),
// 					cc.callFunc(() =>
// 					{
// 					})
// 				).repeatForever()
// 			);
// 		}
// 
// 		if (this.touchStartEvents.length > 0)
// 		{
// 			cc.EventHandler.emitEvents(this.touchStartEvents);
// 		}
// 	}
// 
// 	touchEnd(event)
// 	{
// 		if (this.enabled == false)
// 		{
// 			return;
// 		}
// 
// 		if (this.touchAnim)
// 		{
// 			this.node.stopAllActions();
// 			this.node.runAction(
// 				cc.sequence(
// 					cc.scaleTo(0.1, this.initScale),
// 					cc.callFunc(() =>
// 					{
// 						this.isDown = false;
// 					})
// 				)
// 			);
// 		} else
// 		{
// 			this.isDown = false;
// 		}
// 
// 		let now: any = new Date();
// 		let ms: number = this.clickInterval * 1000;
// 		if (now.getTime() - this.clickTime < ms)
// 		{
// 			return;
// 		}
// 
// 
// 
// 		this.clickTime = now.getTime();
// 		if (this.touchEvents.length > 0)
// 		{
// 			cc.EventHandler.emitEvents(this.touchEvents);
// 		}
// 	}
// 
// 	touchCancel(event)
// 	{
// 		if (this.enabled == false)
// 		{
// 			return;
// 		}
// 
// 		if (this.touchAnim)
// 		{
// 			if (this.touchAnim)
// 			{
// 				this.node.stopAllActions();
// 				this.node.runAction(
// 					cc.sequence(
// 						cc.scaleTo(0.1, 1),
// 						cc.callFunc(() =>
// 						{
// 							this.isDown = false;
// 						})
// 					)
// 				);
// 			} else
// 			{
// 				this.isDown = false;
// 			}
// 		}
// 
// 
// 		if (this.touchCancelEvents.length > 0)
// 		{
// 			cc.EventHandler.emitEvents(this.touchCancelEvents);
// 		}
// 
// 	}
// 
// 	addTouchStartEvent(_targetNode: cc.Node, _componentName: string, _handlerName: string, _customEventData: any = "")
// 	{
// 		let handler = new cc.EventHandler();
// 		handler.target = _targetNode;
// 		handler.component = _componentName;
// 		handler.customEventData = _customEventData + "";
// 		handler.handler = _handlerName;
// 		this.touchStartEvents.push(handler);
// 	}
// 
// 	addTouchEvent(_targetNode: cc.Node, _componentName: string, _handlerName: string, _customEventData: any = "")
// 	{
// 		let handler = new cc.EventHandler();
// 		handler.target = _targetNode;
// 		handler.component = _componentName;
// 		handler.customEventData = _customEventData + "";
// 		handler.handler = _handlerName;
// 		this.touchEvents.push(handler);
// 	}
// 
// 	addTouchCancelEvent(_targetNode: cc.Node, _componentName: string, _handlerName: string, _customEventData: any = "")
// 	{
// 		let handler = new cc.EventHandler();
// 		handler.target = _targetNode;
// 		handler.component = _componentName;
// 		handler.customEventData = _customEventData + "";
// 		handler.handler = _handlerName;
// 		this.touchCancelEvents.push(handler);
// 	}
// 
// }
