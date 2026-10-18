/**
 * GameLogPanel —— 运行时实时日志面板（3.8.8 内核适配配套）
 * 功能：
 *  - 界面常驻 DOM 面板（浏览器/小游戏 webview 可见），实时输出关键流程节点、状态变化、错误堆栈与警告
 *  - 时间戳（HH:MM:SS.mmm）+ 日志等级（LOG/INFO/WARN/ERROR）分色
 *  - 自动滚动（可暂停）、清空、暂停/恢复、折叠/展开
 *  - 全局异常捕获：window.onerror / unhandledrejection / console.error 钩子统一收集，
 *    只记录不中断主循环（不 rethrow）
 *  - 环形缓冲上限 500 条，防内存膨胀
 * 接入：GameSys.ts 副作用 import 本模块（任何场景入口都加载）。
 * 关闭方式：URL 带 ?nolog=1 或调用 GameLog.disable()。
 */

type LogLevel = 'LOG' | 'INFO' | 'WARN' | 'ERROR';

const MAX_LINES = 500;

// 3.8.8 内核适配（原生/jsb 兼容）：jsb 环境存在 document/window 桩对象，
// createElement 返回的对象没有 querySelector/appendChild 等真实 DOM API，
// 仅 typeof 判断会漏过 → buildDom 抛 TypeError 中断模块初始化 → 整包黑屏。
// 用特征探测：真实 DOM 必须 createElement 产物带 querySelector 且 document.body 存在。
function hasRealDom(): boolean
{
    try
    {
        if (typeof document === 'undefined' || !document.createElement || !document.body) return false;
        const probe: any = document.createElement('div');
        return !!probe && typeof probe.querySelector === 'function' && typeof probe.appendChild === 'function';
    } catch (e) { return false; }
}

class GameLogImpl
{
    private enabled = true;
    private paused = false;
    private collapsed = false;
    private lines: { t: string; lv: LogLevel; msg: string }[] = [];
    private root: HTMLDivElement | null = null;
    private list: HTMLDivElement | null = null;
    private hooked = false;

    constructor()
    {
        try
        {
            if (typeof location !== 'undefined' && /[?&]nolog=1/.test(location.search)) this.enabled = false;
        } catch (e) { /* ignore */ }
        // 原生端无真实 DOM：不挂载面板，仅保留环形缓冲（日志经 console 走 logcat）
        if (this.enabled && hasRealDom()) this.buildDom();
        this.hook();
    }

    disable() { this.enabled = false; if (this.root) this.root.style.display = 'none'; }

    private ts(): string
    {
        const d = new Date();
        const p = (n: number, w = 2) => String(n).padStart(w, '0');
        return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`;
    }

    private buildDom()
    {
        if (typeof document === 'undefined') return;
        const root = document.createElement('div');
        root.id = 'wb-game-log';
        root.style.cssText = 'position:fixed;right:6px;top:6px;width:340px;max-height:46vh;display:flex;flex-direction:column;'
            + 'background:rgba(10,12,16,.88);color:#dfe6ee;font:11px/1.45 ui-monospace,Menlo,Consolas,monospace;'
            + 'border:1px solid #3a4450;border-radius:6px;z-index:2147483000;backdrop-filter:blur(2px);';
        const bar = document.createElement('div');
        bar.style.cssText = 'display:flex;gap:6px;align-items:center;padding:4px 8px;border-bottom:1px solid #3a4450;cursor:pointer;user-select:none;';
        bar.innerHTML = '<b style="color:#8fd3ff">运行日志</b><span id="wbl-count" style="color:#7d8896">0</span>'
            + '<span style="flex:1"></span>'
            + '<button id="wbl-pause" style="font:10px monospace;background:#232a33;color:#cfd8e3;border:1px solid #3a4450;border-radius:3px;padding:1px 6px;cursor:pointer">暂停</button>'
            + '<button id="wbl-clear" style="font:10px monospace;background:#232a33;color:#cfd8e3;border:1px solid #3a4450;border-radius:3px;padding:1px 6px;cursor:pointer">清空</button>'
            + '<button id="wbl-fold" style="font:10px monospace;background:#232a33;color:#cfd8e3;border:1px solid #3a4450;border-radius:3px;padding:1px 6px;cursor:pointer">收起</button>';
        const list = document.createElement('div');
        list.style.cssText = 'overflow-y:auto;padding:4px 8px;flex:1;';
        root.appendChild(bar); root.appendChild(list);
        document.body.appendChild(root);
        this.root = root; this.list = list;
        const stop = (e: Event) => e.stopPropagation();
        root.addEventListener('mousedown', stop); root.addEventListener('touchstart', stop);
        root.addEventListener('click', stop);
        bar.querySelector('#wbl-pause')!.addEventListener('click', (e) =>
        {
            e.stopPropagation();
            this.paused = !this.paused;
            (e.target as HTMLButtonElement).textContent = this.paused ? '恢复' : '暂停';
        });
        bar.querySelector('#wbl-clear')!.addEventListener('click', (e) =>
        {
            e.stopPropagation();
            this.lines = []; if (this.list) this.list.innerHTML = '';
            const c = bar.querySelector('#wbl-count'); if (c) c.textContent = '0';
        });
        bar.querySelector('#wbl-fold')!.addEventListener('click', (e) =>
        {
            e.stopPropagation();
            this.collapsed = !this.collapsed;
            list.style.display = this.collapsed ? 'none' : 'block';
            (e.target as HTMLButtonElement).textContent = this.collapsed ? '展开' : '收起';
        });
    }

    private color(lv: LogLevel): string
    {
        switch (lv)
        {
            case 'ERROR': return '#ff7b72';
            case 'WARN': return '#e3b341';
            case 'INFO': return '#7ee787';
            default: return '#c9d1d9';
        }
    }

    push(lv: LogLevel, msg: string)
    {
        if (!this.enabled) return;
        const t = this.ts();
        this.lines.push({ t, lv, msg });
        if (this.lines.length > MAX_LINES) this.lines.shift();
        if (!this.list) return;
        if (this.paused) { this.updateCount(); return; }
        const div = document.createElement('div');
        div.style.cssText = `color:${this.color(lv)};white-space:pre-wrap;word-break:break-all;border-bottom:1px dotted #2a313a;padding:1px 0;`;
        div.textContent = `[${t}] ${lv} ${msg}`;
        this.list.appendChild(div);
        while (this.list.childElementCount > MAX_LINES) this.list.removeChild(this.list.firstChild!);
        this.list.scrollTop = this.list.scrollHeight;
        this.updateCount();
    }

