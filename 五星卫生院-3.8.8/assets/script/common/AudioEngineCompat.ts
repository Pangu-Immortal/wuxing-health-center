/**
 * AudioEngineCompat —— 2.x cc.audioEngine → 3.8 AudioSource 兼容层
 * 提供与 2.x audioEngine 同名同语义的接口，内部用常驻节点的 AudioSource 实现。
 * 2.x: audioID = audioEngine.play(clip, loop, volume); audioEngine.stop(audioID);
 * 3.x: 用 AudioSource 组件；audioID 用自增句柄映射到 source 实例。
 */
import { AudioClip, AudioSource, Node, director, game } from 'cc';

let _rootNode: Node | null = null;
function rootNode(): Node {
    if (!_rootNode || !_rootNode.isValid) {
        _rootNode = new Node('__audio_engine_compat__');
        director.addPersistRootNode(_rootNode);
    }
    return _rootNode;
}

interface Handle { id: number; bgm: AudioSource | null; sfx: AudioSource | null; }
const _handles = new Map<number, Handle>();
let _nextId = 1;
let _bgmVolume = 1;
let _sfxVolume = 1;

function newSource(): AudioSource {
    const n = new Node('__src__');
    rootNode().addChild(n);
    return n.addComponent(AudioSource);
}

export const audioEngine = {
    /** 播放，返回 audioID（与 2.x 一致） */
    play(clip: AudioClip, loop: boolean, volume: number = 1): number {
        if (!clip) return -1;
        const id = _nextId++;
        if (loop) {
            const src = newSource();
            src.clip = clip; src.loop = true; src.volume = volume * _bgmVolume;
            src.play();
            _handles.set(id, { id, bgm: src, sfx: null });
        } else {
            const src = newSource();
            src.playOneShot(clip, volume * _sfxVolume);
            _handles.set(id, { id, bgm: null, sfx: src });
        }
        return id;
    },
    stop(audioID: number): void {
        const h = _handles.get(audioID);
        if (!h) return;
        if (h.bgm) { h.bgm.stop(); h.bgm.node.destroy(); }
        if (h.sfx) { h.sfx.node.destroy(); }
        _handles.delete(audioID);
    },
    stopAll(): void {
        _handles.forEach(h => {
            if (h.bgm) { h.bgm.stop(); h.bgm.node.destroy(); }
            if (h.sfx) { h.sfx.node.destroy(); }
        });
        _handles.clear();
    },
    setVolume(audioID: number, v: number): void {
        const h = _handles.get(audioID);
        if (h && h.bgm) h.bgm.volume = v * _bgmVolume;
    },
    getVolume(audioID: number): number {
        const h = _handles.get(audioID);
        return h && h.bgm ? h.bgm.volume : 0;
    },
    setLoop(audioID: number, loop: boolean): void {
        const h = _handles.get(audioID);
        if (h && h.bgm) h.bgm.loop = loop;
    },
    isLoop(audioID: number): boolean {
        const h = _handles.get(audioID);
        return h && h.bgm ? h.bgm.loop : false;
    },
    setCurrentTime(audioID: number, sec: number): void {
        const h = _handles.get(audioID);
        if (h && h.bgm) (h.bgm as any).currentTime = sec;
    },
    pause(audioID: number): void {
        const h = _handles.get(audioID);
        if (h && h.bgm) h.bgm.pause();
    },
    resume(audioID: number): void {
        const h = _handles.get(audioID);
        if (h && h.bgm) h.bgm.play();
    },
    pauseAll(): void {
        _handles.forEach(h => { if (h.bgm) h.bgm.pause(); });
    },
    resumeAll(): void {
        _handles.forEach(h => { if (h.bgm) h.bgm.play(); });
    },
    /** 2.x 全局 BGM 音量（0-1） */
    setMusicVolume(v: number): void { _bgmVolume = v; },
    getMusicVolume(): number { return _bgmVolume; },
    /** 2.x 全局音效音量（0-1） */
    setEffectsVolume(v: number): void { _sfxVolume = v; },
    getEffectsVolume(): number { return _sfxVolume; },
    setMusicFinishCallback(audioID: number, cb: () => void): void {
        const h = _handles.get(audioID);
        if (h && h.bgm) h.bgm.node.on('ended', cb);
    },
    stopAllEffects(): void {
        _handles.forEach((h, id) => { if (h.sfx) { h.sfx.node.destroy(); _handles.delete(id); } });
    },
    setMaxAudioInstance(n: number): void { /* 3.x 无对应，no-op */ },
    uncload(clip: AudioClip): void { /* 拼写兼容 2.x 的 unload */ },
    unload(clip: AudioClip): void { /* no-op */ },
};

export default audioEngine;
