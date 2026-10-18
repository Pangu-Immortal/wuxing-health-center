import { Event, EventTouch, Node, Vec2, _decorator } from 'cc';
export default class TouchManager
{
    constructor(node: Node)
    {
        this.node = node;
        this.register()
    }
    private node: Node
    private delta: number = 200;
    private lock: number = 0;
    private offset: number = 100;
    private callbackLeft: Function
    private callbackRight: Function
    private callbackUp: Function
    private callbackDown: Function
    submit(callbackLeft: Function,
        callbackRight: Function,
        callbackUp: Function,
        callbackDown: Function)
    {
        this.callbackLeft = callbackLeft
        this.callbackRight = callbackRight
        this.callbackUp = callbackUp
        this.callbackDown = callbackDown
    }
    register()
    {
        let initPos: Vec2
        this.node.on('touch-start', (e: EventTouch) =>
        {
            initPos = e.getLocation();
        }, this)
        this.node.on('touch-move', () =>
        {
            this.lock++;
        }, this)
        this.node.on('touch-end', (e: EventTouch) =>
        {
            this.lock < this.delta ? this.direction(initPos, e.getLocation()) : null;
            this.lock = 0;
        }, this)
        this.node.on('touch-cancel', (e: EventTouch) =>
        {
            this.lock < this.delta ? this.direction(initPos, e.getLocation()) : null;
            this.lock = 0;
        }, this)
    }
    direction(initPos: Vec2, touchPos: Vec2): void
    {
        if (Math.abs(touchPos.x - initPos.x) < this.offset && Math.abs(touchPos.y - initPos.y) < this.offset)
        {
            return;
        }
        if (Math.abs(touchPos.x - initPos.x) > Math.abs(touchPos.y - initPos.y))
        {
//            //这种是左右移动
            if (touchPos.x - initPos.x > this.offset)
            {
//                // console.log("右")
                this.callbackRight()
            }
            else if (touchPos.x - initPos.x < -this.offset)
            {
//                // console.log("左")
                this.callbackLeft();
            }
        }
        else
        {
//            //这种是上下移动
            if (touchPos.y - initPos.y > this.offset)
            {
//                // console.log("上")
                this.callbackUp();
            }
            else if (touchPos.y - initPos.y < -this.offset)
            {
//                // console.log("下")
                this.callbackDown()
            }
        }
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// export default class TouchManager
// {
// 
//     constructor(node: cc.Node)
//     {
//         this.node = node;
//         this.register()
//     }
// 
//     private node: cc.Node
//     private delta: number = 200;
//     private lock: number = 0;
//     private offset: number = 100;
// 
//     private callbackLeft: Function
//     private callbackRight: Function
//     private callbackUp: Function
//     private callbackDown: Function
// 
//     submit(callbackLeft: Function,
//         callbackRight: Function,
//         callbackUp: Function,
//         callbackDown: Function)
//     {
//         this.callbackLeft = callbackLeft
//         this.callbackRight = callbackRight
//         this.callbackUp = callbackUp
//         this.callbackDown = callbackDown
//     }
//     register()
//     {
//         let initPos: cc.Vec2
//         this.node.on('touchstart', (e: EventTouch) =>
//         {
//             initPos = e.getLocation();
//         }, this)
//         this.node.on('touchmove', () =>
//         {
//             this.lock++;
//         }, this)
//         this.node.on('touchend', (e: EventTouch) =>
//         {
//             this.lock < this.delta ? this.direction(initPos, e.getLocation()) : null;
//             this.lock = 0;
//         }, this)
//         this.node.on('touchcancel', (e: EventTouch) =>
//         {
//             this.lock < this.delta ? this.direction(initPos, e.getLocation()) : null;
//             this.lock = 0;
//         }, this)
//     }
//     direction(initPos: cc.Vec2, touchPos: cc.Vec2): void
//     {
//         if (Math.abs(touchPos.x - initPos.x) < this.offset && Math.abs(touchPos.y - initPos.y) < this.offset)
//         {
//             return;
//         }
//         if (Math.abs(touchPos.x - initPos.x) > Math.abs(touchPos.y - initPos.y))
//         {
//             //这种是左右移动
//             if (touchPos.x - initPos.x > this.offset)
//             {
//                 // console.log("右")
//                 this.callbackRight()
//             }
//             else if (touchPos.x - initPos.x < -this.offset)
//             {
//                 // console.log("左")
//                 this.callbackLeft();
//             }
//         }
//         else
//         {
//             //这种是上下移动
//             if (touchPos.y - initPos.y > this.offset)
//             {
//                 // console.log("上")
//                 this.callbackUp();
//             }
//             else if (touchPos.y - initPos.y < -this.offset)
//             {
//                 // console.log("下")
//                 this.callbackDown()
//             }
//         }
//     }
// }
