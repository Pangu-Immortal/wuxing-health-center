// /******************************************************************
//  * Copyright(C)
//  *
//  * 工具集
//  *
//  *
//  ******************************************************************/

import { AudioClip, ImageAsset, JsonAsset, Prefab, Rect, Size, SpriteFrame, Texture2D, Vec2, _decorator, loader, resources } from 'cc';
export default class UtilsManager
{
//    //深复制
    public static clone(src: any)
    {
        if (!src || typeof src !== "object")
        {
            return src;
        }
        let out: any = src.constructor === Array ? [] : {};
        let _clone: Function = function (o: Object, c: any)
        {
            for (let i in o)
            {
                if (o[i] && typeof o[i] === "object")
                {
                    if (o[i].constructor === Array)
                    {
                        c[i] = [];
                    }
                    else
                    {
                        c[i] = {};
                    }
                    _clone(o[i], c[i]);
                }
                else
                {
                    c[i] = o[i];
                }
            }
            return c;
        };
        return _clone(src, out);
    }
    public static async loadJson(_address: string)
    {
        return new Promise(resolve =>
        {
            resources.load(_address, JsonAsset, (err, asset) =>
            {
                if (err)
                {
                    console.error(err);
                    resolve({});
                }
                else
                {
                    resolve(asset.json);
                }
            });
        })
    }
    public static async loadAudioClip(_address: string)
    {
        return new Promise(resolve =>
        {
            resources.load(_address, AudioClip, (err, asset) =>
            {
                if (err)
                {
                    console.error(err);
                    resolve(null);
                }
                else
                {
                    resolve(asset);
                }
            });
        })
    }
    public static async loadPrefab(_address: string)
    {
        return new Promise(resolve =>
        {
            resources.load(_address, Prefab, (err, asset) =>
            {
                if (err)
                {
                    console.error(err);
                    resolve(null);
                }
                else
                {
                    resolve(asset);
                }
            });
        })
    }
    public static async loadImage(_address: string)
    {
        return new Promise(resolve =>
        {
            resources.load(_address, SpriteFrame, (err, asset) =>
            {
                if (err)
                {
                    // 3.8.8 内核适配：2.x 主路径即 SpriteFrame；3.x 主资产为 ImageAsset，
                    // SpriteFrame 在 /spriteFrame 子资产路径。失败时回退子路径。
                    resources.load(_address + '/spriteFrame', SpriteFrame, (err2, asset2) =>
                    {
                        if (err2)
                        {
                            console.error(err2, _address);
                            // 3.8.8 内核适配：资源缺失（如高等级建筑外观变体图不全）时
                            // 返回 1x1 透明兜底帧，避免 Sprite 空帧渲染导致引擎 vb 崩溃
                            resolve(UtilsManager.fallbackFrame(_address));
                        }
                        else
                        {
                            resolve(asset2);
                        }
                    });
                }
                else
                {
                    resolve(asset);
                }
            });
        })
    }
    // 256x256 透明兜底 SpriteFrame（缓存复用；1x1 会让 Tiled assembler 算出百万瓦片）
    private static _fallback: SpriteFrame | null = null;
    private static fallbackFrame(_address: string): SpriteFrame
    {
        if (!UtilsManager._fallback)
        {
            const img = new ImageAsset();
            // 1x1 全透明 RGBA
            img.reset({ _data: new Uint8Array(256 * 256 * 4), width: 256, height: 256, format: Texture2D.PixelFormat.RGBA8888 } as any);
            const tex = new Texture2D();
            tex.image = img;
            const sf = new SpriteFrame();
            sf.texture = tex;
            // 3.8.8 内核适配：必须设 rect/offset/originalSize（默认 0x0 致 Tiled assembler 瓦片数爆炸）
            sf.rect = new Rect(0, 0, 256, 256);
            sf.offset = new Vec2(0, 0);
            sf.originalSize = new Size(256, 256);
            // 3.8.8 内核适配：兜底帧禁入动态图集；256px 保证 Tiled 填充瓦片数有界
            (sf as any).packable = false;
            UtilsManager._fallback = sf;
        }
        return UtilsManager._fallback;
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// /******************************************************************
//  * Copyright(C)
//  *
//  * 工具集
//  *
//  *
//  ******************************************************************/
// export default class UtilsManager
// {
//     //深复制
//     public static clone(src: any)
//     {
//         if (!src || typeof src !== "object")
//         {
//             return src;
//         }
// 
//         let out: any = src.constructor === Array ? [] : {};
// 
//         let _clone: Function = function (o: Object, c: any)
//         {
//             for (let i in o)
//             {
//                 if (o[i] && typeof o[i] === "object")
//                 {
//                     if (o[i].constructor === Array)
//                     {
//                         c[i] = [];
//                     }
//                     else
//                     {
//                         c[i] = {};
//                     }
//                     _clone(o[i], c[i]);
//                 }
//                 else
//                 {
//                     c[i] = o[i];
//                 }
//             }
//             return c;
//         };
// 
//         return _clone(src, out);
//     }
// 
//     public static async loadJson(_address: string)
//     {
//         return new Promise(resolve =>
//         {
//             resources.load(_address, cc.JsonAsset, (err, asset) =>
//             {
//                 if (err)
//                 {
//                     console.error(err);
//                     resolve({});
//                 }
//                 else
//                 {
//                     resolve(asset.json);
//                 }
//             });
//         })
//     }
// 
//     public static async loadAudioClip(_address: string)
//     {
//         return new Promise(resolve =>
//         {
//             resources.load(_address, cc.AudioClip, (err, asset) =>
//             {
//                 if (err)
//                 {
//                     console.error(err);
//                     resolve(null);
//                 }
//                 else
//                 {
//                     resolve(asset);
//                 }
//             });
//         })
//     }
//     public static async loadPrefab(_address: string)
//     {
//         return new Promise(resolve =>
//         {
//             cc.resources.load(_address, cc.Prefab, (err, asset) =>
//             {
//                 if (err)
//                 {
//                     console.error(err);
//                     resolve(null);
//                 }
//                 else
//                 {
//                     resolve(asset);
//                 }
//             });
//         })
//     }
//     public static async loadImage(_address: string)
//     {
//         return new Promise(resolve =>
//         {
//             cc.resources.load(_address, cc.SpriteFrame, (err, asset) =>
//             {
//                 if (err)
//                 {
//                     console.error(err, _address);
//                     resolve(null);
//                 }
//                 else
//                 {
//                     resolve(asset);
//                 }
//             });
//         })
//     }
// 
// 
// 
// }
