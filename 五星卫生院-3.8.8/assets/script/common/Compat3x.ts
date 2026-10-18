/**
 * Compat3x —— 2.x Node API → 3.x 组件化 API 兼容层
 * 由 codemod 自动注入 import；语义与 2.x 对齐：
 *   opacity → UIOpacity 组件（自动挂载）
 *   width/height/contentSize/boundingBox/convert*AR → UITransform 组件（自动挂载）
 *   zIndex → siblingIndex（同父节点绘制序，2.x zIndex 的 3.x 等价物）
 *   color → Sprite/Label 渲染组件 color
 *   stopAllActions → Tween.stopAllByTarget
 */
import { Node, UIOpacity, UITransform, Color, Sprite, Label, Tween } from 'cc';

/** 取（或自动挂）UITransform */
export function ut(n: Node): UITransform {
    let c = n.getComponent(UITransform);
    if (!c) c = n.addComponent(UITransform);
    return c;
}

export function setOpacity(n: Node, v: number): void {
    let c = n.getComponent(UIOpacity);
    if (!c) c = n.addComponent(UIOpacity);
    c.opacity = v;
}
export function getOpacity(n: Node): number {
    const c = n.getComponent(UIOpacity);
    return c ? c.opacity : 255;
}

export function setNodeWidth(n: Node, v: number): void { ut(n).width = v; }
export function getNodeWidth(n: Node): number { return ut(n).width; }
export function setNodeHeight(n: Node, v: number): void { ut(n).height = v; }
export function getNodeHeight(n: Node): number { return ut(n).height; }

/** 2.x zIndex：控制同父兄弟绘制顺序 → 3.x siblingIndex */
export function setZIndex(n: Node, z: number): void {
    n.setSiblingIndex(Math.max(0, Math.floor(z)));
}
export function getZIndex(n: Node): number { return n.getSiblingIndex(); }

/** 2.x node.color → 渲染组件 color（Sprite 优先，其次 Label） */
export function setNodeColor(n: Node, c: Color): void {
    const s = n.getComponent(Sprite);
    if (s) { s.color = c; return; }
    const l = n.getComponent(Label);
    if (l) { l.color = c; }
}
export function getNodeColor(n: Node): Color {
    const s = n.getComponent(Sprite);
    if (s) return s.color.clone();
    const l = n.getComponent(Label);
    if (l) return l.color.clone();
    return new Color(255, 255, 255, 255);
}

export function stopAllActions(n: Node): void { Tween.stopAllByTarget(n); }
