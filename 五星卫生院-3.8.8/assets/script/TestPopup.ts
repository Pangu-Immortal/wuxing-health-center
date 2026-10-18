import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

import PopupBase from "./common/component/popups/PopupBase";
// /** 测试弹窗 */

@ccclass('TestPopup')
export default class TestPopup extends PopupBase<string>{
    static get path() { return 'prefabs/testPopup' }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import PopupBase from "./common/component/popups/PopupBase";
// 
// const { ccclass, property } = cc._decorator;
// 
// /** 测试弹窗 */
// @ccclass
// export default class TestPopup extends PopupBase<string>{
// 
//     static get path() { return 'prefabs/testPopup' }
// 
// }
