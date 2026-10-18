import { Camera, Color, Component, Graphics, Node, UITransform, _decorator, director, view } from 'cc';
const { ccclass } = _decorator;

/**
 * ScreenEdgeFill —— 消除 SHOW_ALL letterbox 空白带（用户所见"白屏/粉白屏"）
 * 2026-10-18：窄屏（如 9:20）下 SHOW_ALL 上下留 letterbox，暴露相机默认清屏色（粉白 218,192,177），
 * 占屏约 20%，被感知为白屏。修复：
 *  ① 相机 clearColor 改为场景内容主色（深褐 109,96,89），任何比例下不再暴露粉白；
 *  ② Canvas 下动态画上/下纯色延伸带，颜色取内容上下边缘纯色（实测顶 #6D6059、底 #797173），
 *     高度 = max(0,(visibleH-1334)/2)，随屏幕比例自适应，与内容边缘无缝衔接；
 *  ③ 带节点 siblingIndex=0 置底，不遮挡 UI；无 BlockInputEvents，不吞触摸。
 */
@ccclass('ScreenEdgeFill')
export default class ScreenEdgeFill extends Component
{
    private _top: Node | null = null;
    private _bottom: Node | null = null;
    private readonly TOP_COLOR = new Color(218, 192, 177, 255); // 天空色（与内容顶边无缝）
    private readonly BOTTOM_COLOR = new Color(183, 168, 168, 255); // 内容底边色（无缝）

    protected onEnable()
    {
        this.build();
        view.on('canvas-resize', this.refit, this);
        this.refit();
    }
    protected onDisable()
    {
        view.off('canvas-resize', this.refit, this);
    }
    private make(name: string): Node
    {
        const n = new Node(name);
        n.layer = this.node.layer;
        n.setParent(this.node);
        n.addComponent(UITransform);
        const g = n.addComponent(Graphics);
        n.setSiblingIndex(0);
        return n;
    }
    private build()
    {
        if (!this._top || !this._top.isValid) this._top = this.make('__edge_top__');
        if (!this._bottom || !this._bottom.isValid) this._bottom = this.make('__edge_bottom__');
        try
        {
            const cam = director.getScene()?.getComponentInChildren(Camera);
            if (cam) cam.clearColor = new Color(218, 192, 177, 255);
        } catch (e) { /* ignore */ }
    }
    private drawBand(n: Node | null, color: Color, centerY: number, h: number, w: number)
    {
        if (!n) return;
        const g = n.getComponent(Graphics);
        if (!g) return;
        g.clear();
        if (h <= 0.5) { n.active = false; return; }
        n.active = true;
        g.fillColor = color;
        g.rect(-w / 2, centerY - h / 2, w, h);
        g.fill();
    }
    private refit()
    {
        try
        {
            // 2026-10-18 修正：view.getVisibleSize() 返回设计区尺寸（恒 750x1334），
            // 无法反映 letterbox。正确算法：canvas 像素高 / scale = 画布设计高，
            // band = (画布设计高 - 1334)/2；宽同理取画布设计宽。
            const cs = view.getCanvasSize();
            const sy = view.getScaleY() || 1;
            const sx = view.getScaleX() || 1;
            const canvasHDesign = cs.height / sy;
            const canvasWDesign = cs.width / sx;
            const band = Math.max(0, (canvasHDesign - 1334) / 2);
            const w = Math.max(canvasWDesign, 750);
            this.drawBand(this._top, this.TOP_COLOR, 667 + band / 2, band, w);
            this.drawBand(this._bottom, this.BOTTOM_COLOR, -667 - band / 2, band, w);
            console.log(`[EDGE-FILL] band=${band.toFixed(0)} canvas=${cs.width.toFixed(0)}x${cs.height.toFixed(0)} design=${canvasWDesign.toFixed(0)}x${canvasHDesign.toFixed(0)}`);
        } catch (e) { /* ignore */ }
    }
}