    private updateCount()
    {
        if (!this.root) return;
        const c = this.root.querySelector('#wbl-count');
        if (c) c.textContent = String(this.lines.length);
    }

    /** 重放暂停期间积压的日志到面板 */
    flush()
    {
        if (!this.list) return;
        this.list.innerHTML = '';
        for (const l of this.lines)
        {
            const div = document.createElement('div');
            div.style.cssText = `color:${this.color(l.lv)};white-space:pre-wrap;word-break:break-all;border-bottom:1px dotted #2a313a;padding:1px 0;`;
            div.textContent = `[${l.t}] ${l.lv} ${l.msg}`;
            this.list.appendChild(div);
        }
        this.list.scrollTop = this.list.scrollHeight;
    }

    private hook()
    {
        if (this.hooked || typeof window === 'undefined') return;
        this.hooked = true;
        const self = this;
        // console 钩子（保留原行为）
        const orig = { log: console.log.bind(console), warn: console.warn.bind(console), error: console.error.bind(console), info: console.info.bind(console) };
        const fmt = (args: any[]) => args.map(a =>
        {
            if (typeof a === 'string') return a;
            if (a instanceof Error) return `${a.message}\n${a.stack || ''}`;
            try { return JSON.stringify(a); } catch (e) { return String(a); }
        }).join(' ');
        console.log = function (...a: any[]) { self.push('LOG', fmt(a)); orig.log(...a); };
        console.info = function (...a: any[]) { self.push('INFO', fmt(a)); orig.info(...a); };
        console.warn = function (...a: any[]) { self.push('WARN', fmt(a)); orig.warn(...a); };
        console.error = function (...a: any[]) { self.push('ERROR', fmt(a)); orig.error(...a); };
        // 全局异常：只记录不中断（jsb 桩 window 可能无 addEventListener，guard）
        try
        {
            if (typeof window.addEventListener === 'function')
            {
                window.addEventListener('error', (e) =>
                {
                    self.push('ERROR', `uncaught: ${e.message} @${(e as any).filename || ''}:${e.lineno}:${e.colno}`);
                });
                window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) =>
                {
                    const r = e.reason;
                    self.push('ERROR', `unhandledrejection: ${r && r.message ? r.message + '\n' + (r.stack || '') : String(r)}`);
                });
            }
        } catch (e) { /* ignore */ }
        self.push('INFO', hasRealDom() ? 'GameLog 面板已挂载（?nolog=1 可关闭）' : 'GameLog 原生模式（仅缓冲+console）');
    }

    /** 关键流程节点埋点 */
    node(tag: string, detail?: string) { this.push('INFO', `[flow] ${tag}${detail ? ' ' + detail : ''}`); }
}

export const GameLog = new GameLogImpl();
export default GameLog;
