// /******************************************************************
//  * Copyright(C)
//  *
//  * 缓存管理
//  *
//  *
//  ******************************************************************/

import { _decorator, sys } from 'cc';
import logger from "./Log";
const GAME_NAME: string = "zhxqfive_"

export default class Caches
{
  public static storage: any = sys.localStorage;
  public static level: string = GAME_NAME + "level";
  public static lock: string = GAME_NAME + "lock";
  public static gold: string = GAME_NAME + "gold";
  public static recruit: string = GAME_NAME + "recruit"//招募人员预存20
  public static link: string = GAME_NAME + "link"
  public static cg: string = GAME_NAME + "cg"
  public static curDate: string = GAME_NAME + "curDates"
  public static signInState: string = GAME_NAME + 'signInstate'
  public static buildings: string = GAME_NAME + "buildings"//建筑物存20
  public static shop: string = GAME_NAME + "shop"//商店存20
  public static warehouse: string = GAME_NAME + "warehouse"//仓库存50
  public static appearance: string = GAME_NAME + "appearance"//仓库存50
  public static offline: string = GAME_NAME + 'offLine'//下线
  public static goldOffline: string = GAME_NAME + 'goldOffline'//下线
  public static newGuide: string = GAME_NAME + 'newGuide'//下线
  public static notice: string = GAME_NAME + 'notice'
  public static hand: string = GAME_NAME + 'hand'//下线
  public static oppoBanner: string = GAME_NAME + "oppoBanner"//banner
  public static oppoNatived: string = GAME_NAME + "oppoNatived"//原生
  public static bgmusic: string = GAME_NAME + "bgmusic"
  public static sounds: string = GAME_NAME + "sounds"
  public static bgmVolume: string = GAME_NAME + "bgmVolume"
  public static sfxVolume: string = GAME_NAME + "sfxVolume"
//  // 启动
  constructor()
  {
//    // 启动记录
    let now: any = new Date();
    logger.info("启动日期:%s", now.toGMTString());
    Caches.set("date_launch", now.getTime());
//    // 系统设置初始化
    if (Caches.get(Caches.bgmusic) == null)
    {
      Caches.set(Caches.bgmusic, true);
    }
    if (Caches.get(Caches.sounds) == null)
    {
      Caches.set(Caches.sounds, true);
    }
    logger.info("初始化缓存管理成功!");
  }
//  // 关闭
  destroy()
  {
//    // 退出记录
    let now: any = new Date();
    Caches.storage.setItem("date_exit", now.getTime());
    logger.info("关闭日期:%s", now.toGMTString());
  }
//  // 取值
  public static get(key: string, def: string = "")
  {
    let value: any = this.storage.getItem(key);
    if (value == null || value == "")
    {
      value = def;
    } else
    {
      // 3.8.8 内核适配：存档可能损坏（非 JSON 串）。裸 JSON.parse 抛异常会中断
      // new Game() → GameSys._game 永久 null → 全链路 xGet/xBind 崩溃（2026-10-16 实测 104 连发）。
      // 坏键清除并回退默认值，保证启动链不断。
      try
      {
        value = JSON.parse(value);
      } catch (e)
      {
        console.warn('[Caches] 存档键损坏已重置:', key, String(value).slice(0, 24));
        try { this.storage.removeItem(key); } catch (e2) { /* ignore */ }
        value = def;
      }
    }
    return value;
  }
//  // 获取整形
  public static getInt(key: string, def: number = -1)
  {
    let value: any = Caches.storage.getItem(key);
    if ((value == null || value == "") && parseInt(value) != 0)
    {
      value = def;
    } else
    {
      value = parseInt(value);
      // 3.8.8 内核适配：非数字串 parseInt 得 NaN，回退默认值
      if (isNaN(value)) value = def;
    }
    return value;
  }
//  // 获取数值
  public static getFloat(key: string, def: number = 0)
  {
    var value = Caches.storage.getItem(key);
    if (typeof value != "string" || value == "")
    {
      return def;
    }
    var f = parseFloat(value);
    // 3.8.8 内核适配：非数字串回退默认值
    return isNaN(f) ? def : f;
  }
//  // 设值
  public static set(key: string, value: any)
  {
    if (typeof value == "object")
    {
      value = JSON.stringify(value);
    }
    Caches.storage.setItem(key, value);
//    // logger.info("缓存更新:%s -> %s", key, value);
    return true;
  }
//  // 删值
  public static del(key: string)
  {
    Caches.storage.removeItem(key);
    logger.info("缓存删除:%s", key);
    return true;
  }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// /******************************************************************
//  * Copyright(C)
//  *
//  * 缓存管理
//  *
//  *
//  ******************************************************************/
// import logger from "./Log";
// const GAME_NAME: string = "zhxqfive_"
// export default class Caches
// {
//   public static storage: any = cc.sys.localStorage;
//   public static level: string = GAME_NAME + "level";
//   public static lock: string = GAME_NAME + "lock";
//   public static gold: string = GAME_NAME + "gold";
//   public static recruit: string = GAME_NAME + "recruit"//招募人员预存20
//   public static link: string = GAME_NAME + "link"
//   public static cg: string = GAME_NAME + "cg"
//   public static curDate: string = GAME_NAME + "curDates"
//   public static signInState: string = GAME_NAME + 'signInstate'
//   public static buildings: string = GAME_NAME + "buildings"//建筑物存20
//   public static shop: string = GAME_NAME + "shop"//商店存20
// 
//   public static warehouse: string = GAME_NAME + "warehouse"//仓库存50
//   public static appearance: string = GAME_NAME + "appearance"//仓库存50
//   public static offline: string = GAME_NAME + 'offLine'//下线
//   public static goldOffline: string = GAME_NAME + 'goldOffline'//下线
//   public static newGuide: string = GAME_NAME + 'newGuide'//下线
//   public static notice: string = GAME_NAME + 'notice'
//   public static hand: string = GAME_NAME + 'hand'//下线
// 
//   public static oppoBanner: string = GAME_NAME + "oppoBanner"//banner
//   public static oppoNatived: string = GAME_NAME + "oppoNatived"//原生
// 
// 
//   public static bgmusic: string = GAME_NAME + "bgmusic"
//   public static sounds: string = GAME_NAME + "sounds"
//   public static bgmVolume: string = GAME_NAME + "bgmVolume"
//   public static sfxVolume: string = GAME_NAME + "sfxVolume"
//   // 启动
//   constructor()
//   {
//     // 启动记录
//     let now: any = new Date();
//     logger.info("启动日期:%s", now.toGMTString());
//     Caches.set("date_launch", now.getTime());
// 
//     // 系统设置初始化
//     if (Caches.get(Caches.bgmusic) == null)
//     {
//       Caches.set(Caches.bgmusic, true);
//     }
//     if (Caches.get(Caches.sounds) == null)
//     {
//       Caches.set(Caches.sounds, true);
//     }
// 
//     logger.info("初始化缓存管理成功!");
//   }
// 
//   // 关闭
//   destroy()
//   {
//     // 退出记录
//     let now: any = new Date();
//     Caches.storage.setItem("date_exit", now.getTime());
//     logger.info("关闭日期:%s", now.toGMTString());
//   }
// 
//   // 取值
//   public static get(key: string, def: string = "")
//   {
//     let value: any = this.storage.getItem(key);
//     if (value == null || value == "")
//     {
//       value = def;
//     } else
//     {
//       value = JSON.parse(value);
//     }
//     return value;
//   }
// 
//   // 获取整形
//   public static getInt(key: string, def: number = -1)
//   {
//     let value: any = Caches.storage.getItem(key);
//     if ((value == null || value == "") && parseInt(value) != 0)
//     {
//       value = def;
//     } else
//     {
//       value = parseInt(value);
//     }
//     return value;
//   }
// 
//   // 获取数值
//   public static getFloat(key: string, def: number = 0)
//   {
//     var value = Caches.storage.getItem(key);
//     if (typeof value != "string" || value == "")
//     {
//       return def;
//     }
//     return parseFloat(value);
//   }
// 
//   // 设值
//   public static set(key: string, value: any)
//   {
//     if (typeof value == "object")
//     {
//       value = JSON.stringify(value);
//     }
//     Caches.storage.setItem(key, value);
//     // logger.info("缓存更新:%s -> %s", key, value);
//     return true;
//   }
//   // 删值
//   public static del(key: string)
//   {
//     Caches.storage.removeItem(key);
//     logger.info("缓存删除:%s", key);
//     return true;
//   }
// }
