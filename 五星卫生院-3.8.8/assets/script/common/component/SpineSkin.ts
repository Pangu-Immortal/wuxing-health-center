import { _decorator, Component, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpineSkin')
export default class SpineSkin extends Component
{
    @property(SpriteFrame)
    private sprite: SpriteFrame | null = null;
    onLoad()
    {
        this.change()
    }
    private change(): void
    {
//        // console.log(this.spine.skeletonData.getRuntimeData().defaultSkin)
//        // // return
//        // let att = this.spine.skeletonData.getRuntimeData().defaultSkin.attachments[4][Object.keys(this.spine.skeletonData.getRuntimeData().defaultSkin.attachments[4])[1]];
//        // console.log("查看", att.region)
//        // let region = this.CreateRegion(this.sprite.getTexture())
//        // console.log("emmm", region)
//        // att.region = region
//        // att.setRegion(region)
//        // att.updateOffset()
    }
    CreateRegion(texture)
    {
//        // let skeletonTexture = new sp.SkeletonTexture()
//        // skeletonTexture.setRealTexture(texture)
//        // let page = new sp.spine.TextureAtlasPage()
//        // page.name = texture.name
//        // page.uWrap = sp.spine.TextureWrap.ClampToEdge
//        // page.vWrap = sp.spine.TextureWrap.ClampToEdge
//        // page.texture = skeletonTexture
//        // page.texture.setWraps(page.uWrap, page.vWrap)
//        // page.width = texture.width
//        // page.height = texture.height
//        // let region = new sp.spine.TextureAtlasRegion()
//        // region.page = page
//        // region.width = texture.width
//        // region.height = texture.height
//        // region.originalWidth = texture.width
//        // region.originalHeight = texture.height
//        // region.rotate = false
//        // region.u = 0
//        // region.v = 0
//        // region.u2 = 1
//        // region.v2 = 1
//        // region.texture = skeletonTexture
//        // return region
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// const { ccclass, property } = cc._decorator;
// 
// @ccclass
// export default class SpineSkin extends cc.Component
// {
// 
//     @property(cc.SpriteFrame)
//     private sprite: cc.SpriteFrame = null;
// 
//     onLoad()
//     {
//         this.change()
//     }
//     private change(): void
//     {
//         // console.log(this.spine.skeletonData.getRuntimeData().defaultSkin)
//         // // return
//         // let att = this.spine.skeletonData.getRuntimeData().defaultSkin.attachments[4][Object.keys(this.spine.skeletonData.getRuntimeData().defaultSkin.attachments[4])[1]];
//         // console.log("查看", att.region)
//         // let region = this.CreateRegion(this.sprite.getTexture())
//         // console.log("emmm", region)
//         // att.region = region
//         // att.setRegion(region)
//         // att.updateOffset()
//     }
// 
//     CreateRegion(texture)
//     {
//         // let skeletonTexture = new sp.SkeletonTexture()
//         // skeletonTexture.setRealTexture(texture)
//         // let page = new sp.spine.TextureAtlasPage()
//         // page.name = texture.name
//         // page.uWrap = sp.spine.TextureWrap.ClampToEdge
//         // page.vWrap = sp.spine.TextureWrap.ClampToEdge
//         // page.texture = skeletonTexture
//         // page.texture.setWraps(page.uWrap, page.vWrap)
//         // page.width = texture.width
//         // page.height = texture.height
// 
//         // let region = new sp.spine.TextureAtlasRegion()
//         // region.page = page
//         // region.width = texture.width
//         // region.height = texture.height
//         // region.originalWidth = texture.width
//         // region.originalHeight = texture.height
// 
//         // region.rotate = false
//         // region.u = 0
//         // region.v = 0
//         // region.u2 = 1
//         // region.v2 = 1
//         // region.texture = skeletonTexture
//         // return region
//     }
// }
