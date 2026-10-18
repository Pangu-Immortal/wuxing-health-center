import { _decorator, NodePool, Prefab, instantiate, Node } from 'cc';
export default class PoolManager
{
    constructor()
    {
        this._clientPool = new NodePool();
        this.client = new Prefab()
        this._goldPool = new NodePool()
    }
    _clientPool: NodePool
    client: Prefab
    _goldPool: NodePool
    gold: Prefab
    static instance: PoolManager
    static getInstance(): PoolManager
    {
        this.instance = this.instance ? this.instance : new PoolManager()
        return this.instance
    }
    initGoldPool(prefab: Prefab, size: number)
    {
        for (let i = 0; i < size; i++)
        {
            let block = instantiate(prefab);
            this._goldPool.put(block);
        }
        this.gold = prefab;
    }
    getGold(): Node
    {
        let block = null;
        if (this._goldPool.size() > 0)
        {
            block = this._goldPool.get()
        }
        else
        {
            block = instantiate(this.gold)
        }
        return block;
    }
    clearGoldList(node: Node)
    {
        this._goldPool.put(node)
    }
    clearGoldPool()
    {
        this._goldPool.clear();
    }
    initPool(prefab: Prefab, size: number)
    {
        for (let i = 0; i < size; i++)
        {
            let block = instantiate(prefab);
            this._clientPool.put(block);
        }
        this.client = prefab;
    }
    getBlock(): Node
    {
        let block = null;
        if (this._clientPool.size() > 0)
        {
            block = this._clientPool.get()
        }
        else
        {
            block = instantiate(this.client)
        }
        return block;
    }
//    // //返回对象池
//    // saveNode(v: number, node: cc.Node)
//    // {
//    //     this._clientList[v].push(node)
//    // }
    clearNodeList(node: Node)
    {
        this._clientPool.put(node)
    }
    clearPool(v: number)
    {
        this._clientPool[v].clear();
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// export default class PoolManager 
// {
//     constructor()
//     {
//         this._clientPool = new cc.NodePool();
//         this.client = new cc.Prefab()
// 
//         this._goldPool = new cc.NodePool()
//     }
// 
//     _clientPool: cc.NodePool
//     client: cc.Prefab
// 
//     _goldPool: cc.NodePool
//     gold: cc.Prefab
// 
//     static instance: PoolManager
//     static getInstance(): PoolManager
//     {
//         this.instance = this.instance ? this.instance : new PoolManager()
//         return this.instance
//     }
//     initGoldPool(prefab: cc.Prefab, size: number)
//     {
//         for (let i = 0; i < size; i++)
//         {
//             let block = cc.instantiate(prefab);
//             this._goldPool.put(block);
//         }
//         this.gold = prefab;
//     }
//     getGold(): cc.Node
//     {
//         let block = null;
//         if (this._goldPool.size() > 0)
//         {
//             block = this._goldPool.get()
//         }
//         else
//         {
//             block = cc.instantiate(this.gold)
//         }
//         return block;
//     }
//     clearGoldList(node: cc.Node)
//     {
//         this._goldPool.put(node)
//     }
//     clearGoldPool()
//     {
//         this._goldPool.clear();
//     }
// 
// 
//     initPool(prefab: cc.Prefab, size: number)
//     {
//         for (let i = 0; i < size; i++)
//         {
//             let block = cc.instantiate(prefab);
//             this._clientPool.put(block);
//         }
//         this.client = prefab;
//     }
//     getBlock(): cc.Node
//     {
//         let block = null;
//         if (this._clientPool.size() > 0)
//         {
//             block = this._clientPool.get()
//         }
//         else
//         {
//             block = cc.instantiate(this.client)
//         }
//         return block;
//     }
//     // //返回对象池
//     // saveNode(v: number, node: cc.Node)
//     // {
//     //     this._clientList[v].push(node)
//     // }
//     clearNodeList(node: cc.Node)
//     {
//         this._clientPool.put(node)
//     }
//     clearPool(v: number)
//     {
//         this._clientPool[v].clear();
//     }
// }
