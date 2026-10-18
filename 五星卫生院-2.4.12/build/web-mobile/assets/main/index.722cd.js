window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AStar: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "94e08uwqlBEGba2mam98g1A", "AStar");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Grid = exports.GRIDTYPE = void 0;
    var GRIDTYPE;
    (function(GRIDTYPE) {
      GRIDTYPE[GRIDTYPE["BARRIOR"] = 0] = "BARRIOR";
      GRIDTYPE[GRIDTYPE["LEFT"] = 1] = "LEFT";
      GRIDTYPE[GRIDTYPE["RIHGHT"] = 2] = "RIHGHT";
      GRIDTYPE[GRIDTYPE["START"] = 3] = "START";
      GRIDTYPE[GRIDTYPE["END"] = 4] = "END";
    })(GRIDTYPE = exports.GRIDTYPE || (exports.GRIDTYPE = {}));
    var Grid = function() {
      function Grid() {
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.g = 0;
        this.f = 0;
        this.parent = null;
        this.type = GRIDTYPE.BARRIOR;
      }
      return Grid;
    }();
    exports.Grid = Grid;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "AStar";
    var AStar = function(_super) {
      __extends(AStar, _super);
      function AStar() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.mapH = 24;
        _this.mapW = 42;
        _this.gridH = 40;
        _this.gridW = 40;
        _this.posStart = cc.v2(27, 1);
        _this.posEnd = cc.v2(0, 0);
        _this.Map_Path = [];
        _this.is8dir = true;
        _this.TYPE = [ GRIDTYPE.BARRIOR, GRIDTYPE.LEFT, GRIDTYPE.RIHGHT ];
        return _this;
      }
      AStar.prototype.onLoad = function() {};
      AStar.prototype.findPath = function(startPos, endPos) {
        var startGrid = this.gridsList[startPos.x][startPos.y];
        this.openList.push(startGrid);
        var curGrid = this.openList[0];
        while (this.openList.length > 0 && curGrid.type != GRIDTYPE.END) {
          curGrid = this.openList[0];
          if (curGrid.type == GRIDTYPE.END) {
            this.generatePate(curGrid);
            return;
          }
          for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) if (0 != i || 0 != j) {
            var col = curGrid.x + i;
            var row = curGrid.y + j;
            if (col >= 0 && row >= 0 && col <= this.mapW && row <= this.mapH && this.gridsList[col][row].type != GRIDTYPE.BARRIOR && this.closeList.indexOf(this.gridsList[col][row]) < 0) {
              if (this.is8dir) {
                if (this.gridsList[col - i][row].type == GRIDTYPE.BARRIOR || this.gridsList[col][row - j].type == GRIDTYPE.BARRIOR) continue;
              } else if (Math.abs(i) == Math.abs(j)) continue;
              var g = curGrid.g + parseInt(Math.sqrt(Math.pow(10 * i, 2) + Math.pow(10 * j, 2)).toFixed(0));
              if (0 == this.gridsList[col][row].g || this.gridsList[col][row].g > g) {
                this.gridsList[col][row].g = g;
                this.gridsList[col][row].parent = curGrid;
              }
              this.gridsList[col][row].h = Math.abs(endPos.x - col) + Math.abs(endPos.y - row);
              this.gridsList[col][row].f = this.gridsList[col][row].g + this.gridsList[col][row].h;
              this.openList.indexOf(this.gridsList[col][row]) < 0 && this.openList.push(this.gridsList[col][row]);
            }
          }
          this.closeList.push(curGrid);
          this.openList.splice(this.openList.indexOf(curGrid), 1);
          this.openList.length <= 0 && console.error("\u627e\u4e0d\u5230\u8def\u5f84", this.posEnd.x, this.posEnd.y);
          this.openList.sort(function(i, j) {
            return i.f - j.f;
          });
        }
      };
      AStar.prototype.sortFunc = function(x, y) {
        return x.f - y.f;
      };
      AStar.prototype.generatePate = function(grid) {
        this.path.push(grid);
        while (grid.parent) {
          grid = grid.parent;
          this.path.push(grid);
        }
      };
      AStar.prototype.initMap = function() {
        this.openList = [];
        this.closeList = [];
        this.path = [];
        this.gridsList = [];
        this.gridsList = new Array(this.mapW + 1);
        for (var i = 0; i < this.gridsList.length; i++) this.gridsList[i] = new Array(this.mapH + 1);
        for (var i = 0; i <= this.mapW; i++) for (var j = 0; j <= this.mapH; j++) this.addGrid(i, j, this.TYPE[this.Map_Path[i][j]]);
        this.addGrid(this.posStart.x, this.posStart.y, GRIDTYPE.START);
        this.addGrid(this.posEnd.x, this.posEnd.y, GRIDTYPE.END);
      };
      AStar.prototype.addGrid = function(col, row, type) {
        var grid = new Grid();
        grid.x = col;
        grid.y = row;
        grid.type = type;
        this.gridsList[col][row] = grid;
      };
      AStar = __decorate([ ccclass ], AStar);
      return AStar;
    }(cc.Component);
    exports.default = AStar;
    cc._RF.pop();
  }, {} ],
  AnimManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a737ePo56NCpreCcsKRj/On", "AnimManager");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AnimEnum;
    (function(AnimEnum) {
      AnimEnum[AnimEnum["red"] = 1] = "red";
      AnimEnum[AnimEnum["hand"] = 2] = "hand";
      AnimEnum[AnimEnum["hand_1"] = 3] = "hand_1";
      AnimEnum[AnimEnum["hand_2"] = 4] = "hand_2";
      AnimEnum[AnimEnum["hand_3"] = 5] = "hand_3";
      AnimEnum[AnimEnum["breathe"] = 6] = "breathe";
    })(AnimEnum || (AnimEnum = {}));
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var AnimManager = function(_super) {
      __extends(AnimManager, _super);
      function AnimManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.anim = AnimEnum.red;
        return _this;
      }
      AnimManager.prototype.onEnable = function() {
        switch (this.anim) {
         case AnimEnum.red:
          this.red();
          break;

         case AnimEnum.hand:
          this.hand();
          break;

         case AnimEnum.hand_1:
          this.hand_1();
          break;

         case AnimEnum.hand_2:
          this.hand_2();
          break;

         case AnimEnum.hand_3:
          this.hand_3();
          break;

         case AnimEnum.breathe:
          this.breathe();
        }
      };
      AnimManager.prototype.red = function() {
        this.node.stopAllActions();
        var scaleX = this.node.scaleX;
        var scaleY = 1;
        scaleX /= Math.abs(scaleX);
        this.node.scaleX = scaleX;
        this.node.scaleY = 1;
        cc.tween(this.node).to(.5, {
          opacity: 0,
          scaleX: 1 * scaleX,
          scaleY: 1 * scaleY
        }).to(.5, {
          opacity: 255,
          scaleX: 1.3 * scaleX,
          scaleY: 1.3 * scaleY
        }).to(.05, {
          angle: 15
        }).to(.05, {
          angle: 0
        }).to(.05, {
          angle: -15
        }).to(.05, {
          angle: 0
        }).delay(.5).union().repeatForever().start();
      };
      AnimManager.prototype.hand = function() {
        cc.tween(this.node).to(.5, {
          x: 86
        }).to(.5, {
          x: 0
        }).delay(.2).union().repeatForever().start();
      };
      AnimManager.prototype.hand_1 = function() {
        cc.tween(this.node).to(.5, {
          angle: 10
        }).to(.5, {
          angle: 0
        }).delay(.2).union().repeatForever().start();
      };
      AnimManager.prototype.hand_2 = function() {
        cc.tween(this.node).to(.5, {
          x: -198,
          y: -25
        }).delay(.5).to(.5, {
          x: -228,
          y: 0
        }).union().repeatForever().start();
      };
      AnimManager.prototype.hand_3 = function() {
        cc.tween(this.node).to(.5, {
          y: this.node.y - 20
        }).delay(.5).to(.5, {
          y: this.node.y + 20
        }).delay(.5).union().repeatForever().start();
      };
      AnimManager.prototype.breathe = function() {
        cc.tween(this.node).to(.3, {
          scale: 1.2
        }).delay(.1).to(.3, {
          scale: 1
        }).delay(.1).union().repeatForever().start();
      };
      __decorate([ property({
        type: cc.Enum(AnimEnum)
      }) ], AnimManager.prototype, "anim", void 0);
      AnimManager = __decorate([ ccclass, menu("\u6309\u94ae\u7ec4\u4ef6/AnimManager") ], AnimManager);
      return AnimManager;
    }(cc.Component);
    exports.default = AnimManager;
    cc._RF.pop();
  }, {} ],
  Appearance: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "46e3cItNTVFHYnbxDf+8Nc7", "Appearance");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var StateManager_1 = require("../common/manager/StateManager");
    var UtilsManager_1 = require("../common/manager/UtilsManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Appearance";
    var Appearance = function(_super) {
      __extends(Appearance, _super);
      function Appearance() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.S = null;
        _this.lockS = null;
        _this.goldA = null;
        _this.goldS = null;
        _this.reduce = null;
        _this.A_spr = null;
        _this.B_spr = null;
        _this.S_spr = null;
        _this.A_lab = null;
        _this.S_lab = null;
        _this.lock_A = null;
        _this.lock_S = null;
        _this.select = null;
        _this.index = 0;
        _this.selectPos = [ -128, -5, 112 ];
        _this.watchvideoA = false;
        _this.watchvideoS = false;
        _this.touch = [ false, false, false ];
        return _this;
      }
      Appearance.prototype.init = function(_index) {
        this.change_data({
          index: _index,
          state: true
        });
      };
      Appearance.prototype.onEnable = function() {
        GameSys_1.default.game.xBind(Config_1.Config.APPITEM, this.change_data.bind(this), BINDER_NAME);
        this.node.scale = 0;
      };
      Appearance.prototype.change_data = function(data) {
        return __awaiter(this, void 0, void 0, function() {
          var cb;
          var _this = this;
          return __generator(this, function(_a) {
            cb = function() {
              return __awaiter(_this, void 0, void 0, function() {
                var _a, _b, _c;
                var _this = this;
                return __generator(this, function(_d) {
                  switch (_d.label) {
                   case 0:
                    this.S.color = cc.Color.WHITE;
                    this.A_lab.string = "";
                    this.S_lab.string = "";
                    this.touch = [ false, false, false ];
                    this.touch[data.index] = true;
                    this.watchvideoA = false;
                    this.watchvideoS = false;
                    this.appearance = GameSys_1.default.game.xGet(Config_1.Config.APPEARANCE)[data.index];
                    this.select.x = this.selectPos[this.appearance.index];
                    this.index = data.index;
                    if (Config_1.APPEARANCE[data.index].lock_A > GameSys_1.default.level) {
                      this.lock_A.stateChange(0);
                      this.A_lab.string = Config_1.APPEARANCE[data.index].lock_A.toString() + "\u7ea7\u89e3\u9501";
                    } else {
                      this.lock_A.stateChange(1);
                      if (this.appearance.geta) this.lock_A.node.children[this.lock_A.nowState].children[0].active = false; else {
                        this.touch[data.index] = false;
                        this.A_lab.string = "-" + Config_1.APPEARANCE[data.index].gold_A.toString();
                        GameSys_1.default.judgeGold(Config_1.APPEARANCE[data.index].gold_A, function() {
                          _this.watchvideoA = true;
                          _this.lock_A.node.children[_this.lock_A.nowState].children[0].active = true;
                        }, function() {
                          _this.watchvideoA = false;
                          _this.lock_A.node.children[_this.lock_A.nowState].children[0].active = false;
                        });
                      }
                    }
                    if (Config_1.APPEARANCE[data.index].lock_S > GameSys_1.default.level) {
                      this.lock_S.stateChange(0);
                      this.lockS.active = true;
                      this.S_lab.string = Config_1.APPEARANCE[data.index].lock_S.toString() + "\u7ea7\u89e3\u9501";
                      this.S.color = cc.Color.GRAY;
                    } else {
                      this.lock_S.stateChange(1);
                      this.lockS.active = false;
                      if (this.appearance.gets) this.lock_S.node.children[this.lock_S.nowState].children[0].active = false; else {
                        this.touch[data.index] = false;
                        this.S_lab.string = "-" + Config_1.APPEARANCE[data.index].gold_S.toString();
                        GameSys_1.default.judgeGold(Config_1.APPEARANCE[data.index].gold_S, function() {
                          _this.watchvideoS = true;
                          _this.lock_S.node.children[_this.lock_S.nowState].children[0].active = true;
                        }, function() {
                          _this.watchvideoS = false;
                          _this.lock_S.node.children[_this.lock_S.nowState].children[0].active = false;
                        });
                      }
                    }
                    _a = this.B_spr;
                    return [ 4, UtilsManager_1.default.loadImage("appearanceB/B" + data.index) ];

                   case 1:
                    _a.spriteFrame = _d.sent();
                    _b = this.A_spr;
                    return [ 4, UtilsManager_1.default.loadImage("appearanceA/A" + data.index) ];

                   case 2:
                    _b.spriteFrame = _d.sent();
                    _c = this.S_spr;
                    return [ 4, UtilsManager_1.default.loadImage("appearanceS/S" + data.index) ];

                   case 3:
                    _c.spriteFrame = _d.sent();
                    return [ 2 ];
                  }
                });
              });
            };
            data.state && cc.tween(this.node).to(.1, {
              scale: 0
            }).call(function() {
              cb && cb();
            }).to(.1, {
              scale: 1
            }).start();
            return [ 2 ];
          });
        });
      };
      Appearance.prototype.onTouchB = function() {
        this.appearance = GameSys_1.default.game.xGet(Config_1.Config.APPEARANCE)[this.index];
        if (this.touch[0]) return;
        this.touch[0] = true;
        this.touch[1] = false;
        this.touch[2] = false;
        GameSys_1.default.game.xSet(Config_1.Config.APPEARANCECHANGE, {
          index: this.index,
          state: 0,
          geta: this.appearance.geta,
          gets: this.appearance.gets
        });
        this.anim(0);
      };
      Appearance.prototype.anim = function(index) {
        cc.tween(this.select).to(0, {
          x: this.selectPos[index]
        }).start();
      };
      Appearance.prototype.onTouchA = function() {
        var _this = this;
        this.appearance = GameSys_1.default.game.xGet(Config_1.Config.APPEARANCE)[this.index];
        Caches_1.default.get(Caches_1.default.newGuide) || 12 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 13);
        if (this.touch[1]) return;
        var cb = function() {
          _this.touch[1] = true;
          _this.touch[0] = false;
          _this.touch[2] = false;
          _this.anim(1);
          GameSys_1.default.game.xSet(Config_1.Config.APPEARANCECHANGE, {
            index: _this.index,
            state: 1,
            geta: true,
            gets: _this.appearance.gets
          });
          _this.A_lab.string = "";
          GameSys_1.default.audio.playSFX("audios/shengji_2");
          _this.lock_A.node.children[_this.lock_A.nowState].children[0].active = false;
          GameSys_1.default.game.xSet(Config_1.Config.ALLRED);
        };
        if (this.appearance.geta) {
          GameSys_1.default.audio.playSFX("audios/shengji_2");
          GameSys_1.default.game.xSet(Config_1.Config.APPEARANCECHANGE, {
            index: this.index,
            state: 1,
            geta: this.appearance.geta,
            gets: this.appearance.gets
          });
          this.anim(1);
          this.touch[1] = true;
          this.touch[0] = false;
          this.touch[2] = false;
        } else this.watchvideoA ? GameSys_1.default.watchVideo(2, cb) : GameSys_1.default.useGold(-Config_1.APPEARANCE[this.index].gold_A, function() {
          _this.goldAnim(_this.goldA, Config_1.APPEARANCE[_this.index].gold_A);
          cb();
        });
      };
      Appearance.prototype.goldAnim = function(node, price) {
        var goldAnim = cc.instantiate(this.reduce);
        node.addChild(goldAnim);
        goldAnim.y = -40;
        goldAnim.x = 0;
        goldAnim.children[0].getComponent(cc.Label).string = "-" + price.toFixed(0);
        goldAnim.children[0].color = cc.Color.BLACK;
        cc.tween(goldAnim).to(1, {
          y: goldAnim.y - 20,
          opacity: 100
        }).call(function() {
          goldAnim.destroy();
        }).start();
      };
      Appearance.prototype.onTouchS = function() {
        var _this = this;
        this.appearance = GameSys_1.default.game.xGet(Config_1.Config.APPEARANCE)[this.index];
        if (this.touch[2]) return;
        var cb = function() {
          _this.touch[2] = true;
          _this.touch[1] = false;
          _this.touch[0] = false;
          _this.anim(2);
          GameSys_1.default.game.xSet(Config_1.Config.APPEARANCECHANGE, {
            index: _this.index,
            state: 2,
            geta: _this.appearance.geta,
            gets: true
          });
          _this.S_lab.string = "";
          GameSys_1.default.audio.playSFX("audios/shengji_2");
          _this.lock_S.node.children[_this.lock_A.nowState].children[0].active = false;
          GameSys_1.default.game.xSet(Config_1.Config.ALLRED);
        };
        if (this.appearance.gets) {
          GameSys_1.default.audio.playSFX("audios/shengji_2");
          this.anim(2);
          GameSys_1.default.game.xSet(Config_1.Config.APPEARANCECHANGE, {
            index: this.index,
            state: 2,
            geta: this.appearance.geta,
            gets: this.appearance.gets
          });
          this.touch[2] = true;
          this.touch[1] = false;
          this.touch[0] = false;
        } else this.watchvideoS ? GameSys_1.default.watchVideo(3, cb) : GameSys_1.default.useGold(-Config_1.APPEARANCE[this.index].gold_S, function() {
          _this.goldAnim(_this.goldS, Config_1.APPEARANCE[_this.index].gold_S);
          cb();
        });
      };
      Appearance.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Node) ], Appearance.prototype, "S", void 0);
      __decorate([ property(cc.Node) ], Appearance.prototype, "lockS", void 0);
      __decorate([ property(cc.Node) ], Appearance.prototype, "goldA", void 0);
      __decorate([ property(cc.Node) ], Appearance.prototype, "goldS", void 0);
      __decorate([ property(cc.Prefab) ], Appearance.prototype, "reduce", void 0);
      __decorate([ property(cc.Sprite) ], Appearance.prototype, "A_spr", void 0);
      __decorate([ property(cc.Sprite) ], Appearance.prototype, "B_spr", void 0);
      __decorate([ property(cc.Sprite) ], Appearance.prototype, "S_spr", void 0);
      __decorate([ property(cc.Label) ], Appearance.prototype, "A_lab", void 0);
      __decorate([ property(cc.Label) ], Appearance.prototype, "S_lab", void 0);
      __decorate([ property(StateManager_1.default) ], Appearance.prototype, "lock_A", void 0);
      __decorate([ property(StateManager_1.default) ], Appearance.prototype, "lock_S", void 0);
      __decorate([ property(cc.Node) ], Appearance.prototype, "select", void 0);
      Appearance = __decorate([ ccclass ], Appearance);
      return Appearance;
    }(cc.Component);
    exports.default = Appearance;
    cc._RF.pop();
  }, {
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/StateManager": "StateManager",
    "../common/manager/UtilsManager": "UtilsManager"
  } ],
  Audio: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cad30hflC9HJIU/u6hz6nKn", "Audio");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Props_1 = require("../kernels/Props");
    var Caches_1 = require("../manager/Caches");
    var Log_1 = require("../manager/Log");
    var UtilsManager_1 = require("../manager/UtilsManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Audio = function(_super) {
      __extends(Audio, _super);
      function Audio() {
        var _this = _super.call(this) || this;
        _this.bgmHandle = -1;
        _this.xSet("bgmVolume", Caches_1.default.getFloat(Caches_1.default.bgmVolume, 1));
        _this.xSet("sfxVolume", Caches_1.default.getFloat(Caches_1.default.sfxVolume, 1));
        Log_1.default.info("\u521d\u59cb\u5316\u58f0\u97f3\u7ba1\u7406\u6210\u529f!");
        return _this;
      }
      Audio.prototype.playBGM = function(clip, scale) {
        var _this = this;
        void 0 === scale && (scale = 1);
        if (!clip || 0 == clip.length) return;
        this.stopBGM();
        var vol = this.xGet("bgmVolume");
        vol *= scale;
        if ("string" != typeof clip) {
          this.bgmHandle = cc.audioEngine.play(clip, true, vol);
          return;
        }
        vol > .001 && cc.loader.loadRes(clip, cc.AudioClip, function(err, asset) {
          _this.bgmHandle = cc.audioEngine.play(asset, true, vol);
        });
      };
      Audio.prototype.stopBGM = function() {
        console.log(this.bgmHandle);
        if (-1 != this.bgmHandle) {
          cc.audioEngine.stop(this.bgmHandle);
          this.bgmHandle = -1;
        }
      };
      Audio.prototype.recoverBGM = function() {
        this.setBGMVolume(1);
      };
      Audio.prototype.slientBgm = function() {
        this.stopBGM();
        this.setBGMVolume(0);
      };
      Audio.prototype.playSFX = function(path, loop) {
        void 0 === loop && (loop = false);
        return __awaiter(this, void 0, void 0, function() {
          var vol_1, vol, clip;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (!path || 0 == path.length) return [ 2 ];
              if ("string" != typeof path) {
                vol_1 = this.xGet("sfxVolume");
                cc.audioEngine.play(path, false, vol_1);
                return [ 2 ];
              }
              vol = this.xGet("sfxVolume");
              if (!(vol > .001)) return [ 3, 2 ];
              return [ 4, UtilsManager_1.default.loadAudioClip(path) ];

             case 1:
              clip = _a.sent();
              cc.audioEngine.play(clip, false, vol);
              _a.label = 2;

             case 2:
              return [ 2 ];
            }
          });
        });
      };
      Audio.prototype.slientSFX = function() {
        this.setSFXVolume(0);
      };
      Audio.prototype.recoverSFX = function() {
        this.setSFXVolume(1);
      };
      Audio.prototype.setBGMVolume = function(v) {
        Caches_1.default.set(Caches_1.default.bgmVolume, v);
        this.xSet("bgmVolume", v);
        -1 != this.bgmHandle && cc.audioEngine.setVolume(this.bgmHandle, v);
      };
      Audio.prototype.setSFXVolume = function(v) {
        Caches_1.default.set(Caches_1.default.sfxVolume, v);
        this.xSet("sfxVolume", v);
        -1 != this.bgmHandle && cc.audioEngine.setEffectsVolume(v);
      };
      Audio.prototype.pauseAll = function() {
        Log_1.default.info("\u58f0\u97f3\u6682\u505c");
        cc.audioEngine.pauseAll();
      };
      Audio.prototype.resumeAll = function() {
        Log_1.default.info("\u58f0\u97f3\u6062\u590d");
        cc.audioEngine.resumeAll();
      };
      Audio.prototype.stopAll = function() {
        Log_1.default.info("\u58f0\u97f3\u5173\u95ed");
        cc.audioEngine.stopAll();
      };
      Audio.prototype.stopAllEffects = function() {
        Log_1.default.info("\u97f3\u6548\u5173\u95ed");
        cc.audioEngine.stopAllEffects();
      };
      Audio = __decorate([ ccclass ], Audio);
      return Audio;
    }(Props_1.default);
    exports.default = Audio;
    cc._RF.pop();
  }, {
    "../kernels/Props": "Props",
    "../manager/Caches": "Caches",
    "../manager/Log": "Log",
    "../manager/UtilsManager": "UtilsManager"
  } ],
  BDApi: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "07dc9k7sNhKtKiFXrqSIhRq", "BDApi");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSys_1 = require("../manager/GameSys");
    var Log_1 = require("../manager/Log");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "sdk_bdapi";
    var BDApi = function() {
      function BDApi() {
        this.rewardedVideoAd = null;
        this.videoNum = 0;
        this.isShowBanner = false;
        this.oldBannerAd = {};
        this.bannerPar = [ "7363205" ];
        this.bannerIndex = 0;
        this.index = 0;
        this.appSid = "aa1a16a9";
        this.videoTime = 0;
        this.videoAds = [ "7363206" ];
        this.isVoice = false;
        this.onLoad();
        GameSys_1.default.sdk.Instance = this;
        Log_1.default.info("\u767e\u5ea6\u73af\u5883----------");
        this.instantiationRewardAd();
        GameSys_1.default.sdk.xBind("createBanner", this.createBanner.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("destroyBanner", this.destroySelf.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("hideBanner", this.hideBanner.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("favoriteGuide", this.favoriteGuide.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("getAntiAddiction", this.getAntiAddiction.bind(this), BINDER_NAME);
      }
      BDApi_1 = BDApi;
      BDApi.prototype.onLoad = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, this.showShareMenu() ];

             case 1:
              _a.sent();
              return [ 2 ];
            }
          });
        });
      };
      BDApi.prototype.instantiationRewardAd = function() {
        console.log("\u89c6\u9891\u5b9e\u4f8b\u5316", this.videoNum % this.videoAds.length);
        this.rewardedVideoAd = swan.createRewardedVideoAd({
          adUnitId: this.videoAds[this.videoNum % this.videoAds.length],
          appSid: this.appSid
        });
      };
      BDApi.prototype.getAntiAddiction = function() {
        console.log("\u9632\u6c89\u8ff7", swan.getSystemInfoSync().platform);
        if ("ios" == swan.getSystemInfoSync().platform) return;
        var api = swan.getAntiAddiction();
        api.onAntiAddiction(function(_a) {
          var state = _a.state, msg = _a.msg;
          console.log("\u9632\u6c89\u8ff7\u503c: ", state);
          console.log("\u9632\u6c89\u8ff7\u63cf\u8ff0: ", msg);
          if (10001 == state) {
            console.log("\u975e\u6cd5\u5b9a\u8282\u5047\u65e5\u6e38\u620f\u65f6\u95f4\u9650\u52361.5\u5c0f\u65f6");
            GameSys_1.default.game.xSet("tip", "\u8bf7\u9002\u5ea6\u6e38\u620f\uff0c\u5929\u5929\u5411\u4e0a");
          }
          if (10002 == state) {
            console.log("\u6cd5\u5b9a\u8282\u5047\u65e5\u6e38\u620f\u65f6\u95f4\u9650\u52363\u5c0f\u65f6");
            GameSys_1.default.game.xSet("tip", "\u8bf7\u9002\u5ea6\u6e38\u620f\uff0c\u5929\u5929\u5411\u4e0a");
          }
          if (10003 == state) {
            console.log("\u591c\u6df1\u4e86\uff0c\u5b69\u5b50\u8be5\u7761\u4e86");
            GameSys_1.default.game.xSet("tip", "\u8bf7\u9002\u5ea6\u6e38\u620f\uff0c\u5929\u5929\u5411\u4e0a");
          }
        });
      };
      BDApi.prototype.createBanner = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _adUnitId, screenWidth, screenHeight, bannerAd_1;
          var _this = this;
          return __generator(this, function(_a) {
            this.bannerIndex++;
            this.bannerIndex % 3 == 0 && this.index++;
            _adUnitId = this.bannerPar[this.index % this.bannerPar.length];
            screenWidth = swan.getSystemInfoSync().screenWidth;
            screenHeight = swan.getSystemInfoSync().screenHeight;
            Log_1.default.info("\u521b\u5efabanner");
            if (this.oldBannerAd.adUnitId && this.oldBannerAd.adUnitId == _adUnitId) this.isShowBanner ? this.hideBanner() : this.showBanner(); else {
              bannerAd_1 = swan.createBannerAd({
                adUnitId: _adUnitId,
                appSid: this.appSid,
                style: {
                  left: (screenWidth - 320) / 2,
                  top: screenHeight - 100,
                  width: 320
                }
              });
              this.oldBannerAd = bannerAd_1;
              bannerAd_1.onResize(function(size) {
                console.log("size:", size);
                bannerAd_1.style.top = window.innerHeight - size.height;
                bannerAd_1.style.left = (screenWidth - size.width) / 2;
              });
              bannerAd_1.onLoad(function() {
                _this.oldBannerAd && _this.oldBannerAd.hide();
                _this.isShowBanner ? _this.hideBanner() : _this.showBanner();
              });
              bannerAd_1.onError(function(err) {
                Log_1.default.warn("swan banner\u51fa\u9519", JSON.stringify(err));
              });
            }
            return [ 2 ];
          });
        });
      };
      BDApi.prototype.showBanner = function() {
        Log_1.default.info("\u8fdb\u5165\u663e\u793abanner");
        this.isShowBanner = true;
        var bannerAd = this.oldBannerAd;
        bannerAd && bannerAd.show();
      };
      BDApi.prototype.hideBanner = function() {
        Log_1.default.info("\u8fdb\u5165\u9690\u85cfbanner");
        this.isShowBanner = false;
        var bannerAd = this.oldBannerAd;
        bannerAd && bannerAd.hide();
      };
      BDApi.prototype.destroySelf = function() {
        var bannerAd = this.oldBannerAd;
        if (bannerAd) {
          bannerAd.destroy();
          this.oldBannerAd = {};
        }
        this.isShowBanner = false;
      };
      BDApi.prototype.createRewardedVideoAd = function(_callback) {
        var _this = this;
        GameSys_1.default.audio.pauseAll();
        this.videoTime++;
        if (this.videoTime >= 3) {
          this.videoTime = 0;
          this.videoNum++;
          this.instantiationRewardAd();
        }
        var onClose = function(res) {
          GameSys_1.default.audio.resumeAll();
          res.isEnded ? _callback(true) : _callback(false);
          _this.rewardedVideoAd.offClose(onClose);
          _this.rewardedVideoAd.offError(onError);
        };
        var onError = function(res) {
          console.log("rewardad" + res.errCode + " : " + res.errMsg);
          GameSys_1.default.game.xSet("tip", "\u5e7f\u544a\u6b63\u5728\u51c6\u5907\u4e2d\uff0c\u8bf7\u91cd\u542f\u6216\u7a0d\u540e\u518d\u8bd5");
          _this.rewardedVideoAd.offError(onError);
        };
        this.rewardedVideoAd.load().then(function() {
          return _this.rewardedVideoAd.show();
        }).catch(function(err) {
          return console.log(err.errMsg);
        });
        this.rewardedVideoAd.onClose(onClose);
        this.rewardedVideoAd.onError(onError);
      };
      BDApi.prototype.shareAppMessage = function(_callback) {
        return new Promise(function(resolve) {
          BDApi_1.clickTime = new Date().getTime();
          swan.offHide();
          swan.onHide(function() {
            swan.offShow();
            swan.onShow(function() {
              GameSys_1.default.audio.playBGM("audios/bgm");
              var space = Math.ceil((new Date().getTime() - BDApi_1.clickTime) / 1e3);
              console.log("\u8fd4\u56de\u4e86\u524d\u53f0 \u4e2d\u95f4\u95f4\u9694\uff1a", space);
              _callback(space >= 5);
            });
          });
          swan.shareAppMessage({
            desc: GameSys_1.default.shareDesc,
            title: GameSys_1.default.shareTitle,
            imageUrl: GameSys_1.default.imageUrl
          });
        });
      };
      BDApi.prototype.favoriteGuide = function() {
        Log_1.default.info("\u6dfb\u52a0\u5c0f\u7a0b\u5e8f\u5f15\u5bfc");
        swan.showFavoriteGuide({
          type: "bar",
          content: "\u4e00\u952e\u6dfb\u52a0\u5230\u6211\u7684\u5c0f\u7a0b\u5e8f",
          success: function(res) {
            console.log("\u6dfb\u52a0\u6210\u529f\uff1a", res);
          },
          fail: function(err) {
            console.log("\u6dfb\u52a0\u5931\u8d25\uff1a", err);
          }
        });
        swan.showFavoriteGuide({
          type: "tip",
          content: "\u4e00\u952e\u6dfb\u52a0\u5230\u6211\u7684\u5c0f\u7a0b\u5e8f",
          success: function(res) {
            console.log("\u6dfb\u52a0\u6210\u529f\uff1a", res);
          },
          fail: function(err) {
            console.log("\u6dfb\u52a0\u5931\u8d25\uff1a", err);
          }
        });
      };
      BDApi.prototype.showShareMenu = function(withShareTicket) {
        void 0 === withShareTicket && (withShareTicket = true);
        return new Promise(function(resolve) {
          var obj = {};
          obj.withShareTicket = withShareTicket;
          obj.success = function(res) {};
          obj.fail = function(res) {};
          obj.complete = function(res) {};
          swan.showShareMenu(obj);
          swan.onShareAppMessage(function() {
            return {
              title: GameSys_1.default.shareTitle,
              imageUrl: GameSys_1.default.imageUrl
            };
          });
        });
      };
      var BDApi_1;
      BDApi.clickTime = 0;
      BDApi = BDApi_1 = __decorate([ ccclass ], BDApi);
      return BDApi;
    }();
    exports.default = BDApi;
    cc._RF.pop();
  }, {
    "../manager/GameSys": "GameSys",
    "../manager/Log": "Log"
  } ],
  BlockPre: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e1881fmqaFD86FHxFBF/KFw", "BlockPre");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var DataManager_1 = require("../common/manager/DataManager");
    var GameSys_1 = require("../common/manager/GameSys");
    var UtilsManager_1 = require("../common/manager/UtilsManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Block = function(_super) {
      __extends(Block, _super);
      function Block() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.index = 0;
        _this.flag = false;
        _this.over = false;
        _this.count = 0;
        return _this;
      }
      Block.prototype.onEnable = function() {
        return __awaiter(this, void 0, void 0, function() {
          var spr, spriteFrame;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
              this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
              this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
              this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this));
              this.canvas = cc.find("Canvas");
              this.initPar = this.node.parent;
              this.flag = false;
              this.over = false;
              this.count = 0;
              spr = "";
              0 == this.index ? spr = DataManager_1.default.getInstance().cleanGarbageInfo.item_model1 : 1 == this.index ? spr = DataManager_1.default.getInstance().cleanGarbageInfo.item_model2 : 2 == this.index && (spr = DataManager_1.default.getInstance().cleanGarbageInfo.item_model3);
              return [ 4, UtilsManager_1.default.loadImage("warehouseItem/" + spr) ];

             case 1:
              spriteFrame = _a.sent();
              this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
              this.node.setContentSize(spriteFrame.getOriginalSize());
              2 == this.index && (DataManager_1.default.getInstance().garbageItem = this.node);
              return [ 2 ];
            }
          });
        });
      };
      Block.prototype.onTouchStart = function() {
        if (DataManager_1.default.getInstance().garbageFlag != this.index) return;
        if (this.over) return;
        this.initPos = this.node.position;
        var pos = this.canvas.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
        this.node.parent = this.canvas;
        this.node.setPosition(pos);
        this.node.zIndex = 15;
        this.count = 0;
        0 == this.index && (Caches_1.default.get(Caches_1.default.newGuide) || 21 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 22));
        1 == this.index && (Caches_1.default.get(Caches_1.default.newGuide) || 23 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 24));
        2 == this.index && (Caches_1.default.get(Caches_1.default.newGuide) || 25 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 26));
      };
      Block.prototype.onTouchMove = function(event) {
        if (DataManager_1.default.getInstance().garbageFlag != this.index) return;
        if (this.over) return;
        var pos = event.getLocation();
        this.node.x += event.getDeltaX();
        this.node.y += event.getDeltaY();
        if (DataManager_1.default.getInstance().checkOnTarget(pos)) {
          if (this.flag) return;
          this.count++;
          if (this.count > 20) {
            2 == this.index ? 3 == GameSys_1.default.game.xGet(Config_1.Config.GARBAGEOPACITY) && (this.flag = true) : this.flag = true;
            GameSys_1.default.game.xSet(Config_1.Config.GARBAGEOPACITY, this.index);
          }
        }
      };
      Block.prototype.onTouchEnd = function() {
        if (DataManager_1.default.getInstance().garbageFlag != this.index) return;
        if (this.over) return;
        var pos = this.initPar.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
        this.node.parent = this.initPar;
        this.node.setPosition(pos);
        cc.tween(this.node).to(.3, {
          position: this.initPos
        }).start();
        if (this.flag) {
          this.over = true;
          DataManager_1.default.getInstance().garbageFlag = this.index + 1;
          0 == this.index && (Caches_1.default.get(Caches_1.default.newGuide) || 22 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 23));
          1 == this.index && (Caches_1.default.get(Caches_1.default.newGuide) || 24 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 25));
          2 == this.index && 3 == GameSys_1.default.game.xGet(Config_1.Config.GARBAGEOPACITY);
        }
      };
      Block.prototype.onDisable = function() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this));
      };
      __decorate([ property ], Block.prototype, "index", void 0);
      Block = __decorate([ ccclass ], Block);
      return Block;
    }(cc.Component);
    exports.default = Block;
    cc._RF.pop();
  }, {
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/DataManager": "DataManager",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/UtilsManager": "UtilsManager"
  } ],
  Block: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2d8edLK4EpDCKllYhcc6hya", "Block");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var DataManager_1 = require("../common/manager/DataManager");
    var GameSys_1 = require("../common/manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Block";
    var Block = function(_super) {
      __extends(Block, _super);
      function Block() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.lab = null;
        _this.select = null;
        _this.item = [];
        return _this;
      }
      Block.prototype.onEnable = function() {
        this.node.zIndex = 10;
        for (var i = 0; i < this.item.length; i++) this.item[i].color = cc.Color.WHITE;
        this.select.position = this.item[0].position;
        GameSys_1.default.game.xBind(Config_1.Config.GARBAGEOPACITY, this.change_select.bind(this), BINDER_NAME);
        DataManager_1.default.getInstance().cleanGarbageInfo && (this.lab.string = DataManager_1.default.getInstance().cleanGarbageInfo.item_tips1);
      };
      Block.prototype.change_select = function(index) {
        var _this = this;
        if (-1 == index) return;
        if (3 == index) {
          this.select.active = false;
          this.lab.string = "\u6e05\u6d01\u5b8c\u6210";
          console.log("\u5b8c\u6210");
          return;
        }
        if (2 == index) return;
        this.item[index].color = cc.Color.GRAY;
        index += 1;
        cc.tween(this.select).to(.1, {
          position: this.item[index].position
        }).call(function() {
          index - 1 == 0 && (_this.lab.string = DataManager_1.default.getInstance().cleanGarbageInfo.item_tips2);
          index - 1 == 1 && (_this.lab.string = DataManager_1.default.getInstance().cleanGarbageInfo.item_tips3);
        }).start();
      };
      Block.prototype.onDisable = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Label) ], Block.prototype, "lab", void 0);
      __decorate([ property(cc.Node) ], Block.prototype, "select", void 0);
      __decorate([ property(cc.Node) ], Block.prototype, "item", void 0);
      Block = __decorate([ ccclass ], Block);
      return Block;
    }(cc.Component);
    exports.default = Block;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/DataManager": "DataManager",
    "../common/manager/GameSys": "GameSys"
  } ],
  Buildings_app: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d50bdT242tNkIwVywuVgxBn", "Buildings_app");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var Magnify_1 = require("../labInfo/Magnify");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Buildings_app";
    var Buildings_app = function(_super) {
      __extends(Buildings_app, _super);
      function Buildings_app() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.index = 0;
        _this.label = new cc.Node();
        _this.open = false;
        return _this;
      }
      Buildings_app.prototype.onLoad = function() {
        this.index = parseInt(this.node.name);
        GameSys_1.default.game.xBind(Config_1.Config.BUILDINGSAPP, this.change_app.bind(this), BINDER_NAME);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch.bind(this));
        this.node.addChild(this.label);
        this.label.addComponent(cc.Label);
        this.label.getComponent(cc.Label).fontSize = 30;
        this.label.getComponent(cc.Label).lineHeight = 30;
        this.label.getComponent(cc.Label).string = Config_1.APPEARANCE[this.index].name;
        this.label.active = false;
        this.label.x = 0;
        this.label.y = -10;
      };
      Buildings_app.prototype.change_app = function(data) {
        if (data.index == this.node.parent.parent.getComponent(Magnify_1.default).index) {
          this.node.getComponent(cc.Sprite).enabled = data.state;
          this.open = true;
          this.label.active = data.state;
        } else if (this.open) {
          this.node.getComponent(cc.Sprite).enabled = false;
          this.label.active = false;
          this.open = false;
        }
      };
      Buildings_app.prototype.onTouch = function() {
        if (!this.node.getComponent(cc.Sprite).enabled) return;
        Caches_1.default.get(Caches_1.default.newGuide) || 11 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 12);
        GameSys_1.default.game.xSet(Config_1.Config.APPITEM, {
          index: this.index,
          state: true
        });
      };
      Buildings_app.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      Buildings_app = __decorate([ ccclass ], Buildings_app);
      return Buildings_app;
    }(cc.Component);
    exports.default = Buildings_app;
    cc._RF.pop();
  }, {
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../labInfo/Magnify": "Magnify"
  } ],
  Buildings_facade: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cb9dd3WDFpBDqOROZ32osuT", "Buildings_facade");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Buildings_facade";
    var Buildings_Facade = function(_super) {
      __extends(Buildings_Facade, _super);
      function Buildings_Facade() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.select = null;
        _this.index = 0;
        _this.posIndex = 0;
        return _this;
      }
      Buildings_Facade.prototype.onLoad = function() {
        GameSys_1.default.game.xBind(Config_1.Config.APPSELECT, this.change_select.bind(this), BINDER_NAME);
        GameSys_1.default.game.xSet(Config_1.Config.APPSELECT, 0);
        if ("toilet_3" == this.node.name) if (GameSys_1.default.level < Config_1.LOCK_ROOM[3]) {
          this.node.active = false;
          var unlock = this.node.getChildByName("unlock");
          unlock.active = true;
        } else this.node.active = true;
      };
      Buildings_Facade.prototype.change_select = function(index) {
        this.index == index ? this.select.active = true : this.select.active = false;
      };
      Buildings_Facade.prototype.onTouchDetails = function() {
        Caches_1.default.get(Caches_1.default.newGuide) || 10 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 11);
        GameSys_1.default.audio.playSFX("audios/button");
        GameSys_1.default.game.xSet(Config_1.Config.APPSELECT, this.index);
        GameSys_1.default.game.xSet(Config_1.Config.MAGNIFY, {
          index: this.index,
          state: true
        });
      };
      Buildings_Facade.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Node) ], Buildings_Facade.prototype, "select", void 0);
      __decorate([ property() ], Buildings_Facade.prototype, "index", void 0);
      __decorate([ property() ], Buildings_Facade.prototype, "posIndex", void 0);
      Buildings_Facade = __decorate([ ccclass ], Buildings_Facade);
      return Buildings_Facade;
    }(cc.Component);
    exports.default = Buildings_Facade;
    cc._RF.pop();
  }, {
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys"
  } ],
  Buildings_updrage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f44223m8xhBO67GLpgIAB1+", "Buildings_updrage");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Buils_Updrage";
    var Buils_Updrage = function(_super) {
      __extends(Buils_Updrage, _super);
      function Buils_Updrage() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.lock_lab = null;
        _this.index = 0;
        _this.clickFlag = true;
        _this.lock = -1;
        return _this;
      }
      Buils_Updrage.prototype.onEnable = function() {
        this.index = parseInt(this.node.name);
        GameSys_1.default.game.xBind(Config_1.Config.BUILDINGSUP, this.change_updrage.bind(this), BINDER_NAME);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch.bind(this));
      };
      Buils_Updrage.prototype.change_updrage = function(v) {
        this.lock_lab.node.active = v;
        this.node.active = v;
        this.node.getComponent(cc.Sprite).enabled = false;
        this.lock = -1;
        this.lock_lab.string = "";
        this.buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
        this.clickFlag = true;
        if (0 == this.buildings[this.index].level) {
          for (var i = 0; i < Config_1.BUILDINGS.length; i++) if (this.index == Config_1.BUILDINGS[i].index && 1 == Config_1.BUILDINGS[i].level) {
            if (GameSys_1.default.level >= Config_1.BUILDINGS[i].lock) {
              this.node.getComponent(cc.Sprite).enabled = true;
              this.clickFlag = false;
              this.lock = 0;
            } else {
              this.lock_lab.string = "\u89e3\u9501LV:" + Config_1.BUILDINGS[i].lock;
              this.lock_lab.node.color = cc.Color.BLACK;
            }
            break;
          }
        } else if (3 !== this.buildings[this.index].level) {
          for (var i = 0; i < Config_1.BUILDINGS.length; i++) if (this.index == Config_1.BUILDINGS[i].index && Config_1.BUILDINGS[i].level == this.buildings[this.index].level) {
            if (GameSys_1.default.level >= Config_1.BUILDINGS[i].lock) {
              this.node.getComponent(cc.Sprite).enabled = true;
              this.clickFlag = false;
              this.lock = 1;
            } else {
              this.lock_lab.string = "\u89e3\u9501LV:" + Config_1.BUILDINGS[i].lock;
              this.lock_lab.node.color = cc.Color.BLACK;
            }
            break;
          }
        } else this.node.getComponent(cc.Sprite).enabled = true;
        9 != this.index && 10 != this.index && 11 != this.index || GameSys_1.default.level < Config_1.LOCK_ROOM[3] && (this.lock_lab.node.active = false);
      };
      Buils_Updrage.prototype.onTouch = function() {
        if (this.clickFlag) return;
        GameSys_1.default.audio.playSFX("audios/close");
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSDETAILS, {
          index: this.index,
          state: this.lock
        });
      };
      Buils_Updrage.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Label) ], Buils_Updrage.prototype, "lock_lab", void 0);
      Buils_Updrage = __decorate([ ccclass ], Buils_Updrage);
      return Buils_Updrage;
    }(cc.Component);
    exports.default = Buils_Updrage;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys"
  } ],
  Buildings: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e6e2aDDWZNB27jnrpfke4uE", "Buildings");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupBase_1 = require("../common/component/popups/PopupBase");
    var Config_1 = require("../common/manager/Config");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Buildings = function(_super) {
      __extends(Buildings, _super);
      function Buildings() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.item = null;
        _this.content = null;
        return _this;
      }
      Buildings.prototype.onLoad = function() {
        for (var i = 0; i <= Config_1.BUILDINGS[Config_1.BUILDINGS.length - 1].index; i++) {
          var item = cc.instantiate(this.item);
          item.parent = this.content;
        }
      };
      Buildings.prototype.onTouchClose = function() {
        this.hide();
      };
      __decorate([ property(cc.Prefab) ], Buildings.prototype, "item", void 0);
      __decorate([ property(cc.Node) ], Buildings.prototype, "content", void 0);
      Buildings = __decorate([ ccclass ], Buildings);
      return Buildings;
    }(PopupBase_1.default);
    exports.default = Buildings;
    cc._RF.pop();
  }, {
    "../common/component/popups/PopupBase": "PopupBase",
    "../common/manager/Config": "Config"
  } ],
  Builds_item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4a86d2J+KxE7qyG5GTYSyNA", "Builds_item");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var StateManager_1 = require("../common/manager/StateManager");
    var StaticManager_1 = require("../common/manager/StaticManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Buils_item";
    var Buils_item = function(_super) {
      __extends(Buils_item, _super);
      function Buils_item() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.button_state = null;
        _this.select = null;
        _this.index = 0;
        return _this;
      }
      Buils_item.prototype.onEnable = function() {
        this.index < StaticManager_1.default.getInstance().open_buildings.length ? this.button_state.stateChange(0) : this.button_state.stateChange(1);
        GameSys_1.default.game.xBind(Config_1.Config.BUILDINGSSELECT, this.change_select.bind(this), BINDER_NAME);
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSSELECT, 0);
      };
      Buils_item.prototype.change_select = function(index) {
        this.index == index ? this.select.active = true : this.select.active = false;
      };
      Buils_item.prototype.onTouchDetails = function() {
        GameSys_1.default.audio.playSFX("audios/button");
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSSELECT, this.index);
        GameSys_1.default.game.xSet(Config_1.Config.SCREENPOS, this.index);
        0 == this.index && (Caches_1.default.get(Caches_1.default.newGuide) || 1 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 2));
        1 == this.index && (Caches_1.default.get(Caches_1.default.newGuide) || 5 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 6));
      };
      Buils_item.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(StateManager_1.default) ], Buils_item.prototype, "button_state", void 0);
      __decorate([ property(cc.Node) ], Buils_item.prototype, "select", void 0);
      __decorate([ property() ], Buils_item.prototype, "index", void 0);
      Buils_item = __decorate([ ccclass ], Buils_item);
      return Buils_item;
    }(cc.Component);
    exports.default = Buils_item;
    cc._RF.pop();
  }, {
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/StateManager": "StateManager",
    "../common/manager/StaticManager": "StaticManager"
  } ],
  Builds_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71a23QlGy5MxqlYa4XUfXLh", "Builds_state");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "";
    var Builds_State = function(_super) {
      __extends(Builds_State, _super);
      function Builds_State() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.index = 0;
        return _this;
      }
      Builds_State.prototype.onEnable = function() {};
      __decorate([ property() ], Builds_State.prototype, "index", void 0);
      Builds_State = __decorate([ ccclass ], Builds_State);
      return Builds_State;
    }(cc.Component);
    exports.default = Builds_State;
    cc._RF.pop();
  }, {} ],
  Builds: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1cc91HxQpZOXbMKG6yjxRn+", "Builds");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupBase_1 = require("../common/component/popups/PopupBase");
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var StateManager_1 = require("../common/manager/StateManager");
    var Appearance_1 = require("./Appearance");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "fiveBuilds";
    var Builds = function(_super) {
      __extends(Builds, _super);
      function Builds() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.toggle = null;
        _this.checkMark_1 = null;
        _this.checkMark_2 = null;
        _this.scroll_0 = null;
        _this.scroll_1 = null;
        _this.lvl_lab = null;
        _this.max_pre_lab = null;
        _this.max_next_lab = null;
        _this.change_pre_lab = null;
        _this.change_next_lab = null;
        _this.time_pre_lab = null;
        _this.time_next_lab = null;
        _this.gold_next_lab = null;
        _this.detail = null;
        _this.button_state = null;
        _this.appearance = null;
        _this.first = false;
        _this.room = [];
        _this.index = 0;
        _this.lvl = 0;
        _this.watchvideo = false;
        _this.buildings = [];
        return _this;
      }
      Builds.prototype.onLoad = function() {
        GameSys_1.default.game.xBind(Config_1.Config.BUILDINGSDETAILS, this.change_detail.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.APPITEM, this.change_select.bind(this), BINDER_NAME);
        Caches_1.default.get(Caches_1.default.newGuide) || GameSys_1.default.game.xBind(Config_1.Config.NEWGUIDECON, this.change_data.bind(this), BINDER_NAME);
      };
      Builds.prototype.onEnable = function() {
        this.node.zIndex = 20;
        this.scroll_0.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMonitor.bind(this));
        this.scroll_1.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMonitor_1.bind(this));
        this.chagne_check();
        this.detail.scale = 0;
        console.log(GameSys_1.default.game.xGet(Config_1.Config.APPITEM).state);
        if (GameSys_1.default.game.xGet(Config_1.Config.APPITEM).state) {
          this.toggle.toggleItems[0].isChecked = false;
          this.toggle.toggleItems[1].isChecked = true;
          this.change_select({
            index: GameSys_1.default.game.xGet(Config_1.Config.APPITEM).index,
            state: GameSys_1.default.game.xGet(Config_1.Config.APPITEM).state
          });
        }
      };
      Builds.prototype.start = function() {};
      Builds.prototype.change_data = function(v) {
        if (3 == v) {
          this.detail.active = true;
          cc.tween(this.detail).to(.1, {
            scale: 1
          }).start();
          this.button_state.stateChange(0);
          this.lvl_lab.string = "LV:0\u2014\u2014LV:1";
          this.gold_next_lab.string = "0";
          this.time_next_lab.string = Config_1.BUILDINGS[0].use_time.toString();
          this.time_pre_lab.string = "0";
          this.max_next_lab.string = Config_1.BUILDINGS[0].max_dirty.toString();
          this.max_pre_lab.string = "0";
          this.change_next_lab.string = Config_1.BUILDINGS[0].change_dirty.toString();
          this.change_pre_lab.string = "0";
        }
        if (6 == v) {
          this.detail.active = true;
          cc.tween(this.detail).to(.1, {
            scale: 1
          }).start();
          this.button_state.stateChange(0);
          this.lvl_lab.string = "LV:0\u2014\u2014LV:1";
          this.gold_next_lab.string = "0";
          this.time_next_lab.string = Config_1.BUILDINGS[9].use_time.toString();
          this.time_pre_lab.string = "0";
          this.max_next_lab.string = Config_1.BUILDINGS[9].max_dirty.toString();
          this.max_pre_lab.string = "0";
          this.change_next_lab.string = Config_1.BUILDINGS[9].change_dirty.toString();
          this.change_pre_lab.string = "0";
        }
      };
      Builds.prototype.chagne_check = function() {
        if (this.checkMark_1.active) {
          GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSUP, true);
          GameSys_1.default.game.xSet(Config_1.Config.SCREENPOS, GameSys_1.default.game.xGet(Config_1.Config.SCREENPOS));
        }
        this.checkMark_2.active && GameSys_1.default.game.xSet(Config_1.Config.MAGNIFY, {
          index: GameSys_1.default.game.xGet(Config_1.Config.MAGNIFY).index,
          state: true
        });
      };
      Builds.prototype.change_select = function(data) {
        if (data.state) {
          if (!this.appearance.active) {
            this.appearance.active = true;
            this.appearance.getComponent(Appearance_1.default).init(GameSys_1.default.game.xGet(Config_1.Config.APPITEM).index);
          }
        } else this.appearance.active = false;
      };
      Builds.prototype.change_detail = function(data) {
        var _this = this;
        this.detail.active || (this.detail.active = true);
        cc.tween(this.detail).to(.1, {
          scale: 0
        }).to(.1, {
          scale: 1
        }).start();
        if (-1 != data.state) {
          this.button_state.node.active = true;
          this.button_state.stateChange(data.state);
        } else this.button_state.node.active = false;
        this.room = [];
        this.index = data.index;
        this.builings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
        var buildings = this.builings[data.index];
        this.lvl = buildings.level;
        for (var i = 0; i < Config_1.BUILDINGS.length; i++) Config_1.BUILDINGS[i].index == buildings.index && this.room.push(Config_1.BUILDINGS[i]);
        if (buildings.level < 3) if (0 == buildings.level) {
          this.lvl_lab.string = "LV:0\u2014\u2014LV:1";
          this.gold_next_lab.string = this.room[0].gold.toString();
          this.time_pre_lab.string = "0";
          this.time_next_lab.string = this.room[0].use_time.toString();
          this.max_pre_lab.string = "0";
          this.max_next_lab.string = this.room[0].max_dirty.toString();
          this.change_pre_lab.string = "0";
          this.change_next_lab.string = this.room[0].change_dirty.toString();
        } else {
          this.lvl_lab.string = "LV:" + buildings.level + "\u2014\u2014LV:" + (buildings.level + 1);
          this.gold_next_lab.string = this.room[buildings.level].gold.toString();
          this.time_pre_lab.string = this.room[buildings.level - 1].use_time.toString();
          this.time_next_lab.string = this.room[buildings.level].use_time.toString();
          this.max_pre_lab.string = this.room[buildings.level - 1].max_dirty.toString();
          this.max_next_lab.string = this.room[buildings.level].max_dirty.toString();
          this.change_pre_lab.string = this.room[buildings.level - 1].change_dirty.toString();
          this.change_next_lab.string = this.room[buildings.level].change_dirty.toString();
        } else {
          this.button_state.node.active = false;
          this.lvl_lab.string = "LV:3\u2014\u2014LV:\u221e";
          this.gold_next_lab.string = "\u221e";
          this.time_next_lab.string = "\u221e";
          this.time_pre_lab.string = this.room[this.room.length - 1].use_time.toString();
          this.max_next_lab.string = "\u221e";
          this.max_pre_lab.string = this.room[this.room.length - 1].max_dirty.toString();
          this.change_next_lab.string = "\u221e";
          this.change_pre_lab.string = this.room[this.room.length - 1].change_dirty.toString();
        }
        this.button_state.node.active && GameSys_1.default.judgeGold(this.room[buildings.level].gold, function() {
          console.log("\u91d1\u5e01\u4e0d\u8db3");
          _this.watchvideo = true;
          _this.button_state.node.children[_this.button_state.nowState].children[0].active = true;
        }, function() {
          console.log("\u91d1\u5e01\u8db3\u591f");
          _this.watchvideo = false;
          _this.button_state.node.children[_this.button_state.nowState].children[0].active = false;
        });
      };
      Builds.prototype.onTouchHide = function() {
        GameSys_1.default.game.xSet(Config_1.Config.HIDEALL, false);
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSUP, false);
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSAPP, {
          index: GameSys_1.default.game.xGet(Config_1.Config.BUILDINGSAPP).index,
          state: false
        });
        GameSys_1.default.game.xSet(Config_1.Config.MAGNIFY, {
          index: GameSys_1.default.game.xGet(Config_1.Config.MAGNIFY).index,
          state: false
        });
        Caches_1.default.get(Caches_1.default.newGuide) || 13 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 14);
        GameSys_1.default.game.xSet(Config_1.Config.HIDESHOP, true);
        this.hide();
      };
      Builds.prototype.onTouchUpdrage = function() {
        var _this = this;
        this.buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
        if (0 != this.buildings[this.room[0].index].upgrade) {
          GameSys_1.default.game.xSet(Config_1.Config.TIP, Config_1.TipLab.upgrade_buildings);
          return;
        }
        var success = function() {
          _this.detail.active = false;
          GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSCHANGE, {
            index: _this.room[0].index,
            level: _this.buildings[_this.room[0].index].level,
            dirty: _this.buildings[_this.room[0].index].dirty,
            upgrade: _this.room[_this.lvl].upgrade_time
          });
          GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSUPDATE, _this.room[0].index);
          GameSys_1.default.game.xSet(Config_1.Config.ALLRED);
        };
        this.watchvideo ? GameSys_1.default.watchVideo(1, success) : GameSys_1.default.useGold(-parseFloat(this.gold_next_lab.string), function() {
          success();
        });
      };
      Builds.prototype.onTouchClose = function() {
        this.detail.active = false;
      };
      Builds.prototype.onTouchCloseApp = function() {
        this.appearance.active = false;
      };
      Builds.prototype.onMonitor = function(event) {
        if (event.getDeltaX() > 2) for (var i = 0; i < this.scroll_0.content.childrenCount; i++) cc.tween(this.scroll_0.content.children[i]).to(.05, {
          angle: -6
        }).to(.05, {
          angle: 0
        }).start(); else if (event.getDeltaX() < -2) for (var i = 0; i < this.scroll_0.content.childrenCount; i++) cc.tween(this.scroll_0.content.children[i]).to(.05, {
          angle: 6
        }).to(.05, {
          angle: 0
        }).start();
      };
      Builds.prototype.onMonitor_1 = function(event) {
        if (event.getDeltaX() > 0) for (var i = 0; i < this.scroll_1.content.childrenCount; i++) cc.tween(this.scroll_1.content.children[i]).to(.05, {
          angle: -6
        }).to(.05, {
          angle: 0
        }).start(); else for (var i = 0; i < this.scroll_1.content.childrenCount; i++) cc.tween(this.scroll_1.content.children[i]).to(.1, {
          angle: 6
        }).to(.1, {
          angle: 0
        }).start();
      };
      Builds.prototype.onTaggle1 = function() {
        GameSys_1.default.audio.playSFX("audios/button");
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSAPP, {
          index: GameSys_1.default.game.xGet(Config_1.Config.BUILDINGSAPP).index,
          state: false
        });
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSUP, true);
        GameSys_1.default.game.xSet(Config_1.Config.MAGNIFY, {
          index: GameSys_1.default.game.xGet(Config_1.Config.MAGNIFY).index,
          state: false
        });
        this.onTouchCloseApp();
      };
      Builds.prototype.onTaggle2 = function() {
        GameSys_1.default.audio.playSFX("audios/button");
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSUP, false);
        Caches_1.default.get(Caches_1.default.newGuide) || 9 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 10);
        this.detail.active = false;
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSAPP, {
          index: GameSys_1.default.game.xGet(Config_1.Config.BUILDINGSAPP).index,
          state: true
        });
        if (!Caches_1.default.get(Caches_1.default.newGuide)) return;
        GameSys_1.default.game.xSet(Config_1.Config.MAGNIFY, {
          index: GameSys_1.default.game.xGet(Config_1.Config.MAGNIFY).index,
          state: true
        });
      };
      Builds.prototype.onDisable = function() {};
      Builds.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.ToggleContainer) ], Builds.prototype, "toggle", void 0);
      __decorate([ property(cc.Node) ], Builds.prototype, "checkMark_1", void 0);
      __decorate([ property(cc.Node) ], Builds.prototype, "checkMark_2", void 0);
      __decorate([ property(cc.ScrollView) ], Builds.prototype, "scroll_0", void 0);
      __decorate([ property(cc.ScrollView) ], Builds.prototype, "scroll_1", void 0);
      __decorate([ property(cc.Label) ], Builds.prototype, "lvl_lab", void 0);
      __decorate([ property(cc.Label) ], Builds.prototype, "max_pre_lab", void 0);
      __decorate([ property(cc.Label) ], Builds.prototype, "max_next_lab", void 0);
      __decorate([ property(cc.Label) ], Builds.prototype, "change_pre_lab", void 0);
      __decorate([ property(cc.Label) ], Builds.prototype, "change_next_lab", void 0);
      __decorate([ property(cc.Label) ], Builds.prototype, "time_pre_lab", void 0);
      __decorate([ property(cc.Label) ], Builds.prototype, "time_next_lab", void 0);
      __decorate([ property(cc.Label) ], Builds.prototype, "gold_next_lab", void 0);
      __decorate([ property(cc.Node) ], Builds.prototype, "detail", void 0);
      __decorate([ property(StateManager_1.default) ], Builds.prototype, "button_state", void 0);
      __decorate([ property(cc.Node) ], Builds.prototype, "appearance", void 0);
      Builds = __decorate([ ccclass ], Builds);
      return Builds;
    }(PopupBase_1.default);
    exports.default = Builds;
    cc._RF.pop();
  }, {
    "../common/component/popups/PopupBase": "PopupBase",
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/StateManager": "StateManager",
    "./Appearance": "Appearance"
  } ],
  Caches: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "082481QymZFvp4YWqTCDX3t", "Caches");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Log_1 = require("./Log");
    var GAME_NAME = "zhxqfive_";
    var Caches = function() {
      function Caches() {
        var now = new Date();
        Log_1.default.info("\u542f\u52a8\u65e5\u671f:%s", now.toGMTString());
        Caches.set("date_launch", now.getTime());
        null == Caches.get(Caches.bgmusic) && Caches.set(Caches.bgmusic, true);
        null == Caches.get(Caches.sounds) && Caches.set(Caches.sounds, true);
        Log_1.default.info("\u521d\u59cb\u5316\u7f13\u5b58\u7ba1\u7406\u6210\u529f!");
      }
      Caches.prototype.destroy = function() {
        var now = new Date();
        Caches.storage.setItem("date_exit", now.getTime());
        Log_1.default.info("\u5173\u95ed\u65e5\u671f:%s", now.toGMTString());
      };
      Caches.get = function(key, def) {
        void 0 === def && (def = "");
        var value = this.storage.getItem(key);
        value = null == value || "" == value ? def : JSON.parse(value);
        return value;
      };
      Caches.getInt = function(key, def) {
        void 0 === def && (def = -1);
        var value = Caches.storage.getItem(key);
        value = null != value && "" != value || 0 == parseInt(value) ? parseInt(value) : def;
        return value;
      };
      Caches.getFloat = function(key, def) {
        void 0 === def && (def = 0);
        var value = Caches.storage.getItem(key);
        if ("string" != typeof value || "" == value) return def;
        return parseFloat(value);
      };
      Caches.set = function(key, value) {
        "object" == typeof value && (value = JSON.stringify(value));
        Caches.storage.setItem(key, value);
        return true;
      };
      Caches.del = function(key) {
        Caches.storage.removeItem(key);
        Log_1.default.info("\u7f13\u5b58\u5220\u9664:%s", key);
        return true;
      };
      Caches.storage = cc.sys.localStorage;
      Caches.level = GAME_NAME + "level";
      Caches.lock = GAME_NAME + "lock";
      Caches.gold = GAME_NAME + "gold";
      Caches.recruit = GAME_NAME + "recruit";
      Caches.link = GAME_NAME + "link";
      Caches.cg = GAME_NAME + "cg";
      Caches.curDate = GAME_NAME + "curDates";
      Caches.signInState = GAME_NAME + "signInstate";
      Caches.buildings = GAME_NAME + "buildings";
      Caches.shop = GAME_NAME + "shop";
      Caches.warehouse = GAME_NAME + "warehouse";
      Caches.appearance = GAME_NAME + "appearance";
      Caches.offline = GAME_NAME + "offLine";
      Caches.goldOffline = GAME_NAME + "goldOffline";
      Caches.newGuide = GAME_NAME + "newGuide";
      Caches.notice = GAME_NAME + "notice";
      Caches.hand = GAME_NAME + "hand";
      Caches.oppoBanner = GAME_NAME + "oppoBanner";
      Caches.oppoNatived = GAME_NAME + "oppoNatived";
      Caches.bgmusic = GAME_NAME + "bgmusic";
      Caches.sounds = GAME_NAME + "sounds";
      Caches.bgmVolume = GAME_NAME + "bgmVolume";
      Caches.sfxVolume = GAME_NAME + "sfxVolume";
      return Caches;
    }();
    exports.default = Caches;
    cc._RF.pop();
  }, {
    "./Log": "Log"
  } ],
  Cashier: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6186fYpRw5P14XQY0c5oXQj", "Cashier");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Cashier";
    var Cashier = function(_super) {
      __extends(Cashier, _super);
      function Cashier() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Cashier.prototype.onLoad = function() {
        GameSys_1.default.game.xBind(Config_1.Config.HIDEALL, this.change_hide.bind(this), BINDER_NAME);
      };
      Cashier.prototype.change_hide = function(v) {
        this.node.opacity = v ? 0 : 255;
      };
      Cashier.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      Cashier = __decorate([ ccclass ], Cashier);
      return Cashier;
    }(cc.Component);
    exports.default = Cashier;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys"
  } ],
  Change_Appearance: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e3466W/CgZOaYOZGiCi7/2v", "Change_Appearance");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var UtilsManager_1 = require("../common/manager/UtilsManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Changee_Appearance";
    var Changee_Appearance = function(_super) {
      __extends(Changee_Appearance, _super);
      function Changee_Appearance() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.spr = null;
        _this.index = 0;
        _this.floorIndex = -1;
        _this.path = [ "roomB/B", "roomA/A", "roomS/S" ];
        return _this;
      }
      Changee_Appearance.prototype.onLoad = function() {
        return __awaiter(this, void 0, void 0, function() {
          var appearance, _a, _b;
          return __generator(this, function(_c) {
            switch (_c.label) {
             case 0:
              GameSys_1.default.game.xBind(Config_1.Config.APPEARANCECHANGE, this.change_spr.bind(this), BINDER_NAME);
              appearance = GameSys_1.default.game.xGet(Config_1.Config.APPEARANCE)[this.index];
              _a = this.node.getComponent(cc.Sprite);
              return [ 4, UtilsManager_1.default.loadImage(this.path[appearance.index] + this.index.toString()) ];

             case 1:
              _a.spriteFrame = _c.sent();
              if (!(1 == appearance.index || 2 == appearance.index)) return [ 3, 3 ];
              if (!this.spr.node) return [ 3, 3 ];
              _b = this.spr;
              return [ 4, UtilsManager_1.default.loadImage(this.path[appearance.index] + this.index.toString() + "_" + appearance.index.toString()) ];

             case 2:
              _b.spriteFrame = _c.sent();
              _c.label = 3;

             case 3:
              appearance = null;
              return [ 2 ];
            }
          });
        });
      };
      Changee_Appearance.prototype.change_spr = function(data) {
        return __awaiter(this, void 0, void 0, function() {
          var clone, _a, clone_1_1, _b, clone_1_2, _c;
          var _this = this;
          return __generator(this, function(_d) {
            switch (_d.label) {
             case 0:
              if (data.index !== this.index) return [ 2 ];
              clone = new cc.Node();
              clone.parent = this.node.parent;
              clone.anchorX = this.node.anchorX;
              clone.anchorY = this.node.anchorY;
              clone.x = this.node.x;
              clone.y = this.node.y + 100;
              this.spr.node && (this.spr.enabled = false);
              this.node.getComponent(cc.Sprite).enabled = false;
              this.node.stopAllActions();
              this.node.resumeAllActions();
              _a = clone.addComponent(cc.Sprite);
              return [ 4, UtilsManager_1.default.loadImage(this.path[data.state] + this.index.toString()) ];

             case 1:
              _a.spriteFrame = _d.sent();
              if (!(0 == data.state)) return [ 3, 2 ];
              this.spr.node && (this.spr.enabled = false);
              cc.tween(clone).to(.5, {
                y: this.node.y
              }).call(function() {
                return __awaiter(_this, void 0, void 0, function() {
                  var _a;
                  return __generator(this, function(_b) {
                    switch (_b.label) {
                     case 0:
                      clone.destroy();
                      this.node.getComponent(cc.Sprite).enabled = true;
                      _a = this.node.getComponent(cc.Sprite);
                      return [ 4, UtilsManager_1.default.loadImage(this.path[data.state] + this.index.toString()) ];

                     case 1:
                      _a.spriteFrame = _b.sent();
                      return [ 2 ];
                    }
                  });
                });
              }).start();
              return [ 3, 8 ];

             case 2:
              if (!(1 == data.state)) return [ 3, 5 ];
              if (!this.spr.node) return [ 3, 4 ];
              clone_1_1 = new cc.Node();
              clone_1_1.parent = this.spr.node.parent;
              clone_1_1.x = this.spr.node.x;
              clone_1_1.y = this.spr.node.y + 150;
              _b = clone_1_1.addComponent(cc.Sprite);
              return [ 4, UtilsManager_1.default.loadImage(this.path[data.state] + this.index.toString() + "_" + data.state.toString()) ];

             case 3:
              _b.spriteFrame = _d.sent();
              cc.tween(clone_1_1).to(.7, {
                y: this.spr.node.y
              }).call(function() {
                return __awaiter(_this, void 0, void 0, function() {
                  var _a;
                  return __generator(this, function(_b) {
                    switch (_b.label) {
                     case 0:
                      clone_1_1.destroy();
                      this.spr.enabled = true;
                      _a = this.spr;
                      return [ 4, UtilsManager_1.default.loadImage(this.path[data.state] + this.index.toString() + "_" + data.state.toString()) ];

                     case 1:
                      _a.spriteFrame = _b.sent();
                      return [ 2 ];
                    }
                  });
                });
              }).start();
              _d.label = 4;

             case 4:
              cc.tween(clone).to(.5, {
                y: this.node.y
              }).call(function() {
                return __awaiter(_this, void 0, void 0, function() {
                  var _a;
                  return __generator(this, function(_b) {
                    switch (_b.label) {
                     case 0:
                      clone.destroy();
                      this.node.getComponent(cc.Sprite).enabled = true;
                      _a = this.node.getComponent(cc.Sprite);
                      return [ 4, UtilsManager_1.default.loadImage(this.path[data.state] + this.index.toString()) ];

                     case 1:
                      _a.spriteFrame = _b.sent();
                      return [ 2 ];
                    }
                  });
                });
              }).start();
              return [ 3, 8 ];

             case 5:
              if (!this.spr.node) return [ 3, 7 ];
              clone_1_2 = new cc.Node();
              clone_1_2.parent = this.spr.node.parent;
              clone_1_2.x = this.spr.node.x;
              clone_1_2.y = this.spr.node.y + 150;
              _c = clone_1_2.addComponent(cc.Sprite);
              return [ 4, UtilsManager_1.default.loadImage(this.path[data.state] + this.index.toString() + "_" + data.state.toString()) ];

             case 6:
              _c.spriteFrame = _d.sent();
              cc.tween(clone_1_2).to(.7, {
                y: this.spr.node.y
              }).call(function() {
                return __awaiter(_this, void 0, void 0, function() {
                  var _a;
                  return __generator(this, function(_b) {
                    switch (_b.label) {
                     case 0:
                      clone_1_2.destroy();
                      this.spr.enabled = true;
                      _a = this.spr;
                      return [ 4, UtilsManager_1.default.loadImage(this.path[data.state] + this.index.toString() + "_" + data.state.toString()) ];

                     case 1:
                      _a.spriteFrame = _b.sent();
                      return [ 2 ];
                    }
                  });
                });
              }).start();
              _d.label = 7;

             case 7:
              cc.tween(clone).to(.5, {
                y: this.node.y
              }).call(function() {
                return __awaiter(_this, void 0, void 0, function() {
                  var _a;
                  return __generator(this, function(_b) {
                    switch (_b.label) {
                     case 0:
                      clone.destroy();
                      this.node.getComponent(cc.Sprite).enabled = true;
                      _a = this.node.getComponent(cc.Sprite);
                      return [ 4, UtilsManager_1.default.loadImage(this.path[data.state] + this.index.toString()) ];

                     case 1:
                      _a.spriteFrame = _b.sent();
                      return [ 2 ];
                    }
                  });
                });
              }).start();
              _d.label = 8;

             case 8:
              return [ 2 ];
            }
          });
        });
      };
      Changee_Appearance.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Sprite) ], Changee_Appearance.prototype, "spr", void 0);
      __decorate([ property() ], Changee_Appearance.prototype, "index", void 0);
      __decorate([ property() ], Changee_Appearance.prototype, "floorIndex", void 0);
      Changee_Appearance = __decorate([ ccclass ], Changee_Appearance);
      return Changee_Appearance;
    }(cc.Component);
    exports.default = Changee_Appearance;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/UtilsManager": "UtilsManager"
  } ],
  Client: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8c7715QIExCgbtEWZOvznS9", "Client");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var DataManager_1 = require("../common/manager/DataManager");
    var GameSys_1 = require("../common/manager/GameSys");
    var MathManager_1 = require("../common/manager/MathManager");
    var PoolManager_1 = require("../common/manager/PoolManager");
    var PopupManager_1 = require("../common/manager/PopupManager");
    var StaticManager_1 = require("../common/manager/StaticManager");
    var UtilsManager_1 = require("../common/manager/UtilsManager");
    var Production_1 = require("./Production");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "client";
    var Client = function(_super) {
      __extends(Client, _super);
      function Client() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.dragonName = null;
        _this.info = null;
        _this.spr = null;
        _this.gotoloo = false;
        _this.notLeave = false;
        _this.buildings = [];
        _this.odds = [];
        _this.props = [];
        _this.index = 0;
        _this.curPos = cc.v2(0, 0);
        _this.endPos = cc.v2(0, 0);
        _this.typeIndex = 0;
        _this.lower = 0;
        _this.upper = 3;
        _this.buy_time = 0;
        _this.fall_index = 0;
        _this.goods = 0;
        _this.grid = 40;
        _this.v = 0;
        _this.count = 0;
        _this.time = .7;
        _this.dragonsName = [ "\u987e\u5ba2-\u80cc\u9505\u4fa0", "\u987e\u5ba2-\u72d0\u72f8", "\u987e\u5ba2-\u6811\u5996" ];
        _this.shop_queue = -1;
        _this.loo_queue = -1;
        return _this;
      }
      Client.prototype.initPath = function(path, startPos, _posIndex, count) {
        var _this = this;
        if (!Caches_1.default.get(Caches_1.default.newGuide)) {
          console.log("\u65f6\u95f4");
          this.time = .2;
        }
        this.dragonName.armatureName = this.dragonsName[Math.floor(3 * Math.random())];
        this.count = count;
        this.change_propAdds();
        var index = path.length - 1;
        this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u5de6\u4e0a", 0);
        var _cb = function() {
          if (path.length > 0) {
            index--;
            if (index < 0) {
              _this.unschedule(_cb);
              _this.onTouchBuy();
              return;
            }
            19 == path[index].x && 8 == path[index].y && (_this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0));
            22 == path[index].x && 11 == path[index].y && _this.showProp();
            _this.curPos.x = path[index].x;
            _this.curPos.y = path[index].y;
            _this.node.zIndex = 24 - path[index].y;
            cc.tween(_this.node).to(_this.time, {
              x: 2 + path[index].x * (_this.grid + 2) + _this.grid / 2,
              y: 2 + path[index].y * (_this.grid + 2) + _this.grid / 2
            }).start();
          } else _this.unschedule(_cb);
        };
        this.unschedule(_cb);
        this._posIndex = _posIndex;
        this.node.x = 2 + startPos.x * (this.grid + 2) + this.grid / 2;
        this.node.y = 2 + startPos.y * (this.grid + 2) + this.grid / 2;
        this.schedule(_cb, this.time);
        GameSys_1.default.game.xBind(Config_1.Config.PROPADDS, this.change_propAdds.bind(this), this.count.toString());
      };
      Client.prototype.onLoad = function() {
        Caches_1.default.get(Caches_1.default.newGuide) || GameSys_1.default.game.xBind(Config_1.Config.NEWGUIDECON, this.move.bind(this), BINDER_NAME);
      };
      Client.prototype.queue_shop = function() {
        this.dragonName.armatureName = this.dragonsName[Math.floor(3 * Math.random())];
        var flag_queue = -1;
        MathManager_1.default.getInstance().visitLinearArray(StaticManager_1.default.getInstance().shop_queue, function(i) {
          StaticManager_1.default.getInstance().shop_queue[i] && (flag_queue = i);
        });
        this.curPos = cc.v2(27, 1);
        this.node.x = 2 + this.curPos.x * (this.grid + 2) + this.grid / 2;
        this.node.y = 2 + this.curPos.y * (this.grid + 2) + this.grid / 2;
        if (-1 != flag_queue) {
          StaticManager_1.default.getInstance().shop_queue[flag_queue + 1] = true;
          var endpos = Config_1.SHOP_QUEUE[flag_queue + 1];
          this.shop_queue = flag_queue + 1;
          this.leave(endpos);
        } else {
          StaticManager_1.default.getInstance().shop_queue[0] = true;
          var endpos = Config_1.SHOP_QUEUE[0];
          this.shop_queue = 0;
          this.leave(endpos);
        }
        GameSys_1.default.game.xBind(Config_1.Config.SHOP_POS_CHANGE, this.shop_change.bind(this), BINDER_NAME);
      };
      Client.prototype.shop_change = function() {
        var _this = this;
        if (-1 == this.shop_queue) return;
        var cb = function() {
          var pos = [];
          MathManager_1.default.getInstance().visitLinearArray(GameSys_1.default.game.xGet(Config_1.Config.SHOP_POS), function(i) {
            1 != GameSys_1.default.game.xGet(Config_1.Config.SHOP_POS)[i] && pos.push(i);
          });
          console.error("\u53ef\u80fd\u6ca1\u4e1c\u897f", pos, GameSys_1.default.game.xGet(Config_1.Config.SHOP_POS));
          if (pos.length > 0) {
            var index_1 = Math.floor(Math.random() * pos.length);
            GameSys_1.default.game.xGet(Config_1.Config.SHOP_POS)[pos[index_1]] = 1;
            GameSys_1.default.game.xSet(Config_1.Config.SHOP_POS, GameSys_1.default.game.xGet(Config_1.Config.SHOP_POS));
            var posShopEnd_1 = Config_1.SHOP_POS[pos[index_1]];
            var posEnd = cc.v2(22, 11);
            _this.leave(posEnd, function() {
              _this.showProp();
              _this.leave(posShopEnd_1, function() {
                _this._posIndex = pos[index_1];
                _this.onTouchBuy();
              });
            });
          }
        };
        if (-1 != this.shop_queue) if (0 == this.shop_queue) {
          StaticManager_1.default.getInstance().shop_queue[0] = false;
          this.shop_queue = -1;
          cb && cb();
        } else if (false == StaticManager_1.default.getInstance().shop_queue[this.shop_queue - 1]) {
          StaticManager_1.default.getInstance().shop_queue[this.shop_queue] = false;
          this.shop_queue = this.shop_queue - 1;
          StaticManager_1.default.getInstance().shop_queue[this.shop_queue] = true;
          cb && cb();
        }
      };
      Client.prototype.change_propAdds = function() {
        var _this = this;
        this.odds = [];
        var temp = 0;
        MathManager_1.default.getInstance().visitLinearArray(Config_1.CLIENT, function(i) {
          if (GameSys_1.default.level >= Config_1.CLIENT[i].lock) {
            temp += Config_1.CLIENT[i].odds;
            _this.odds.push(temp);
            _this.props.push(Config_1.CLIENT[i]);
          }
        });
      };
      Client.prototype.showProp = function() {
        return __awaiter(this, void 0, void 0, function() {
          var index, i, spriteFrame;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              index = Math.random() * this.odds[this.odds.length - 1];
              i = 0;
              _a.label = 1;

             case 1:
              if (!(i < this.odds.length)) return [ 3, 4 ];
              if (!(index <= this.odds[i])) return [ 3, 3 ];
              this.spr.node.active = true;
              this.spr.node.scale = 3.5;
              this.index = this.props[i].ID;
              return [ 4, UtilsManager_1.default.loadImage("head/" + this.props[i].prop) ];

             case 2:
              spriteFrame = _a.sent();
              this.spr.spriteFrame = spriteFrame;
              this.spr.node.setContentSize(spriteFrame.getOriginalSize());
              return [ 3, 4 ];

             case 3:
              i++;
              return [ 3, 1 ];

             case 4:
              return [ 2 ];
            }
          });
        });
      };
      Client.prototype.onTouchBuy = function() {
        var _this = this;
        var shop = GameSys_1.default.game.xGet(Config_1.Config.SHOP);
        var cb_buy = function() {
          var shop = GameSys_1.default.game.xGet(Config_1.Config.SHOP);
          if (shop[_this.index].count > 0) {
            _this.dragons.stop();
            _this.goods = -1;
            GameSys_1.default.game.xSet(Config_1.Config.SHOPCHANGE, {
              ID: shop[_this.index].ID,
              count: shop[_this.index].count - 1
            });
            _this.spr.node.active = false;
            _this.node.scaleX = -.17;
            _this.leave(Config_1.SETTLE, function() {
              _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u7ed3\u8d26", 1);
              _this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, function(event) {
                _this.goldAnim(Config_1.SHOP[_this.index].sell, true);
                _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
                GameSys_1.default.game.xSet(Config_1.Config.SHOP_POS_CHANGE, _this._posIndex);
                _this.dragons.play();
                _this.selectGo();
              });
            });
          }
        };
        if (shop[this.index].count <= 0) {
          GameSys_1.default.game.xSet(Config_1.Config.STOCKOUT, {
            index: this.index,
            v: true
          });
          GameSys_1.default.game.xSet(Config_1.Config.INFORM, {
            index: 0,
            v: "\u5546\u5e97\u5546\u54c1\u4e0d\u8db3",
            cb: function() {
              var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
              PopupManager_1.default.show(Config_1.PopupPath.shop, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
            }
          });
          var _cb_1 = function() {
            if (-1 == _this.goods) {
              _this.unschedule(_cb_1);
              return;
            }
            _this.goods++;
            if (_this.goods >= 3) {
              _this.unschedule(_cb_1);
              _this.selectGo();
              return;
            }
            cb_buy();
          };
          this.schedule(_cb_1, 1, 3);
        } else cb_buy();
      };
      Client.prototype.judge_go = function(index) {
        if (this.typeIndex != index) return;
        if (-1 == this.loo_queue) return;
        this.buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
        var can_use = [];
        for (var i = this.lower; i < this.upper; i++) if (0 != this.buildings[i].level && false == StaticManager_1.default.getInstance().use_buildings[i]) for (var j = 0; j < Config_1.BUILDINGS.length; j++) if (Config_1.BUILDINGS[j].level == this.buildings[i].level && Config_1.BUILDINGS[j].index == i && this.buildings[i].dirty < Config_1.BUILDINGS[j].max_dirty) {
          can_use.push({
            level: this.buildings[i].level,
            index: i
          });
          break;
        }
        0 == this.typeIndex ? this.judge_gotLoo(can_use) : 1 == this.typeIndex ? this.judge_gotToilet_1(can_use) : 2 == this.typeIndex ? this.judge_gotToilet_2(can_use) : 3 == this.typeIndex && this.judge_gotToilet_3(can_use);
      };
      Client.prototype.judge_gotLoo = function(can_use) {
        var _this = this;
        if (can_use.length > 0) {
          if (-1 != this.loo_queue) if (0 == this.loo_queue) {
            StaticManager_1.default.getInstance().loo_queue[0] = false;
            this.loo_queue = -1;
            this.can_goTo(can_use[0], Config_1.LOO_POS, this.typeIndex);
          } else if (false == StaticManager_1.default.getInstance().loo_queue[this.loo_queue - 1]) {
            StaticManager_1.default.getInstance().loo_queue[this.loo_queue] = false;
            this.loo_queue = this.loo_queue - 1;
            StaticManager_1.default.getInstance().loo_queue[this.loo_queue] = true;
            this.endPos = Config_1.LOO_QUEUE[this.loo_queue];
            this.dragons.play();
            this.leave(this.endPos, function() {
              _this.dragons.stop();
            });
          }
        } else if (false == StaticManager_1.default.getInstance().loo_queue[this.loo_queue - 1] && false == StaticManager_1.default.getInstance().loo_queue[this.loo_queue - 1]) {
          StaticManager_1.default.getInstance().loo_queue[this.loo_queue] = false;
          this.loo_queue = this.loo_queue - 1;
          StaticManager_1.default.getInstance().loo_queue[this.loo_queue] = true;
          this.endPos = Config_1.LOO_QUEUE[this.loo_queue];
          this.dragons.play();
          this.leave(this.endPos, function() {
            _this.dragons.stop();
          });
        }
      };
      Client.prototype.judge_gotToilet_1 = function(can_use) {
        var _this = this;
        if (can_use.length > 0) {
          if (-1 != this.loo_queue) if (0 == this.loo_queue) {
            StaticManager_1.default.getInstance().toilet_queue_1[0] = false;
            this.loo_queue = -1;
            this.can_goTo(can_use[0], Config_1.TOILET_POS_1, this.typeIndex);
          } else if (false == StaticManager_1.default.getInstance().toilet_queue_1[this.loo_queue - 1]) {
            StaticManager_1.default.getInstance().toilet_queue_1[this.loo_queue] = false;
            this.loo_queue = this.loo_queue - 1;
            StaticManager_1.default.getInstance().toilet_queue_1[this.loo_queue] = true;
            this.endPos = Config_1.TOILET_QUEUE_1[this.loo_queue];
            this.dragons.play();
            this.leave(this.endPos, function() {
              _this.dragons.stop();
            });
          }
        } else if (false == StaticManager_1.default.getInstance().toilet_queue_1[this.loo_queue - 1]) {
          StaticManager_1.default.getInstance().toilet_queue_1[this.loo_queue] = false;
          this.loo_queue = this.loo_queue - 1;
          StaticManager_1.default.getInstance().toilet_queue_1[this.loo_queue] = true;
          this.endPos = Config_1.TOILET_QUEUE_1[this.loo_queue];
          this.dragons.play();
          this.leave(this.endPos, function() {
            _this.dragons.stop();
          });
        }
      };
      Client.prototype.judge_gotToilet_2 = function(can_use) {
        var _this = this;
        if (can_use.length > 0) {
          if (-1 != this.loo_queue) if (0 == this.loo_queue) {
            StaticManager_1.default.getInstance().toilet_queue_2[0] = false;
            this.loo_queue = -1;
            this.can_goTo(can_use[0], Config_1.TOILET_POS_2, this.typeIndex);
          } else if (false == StaticManager_1.default.getInstance().toilet_queue_2[this.loo_queue - 1]) {
            StaticManager_1.default.getInstance().toilet_queue_2[this.loo_queue] = false;
            this.loo_queue = this.loo_queue - 1;
            StaticManager_1.default.getInstance().toilet_queue_2[this.loo_queue] = true;
            this.endPos = Config_1.TOILET_QUEUE_2[this.loo_queue];
            this.dragons.play();
            this.leave(this.endPos, function() {
              _this.dragons.stop();
            });
          }
        } else if (false == StaticManager_1.default.getInstance().toilet_queue_2[this.loo_queue - 1]) {
          StaticManager_1.default.getInstance().toilet_queue_2[this.loo_queue] = false;
          this.loo_queue = this.loo_queue - 1;
          StaticManager_1.default.getInstance().toilet_queue_2[this.loo_queue] = true;
          this.endPos = Config_1.TOILET_QUEUE_2[this.loo_queue];
          this.dragons.play();
          this.leave(this.endPos, function() {
            _this.dragons.stop();
          });
        }
      };
      Client.prototype.judge_gotToilet_3 = function(can_use) {
        var _this = this;
        if (can_use.length > 0) {
          if (-1 != this.loo_queue) if (0 == this.loo_queue) {
            StaticManager_1.default.getInstance().toilet_queue_3[0] = false;
            this.loo_queue = -1;
            this.can_goTo(can_use[0], Config_1.TOILET_POS_3, this.typeIndex);
          } else if (false == StaticManager_1.default.getInstance().toilet_queue_3[this.loo_queue - 1]) {
            StaticManager_1.default.getInstance().toilet_queue_3[this.loo_queue] = false;
            this.loo_queue = this.loo_queue - 1;
            StaticManager_1.default.getInstance().toilet_queue_3[this.loo_queue] = true;
            this.endPos = Config_1.TOILET_QUEUE_3[this.loo_queue];
            this.dragons.play();
            this.leave(this.endPos, function() {
              _this.dragons.stop();
            });
          }
        } else if (false == StaticManager_1.default.getInstance().toilet_queue_3[this.loo_queue - 1]) {
          StaticManager_1.default.getInstance().toilet_queue_3[this.loo_queue] = false;
          this.loo_queue = this.loo_queue - 1;
          StaticManager_1.default.getInstance().toilet_queue_3[this.loo_queue] = true;
          this.endPos = Config_1.TOILET_QUEUE_3[this.loo_queue];
          this.dragons.play();
          this.leave(this.endPos, function() {
            _this.dragons.stop();
          });
        }
      };
      Client.prototype.can_goTo = function(can_use, target, index) {
        var _this = this;
        this.unschedule(this.can_goTo);
        var buildings;
        for (var i = 0; i < Config_1.BUILDINGS.length; i++) if (Config_1.BUILDINGS[i].level == can_use.level && Config_1.BUILDINGS[i].index == can_use.index) {
          buildings = Config_1.BUILDINGS[i];
          StaticManager_1.default.getInstance().use_buildings[can_use.index] = true;
          this.endPos = target[can_use.index - 3 * index];
          this.leave(this.endPos, function() {
            _this.spr.node.active = false;
            var pos = _this.node.position;
            var callback = function() {
              GameSys_1.default.game.xSet(Config_1.Config.LOOTIME, {
                time: buildings.use_time + Config_1.SHOP[_this.index].use_time,
                dirty: buildings.change_dirty + buildings.change_dirty * Config_1.SHOP[_this.index].clean,
                _index: can_use.index,
                _cb: function() {
                  Caches_1.default.get(Caches_1.default.newGuide) || 19 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 20);
                  DataManager_1.default.getInstance().packagingDrop(can_use.index, buildings.name);
                  if (0 == index) {
                    _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u6d17\u624b\u6c60\u4f7f\u7528-\u540e", 1);
                    _this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, function(event) {
                      _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
                      _this.notLeave = true;
                      _this.leave_again();
                    });
                  } else {
                    _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u536b\u751f\u95f4\u4f7f\u7528-\u540e", 1);
                    _this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, function(event) {
                      _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
                      _this.notLeave = true;
                      cc.tween(_this.node).to(1, {
                        position: pos
                      }).call(function() {
                        _this.leave_again();
                      }).start();
                    });
                  }
                }
              });
            };
            if (0 == index) {
              _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u6d17\u624b\u6c60\u4f7f\u7528-\u524d", 1);
              _this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, function(event) {
                _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u6d17\u624b\u6c60\u4f7f\u7528-\u4e2d", 0);
                callback();
              });
            } else {
              _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u5de6\u4e0a", 0);
              cc.tween(_this.node).to(1, {
                position: Config_1.Pre_Toilet[can_use.index]
              }).call(function() {
                _this.node.scaleX = .17;
                _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u536b\u751f\u95f4\u4f7f\u7528-\u524d", 1);
                cc.tween(_this.node).to(.5, {
                  position: Config_1.Finally_Toilet[can_use.index]
                }).call(function() {
                  callback && callback();
                }).start();
              }).start();
            }
          });
          return;
        }
      };
      Client.prototype.goto = function(pos_queue, target) {
        var _this = this;
        var flag_queue = -1;
        0 == this.typeIndex ? MathManager_1.default.getInstance().visitLinearArray(StaticManager_1.default.getInstance().loo_queue, function(i) {
          StaticManager_1.default.getInstance().loo_queue[i] && (flag_queue = i);
        }) : 1 == this.typeIndex ? MathManager_1.default.getInstance().visitLinearArray(StaticManager_1.default.getInstance().toilet_queue_1, function(i) {
          StaticManager_1.default.getInstance().toilet_queue_1[i] && (flag_queue = i);
        }) : 2 == this.typeIndex ? MathManager_1.default.getInstance().visitLinearArray(StaticManager_1.default.getInstance().toilet_queue_2, function(i) {
          StaticManager_1.default.getInstance().toilet_queue_2[i] && (flag_queue = i);
        }) : 3 == this.typeIndex && MathManager_1.default.getInstance().visitLinearArray(StaticManager_1.default.getInstance().toilet_queue_3, function(i) {
          StaticManager_1.default.getInstance().toilet_queue_3[i] && (flag_queue = i);
        });
        if (-1 != flag_queue) {
          0 == this.typeIndex ? StaticManager_1.default.getInstance().loo_queue[flag_queue + 1] = true : 1 == this.typeIndex ? StaticManager_1.default.getInstance().toilet_queue_1[flag_queue + 1] = true : 2 == this.typeIndex ? StaticManager_1.default.getInstance().toilet_queue_2[flag_queue + 1] = true : 3 == this.typeIndex && (StaticManager_1.default.getInstance().toilet_queue_3[flag_queue + 1] = true);
          this.endPos = pos_queue[flag_queue + 1];
          this.loo_queue = flag_queue + 1;
          this.leave(this.endPos, function() {
            _this.dragons.stop();
          });
        } else {
          this.buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
          var can_use = [];
          for (var i = this.lower; i < this.upper; i++) if (0 != this.buildings[i].level && false == StaticManager_1.default.getInstance().use_buildings[i]) for (var j = 0; j < Config_1.BUILDINGS.length; j++) if (Config_1.BUILDINGS[j].level == this.buildings[i].level && Config_1.BUILDINGS[j].index == i && this.buildings[i].dirty < Config_1.BUILDINGS[j].max_dirty) {
            can_use.push({
              level: this.buildings[i].level,
              index: i
            });
            break;
          }
          if (0 == can_use.length) {
            0 == this.typeIndex ? StaticManager_1.default.getInstance().loo_queue[0] = true : 1 == this.typeIndex ? StaticManager_1.default.getInstance().toilet_queue_1[0] = true : 2 == this.typeIndex ? StaticManager_1.default.getInstance().toilet_queue_2[0] = true : 3 == this.typeIndex && (StaticManager_1.default.getInstance().toilet_queue_3[0] = true);
            this.endPos = pos_queue[0];
            this.loo_queue = 0;
            this.leave(this.endPos, function() {
              _this.dragons.stop();
              _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
            });
          } else this.can_goTo(can_use[0], target, this.typeIndex);
        }
      };
      Client.prototype.goto_toilet_1 = function() {
        var count = 0;
        this.typeIndex = 1;
        this.lower = 3;
        this.upper = 6;
        MathManager_1.default.getInstance().visitLinearArray(StaticManager_1.default.getInstance().toilet_queue_1, function(i) {
          StaticManager_1.default.getInstance().toilet_queue_1[i] && count++;
        });
        if (count == StaticManager_1.default.getInstance().toilet_queue_1.length) {
          this.reconfirm();
          return;
        }
        this.goto(Config_1.TOILET_QUEUE_1, Config_1.TOILET_POS_1);
        GameSys_1.default.game.xBind(Config_1.Config.LEAVETOILETONE, this.judge_go.bind(this), this.count.toString());
      };
      Client.prototype.goto_toilet_2 = function() {
        var count = 0;
        this.typeIndex = 2;
        this.lower = 6;
        this.upper = 9;
        MathManager_1.default.getInstance().visitLinearArray(StaticManager_1.default.getInstance().toilet_queue_2, function(i) {
          StaticManager_1.default.getInstance().toilet_queue_2[i] && count++;
        });
        if (count == StaticManager_1.default.getInstance().toilet_queue_2.length) {
          this.reconfirm();
          return;
        }
        this.goto(Config_1.TOILET_QUEUE_2, Config_1.TOILET_POS_2);
        GameSys_1.default.game.xBind(Config_1.Config.LEAVETOILETTWO, this.judge_go.bind(this), this.count.toString());
      };
      Client.prototype.goto_toilet_3 = function() {
        var count = 0;
        this.typeIndex = 3;
        this.lower = 9;
        this.upper = 12;
        MathManager_1.default.getInstance().visitLinearArray(StaticManager_1.default.getInstance().toilet_queue_3, function(i) {
          StaticManager_1.default.getInstance().toilet_queue_3[i] && count++;
        });
        if (count == StaticManager_1.default.getInstance().toilet_queue_3.length) {
          this.reconfirm();
          return;
        }
        this.goto(Config_1.TOILET_QUEUE_3, Config_1.TOILET_POS_3);
        GameSys_1.default.game.xBind(Config_1.Config.LEAVETOILETTHERE, this.judge_go.bind(this), this.count.toString());
      };
      Client.prototype.goto_Loo = function() {
        var count = 0;
        this.typeIndex = 0;
        this.lower = 0;
        this.upper = 3;
        MathManager_1.default.getInstance().visitLinearArray(StaticManager_1.default.getInstance().loo_queue, function(i) {
          StaticManager_1.default.getInstance().loo_queue[i] && count++;
        });
        if (count == StaticManager_1.default.getInstance().loo_queue.length) {
          this.reconfirm();
          return;
        }
        this.gotoloo = true;
        this.goto(Config_1.LOO_QUEUE, Config_1.LOO_POS);
        GameSys_1.default.game.xBind(Config_1.Config.LEAVELOO, this.judge_go.bind(this), this.count.toString());
      };
      Client.prototype.reconfirm = function() {
        this.buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
        var can_use = [];
        for (var i = this.lower; i < this.upper; i++) if (0 != this.buildings[i].level && false == StaticManager_1.default.getInstance().use_buildings[i]) for (var j = 0; j < Config_1.BUILDINGS.length; j++) if (Config_1.BUILDINGS[j].level == this.buildings[i].level && Config_1.BUILDINGS[j].index == i && this.buildings[i].dirty < Config_1.BUILDINGS[j].max_dirty) {
          can_use.push({
            level: this.buildings[i].level,
            index: i
          });
          break;
        }
        0 !== can_use.length;
        this.info.active = true;
        this.spr.node.active = false;
        this.leave_entirely();
      };
      Client.prototype.leave_again = function() {
        var _this = this;
        this.endPos = Config_1.SHOP_AGAIN[Math.floor(Math.random() * Config_1.SHOP_AGAIN.length)];
        this.leave(this.endPos, function() {
          StaticManager_1.default.getInstance().goldCount++;
          var earnings = _this.earnings();
          GameSys_1.default.game.xSet(Config_1.Config.GOLDOFFLINECHANGE, {
            index: StaticManager_1.default.getInstance().goldCount % 2,
            state: earnings
          });
          if (StaticManager_1.default.getInstance().goldCount % 2 == 1) {
            var time = Math.ceil((new Date().getTime() - StaticManager_1.default.getInstance().goldPreSecond) / 1e3);
            GameSys_1.default.game.xSet(Config_1.Config.GOLDOFFLINECHANGE, {
              index: 2,
              state: time
            });
          } else StaticManager_1.default.getInstance().goldPreSecond = new Date().getTime();
          _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u7ed3\u8d26", 1);
          _this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, function(event) {
            _this.goldAnim(_this.earnings(), false);
            _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
            _this.leave_entirely();
          });
        });
      };
      Client.prototype.leave_entirely = function() {
        var _this = this;
        this.endPos = Config_1.LEAVE_POS;
        this.leave(this.endPos, function() {
          _this.node.destroy();
        });
      };
      Client.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(this.count.toString());
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      Client.prototype.earnings = function() {
        var earnings = Config_1.EARNINGS[GameSys_1.default.level].level_earnings * GameSys_1.default.level + Config_1.SHOP[this.index].jiesuan * GameSys_1.default.level;
        var level = 0;
        MathManager_1.default.getInstance().visitLinearArray(GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS), function(i) {
          level += GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS)[i].level;
        });
        return earnings + level * Config_1.EARNINGS[GameSys_1.default.level].build_earnings;
      };
      Client.prototype.leave = function(endPos, _callback) {
        var _this = this;
        this.unschedule(this.leave);
        this.unscheduleAllCallbacks();
        Production_1.default.getInstance().posStart = this.curPos;
        Production_1.default.getInstance().posEnd = endPos;
        Production_1.default.getInstance().Map_Path = [];
        Production_1.default.getInstance().Map_Path = MathManager_1.default.getInstance().transformArray(Config_1.JSON_PATH);
        Production_1.default.getInstance().initMap();
        Production_1.default.getInstance().findPath(this.curPos, endPos);
        var path = Production_1.default.getInstance().path;
        var index = path.length - 1;
        var time = .5;
        Caches_1.default.get(Caches_1.default.newGuide) || (time = .1);
        var _cb = function() {
          if (path.length > 0) {
            index--;
            if (index < 0) {
              _this.unschedule(_cb);
              _callback && _callback();
              return;
            }
            _this.scheduleOnce(function() {
              if (_this.notLeave) {
                if (36 == path[index].x && 18 == path[index].y) {
                  _this.node.scaleX = .17;
                  _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u5de6\u4e0a", 0);
                }
                if (33 == path[index].x && 23 == path[index].y) {
                  _this.node.scaleX = -.17;
                  _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
                }
                if (6 == path[index].x && 17 == path[index].y) {
                  _this.node.scaleX = .17;
                  _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
                }
              } else {
                if (17 == path[index].x && 10 == path[index].y) {
                  _this.node.scaleX = .17;
                  _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u5de6\u4e0a", 0);
                }
                if (!_this.gotoloo && 17 == path[index].x && 16 == path[index].y) {
                  _this.node.scaleX = .17;
                  _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
                }
                if (16 == path[index].x && 15 == path[index].y) {
                  _this.node.scaleX = -.17;
                  _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
                }
                if (33 == path[index].x && 22 == path[index].y) {
                  _this.node.scaleX = -.17;
                  _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
                }
              }
            }, time);
            var x = 2 + path[index].x * (_this.grid + 2) + _this.grid / 2;
            var y = 2 + path[index].y * (_this.grid + 2) + _this.grid / 2;
            if (17 == path[index].x && 11 == path[index].y) {
              x += _this.grid / 2;
              y -= _this.grid / 2;
            }
            if (18 == path[index].x && 12 == path[index].y) {
              x = 2 + 19 * (_this.grid + 2) + _this.grid / 2;
              y = 2 + 12 * (_this.grid + 2) + _this.grid / 2;
            }
            if (37 == path[index].x && 18 == path[index].y) {
              x -= _this.grid / 2;
              y += _this.grid / 2;
            }
            18 == path[index].x && 7 == path[index].y && (x += _this.grid / 2);
            _this.curPos.x = path[index].x;
            _this.curPos.y = path[index].y;
            _this.node.zIndex = 24 - path[index].y;
            cc.tween(_this.node).to(_this.time, {
              x: x,
              y: y
            }).start();
          } else _this.unschedule(_cb);
        };
        this.unschedule(_cb);
        this.schedule(_cb, this.time);
      };
      Client.prototype.onDisable = function() {};
      Client.prototype.recycle_customer = function() {
        PoolManager_1.default.getInstance().clearNodeList(this.node);
      };
      Client.prototype.selectGo = function() {
        return __awaiter(this, void 0, void 0, function() {
          var flag_2, flag_3, i, i, open_buildings;
          return __generator(this, function(_a) {
            GameSys_1.default.game.xSet(Config_1.Config.SHOP_POS_CHANGE, this._posIndex);
            if (Caches_1.default.get(Caches_1.default.newGuide)) {
              flag_2 = false;
              flag_3 = false;
              for (i = 6; i < 9; i++) {
                this.buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
                0 != this.buildings[i].level && (flag_2 = true);
              }
              for (i = 9; i < 12; i++) {
                this.buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
                0 != this.buildings[i].level && (flag_3 = true);
              }
              open_buildings = [ 0, 1 ];
              flag_2 && open_buildings.push(2);
              flag_3 && open_buildings.push(3);
              this.fall_index = open_buildings[Math.floor(Math.random() * open_buildings.length)];
              this.conmove();
            } else 14 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 15);
            return [ 2 ];
          });
        });
      };
      Client.prototype.move = function() {
        if (!Caches_1.default.get(Caches_1.default.newGuide) && 18 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON)) {
          GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 19);
          this.fall_index = 0;
          this.conmove();
        }
      };
      Client.prototype.conmove = function() {
        return __awaiter(this, void 0, void 0, function() {
          var spriteFrame;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this.spr.node.active = true;
              this.spr.node.scale = 1.5;
              spriteFrame = null;
              if (!(0 == this.fall_index)) return [ 3, 2 ];
              return [ 4, UtilsManager_1.default.loadImage("staffState/loo") ];

             case 1:
              spriteFrame = _a.sent();
              return [ 3, 4 ];

             case 2:
              return [ 4, UtilsManager_1.default.loadImage("staffState/toilet") ];

             case 3:
              spriteFrame = _a.sent();
              _a.label = 4;

             case 4:
              this.spr.spriteFrame = spriteFrame;
              this.spr.node.setContentSize(spriteFrame.getOriginalSize());
              this.node.scaleX = -.17;
              0 == this.fall_index ? this.goto_Loo() : 1 == this.fall_index ? this.goto_toilet_1() : 2 == this.fall_index ? this.goto_toilet_2() : 3 == this.fall_index && this.goto_toilet_3();
              return [ 2 ];
            }
          });
        });
      };
      Client.prototype.goldAnim = function(price, click) {
        if (0 !== parseInt(price.toFixed(0))) {
          var canvas = cc.find("Canvas");
          var target = canvas.getChildByName("zone").getChildByName("target");
          var pos = target.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
          GameSys_1.default.game.xSet(Config_1.Config.INSTANTIATEGOLD, {
            price: price,
            pos: pos,
            click: click
          });
        }
      };
      __decorate([ property(dragonBones.ArmatureDisplay) ], Client.prototype, "dragonName", void 0);
      __decorate([ property(cc.Node) ], Client.prototype, "info", void 0);
      __decorate([ property(cc.Sprite) ], Client.prototype, "spr", void 0);
      Client = __decorate([ ccclass ], Client);
      return Client;
    }(cc.Component);
    exports.default = Client;
    cc._RF.pop();
  }, {
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/DataManager": "DataManager",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/MathManager": "MathManager",
    "../common/manager/PoolManager": "PoolManager",
    "../common/manager/PopupManager": "PopupManager",
    "../common/manager/StaticManager": "StaticManager",
    "../common/manager/UtilsManager": "UtilsManager",
    "./Production": "Production"
  } ],
  Coin_fly_to_wallet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "50c59Toe4FIS6Eq7H2Fr8SF", "Coin_fly_to_wallet");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSys_1 = require("../manager/GameSys");
    var Config_1 = require("../manager/Config");
    var BINDER_NAME = "goldAnim";
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Coin_fly_to_wallet = function(_super) {
      __extends(Coin_fly_to_wallet, _super);
      function Coin_fly_to_wallet() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.coinPrefab = null;
        _this.coinPool = null;
        return _this;
      }
      Coin_fly_to_wallet.prototype.onLoad = function() {
        this.node.zIndex = 100;
        this.coinPool = new cc.NodePool();
        this.initCoinPool();
      };
      Coin_fly_to_wallet.prototype.onEnable = function() {
        GameSys_1.default.game.xBind(Config_1.Config.GOLD, this.playAnim.bind(this), BINDER_NAME);
      };
      Coin_fly_to_wallet.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      Coin_fly_to_wallet.prototype.initCoinPool = function(count) {
        void 0 === count && (count = 20);
        for (var i = 0; i < count; i++) {
          var coin = cc.instantiate(this.coinPrefab);
          this.coinPool.put(coin);
        }
      };
      Coin_fly_to_wallet.prototype.playAnim = function(data) {
        if (data.index > 0) {
          var randomCount = 15 * Math.random() + 10;
          var stPos = this.node.getPosition();
          var edPos = GameSys_1.default.game.xGet(Config_1.Config.GOLDPOS);
          this.playCoinFlyAnim(randomCount, stPos, edPos);
        }
      };
      Coin_fly_to_wallet.prototype.playCoinFlyAnim = function(count, stPos, edPos, r) {
        var _this = this;
        void 0 === r && (r = 130);
        var poolSize = this.coinPool.size();
        var reCreateCoinCount = poolSize > count ? 0 : count - poolSize;
        this.initCoinPool(reCreateCoinCount);
        var points = this.getCirclePoints(r, stPos, count);
        var coinNodeList = points.map(function(pos) {
          var coin = _this.coinPool.get();
          coin.setPosition(stPos);
          _this.node.addChild(coin);
          return {
            node: coin,
            stPos: stPos,
            mdPos: pos,
            edPos: edPos,
            dis: pos.sub(edPos).mag()
          };
        });
        coinNodeList = coinNodeList.sort(function(a, b) {
          if (a.dis - b.dis > 0) return 1;
          if (a.dis - b.dis < 0) return -1;
          return 0;
        });
        coinNodeList.forEach(function(item, idx) {
          cc.tween(item.node).to(.3, {
            x: item.mdPos.x,
            y: item.mdPos.y
          }).delay(.01 * idx).to(.5, {
            x: item.edPos.x,
            y: item.edPos.y
          }).call(function() {
            _this.coinPool.put(item.node);
          }).start();
        });
      };
      Coin_fly_to_wallet.prototype.getCirclePoints = function(r, pos, count, randomScope) {
        void 0 === randomScope && (randomScope = 60);
        var points = [];
        var radians = Math.PI / 180 * Math.round(360 / count);
        for (var i = 0; i < count; i++) {
          var x = pos.x + r * Math.sin(radians * i);
          var y = pos.y + r * Math.cos(radians * i);
          points.unshift(cc.v3(x + Math.random() * randomScope, y + Math.random() * randomScope, 0));
        }
        return points;
      };
      __decorate([ property(cc.Prefab) ], Coin_fly_to_wallet.prototype, "coinPrefab", void 0);
      Coin_fly_to_wallet = __decorate([ ccclass ], Coin_fly_to_wallet);
      return Coin_fly_to_wallet;
    }(cc.Component);
    exports.default = Coin_fly_to_wallet;
    cc._RF.pop();
  }, {
    "../manager/Config": "Config",
    "../manager/GameSys": "GameSys"
  } ],
  Config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "16d32vVUBtBzrcn5Xx9TRkZ", "Config");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.WUZI = exports.WUPIN = exports.JSON_PATH = exports.Finally_Toilet = exports.Pre_Toilet = exports.STAFF_MOVE_WAREHOUSE = exports.STAFF_MOVE_LOO = exports.STAFF_MOVE_TOILET_3 = exports.STAFF_MOVE_TOILET_1 = exports.STAFF_MOVE_TOILET_2 = exports.SHOP_QUEUE = exports.TOILET_QUEUE_3 = exports.TOILET_QUEUE_2 = exports.TOILET_QUEUE_1 = exports.LOO_QUEUE = exports.STAIRS = exports.TOILET_3_LOOKON = exports.TOILET_2_LOOKON = exports.TOILET_1_LOOKON = exports.LOO_LOOKON = exports.LOO_POS = exports.TOILET_POS_3 = exports.TOILET_POS_2 = exports.TOILET_POS_1 = exports.SHOP_AGAIN = exports.LEAVE_POS = exports.CLEAN_POS = exports.SHOP_POS = exports.SETTLE = exports.LEVELLOCK = exports.EARNINGS = exports.APPEARANCE = exports.WAREHOUSE = exports.HandDown = exports.Garbage = exports.CLEANGARBAGE = exports.CLIENT = exports.SHOP = exports.BUILDINGS = exports.RECRUIT = exports.LOCK_ROOM = exports.PopupPath = exports.InformLab = exports.TipLab = exports.Config = void 0;
    exports.Config = {
      SCREENPOS: "screenPos",
      GOLD: "gold",
      GOLDOFFLINE: "goldOffline",
      GOLDOFFLINECHANGE: "goldofflineChange",
      LEVEL: "level",
      TIP: "tip",
      LOCKROOM: "lockromm",
      LOCKROOMCHANGE: "lockchange",
      SUCCESS: "success",
      SETPANEL: "set",
      GOLDPOS: "goldPos",
      INSTANTIATEGOLD: "instantiateGold",
      SIGNIN: "signIn",
      SIGNINCHANGE: "signInChange",
      SIGNRED: "signRed",
      SIGNINTRUE: "signInTrue",
      SHOP: "shop",
      SELECTSHOP: "selectshop",
      SHOPCHANGE: "shopChange",
      SHOP_POS_CHANGE: "shop_pos_change",
      SHOP_POS: "shopPos",
      SHOP_POSFLAG: "shopFlag",
      RECRUIT: "recruit",
      APPITEM: "appitem",
      BUILDINGSUP: "buildingsup",
      BUILDINGSAPP: "buildingsApp",
      APPSELECT: "appSelect",
      RECRUITCHANGE: "recruitChange",
      BUILDINGSDETAILS: "buildingsDetails",
      BUILDINGSSELECT: "buildingsSelect",
      BUILDINGS: "buildings",
      BUILDINGSCHANGE: "buildingsChane",
      BUILDINGSUPDATE: "buildingsUpdate",
      LOOTIME: "lootime",
      BLOCK: "block",
      FALLINGRED: "fallingRed",
      FALLINGGOODS: "fallingGoods",
      UPGRADE_BUILDINGS: "upgrade_buildings",
      LEAVELOO: "leaveLoo",
      LEAVETOILETONE: "leaveToiletone",
      LEAVETOILETTWO: "leaveToilettwo",
      LEAVETOILETTHERE: "leaveToiletthere",
      FIXLOO: "fixloo",
      WAREHOUSE: "warehouse",
      WAREHOUSECHNAGE: "warehouseChange",
      WAREHOUSEANIM: "warehouseanim",
      APPEARANCE: "appearance",
      APPEARANCECHANGE: "appearanceChange",
      PROPADDS: "propAdds",
      HIDEALL: "hideAll",
      STOCKOUT: "stockout",
      MAGNIFY: "magnify",
      GRAPHICS: "graphics",
      CLEAN: "clean",
      NEWGUIDECON: "newguidecon",
      NEWGUID: "newguid",
      TTOVER: "ttover",
      INFORM: "inform",
      ALLRED: "allred",
      HIDESHOP: "hideshop",
      GARBAGEOPACITY: "garbageopacity",
      OPPO: "oppo"
    };
    exports.TipLab = {
      gold_not: "\u91d1\u5e01\u4e0d\u8db3",
      lock: "\u5f53\u524d\u5173\u5361\u672a\u89e3\u9501",
      comingsoon: "\u656c\u8bf7\u671f\u5f85",
      fail: "\u5931\u8d25\u4e86",
      get_hint: "\u83b7\u5f97\u63d0\u793a",
      not_reward: "\u4eb2,\u770b\u5b8c\u89c6\u9891\u83b7\u5f97\u5956\u52b1\u54e6",
      have_reward: "\u5df2\u7ecf\u9886\u53d6\u4e86\u54e6",
      not_arrived_time: "\u65f6\u95f4\u672a\u5230,\u4e0d\u8981\u5fc3\u6025",
      use_buildings: "\u8bbe\u5907\u4f7f\u7528\u4e2d\uff0c\u8bf7\u7a0d\u540e\u5347\u7ea7",
      upgrade_buildings: "\u8bbe\u5907\u6b63\u5728\u5347\u7ea7\u4e2d",
      levelCap: "\u5df2\u8fbe\u4e0a\u9650",
      recruited: "\u88ab\u62db\u52df",
      dissmissal: "\u5df2\u89e3\u96c7"
    };
    exports.InformLab = {};
    var path = "prefabs/";
    exports.PopupPath = {
      signIn: path + "signIn",
      shop: path + "shop",
      buildings: path + "buildings",
      warehouse: path + "warehouse",
      activity: path + "activity",
      task: path + "task",
      dial: path + "dial",
      recruit: path + "recruit",
      tip: path + "tip",
      loo: path + "loo",
      block: path + "block",
      ttrec: path + "ttrec"
    };
    exports.LOCK_ROOM = [ 0, 0, 2, 18 ];
    exports.RECRUIT = [ {
      ID: 1,
      name: "\u5c0f\u592a\u767d",
      efficiency: 30,
      time: 30,
      price: 50,
      level: 1,
      color: "#b7d2b5"
    }, {
      ID: 2,
      name: "\u5c0f\u7075\u5b9d",
      efficiency: 28,
      time: 30,
      price: 300,
      level: 2,
      color: "#ecae7d"
    }, {
      ID: 3,
      name: "\u5c0f\u592a\u4fdd",
      efficiency: 26,
      time: 26,
      price: 1800,
      level: 3,
      color: "#a8b9d1"
    }, {
      ID: 4,
      name: "\u5c0f\u65e5\u6708",
      efficiency: 26,
      time: 26,
      price: 1e4,
      level: 3,
      color: "#a8b9d1"
    }, {
      ID: 5,
      name: "\u5c0f\u4e50\u4e50",
      efficiency: 24,
      time: 22,
      price: 5e4,
      level: 4,
      color: "#d7c3e6"
    }, {
      ID: 6,
      name: "\u5c0f\u571f\u8c46",
      efficiency: 24,
      time: 22,
      price: 135e3,
      level: 4,
      color: "#d7c3e6"
    }, {
      ID: 7,
      name: "\u5c0f\u7075\u4e39",
      efficiency: 20,
      time: 15,
      price: 42e4,
      level: 5,
      color: "#eed37"
    }, {
      ID: 8,
      name: "\u5c0f\u6c99\u5b50",
      efficiency: 20,
      time: 15,
      price: 1e6,
      level: 5,
      color: "#eed37"
    } ];
    exports.BUILDINGS = [ {
      ID: 1,
      name: "\u6d17\u624b\u6c60",
      TIPS: "",
      level: 1,
      icon: "loo_1",
      upgrade_time: 10,
      gold: 0,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 8,
      lock: 0,
      index: 0
    }, {
      ID: 2,
      name: "\u6d17\u624b\u6c60",
      TIPS: "",
      level: 2,
      icon: "loo_2",
      upgrade_time: 10,
      gold: 14e4,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 6,
      lock: 6,
      index: 0
    }, {
      ID: 3,
      name: "\u6d17\u624b\u6c60",
      TIPS: "",
      level: 3,
      icon: "loo_3",
      upgrade_time: 10,
      gold: 277e4,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 3,
      lock: 12,
      index: 0
    }, {
      ID: 4,
      name: "\u6d17\u624b\u6c60",
      TIPS: "",
      level: 1,
      icon: "loo_1",
      upgrade_time: 10,
      gold: 2300,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 8,
      lock: 2,
      index: 1
    }, {
      ID: 5,
      name: "\u6d17\u624b\u6c60",
      TIPS: "",
      level: 2,
      icon: "loo_2",
      upgrade_time: 10,
      gold: 48e4,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 6,
      lock: 8,
      index: 1
    }, {
      ID: 6,
      name: "\u6d17\u624b\u6c60",
      TIPS: "",
      level: 3,
      icon: "loo_3",
      upgrade_time: 10,
      gold: 54e5,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 3,
      lock: 14,
      index: 1
    }, {
      ID: 7,
      name: "\u6d17\u624b\u6c60",
      TIPS: "",
      level: 1,
      icon: "loo_1",
      upgrade_time: 10,
      gold: 2e4,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 8,
      lock: 4,
      index: 2
    }, {
      ID: 8,
      name: "\u6d17\u624b\u6c60",
      TIPS: "",
      level: 2,
      icon: "loo_2",
      upgrade_time: 10,
      gold: 126e4,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 6,
      lock: 10,
      index: 2
    }, {
      ID: 9,
      name: "\u6d17\u624b\u6c60",
      TIPS: "",
      level: 3,
      icon: "loo_3",
      upgrade_time: 10,
      gold: 962e4,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 3,
      lock: 16,
      index: 2
    }, {
      ID: 10,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 1,
      icon: "bay_1",
      upgrade_time: 10,
      gold: 0,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 5,
      lock: 0,
      index: 3
    }, {
      ID: 11,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 2,
      icon: "bay_2",
      upgrade_time: 10,
      gold: 12e4,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 4,
      lock: 6,
      index: 3
    }, {
      ID: 12,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 3,
      icon: "bay_3",
      upgrade_time: 10,
      gold: 237e4,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 2,
      lock: 12,
      index: 3
    }, {
      ID: 13,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 1,
      icon: "bay_1",
      upgrade_time: 10,
      gold: 100,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 5,
      lock: 1,
      index: 4
    }, {
      ID: 14,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 2,
      icon: "bay_2",
      upgrade_time: 10,
      gold: 41e4,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 4,
      lock: 8,
      index: 4
    }, {
      ID: 15,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 3,
      icon: "bay_3",
      upgrade_time: 10,
      gold: 463e4,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 2,
      lock: 14,
      index: 4
    }, {
      ID: 16,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 1,
      icon: "bay_1",
      upgrade_time: 10,
      gold: 1e4,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 5,
      lock: 3,
      index: 5
    }, {
      ID: 17,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 2,
      icon: "bay_2",
      upgrade_time: 10,
      gold: 108e4,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 4,
      lock: 10,
      index: 5
    }, {
      ID: 18,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 3,
      icon: "bay_3",
      upgrade_time: 10,
      gold: 825e4,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 2,
      lock: 16,
      index: 5
    }, {
      ID: 19,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 1,
      icon: "bay_1",
      upgrade_time: 10,
      gold: 0,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 5,
      lock: 2,
      index: 6
    }, {
      ID: 20,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 2,
      icon: "bay_2",
      upgrade_time: 10,
      gold: 27e4,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 4,
      lock: 7,
      index: 6
    }, {
      ID: 21,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 3,
      icon: "bay_3",
      upgrade_time: 10,
      gold: 392e4,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 2,
      lock: 13,
      index: 6
    }, {
      ID: 22,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 1,
      icon: "bay_1",
      upgrade_time: 10,
      gold: 2e4,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 5,
      lock: 4,
      index: 7
    }, {
      ID: 23,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 2,
      icon: "bay_2",
      upgrade_time: 10,
      gold: 8e5,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 4,
      lock: 9,
      index: 7
    }, {
      ID: 24,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 3,
      icon: "bay_3",
      upgrade_time: 10,
      gold: 728e4,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 2,
      lock: 15,
      index: 7
    }, {
      ID: 25,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 1,
      icon: "bay_1",
      upgrade_time: 10,
      gold: 6e4,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 5,
      lock: 5,
      index: 8
    }, {
      ID: 26,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 2,
      icon: "bay_2",
      upgrade_time: 10,
      gold: 19e5,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 4,
      lock: 11,
      index: 8
    }, {
      ID: 27,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 3,
      icon: "bay_3",
      upgrade_time: 10,
      gold: 1251e4,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 2,
      lock: 17,
      index: 8
    }, {
      ID: 28,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 1,
      icon: "bay_1",
      upgrade_time: 10,
      gold: 1602e4,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 5,
      lock: 18,
      index: 9
    }, {
      ID: 29,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 2,
      icon: "bay_2",
      upgrade_time: 10,
      gold: 2528e4,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 4,
      lock: 20,
      index: 9
    }, {
      ID: 30,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 3,
      icon: "bay_3",
      upgrade_time: 10,
      gold: 6644e4,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 2,
      lock: 25,
      index: 9
    }, {
      ID: 31,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 1,
      icon: "bay_1",
      upgrade_time: 10,
      gold: 1602e4,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 5,
      lock: 18,
      index: 10
    }, {
      ID: 32,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 2,
      icon: "bay_2",
      upgrade_time: 10,
      gold: 2528e4,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 4,
      lock: 20,
      index: 10
    }, {
      ID: 33,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 3,
      icon: "bay_3",
      upgrade_time: 10,
      gold: 6644e4,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 2,
      lock: 25,
      index: 10
    }, {
      ID: 34,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 1,
      icon: "bay_1",
      upgrade_time: 10,
      gold: 1602e4,
      earnings: 0,
      max_dirty: 200,
      change_dirty: 10,
      use_time: 5,
      lock: 18,
      index: 11
    }, {
      ID: 35,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 2,
      icon: "bay_2",
      upgrade_time: 10,
      gold: 2528e4,
      earnings: 0,
      max_dirty: 500,
      change_dirty: 9,
      use_time: 4,
      lock: 20,
      index: 11
    }, {
      ID: 36,
      name: "\u536b\u751f\u95f4",
      TIPS: "",
      level: 3,
      icon: "bay_3",
      upgrade_time: 10,
      gold: 6644e4,
      earnings: 0,
      max_dirty: 1e3,
      change_dirty: 8,
      use_time: 2,
      lock: 25,
      index: 11
    } ];
    exports.SHOP = [ {
      ID: 1,
      name: "\u624b\u7eb8",
      lock: 0,
      buy: 2,
      overlay: 200,
      sell: 10,
      room: 0,
      use_time: -1,
      clean: 0,
      jiesuan: 0
    }, {
      ID: 2,
      name: "\u9ad8\u7ea7\u7eb8\u5dfe",
      lock: 0,
      buy: 5,
      overlay: 100,
      sell: 25,
      room: 0,
      use_time: 1,
      clean: 0,
      jiesuan: .05
    }, {
      ID: 3,
      name: "\u725b\u5976",
      lock: 0,
      buy: 3,
      overlay: 100,
      sell: 100,
      room: 2,
      use_time: 0,
      clean: .2,
      jiesuan: .05
    }, {
      ID: 4,
      name: "\u901f\u5e72\u6bdb\u5dfe",
      lock: 1,
      buy: 3,
      overlay: 100,
      sell: 15,
      room: 1,
      use_time: 1,
      clean: 0,
      jiesuan: 0
    }, {
      ID: 5,
      name: "\u6d17\u624b\u6db2",
      lock: 2,
      buy: 7,
      overlay: 100,
      sell: 35,
      room: 1,
      use_time: 0,
      clean: 0,
      jiesuan: .05
    }, {
      ID: 6,
      name: "\u5feb\u4e50\u679c\u51bb",
      lock: 3,
      buy: 10,
      overlay: 50,
      sell: 80,
      room: 0,
      use_time: 0,
      clean: -.3,
      jiesuan: .1
    }, {
      ID: 7,
      name: "\u68b3\u5b50",
      lock: 4,
      buy: 15,
      overlay: 100,
      sell: 75,
      room: 1,
      use_time: 1,
      clean: 0,
      jiesuan: .2
    }, {
      ID: 8,
      name: "\u8863\u670d",
      lock: 5,
      buy: 50,
      overlay: 10,
      sell: 300,
      room: 0,
      use_time: 0,
      clean: -1,
      jiesuan: .2
    }, {
      ID: 9,
      name: "\u5feb\u4e50\u6c34",
      lock: 5,
      buy: 8,
      overlay: 100,
      sell: 80,
      room: 2,
      use_time: 0,
      clean: .2,
      jiesuan: .1
    }, {
      ID: 10,
      name: "\u53d1\u80f6",
      lock: 6,
      buy: 55,
      overlay: 30,
      sell: 600,
      room: 1,
      use_time: 0,
      clean: 0,
      jiesuan: .2
    }, {
      ID: 11,
      name: "\u6cfb\u836f",
      lock: 7,
      buy: 100,
      overlay: 5,
      sell: 500,
      room: 0,
      use_time: 3,
      clean: 0,
      jiesuan: 1
    }, {
      ID: 12,
      name: "\u718f\u9999\u7eb8\u5dfe",
      lock: 8,
      buy: 115,
      overlay: 10,
      sell: 1500,
      room: 1,
      use_time: 0,
      clean: -.5,
      jiesuan: .3
    }, {
      ID: 13,
      name: "\u78b3\u9178\u996e\u6599",
      lock: 10,
      buy: 8,
      overlay: 100,
      sell: 80,
      room: 2,
      use_time: 0,
      clean: .2,
      jiesuan: .1
    } ];
    exports.CLIENT = [ {
      ID: 0,
      lock: 0,
      tip: 0,
      prop: "\u624b\u7eb8",
      odds: 1e4
    }, {
      ID: 1,
      lock: 0,
      tip: 0,
      prop: "\u9ad8\u7ea7\u7eb8\u5dfe",
      odds: 1e4
    }, {
      ID: 2,
      lock: 0,
      tip: 0,
      prop: "\u725b\u5976",
      odds: 1e4
    }, {
      ID: 3,
      lock: 1,
      tip: 0,
      prop: "\u901f\u5e72\u6bdb\u5dfe",
      odds: 8573.75
    }, {
      ID: 4,
      lock: 2,
      tip: 0,
      prop: "\u6d17\u624b\u6db2",
      odds: 7350.918906
    }, {
      ID: 5,
      lock: 3,
      tip: 0,
      prop: "\u5feb\u4e50\u679c\u51bb",
      odds: 6634.204313
    }, {
      ID: 6,
      lock: 4,
      tip: 0,
      prop: "\u68b3\u5b50",
      odds: 9500
    }, {
      ID: 7,
      lock: 5,
      tip: 0,
      prop: "\u8863\u670d",
      odds: 9025
    }, {
      ID: 8,
      lock: 5,
      tip: 0,
      prop: "\u5feb\u4e50\u6c34",
      odds: 8145.0625
    }, {
      ID: 9,
      lock: 6,
      tip: 0,
      prop: "\u53d1\u80f6",
      odds: 6983.372961
    }, {
      ID: 10,
      lock: 7,
      tip: 0,
      prop: "\u6cfb\u836f",
      odds: 6302.494097
    }, {
      ID: 11,
      lock: 8,
      tip: 0,
      prop: "\u718f\u9999\u7eb8\u5dfe",
      odds: 7737.809375
    }, {
      ID: 12,
      lock: 10,
      tip: 0,
      prop: "\u78b3\u9178\u996e\u6599",
      odds: 5987.369392
    } ];
    exports.CLEANGARBAGE = [ {
      name: "\u5899\u6c61\u6e0d",
      TOILET: 1,
      pool: 1,
      item_id1: 8,
      item_model1: "\u9ad8\u6548\u53bb\u6c61\u5668",
      item_tips1: "\u8bf7\u4f7f\u7528[\u9ad8\u6548\u53bb\u6c61\u5668]\u8fdb\u884c\u57fa\u672c\u5904\u7406",
      transparency1: .2,
      item_id2: 4,
      item_model2: "\u6e05\u6d01\u5242",
      item_tips2: "\u518d\u4f7f\u7528[\u6e05\u6d01\u5242]\u8fdb\u884c\u7ec6\u81f4\u5904\u7406",
      transparency2: .2,
      item_id3: 2,
      item_model3: "\u5237\u5b50",
      item_tips3: "\u73b0\u5728\u8d76\u5feb\u4f7f\u7528[\u5237\u5b50]\u8fdb\u884c\u6700\u540e\u7684\u5904\u7406\u5427",
      transparency3: .6
    }, {
      name: "\u6c61\u7269",
      TOILET: 1,
      pool: 1,
      item_id1: 5,
      item_model1: "\u9664\u5473\u5242",
      item_tips1: "\u8bf7\u4f7f\u7528[\u9664\u5473\u5242]\u8fdb\u884c\u57fa\u672c\u5904\u7406",
      transparency1: .2,
      item_id2: 4,
      item_model2: "\u6e05\u6d01\u5242",
      item_tips2: "\u518d\u4f7f\u7528[\u6e05\u6d01\u5242]\u8fdb\u884c\u7ec6\u81f4\u5904\u7406",
      transparency2: .2,
      item_id3: 1,
      item_model3: "\u62b9\u5e03",
      item_tips3: "\u73b0\u5728\u8d76\u5feb\u4f7f\u7528[\u62b9\u5e03]\u8fdb\u884c\u6700\u540e\u7684\u5904\u7406\u5427",
      transparency3: .6
    }, {
      name: "\u5e9f\u7eb8",
      TOILET: 1,
      pool: 1,
      item_id1: 3,
      item_model1: "\u9a6c\u6876\u585e",
      item_tips1: "\u8bf7\u4f7f\u7528[\u9a6c\u6876\u585e]\u8fdb\u884c\u57fa\u672c\u5904\u7406",
      transparency1: .4,
      item_id2: 6,
      item_model2: "\u6e05\u65b0\u5242",
      item_tips2: "\u518d\u4f7f\u7528[\u6e05\u65b0\u5242]\u8fdb\u884c\u7ec6\u81f4\u5904\u7406",
      transparency2: .2,
      item_id3: 2,
      item_model3: "\u5237\u5b50",
      item_tips3: "\u73b0\u5728\u8d76\u5feb\u4f7f\u7528[\u5237\u5b50]\u8fdb\u884c\u6700\u540e\u7684\u5904\u7406\u5427",
      transparency3: .4
    }, {
      name: "\u6c34\u6e0d",
      TOILET: 1,
      pool: 1,
      item_id1: 4,
      item_model1: "\u6e05\u6d01\u5242",
      item_tips1: "\u8bf7\u4f7f\u7528[\u6e05\u6d01\u5242]\u8fdb\u884c\u57fa\u672c\u5904\u7406",
      transparency1: .2,
      item_id2: 1,
      item_model2: "\u62b9\u5e03",
      item_tips2: "\u518d\u4f7f\u7528[\u62b9\u5e03]\u8fdb\u884c\u7ec6\u81f4\u5904\u7406",
      transparency2: .2,
      item_id3: 10,
      item_model3: "\u5439\u98ce\u673a",
      item_tips3: "\u73b0\u5728\u8d76\u5feb\u4f7f\u7528[\u5439\u98ce\u673a]\u8fdb\u884c\u6700\u540e\u7684\u5904\u7406\u5427",
      transparency3: .6
    }, {
      name: "\u624b\u7eb8",
      TOILET: 1,
      pool: 1,
      item_id1: 5,
      item_model1: "\u9664\u5473\u5242",
      item_tips1: "\u8bf7\u4f7f\u7528[\u9664\u5473\u5242]\u8fdb\u884c\u57fa\u672c\u5904\u7406",
      transparency1: .2,
      item_id2: 2,
      item_model2: "\u5237\u5b50",
      item_tips2: "\u518d\u4f7f\u7528[\u5237\u5b50]\u8fdb\u884c\u7ec6\u81f4\u5904\u7406",
      transparency2: .2,
      item_id3: 1,
      item_model3: "\u62b9\u5e03",
      item_tips3: "\u73b0\u5728\u8d76\u5feb\u4f7f\u7528[\u62b9\u5e03]\u8fdb\u884c\u6700\u540e\u7684\u5904\u7406\u5427",
      transparency3: .6
    }, {
      name: "\u53e3\u7ea2\u6c61\u6e0d",
      TOILET: 0,
      pool: 1,
      item_id1: 8,
      item_model1: "\u9ad8\u6548\u53bb\u6c61\u5668",
      item_tips1: "\u8bf7\u4f7f\u7528[\u9ad8\u6548\u53bb\u6c61\u5668]\u8fdb\u884c\u57fa\u672c\u5904\u7406",
      transparency1: .2,
      item_id2: 4,
      item_model2: "\u6e05\u6d01\u5242",
      item_tips2: "\u518d\u4f7f\u7528[\u6e05\u6d01\u5242]\u8fdb\u884c\u7ec6\u81f4\u5904\u7406",
      transparency2: .2,
      item_id3: 1,
      item_model3: "\u62b9\u5e03",
      item_tips3: "\u73b0\u5728\u8d76\u5feb\u4f7f\u7528[\u62b9\u5e03]\u8fdb\u884c\u6700\u540e\u7684\u5904\u7406\u5427",
      transparency3: .6
    }, {
      name: "\u4e0d\u660e\u6db2\u4f53",
      TOILET: 1,
      pool: 1,
      item_id1: 8,
      item_model1: "\u9ad8\u6548\u53bb\u6c61\u5668",
      item_tips1: "\u8bf7\u4f7f\u7528[\u9ad8\u6548\u53bb\u6c61\u5668]\u8fdb\u884c\u57fa\u672c\u5904\u7406",
      transparency1: .2,
      item_id2: 5,
      item_model2: "\u9664\u5473\u5242",
      item_tips2: "\u518d\u4f7f\u7528[\u9664\u5473\u5242]\u8fdb\u884c\u7ec6\u81f4\u5904\u7406",
      transparency2: .2,
      item_id3: 10,
      item_model3: "\u5439\u98ce\u673a",
      item_tips3: "\u73b0\u5728\u8d76\u5feb\u4f7f\u7528[\u5439\u98ce\u673a]\u8fdb\u884c\u6700\u540e\u7684\u5904\u7406\u5427",
      transparency3: .6
    } ];
    exports.Garbage = [ {
      ID: 0,
      name: "\u65e0",
      room: "\u536b\u751f\u95f4",
      chance: 15e3
    }, {
      ID: 1,
      name: "\u5899\u6c61\u6e0d",
      room: "\u536b\u751f\u95f4",
      chance: 100
    }, {
      ID: 2,
      name: "\u6c61\u7269",
      room: "\u536b\u751f\u95f4",
      chance: 100
    }, {
      ID: 3,
      name: "\u5e9f\u7eb8",
      room: "\u536b\u751f\u95f4",
      chance: 100
    }, {
      ID: 4,
      name: "\u6c34\u6e0d",
      room: "\u6d17\u624b\u6c60",
      chance: 100
    }, {
      ID: 5,
      name: "\u624b\u7eb8",
      room: "\u6d17\u624b\u6c60",
      chance: 100
    }, {
      ID: 6,
      name: "\u4e0d\u660e\u6db2\u4f53",
      room: "\u6d17\u624b\u6c60",
      chance: 100
    }, {
      ID: 7,
      name: "\u53e3\u7ea2\u6c61\u6e0d",
      room: "\u6d17\u624b\u6c60",
      chance: 100
    } ];
    exports.HandDown = [ {
      ID: 0,
      name: "\u7a7a",
      chance: 3e3,
      price: 1,
      percentage: 0,
      room: "\u536b\u751f\u95f4"
    }, {
      ID: 1,
      name: "\u624b\u673a",
      chance: 6,
      price: 75,
      percentage: .15,
      room: "\u536b\u751f\u95f4"
    }, {
      ID: 2,
      name: "\u94a5\u5319",
      chance: 91,
      price: 5,
      percentage: .15,
      room: "\u536b\u751f\u95f4"
    }, {
      ID: 3,
      name: "\u94b1\u5305",
      chance: 6,
      price: 70,
      percentage: .15,
      room: "\u536b\u751f\u95f4"
    }, {
      ID: 4,
      name: "\u6212\u6307",
      chance: 6,
      price: 80,
      percentage: .15,
      room: "\u6d17\u624b\u6c60"
    }, {
      ID: 5,
      name: "\u624b\u8868",
      chance: 11,
      price: 40,
      percentage: .15,
      room: "\u6d17\u624b\u6c60"
    }, {
      ID: 6,
      name: "\u5e3d\u5b50",
      chance: 9,
      price: 50,
      percentage: .15,
      room: "\u6d17\u624b\u6c60"
    }, {
      ID: 7,
      name: "\u773c\u955c",
      chance: 45,
      price: 10,
      percentage: .15,
      room: "\u6d17\u624b\u6c60"
    }, {
      ID: 8,
      name: "\u8033\u673a",
      chance: 18,
      price: 25,
      percentage: .15,
      room: "\u6d17\u624b\u6c60"
    }, {
      ID: 9,
      name: "\u56f4\u5dfe",
      chance: 5,
      price: 100,
      percentage: .15,
      room: "\u536b\u751f\u95f4"
    } ];
    exports.WAREHOUSE = [ {
      ID: 1,
      name: "\u62b9\u5e03",
      buy: 15,
      lock: 1,
      room: "\u6d17\u624b\u6c60",
      result_1: .3,
      result_2: .1,
      result_3: .01
    }, {
      ID: 2,
      name: "\u5237\u5b50",
      buy: 20,
      lock: 1,
      room: "\u536b\u751f\u95f4",
      result_1: .5,
      result_2: .1,
      result_3: .01
    }, {
      ID: 3,
      name: "\u9a6c\u6876\u585e",
      buy: 400,
      lock: 2,
      room: "\u536b\u751f\u95f4",
      result_1: .8,
      result_2: .2,
      result_3: .02
    }, {
      ID: 4,
      name: "\u6e05\u6d01\u5242",
      buy: 2e3,
      lock: 3,
      room: "\u6d17\u624b\u6c60",
      result_1: 1.1,
      result_2: .3,
      result_3: .02
    }, {
      ID: 5,
      name: "\u9664\u5473\u5242",
      buy: 6500,
      lock: 4,
      room: "\u536b\u751f\u95f4",
      result_1: 1.3,
      result_2: .5,
      result_3: .03
    }, {
      ID: 6,
      name: "\u6e05\u65b0\u5242",
      buy: 18e3,
      lock: 5,
      room: "\u6d17\u624b\u6c60",
      result_1: 1.5,
      result_2: .5,
      result_3: .03
    }, {
      ID: 7,
      name: "\u8f6c\u8f6c\u6905",
      buy: 14e4,
      lock: 8,
      room: "\u6d17\u624b\u6c60",
      result_1: 1.8,
      result_2: .7,
      result_3: .03
    }, {
      ID: 8,
      name: "\u9ad8\u6548\u53bb\u6c61\u5668",
      buy: 8e5,
      lock: 12,
      room: "\u536b\u751f\u95f4",
      result_1: 2,
      result_2: .7,
      result_3: .04
    }, {
      ID: 9,
      name: "\u70d8\u5e72\u673a",
      buy: 2e6,
      lock: 15,
      room: "\u6d17\u624b\u6c60",
      result_1: 2.3,
      result_2: 1,
      result_3: .04
    }, {
      ID: 10,
      name: "\u5439\u98ce\u673a",
      buy: 5e6,
      lock: 18,
      room: "\u6d17\u624b\u6c60",
      result_1: 2.5,
      result_2: 1,
      result_3: .05
    } ];
    exports.APPEARANCE = [ {
      ID: 0,
      name: "\u5165\u53e3",
      lock_A: 1,
      gold_A: 500,
      lock_S: 2,
      gold_S: 115e3
    }, {
      ID: 1,
      name: "\u5730\u9762",
      lock_A: 0,
      gold_A: 0,
      lock_S: 2,
      gold_S: 205e3
    }, {
      ID: 2,
      name: "\u5899\u9762",
      lock_A: 1,
      gold_A: 10200,
      lock_S: 2,
      gold_S: 341400
    }, {
      ID: 3,
      name: "\u697c\u68af",
      lock_A: 1,
      gold_A: 26800,
      lock_S: 2,
      gold_S: 538800
    }, {
      ID: 4,
      name: "\u76f8\u6846",
      lock_A: 1,
      gold_A: 59e3,
      lock_S: 2,
      gold_S: 814e3
    }, {
      ID: 5,
      name: "\u5730\u6bef",
      lock_A: 1,
      gold_A: 115e3,
      lock_S: 2,
      gold_S: 1186500
    }, {
      ID: 6,
      name: "\u5730\u9762",
      lock_A: 1,
      gold_A: 10200,
      lock_S: 2,
      gold_S: 341400
    }, {
      ID: 7,
      name: "\u5899\u58c1",
      lock_A: 1,
      gold_A: 59e3,
      lock_S: 2,
      gold_S: 814e3
    }, {
      ID: 8,
      name: "\u51b7\u85cf\u67dc",
      lock_A: 1,
      gold_A: 205e3,
      lock_S: 2,
      gold_S: 1677900
    }, {
      ID: 9,
      name: "\u6536\u94f6\u53f0",
      lock_A: 1,
      gold_A: 538800,
      lock_S: 2,
      gold_S: 3118e3
    }, {
      ID: 10,
      name: "\u8d27\u67b6",
      lock_A: 1,
      gold_A: 1186500,
      lock_S: 2,
      gold_S: 5361e3
    }, {
      ID: 11,
      name: "\u5730\u9762",
      lock_A: 1,
      gold_A: 2900,
      lock_S: 2,
      gold_S: 205e3
    }, {
      ID: 12,
      name: "\u5899\u58c1",
      lock_A: 1,
      gold_A: 26800,
      lock_S: 2,
      gold_S: 538800
    }, {
      ID: 13,
      name: "\u8d27\u67b6",
      lock_A: 1,
      gold_A: 115e3,
      lock_S: 2,
      gold_S: 1186500
    }, {
      ID: 14,
      name: "\u50a8\u7269\u67dc",
      lock_A: 1,
      gold_A: 341400,
      lock_S: 2,
      gold_S: 2312800
    }, {
      ID: 15,
      name: "\u697c\u68af",
      lock_A: 1,
      gold_A: 814e3,
      lock_S: 2,
      gold_S: 4123300
    }, {
      ID: 16,
      name: "\u5730\u9762",
      lock_A: 1,
      gold_A: 26800,
      lock_S: 2,
      gold_S: 538800
    }, {
      ID: 17,
      name: "\u5899\u58c1",
      lock_A: 1,
      gold_A: 205e3,
      lock_S: 2,
      gold_S: 1677900
    }, {
      ID: 18,
      name: "\u673a\u68b0",
      lock_A: 1,
      gold_A: 538800,
      lock_S: 2,
      gold_S: 3118e3
    }, {
      ID: 19,
      name: "\u5730\u9762",
      lock_A: 1,
      gold_A: 2900,
      lock_S: 2,
      gold_S: 205e3
    }, {
      ID: 20,
      name: "\u5899\u58c1",
      lock_A: 1,
      gold_A: 10200,
      lock_S: 2,
      gold_S: 341400
    }, {
      ID: 21,
      name: "\u5de6\u5730\u6bef",
      lock_A: 1,
      gold_A: 1e19,
      lock_S: 2,
      gold_S: 1e19
    }, {
      ID: 22,
      name: "\u53f3\u5730\u6bef",
      lock_A: 1,
      gold_A: 1e19,
      lock_S: 2,
      gold_S: 1e19
    }, {
      ID: 23,
      name: "\u9632\u6c34\u5730\u6bef",
      lock_A: 1,
      gold_A: 26800,
      lock_S: 2,
      gold_S: 538800
    }, {
      ID: 24,
      name: "\u5730\u9762",
      lock_A: 1,
      gold_A: 2900,
      lock_S: 2,
      gold_S: 205e3
    }, {
      ID: 25,
      name: "\u5899\u58c1",
      lock_A: 1,
      gold_A: 10200,
      lock_S: 2,
      gold_S: 341400
    }, {
      ID: 26,
      name: "\u6805\u680f",
      lock_A: 1,
      gold_A: 26800,
      lock_S: 2,
      gold_S: 538800
    }, {
      ID: 27,
      name: "\u5730\u6bef",
      lock_A: 1,
      gold_A: 59e3,
      lock_S: 2,
      gold_S: 814e3
    }, {
      ID: 28,
      name: "\u5730\u677f",
      lock_A: 1,
      gold_A: 10200,
      lock_S: 2,
      gold_S: 341400
    }, {
      ID: 29,
      name: "\u5899\u58c1",
      lock_A: 1,
      gold_A: 26800,
      lock_S: 2,
      gold_S: 538800
    }, {
      ID: 30,
      name: "\u6805\u680f",
      lock_A: 1,
      gold_A: 59e3,
      lock_S: 2,
      gold_S: 814e3
    }, {
      ID: 31,
      name: "\u5730\u677f",
      lock_A: 1,
      gold_A: 115e3,
      lock_S: 2,
      gold_S: 1186500
    }, {
      ID: 32,
      name: "\u5899\u58c1",
      lock_A: 1,
      gold_A: 205e3,
      lock_S: 2,
      gold_S: 1677900
    }, {
      ID: 33,
      name: "\u6805\u680f",
      lock_A: 1,
      gold_A: 341400,
      lock_S: 2,
      gold_S: 2312800
    } ];
    exports.EARNINGS = [ {
      build_earnings: 0,
      level_earnings: 0
    }, {
      build_earnings: 0,
      level_earnings: 0
    }, {
      build_earnings: 2.158456473,
      level_earnings: 1.5
    }, {
      build_earnings: 3.385357929,
      level_earnings: 2.1
    }, {
      build_earnings: 4.658934346,
      level_earnings: 2.8
    }, {
      build_earnings: 5.968383277,
      level_earnings: 3.6
    }, {
      build_earnings: 7.307147735,
      level_earnings: 4.5
    }, {
      build_earnings: 8.670793122,
      level_earnings: 5.5
    }, {
      build_earnings: 10.056107,
      level_earnings: 6.6
    }, {
      build_earnings: 11.46064831,
      level_earnings: 7.8
    }, {
      build_earnings: 12.88249552,
      level_earnings: 9.1
    }, {
      build_earnings: 14.32009439,
      level_earnings: 10.5
    }, {
      build_earnings: 15.77216033,
      level_earnings: 12
    }, {
      build_earnings: 17.2376128,
      level_earnings: 13.6
    }, {
      build_earnings: 18.71552954,
      level_earnings: 15.3
    }, {
      build_earnings: 20.20511365,
      level_earnings: 17.1
    }, {
      build_earnings: 21.70566924,
      level_earnings: 19
    }, {
      build_earnings: 23.21658309,
      level_earnings: 21
    }, {
      build_earnings: 24.73731052,
      level_earnings: 23.1
    }, {
      build_earnings: 26.26736428,
      level_earnings: 25.3
    }, {
      build_earnings: 27.80630584,
      level_earnings: 27.6
    }, {
      build_earnings: 29.35373824,
      level_earnings: 30
    }, {
      build_earnings: 30.90930042,
      level_earnings: 32.5
    }, {
      build_earnings: 32.47266244,
      level_earnings: 35.1
    }, {
      build_earnings: 34.04352155,
      level_earnings: 37.8
    }, {
      build_earnings: 35.62159894,
      level_earnings: 40.6
    }, {
      build_earnings: 37.20663692,
      level_earnings: 43.5
    }, {
      build_earnings: 38.79839661,
      level_earnings: 46.5
    }, {
      build_earnings: 40.39665588,
      level_earnings: 49.6
    }, {
      build_earnings: 42.00120764,
      level_earnings: 52.8
    } ];
    exports.LEVELLOCK = [ {
      level: 1,
      gold: 84
    }, {
      level: 2,
      gold: 444.17
    }, {
      level: 3,
      gold: 2448.45
    }, {
      level: 4,
      gold: 8220.23
    }, {
      level: 5,
      gold: 31547.59
    }, {
      level: 6,
      gold: 67970.31
    }, {
      level: 7,
      gold: 130066.44
    }, {
      level: 8,
      gold: 228197.74
    }, {
      level: 9,
      gold: 374682.55
    }, {
      level: 10,
      gold: 778468.85
    }, {
      level: 11,
      gold: 1162798.44
    }, {
      level: 12,
      gold: 1677236.42
    }, {
      level: 13,
      gold: 2349323.11
    }, {
      level: 14,
      gold: 3209521.34
    }, {
      level: 15,
      gold: 5364082.53
    }, {
      level: 16,
      gold: 7038763.57
    }, {
      level: 17,
      gold: 9085340.52
    }, {
      level: 18,
      gold: 11557090.04
    }, {
      level: 19,
      gold: 14511219.47
    }, {
      level: 20,
      gold: 21610697.2
    }, {
      level: 21,
      gold: 26538460.59
    }, {
      level: 22,
      gold: 32279885.29
    }, {
      level: 23,
      gold: 38923034.04
    }, {
      level: 24,
      gold: 46560949.06
    }, {
      level: 25,
      gold: 64506981.84
    }, {
      level: 26,
      gold: 76088159.84
    }, {
      level: 27,
      gold: 89190938.38
    }, {
      level: 28,
      gold: 103947631.5
    }, {
      level: 29,
      gold: 120496617.9
    }, {
      level: 30,
      gold: 138982387.7
    }, {
      level: 31,
      gold: 159555587.4
    }, {
      level: 32,
      gold: 182373064.1
    }, {
      level: 33,
      gold: 207597908.1
    }, {
      level: 34,
      gold: 235399495
    }, {
      level: 35,
      gold: 265953526.1
    }, {
      level: 36,
      gold: 299442068.6
    }, {
      level: 37,
      gold: 336053594
    }, {
      level: 38,
      gold: 375983016.4
    }, {
      level: 39,
      gold: 419431729.9
    } ];
    exports.SETTLE = cc.v2(23, 12);
    exports.SHOP_POS = [ cc.v2(24, 12), cc.v2(25, 12), cc.v2(26, 12), cc.v2(27, 12), cc.v2(28, 12), cc.v2(23, 11), cc.v2(24, 11), cc.v2(25, 11), cc.v2(26, 11), cc.v2(27, 11), cc.v2(28, 11), cc.v2(24, 13), cc.v2(25, 13), cc.v2(26, 13), cc.v2(27, 13), cc.v2(25, 14) ];
    exports.CLEAN_POS = [ cc.v2(15, 18), cc.v2(17, 19), cc.v2(20, 21), cc.v2(5, 17), cc.v2(8, 19), cc.v2(10, 20), cc.v2(26, 22), cc.v2(28, 23), cc.v2(30, 24), cc.v2(38, 20), cc.v2(41, 18), cc.v2(42, 17) ];
    exports.LEAVE_POS = cc.v2(17, 0);
    exports.SHOP_AGAIN = [ cc.v2(18, 8), cc.v2(17, 8) ];
    exports.TOILET_POS_1 = [ cc.v2(5, 17), cc.v2(8, 19), cc.v2(10, 20) ];
    exports.TOILET_POS_2 = [ cc.v2(26, 22), cc.v2(28, 23), cc.v2(30, 24) ];
    exports.TOILET_POS_3 = [ cc.v2(38, 20), cc.v2(41, 18), cc.v2(42, 17) ];
    exports.LOO_POS = [ cc.v2(15, 18), cc.v2(17, 19), cc.v2(20, 21) ];
    exports.LOO_LOOKON = cc.v2(17, 15);
    exports.TOILET_1_LOOKON = cc.v2(13, 15);
    exports.TOILET_2_LOOKON = cc.v2(23, 20);
    exports.TOILET_3_LOOKON = cc.v2(17, 15);
    exports.STAIRS = cc.v2(17, 10);
    exports.LOO_QUEUE = [ cc.v2(16, 17), cc.v2(17, 18), cc.v2(18, 18), cc.v2(19, 19), cc.v2(20, 19), cc.v2(21, 19), cc.v2(21, 20), cc.v2(22, 20) ];
    exports.TOILET_QUEUE_1 = [ cc.v2(6, 18), cc.v2(7, 18), cc.v2(8, 18), cc.v2(9, 18), cc.v2(10, 18) ];
    exports.TOILET_QUEUE_2 = [ cc.v2(28, 21), cc.v2(29, 22), cc.v2(30, 23), cc.v2(31, 23), cc.v2(31, 24), cc.v2(32, 24) ];
    exports.TOILET_QUEUE_3 = [ cc.v2(37, 20), cc.v2(36, 19), cc.v2(37, 19), cc.v2(38, 19), cc.v2(39, 19), cc.v2(39, 18), cc.v2(40, 18), cc.v2(41, 17) ];
    exports.SHOP_QUEUE = [ cc.v2(20, 6), cc.v2(21, 5), cc.v2(22, 5), cc.v2(23, 5), cc.v2(22, 4), cc.v2(23, 4), cc.v2(24, 4), cc.v2(23, 3), cc.v2(24, 3), cc.v2(25, 3), cc.v2(24, 2), cc.v2(25, 2), cc.v2(26, 2) ];
    exports.STAFF_MOVE_TOILET_2 = [ cc.v2(26, 21), cc.v2(30, 22), cc.v2(33, 24), cc.v2(33, 23) ];
    exports.STAFF_MOVE_TOILET_1 = [ cc.v2(6, 16), cc.v2(7, 16), cc.v2(11, 16), cc.v2(7, 17), cc.v2(8, 17), cc.v2(9, 17), cc.v2(10, 17) ];
    exports.STAFF_MOVE_TOILET_3 = [ cc.v2(37, 18), cc.v2(42, 17) ];
    exports.STAFF_MOVE_LOO = [ cc.v2(13, 15), cc.v2(16, 15), cc.v2(15, 16), cc.v2(17, 16), cc.v2(18, 17), cc.v2(20, 18), cc.v2(22, 20) ];
    exports.STAFF_MOVE_WAREHOUSE = [ cc.v2(3, 8), cc.v2(4, 8), cc.v2(5, 8), cc.v2(6, 8), cc.v2(6, 9), cc.v2(7, 9), cc.v2(8, 9), cc.v2(14, 9), cc.v2(15, 9), cc.v2(16, 9), cc.v2(17, 9), cc.v2(18, 9), cc.v2(8, 10), cc.v2(9, 10), cc.v2(10, 10), cc.v2(11, 10), cc.v2(12, 10), cc.v2(20, 10), cc.v2(21, 10), cc.v2(12, 11), cc.v2(22, 11), cc.v2(23, 12), cc.v2(13, 15), cc.v2(14, 15), cc.v2(15, 15), cc.v2(16, 15), cc.v2(6, 16), cc.v2(7, 16), cc.v2(8, 16), cc.v2(11, 16), cc.v2(6, 16), cc.v2(14, 16), cc.v2(15, 16), cc.v2(16, 16), cc.v2(17, 16), cc.v2(5, 17), cc.v2(6, 17), cc.v2(7, 17), cc.v2(8, 17), cc.v2(9, 17), cc.v2(10, 17), cc.v2(11, 17), cc.v2(15, 17) ];
    exports.Pre_Toilet = [ cc.v3(0, 0, 0), cc.v3(0, 0, 0), cc.v3(0, 0, 0), cc.v3(205.953, 785.201, 0), cc.v3(305.493, 841.352, 0), cc.v3(409.861, 895.985, 0), cc.v3(1035.883, 975.73, 0), cc.v3(1141.342, 1033.577, 0), cc.v3(1242.796, 1089.199, 0), cc.v3(1707.631, 899.63, 0), cc.v3(1809.773, 843.365, 0), cc.v3(1904.125, 787.966, 0) ];
    exports.Finally_Toilet = [ cc.v3(0, 0, 0), cc.v3(0, 0, 0), cc.v3(0, 0, 0), cc.v3(174.749, 814.762, 0), cc.v3(280.876, 865.653, 0), cc.v3(385.201, 923.08, 0), cc.v3(1013.618, 1008.418, 0), cc.v3(1117.742, 1065.82, 0), cc.v3(1221.866, 1120.552, 0), cc.v3(1729.797, 922.619, 0), cc.v3(1829.471, 868.332, 0), cc.v3(1934.357, 813.096, 0) ];
    exports.JSON_PATH = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];
    exports.WUPIN = [ [], [ cc.v2(40, -18) ], [ cc.v2(75, -34) ], [ cc.v2(6, -60) ], [ cc.v2(30, 5) ], [ cc.v2(30, 5) ], [ cc.v2(30, 5) ], [ cc.v2(30, 5) ], [ cc.v2(30, 5) ], [ cc.v2(-80, 36) ] ];
    exports.WUZI = [ [], [ cc.v2(-41, 41) ], [ cc.v2(85, -36) ], [ cc.v2(70, -96) ], [ cc.v2(81, -83) ], [ cc.v2(22, -58) ], [ cc.v2(-18, -90) ], [ cc.v2(-25, -56) ] ];
    cc._RF.pop();
  }, {} ],
  CountDown: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8adb5QvI35M9bRIZG9XD/iM", "CountDown");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "";
    var CountDown = function(_super) {
      __extends(CountDown, _super);
      function CountDown() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.time_lab = null;
        _this.index = 0;
        _this.time_remain = 0;
        _this.startTime = false;
        return _this;
      }
      CountDown.prototype.onEnable = function() {
        this.online();
      };
      CountDown.prototype.time_change = function() {};
      CountDown.prototype.online = function() {
        this.node.width = 100;
        this.node.height = 100;
        this.node.opacity = 180;
        this.buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS)[this.index];
        this.time_remain = this.buildings.upgrade;
        console.log("\u4e0a\u7ebf\u67e5\u770b", this.buildings.upgrade);
        this.startTime = true;
        this.time_lab.string = this.fomatTime(this.time_remain);
        this.countTime(this.time_remain);
      };
      CountDown.prototype.offline = function() {
        this.startTime = false;
        this.buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS)[this.index];
        this.time_remain = this.buildings.upgrade;
        console.log("\u79bb\u7ebf", this.time_remain);
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSCHANGE, {
          index: this.index,
          level: this.buildings.level,
          dirty: this.buildings.dirty,
          upgrade: this.time_remain
        });
      };
      CountDown.prototype.countTime = function(_time) {
        var _this = this;
        if (_time < 0) return;
        this.unscheduleAllCallbacks();
        this.time_lab.node.active = true;
        this.schedule(function() {
          if (_time > 0) {
            _time--;
            0 !== _time && GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSCHANGE, {
              index: _this.index,
              level: _this.buildings.level,
              dirty: _this.buildings.dirty,
              upgrade: _time
            });
            _this.time_lab.string = _this.fomatTime(_time);
            if (0 == _time) {
              console.log("\u5012\u8ba1\u65f6\u7ed3\u675f");
              GameSys_1.default.audio.playSFX("audios/shengji_1");
              GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSCHANGE, {
                index: _this.index,
                dirty: 0,
                level: _this.buildings.level + 1,
                upgrade: 0
              });
              GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSSELECT, _this.index);
              0 == Math.floor(_this.index / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVELOO, 0) : 1 == Math.floor(_this.index / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETONE, 1) : 2 == Math.floor(_this.index / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETTWO, 2) : 3 == Math.floor(_this.index / 3) && GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETTHERE, 3);
              _this.node.active = false;
              GameSys_1.default.game.xSet(Config_1.Config.ALLRED);
            }
          }
        }, 1, _time);
      };
      CountDown.prototype.fomatTime = function(_time) {
        var time = "";
        if (_time < 60) time = _time < 10 ? "00:0" + _time : "00:" + _time; else {
          var minute = Math.floor(_time / 60);
          var second = _time - 60 * minute;
          var minuteL = "";
          var secondL = "";
          minute < 60 && (minuteL = minute < 10 ? "0" + minute : minute + "");
          second < 60 && (secondL = second < 10 ? "0" + second : second + "");
          time = minuteL + ":" + secondL;
        }
        console.log("\u66f4\u65b0", time);
        return time;
      };
      CountDown.prototype.onDestory = function() {};
      __decorate([ property(cc.Label) ], CountDown.prototype, "time_lab", void 0);
      __decorate([ property ], CountDown.prototype, "index", void 0);
      CountDown = __decorate([ ccclass ], CountDown);
      return CountDown;
    }(cc.Component);
    exports.default = CountDown;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys"
  } ],
  Counter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "90aa4+PunJITZKl7MthksB7", "Counter");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var PoolManager_1 = require("../common/manager/PoolManager");
    var GoldAnim_1 = require("../labInfo/GoldAnim");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Counter";
    var Counter = function(_super) {
      __extends(Counter, _super);
      function Counter() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.goldPre = null;
        _this.count = 0;
        return _this;
      }
      Counter.prototype.onLoad = function() {
        console.log(this.node.name);
        PoolManager_1.default.getInstance().initGoldPool(this.goldPre, 200);
        GameSys_1.default.game.xBind(Config_1.Config.INSTANTIATEGOLD, this.change_gold.bind(this), BINDER_NAME);
      };
      Counter.prototype.change_gold = function(_data) {
        var num = 0;
        num = _data.click ? _data.price < 10 ? 1 : _data.price < 50 ? 2 : 5 : 1;
        GameSys_1.default.audio.playSFX("audios/dropGold");
        for (var i = 0; i < num; i++) {
          this.count++;
          var bindername = "goldAnim" + this.count + i;
          var jinbi_icon = PoolManager_1.default.getInstance().getGold();
          jinbi_icon.x = _data.pos.x;
          jinbi_icon.y = _data.pos.y;
          this.node.addChild(jinbi_icon);
          jinbi_icon.getComponent(GoldAnim_1.default).init(_data.price / num, bindername, _data.click);
        }
      };
      Counter.prototype.jinbi_shengyin = function() {
        var action1 = cc.delayTime(.15);
        var action2 = cc.callFunc(function() {}, this, 10);
        var actionlist = cc.sequence(action1, action2).repeatForever();
      };
      Counter.prototype.onTouchGet = function() {};
      Counter.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Prefab) ], Counter.prototype, "goldPre", void 0);
      Counter = __decorate([ ccclass ], Counter);
      return Counter;
    }(cc.Component);
    exports.default = Counter;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/PoolManager": "PoolManager",
    "../labInfo/GoldAnim": "GoldAnim"
  } ],
  DataManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4be9b83llVBz7Y9oDddwRv2", "DataManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("./Caches");
    var Config_1 = require("./Config");
    var GameSys_1 = require("./GameSys");
    var MathManager_1 = require("./MathManager");
    var StaticManager_1 = require("./StaticManager");
    var DataManager = function() {
      function DataManager() {
        this.queue = 0;
        this.stRectime = 0;
        this.garbgeCout = 0;
        this.fallings_null = 0;
        this.queue_loo = [ false, false ];
        this.leisure = [ true, true, true, true, true, true, true, true, true, true, true, true ];
        this.needClean = [ false, false, false, false, false, false, false, false, false, false, false, false ];
        this.inform = [];
        this.cleanGarbageInfo = null;
        this.garbageFlag = 0;
      }
      DataManager.getInstance = function() {
        this.instance = this.instance ? this.instance : new DataManager();
        return this.instance;
      };
      DataManager.prototype.initData = function() {
        this.use_buildings();
        this.loo_queue();
        this.fallings_null = Config_1.HandDown[0].chance;
        this.garbgeCout = Config_1.Garbage[0].chance;
        GameSys_1.default.game.xSet(Config_1.Config.MAGNIFY, {
          index: 0,
          state: true
        });
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSAPP, {
          index: 0,
          state: false
        });
        GameSys_1.default.game.xSet(Config_1.Config.APPITEM, {
          index: 0,
          state: false
        });
        GameSys_1.default.game.xSet(Config_1.Config.BLOCK, {
          state: false,
          spr: false,
          clean: false
        });
        GameSys_1.default.game.xSet(Config_1.Config.SCREENPOS, 0);
        this.garbageNode = new cc.Node();
      };
      DataManager.prototype.use_buildings = function() {
        var index = 0;
        MathManager_1.default.getInstance().visitLinearArray(Config_1.BUILDINGS, function(row) {
          Config_1.BUILDINGS[row].index > index && (index = Config_1.BUILDINGS[row].index);
        });
        for (var i = 0; i <= index; i++) StaticManager_1.default.getInstance().use_buildings.push(false);
        MathManager_1.default.getInstance().visitLinearArray(Config_1.LOCK_ROOM, function(i) {
          GameSys_1.default.game.xGet(Config_1.Config.LOCKROOM)[i] && StaticManager_1.default.getInstance().open_buildings.push(i);
        });
      };
      DataManager.prototype.loo_queue = function() {
        MathManager_1.default.getInstance().visitLinearArray(Config_1.LOO_QUEUE, function(row) {
          StaticManager_1.default.getInstance().loo_queue.push(false);
        });
        MathManager_1.default.getInstance().visitLinearArray(Config_1.TOILET_QUEUE_1, function(row) {
          StaticManager_1.default.getInstance().toilet_queue_1.push(false);
        });
        MathManager_1.default.getInstance().visitLinearArray(Config_1.TOILET_QUEUE_2, function(row) {
          StaticManager_1.default.getInstance().toilet_queue_2.push(false);
        });
        MathManager_1.default.getInstance().visitLinearArray(Config_1.TOILET_QUEUE_3, function(row) {
          StaticManager_1.default.getInstance().toilet_queue_3.push(false);
        });
        MathManager_1.default.getInstance().visitLinearArray(Config_1.SHOP_QUEUE, function(row) {
          StaticManager_1.default.getInstance().shop_queue.push(false);
        });
      };
      DataManager.prototype.garbage = function(_room) {
        var chance = Config_1.Garbage[0].chance;
        var curRoom = [];
        var ID = [];
        ID.push(Config_1.Garbage[0].ID);
        curRoom.push(Config_1.Garbage[0].chance);
        for (var i = 1; i < Config_1.Garbage.length; i++) if (Config_1.Garbage[i].room == _room) {
          chance += Config_1.Garbage[i].chance;
          curRoom.push(chance);
          ID.push(Config_1.Garbage[i].ID);
        }
        var random = Math.random() * chance;
        var ID_index;
        for (var i = 0; i < curRoom.length; i++) if (random <= curRoom[i]) {
          ID_index = ID[i];
          break;
        }
        if (0 != ID_index) Config_1.Garbage[0].chance = this.garbgeCout; else {
          Config_1.Garbage[0].chance -= 500;
          Config_1.Garbage[0].chance < 0 && (Config_1.Garbage[0].chance = 0);
        }
        return ID_index;
      };
      DataManager.prototype.fallings = function(_room) {
        var chance = Config_1.HandDown[0].chance;
        var curRoom = [];
        var ID = [];
        ID.push(Config_1.HandDown[0].ID);
        curRoom.push(Config_1.HandDown[0].chance);
        for (var i = 1; i < Config_1.HandDown.length; i++) if (Config_1.HandDown[i].room == _room) {
          chance += Config_1.HandDown[i].chance;
          curRoom.push(chance);
          ID.push(Config_1.HandDown[i].ID);
        }
        var random = Math.random() * chance;
        var ID_index;
        for (var i = 0; i < curRoom.length; i++) if (random < curRoom[i]) {
          ID_index = ID[i];
          break;
        }
        if (0 != ID_index) Config_1.HandDown[0].chance = this.fallings_null; else {
          Config_1.HandDown[0].chance -= 500;
          Config_1.HandDown[0].chance <= 0 && (Config_1.HandDown[0].chance = 0);
        }
        return ID_index;
      };
      DataManager.prototype.floating = function(price, pecentage) {
        var upper = price + .15 * price;
        var lower = price - .15 * price;
        return Math.ceil(Math.random() * (upper - lower) + lower);
      };
      DataManager.prototype.action = function() {
        var _this = this;
        var canMove = false;
        MathManager_1.default.getInstance().visitLinearArray(this.queue_loo, function(i) {
          false == _this.queue_loo[i];
        });
      };
      DataManager.prototype.odds = function() {
        var odds;
        var temp = 0;
        var props;
        MathManager_1.default.getInstance().visitLinearArray(Config_1.CLIENT, function(i) {
          temp += Config_1.CLIENT[i].odds;
          odds.push(temp);
          props.push(Config_1.CLIENT[i]);
        });
        return [ odds, props ];
      };
      DataManager.prototype.packagingDrop = function(index, name) {
        var flag = false;
        for (var i = 0; i < 2; i++) 0 == StaticManager_1.default.getInstance().falllings[index][i] && (flag = true);
        if (flag) {
          if (0 == StaticManager_1.default.getInstance().falllings[index][0]) {
            var ID = DataManager.getInstance().fallings(name);
            Caches_1.default.get(Caches_1.default.newGuide) || (ID = 4);
            if (0 != ID) for (var i = 1; i < Config_1.HandDown.length; i++) if (Config_1.HandDown[i].ID == ID) {
              GameSys_1.default.game.xSet(Config_1.Config.FALLINGGOODS, {
                path: Config_1.HandDown[i],
                index: index
              });
              StaticManager_1.default.getInstance().falllings[index][0] = 1;
              GameSys_1.default.game.xSet(Config_1.Config.FALLINGRED, index);
              break;
            }
          }
          if (0 == StaticManager_1.default.getInstance().falllings[index][1]) {
            var garbgeId = DataManager.getInstance().garbage(name);
            Caches_1.default.get(Caches_1.default.newGuide) || (garbgeId = 7);
            if (0 != garbgeId) for (var i = 0; i < Config_1.Garbage.length; i++) if (Config_1.Garbage[i].ID == garbgeId) {
              GameSys_1.default.game.xSet(Config_1.Config.GRAPHICS, {
                path: Config_1.Garbage[i],
                index: index
              });
              StaticManager_1.default.getInstance().falllings[index][1] = 1;
              GameSys_1.default.game.xSet(Config_1.Config.FALLINGRED, index);
            }
          }
        }
      };
      DataManager.prototype.setClean = function(index, state) {
        this.needClean[index] = state;
      };
      DataManager.prototype.getClean = function(index) {
        console.log("\u4e0d\u4f1a\u5427", this.needClean);
        return this.needClean[index];
      };
      DataManager.prototype.setLeisure = function(index, state) {
        this.leisure[index] = state;
      };
      DataManager.prototype.getLeisure = function(index) {
        return this.leisure[index];
      };
      DataManager.prototype.packagingGarbage = function(index) {
        var flag = false;
        for (var i = 0; i < 2; i++) 0 == StaticManager_1.default.getInstance().falllings[index][i] && (flag = true);
        if (flag && 0 == StaticManager_1.default.getInstance().falllings[index][1]) {
          var garbgeId = 7;
          garbgeId = index < 3 ? 7 : 1;
          for (var i = 0; i < Config_1.Garbage.length; i++) if (Config_1.Garbage[i].ID == garbgeId) {
            GameSys_1.default.game.xSet(Config_1.Config.GRAPHICS, {
              path: Config_1.Garbage[i],
              index: index
            });
            StaticManager_1.default.getInstance().falllings[index][1] = 1;
            GameSys_1.default.game.xSet(Config_1.Config.FALLINGRED, index);
          }
        }
      };
      DataManager.prototype.getInform = function(v) {
        if (-1 == this.inform.indexOf(v)) {
          this.inform.push(v);
          return false;
        }
        return true;
      };
      DataManager.prototype.spliceInform = function(v) {
        this.inform.splice(this.inform.indexOf(v), 1);
      };
      DataManager.prototype.checkOnTarget = function(location) {
        var node = this.garbageNode;
        if ("" == node.name) {
          console.log("====");
          return false;
        }
        var rect = node.getBoundingBoxToWorld();
        var point = location;
        return !!rect.contains(point);
      };
      return DataManager;
    }();
    exports.default = DataManager;
    cc._RF.pop();
  }, {
    "./Caches": "Caches",
    "./Config": "Config",
    "./GameSys": "GameSys",
    "./MathManager": "MathManager",
    "./StaticManager": "StaticManager"
  } ],
  EditorAsset: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d1d0oxmdNOW6j/uiVpA8kZ", "EditorAsset");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EditorAsset = function() {
      function EditorAsset() {}
      EditorAsset.load = function(path, assetType, callback) {
        true;
        return cc.warn("[EditorAsset]", "\u8be5\u51fd\u6570\u53ea\u5728\u7f16\u8f91\u5668\u73af\u5883\u5185\u6709\u6548\uff01");
      };
      return EditorAsset;
    }();
    exports.default = EditorAsset;
    cc._RF.pop();
  }, {} ],
  GameSys: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0c418gEABlBIYSVYzv5VZHM", "GameSys");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("./Game");
    var Config_1 = require("./Config");
    var Audio_1 = require("../component/Audio");
    var SDK_1 = require("../sdk/SDK");
    var Http_1 = require("../net/Http");
    var TTApi_1 = require("../sdk/TTApi");
    var OPPOApi_1 = require("../sdk/OPPOApi");
    var VivoApi_1 = require("../sdk/VivoApi");
    var DataManager_1 = require("./DataManager");
    var BDApi_1 = require("../sdk/BDApi");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GameSys = function(_super) {
      __extends(GameSys, _super);
      function GameSys() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      GameSys_1 = GameSys;
      GameSys.init = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            this.game = new Game_1.default();
            this.audio = new Audio_1.default();
            this.http = new Http_1.default();
            this.sdk = new SDK_1.default();
            this.level = GameSys_1.game.xGet(Config_1.Config.LEVEL);
            cc.log("\u5f53\u524d\u7b49\u7ea7", this.level);
            if ("tt" == this.channel) {
              new TTApi_1.default();
              this.share = true;
            } else if ("oppo" == this.channel) {
              new OPPOApi_1.default();
              this.share = false;
            } else if ("vivo" == this.channel) {
              new VivoApi_1.default();
              this.share = true;
            } else if ("baidu" == this.channel) {
              new BDApi_1.default();
              this.share = true;
            }
            return [ 2 ];
          });
        });
      };
      GameSys.loadScene = function(v) {
        cc.director.loadScene(v);
      };
      GameSys.gold = function(_v) {
        if (_v < 0 && this.game.xGet(Config_1.Config.GOLD).v + _v < 0) return false;
        this.game.xSet(Config_1.Config.GOLD, {
          v: this.game.xGet(Config_1.Config.GOLD).v + _v,
          index: _v
        });
        return true;
      };
      GameSys.judgeGold = function(usegold, call, cb) {
        this.game.xGet(Config_1.Config.GOLD).v < Math.abs(usegold) ? call && call() : cb && cb();
      };
      GameSys.useGold = function(_usegold, call) {
        if (this.game.xGet(Config_1.Config.GOLD).v < Math.abs(_usegold)) this.game.xSet(Config_1.Config.TIP, Config_1.TipLab.gold_not); else {
          this.gold(_usegold);
          call && call();
        }
      };
      GameSys.shortCut = function() {
        this.sdk.xSet("shortcut");
      };
      GameSys.showNativeAd = function(native) {
        if ("oppo" == this.channel || "vivo" == this.channel) {
          DataManager_1.default.getInstance().oppoNatived = native;
          this.sdk.xSet("showNativeAd");
        }
      };
      GameSys.showInter = function() {
        if ("blank" == GameSys_1.channel) return;
        this.sdk.xSet("showInter");
      };
      GameSys.showBanner = function() {
        if ("blank" == GameSys_1.channel) return;
        this.sdk.xSet("createBanner");
      };
      GameSys.hideBanner = function() {
        if ("blank" == GameSys_1.channel) return;
        "oppo" != this.channel && this.sdk.xSet("hideBanner");
      };
      GameSys.watchVideo = function(pos, success) {
        return __awaiter(this, void 0, void 0, function() {
          var res;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if ("blank" == GameSys_1.channel) {
                success();
                return [ 2 ];
              }
              return [ 4, GameSys_1.sdk.watchVideo() ];

             case 1:
              res = _a.sent();
              if (res) {
                success();
                "tt" == this.channel && (1 == pos ? this.statistical("video", "1\u63d0\u793a\u89c6\u9891\u6210\u529f", pos) : this.statistical("video", "1\u89c2\u770b\u89c6\u9891\u6210\u529f", pos));
              } else {
                this.fail();
                "tt" == this.channel && (1 == pos ? this.statistical("video", "1\u63d0\u793a\u89c6\u9891\u5931\u8d25", -pos) : this.statistical("video", "1\u89c2\u770b\u89c6\u9891\u5931\u8d25", -pos));
              }
              return [ 2 ];
            }
          });
        });
      };
      GameSys.fail = function() {
        this.game.xSet(Config_1.Config.TIP, Config_1.TipLab.not_reward);
      };
      GameSys.startRec = function() {
        "tt" == this.channel && this.sdk.xSet("startRec");
      };
      GameSys.stopRec = function() {
        "tt" == this.channel && this.sdk.xSet("stopRec");
      };
      GameSys.statistical = function(v, _message, _pos) {
        "tt" == this.channel && tt.reportAnalytics(v, {
          value: _message,
          pos: _pos
        });
      };
      GameSys.checkOnTarget = function(location) {
        var point = location;
      };
      var GameSys_1;
      GameSys.share = false;
      GameSys.hint = 0;
      GameSys.answer = 0;
      GameSys.imageUrl = "http://123.56.5.6/static/game/lhmsShare.jpg";
      GameSys.game = null;
      GameSys.audio = null;
      GameSys.sdk = null;
      GameSys.http = null;
      GameSys.level = 0;
      GameSys.channel = "oppo";
      GameSys = GameSys_1 = __decorate([ ccclass ], GameSys);
      return GameSys;
    }(cc.Component);
    exports.default = GameSys;
    cc._RF.pop();
  }, {
    "../component/Audio": "Audio",
    "../net/Http": "Http",
    "../sdk/BDApi": "BDApi",
    "../sdk/OPPOApi": "OPPOApi",
    "../sdk/SDK": "SDK",
    "../sdk/TTApi": "TTApi",
    "../sdk/VivoApi": "VivoApi",
    "./Config": "Config",
    "./DataManager": "DataManager",
    "./Game": "Game"
  } ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "76800fBHONKUrv7msjQ0xjq", "Game");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Props_1 = require("../kernels/Props");
    var Caches_1 = require("./Caches");
    var Config_1 = require("./Config");
    var UtilsManager_1 = require("./UtilsManager");
    var BINDER_NAME = "labyrinth";
    var Game = function(_super) {
      __extends(Game, _super);
      function Game() {
        var _this = _super.call(this) || this;
        _this.bind_Event();
        _this.bind_level();
        _this.bind_gold();
        _this.bind_lock();
        _this.bind_signIn();
        _this.bind_recruit();
        _this.bind_buildings();
        _this.bind_shop();
        _this.bind_warehouse();
        _this.bind_appearance();
        _this.bind_goldOffline();
        return _this;
      }
      Game.prototype.bind_Event = function() {
        for (var i = 0; i < Object.keys(Config_1.Config).length; i++) this.xSet(Config_1.Config[Object.keys(Config_1.Config)[i]], null, null);
      };
      Game.prototype.bind_lock = function() {
        var lock = Caches_1.default.get(Caches_1.default.lock);
        if (!lock) {
          var model = new Array(10);
          for (var i = 0; i < model.length; i++) model[i] = false;
          model[0] = true;
          model[1] = true;
          lock = UtilsManager_1.default.clone(model);
          Caches_1.default.set(Caches_1.default.lock, lock);
        }
        this.xSet(Config_1.Config.LOCKROOM, lock);
        this.xBind(Config_1.Config.LOCKROOMCHANGE, this.change_lock.bind(this), BINDER_NAME);
      };
      Game.prototype.change_lock = function(_data) {
        var lock = this.xGet(Config_1.Config.LOCKROOM);
        lock[_data.index] = _data.state;
        Caches_1.default.set(Caches_1.default.lock, lock);
      };
      Game.prototype.bind_level = function() {
        var level = Caches_1.default.get(Caches_1.default.level);
        if (!level && "number" !== typeof level) {
          level = 0;
          Caches_1.default.set(Caches_1.default.level, level);
        }
        this.xSet(Config_1.Config.LEVEL, level);
        this.xBind(Config_1.Config.LEVEL, this.change_level.bind(this), BINDER_NAME);
      };
      Game.prototype.change_level = function(_data) {
        _data > Caches_1.default.get(Caches_1.default.level) && Caches_1.default.set(Caches_1.default.level, _data);
      };
      Game.prototype.bind_gold = function() {
        var gold = Caches_1.default.get(Caches_1.default.gold);
        if (!gold && "number" != typeof gold) {
          gold = 10;
          Caches_1.default.set(Caches_1.default.gold, gold);
        }
        this.xSet(Config_1.Config.GOLD, {
          v: gold,
          index: 0
        });
        this.xBind(Config_1.Config.GOLD, this.change_gold.bind(this), BINDER_NAME);
      };
      Game.prototype.change_gold = function(_data) {
        Caches_1.default.set(Caches_1.default.gold, _data.v);
      };
      Game.prototype.bind_goldOffline = function() {
        var goldoffline = Caches_1.default.get(Caches_1.default.goldOffline);
        if (!goldoffline) {
          goldoffline = [ 0, 0, 1 ];
          Caches_1.default.set(Caches_1.default.goldOffline, goldoffline);
        }
        this.xSet(Config_1.Config.GOLDOFFLINE, goldoffline);
        this.xBind(Config_1.Config.GOLDOFFLINECHANGE, this.change_goldOffline.bind(this), BINDER_NAME);
      };
      Game.prototype.change_goldOffline = function(_data) {
        _data.state = parseInt(_data.state.toFixed(0));
        var goldOffline = this.xGet(Config_1.Config.GOLDOFFLINE);
        goldOffline[_data.index] = _data.state;
        Caches_1.default.set(Caches_1.default.goldOffline, goldOffline);
      };
      Game.prototype.bind_signIn = function() {
        var signInState = Caches_1.default.get(Caches_1.default.signInState);
        if (!signInState) {
          var model = new Array(7);
          for (var i = 0; i < model.length; i++) model[i] = 0;
          model[0] = 1;
          signInState = UtilsManager_1.default.clone(model);
          Caches_1.default.set(Caches_1.default.signInState, signInState);
        }
        this.xSet(Config_1.Config.SIGNIN, signInState);
        this.xBind(Config_1.Config.SIGNINCHANGE, this.change_signInState.bind(this), BINDER_NAME);
      };
      Game.prototype.change_signInState = function(_data) {
        var signInState = this.xGet(Config_1.Config.SIGNIN);
        if (7 == _data.index) {
          for (var i = 0; i < signInState.length; i++) signInState[i] = _data.state;
          signInState[0] = 1;
        } else signInState[_data.index] = _data.state;
        Caches_1.default.set(Caches_1.default.signInState, signInState);
      };
      Game.prototype.bind_recruit = function() {
        var recruitState = Caches_1.default.get(Caches_1.default.recruit);
        if (!recruitState) {
          var model = new Array(20);
          for (var i = 0; i < model.length; i++) model[i] = 0;
          recruitState = UtilsManager_1.default.clone(model);
          Caches_1.default.set(Caches_1.default.recruit, recruitState);
        }
        this.xSet(Config_1.Config.RECRUIT, recruitState);
        this.xBind(Config_1.Config.RECRUITCHANGE, this.change_recruitState.bind(this), BINDER_NAME);
      };
      Game.prototype.change_recruitState = function(_data) {
        var recruitState = this.xGet(Config_1.Config.RECRUIT);
        recruitState[_data.index] = _data.state;
        Caches_1.default.set(Caches_1.default.recruit, recruitState);
      };
      Game.prototype.bind_buildings = function() {
        var buildingsState = Caches_1.default.get(Caches_1.default.buildings);
        if (!buildingsState) {
          var model = [];
          for (var i = 0; i < 12; i++) model.push({
            index: i,
            dirty: 0,
            level: 0,
            upgrade: 0
          });
          model[0].level = 1;
          model[3].level = 1;
          buildingsState = UtilsManager_1.default.clone(model);
          Caches_1.default.set(Caches_1.default.buildings, buildingsState);
        }
        this.xSet(Config_1.Config.BUILDINGS, buildingsState);
        this.xBind(Config_1.Config.BUILDINGSCHANGE, this.change_buildings.bind(this), BINDER_NAME);
      };
      Game.prototype.change_buildings = function(_data) {
        var buildingsState = this.xGet(Config_1.Config.BUILDINGS);
        buildingsState[_data.index].dirty = _data.dirty;
        buildingsState[_data.index].level = _data.level;
        buildingsState[_data.index].upgrade = _data.upgrade;
        Caches_1.default.set(Caches_1.default.buildings, buildingsState);
      };
      Game.prototype.bind_shop = function() {
        var shopState = Caches_1.default.get(Caches_1.default.shop);
        if (!shopState) {
          var model = [];
          for (var i = 0; i < 50; i++) model.push({
            ID: i,
            count: 0
          });
          model[0].count = 5;
          model[1].count = 5;
          model[2].count = 5;
          shopState = UtilsManager_1.default.clone(model);
          Caches_1.default.set(Caches_1.default.shop, shopState);
        }
        this.xSet(Config_1.Config.SHOP, shopState);
        this.xBind(Config_1.Config.SHOPCHANGE, this.change_Shop.bind(this), BINDER_NAME);
      };
      Game.prototype.change_Shop = function(_data) {
        var shopState = this.xGet(Config_1.Config.SHOP);
        shopState[_data.ID].count = _data.count;
        Caches_1.default.set(Caches_1.default.shop, shopState);
      };
      Game.prototype.bind_warehouse = function() {
        var warehouseState = Caches_1.default.get(Caches_1.default.warehouse);
        if (!warehouseState) {
          var model = [];
          warehouseState = UtilsManager_1.default.clone(model);
          Caches_1.default.set(Caches_1.default.warehouse, warehouseState);
        }
        this.xSet(Config_1.Config.WAREHOUSE, warehouseState);
        this.xBind(Config_1.Config.WAREHOUSECHNAGE, this.change_warehouse.bind(this), BINDER_NAME);
      };
      Game.prototype.change_warehouse = function(ID) {
        var warehouseState = this.xGet(Config_1.Config.WAREHOUSE);
        console.log("\u4ed3\u5e93", warehouseState, ID);
        warehouseState.push(ID);
        Caches_1.default.set(Caches_1.default.warehouse, warehouseState);
      };
      Game.prototype.bind_appearance = function() {
        var appearanceState = Caches_1.default.get(Caches_1.default.appearance);
        if (!appearanceState) {
          var model = [];
          for (var i = 0; i < 100; i++) model.push({
            index: 0,
            geta: false,
            gets: false
          });
          appearanceState = UtilsManager_1.default.clone(model);
          Caches_1.default.set(Caches_1.default.appearance, appearanceState);
        }
        this.xSet(Config_1.Config.APPEARANCE, appearanceState);
        this.xBind(Config_1.Config.APPEARANCECHANGE, this.change_appearance.bind(this), BINDER_NAME);
      };
      Game.prototype.change_appearance = function(data) {
        var appearanceState = this.xGet(Config_1.Config.APPEARANCE);
        appearanceState[data.index].geta = data.geta;
        appearanceState[data.index].gets = data.gets;
        appearanceState[data.index].index = data.state;
        Caches_1.default.set(Caches_1.default.appearance, appearanceState);
      };
      return Game;
    }(Props_1.default);
    exports.default = Game;
    cc._RF.pop();
  }, {
    "../kernels/Props": "Props",
    "./Caches": "Caches",
    "./Config": "Config",
    "./UtilsManager": "UtilsManager"
  } ],
  Garbage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bdcd3lER/dBxq6MitFaLkAF", "Garbage");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var DataManager_1 = require("../common/manager/DataManager");
    var GameSys_1 = require("../common/manager/GameSys");
    var StaticManager_1 = require("../common/manager/StaticManager");
    var UtilsManager_1 = require("../common/manager/UtilsManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var CALC_RECT_WIDTH = 40;
    var CLEAR_LINE_WIDTH = 40;
    var Garbage_Smear = function(_super) {
      __extends(Garbage_Smear, _super);
      function Garbage_Smear() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.spr = null;
        _this.maskNode = null;
        _this.ticketNode = null;
        _this.opacity = 0;
        _this.binder_name = "";
        _this.calcDebugger = false;
        _this.tempDrawPoints = [];
        _this.polygonPointsList = [];
        return _this;
      }
      Garbage_Smear.prototype.changeGarbageNode = function(index) {
        if (3 == index) return;
        if (-1 == index) return;
        var num;
        if (0 == index) {
          num = DataManager_1.default.getInstance().cleanGarbageInfo.transparency1;
          console.log("\u67e5\u770b", DataManager_1.default.getInstance().cleanGarbageInfo);
          this.node.opacity = this.node.opacity - 255 * num;
          this.opacity = this.node.opacity;
        } else if (1 == index) {
          num = DataManager_1.default.getInstance().cleanGarbageInfo.transparency2;
          this.node.opacity = this.node.opacity - 255 * num;
          this.opacity = this.node.opacity;
        } else if (2 == index) {
          DataManager_1.default.getInstance().garbageItem.on(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this);
          DataManager_1.default.getInstance().garbageItem.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
          DataManager_1.default.getInstance().garbageItem.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, this);
          DataManager_1.default.getInstance().garbageItem.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this);
        }
      };
      Garbage_Smear.prototype.init = function(_path, index, binder) {
        return __awaiter(this, void 0, void 0, function() {
          var _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              this.binder_name = binder;
              this.redIndex = index;
              _a = this.spr;
              return [ 4, UtilsManager_1.default.loadImage("garbage/" + _path) ];

             case 1:
              _a.spriteFrame = _b.sent();
              this.node.setContentSize(this.spr.node.getContentSize());
              return [ 2 ];
            }
          });
        });
      };
      Garbage_Smear.prototype.onLoad = function() {
        this.reset();
      };
      Garbage_Smear.prototype.onEnable = function() {
        this.node.opacity = 255;
        GameSys_1.default.game.xBind(Config_1.Config.GARBAGEOPACITY, this.changeGarbageNode.bind(this), this.binder_name);
      };
      Garbage_Smear.prototype.change_active = function(data) {
        data.index == this.redIndex && (this.node.active = data.show);
      };
      Garbage_Smear.prototype.beforeDestroy = function() {
        this.ticketNode.off(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this);
        this.ticketNode.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
        this.ticketNode.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, this);
        this.ticketNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this);
      };
      Garbage_Smear.prototype.touchStartEvent = function(event) {
        var point = this.ticketNode.convertToNodeSpaceAR(event.getLocation());
        this.clearMask(point);
        this.node.opacity = this.opacity;
      };
      Garbage_Smear.prototype.touchMoveEvent = function(event) {
        var point = this.ticketNode.convertToNodeSpaceAR(event.getLocation());
        this.clearMask(point);
        this.node.opacity = this.opacity;
      };
      Garbage_Smear.prototype.touchEndEvent = function() {
        this.tempDrawPoints = [];
        this.calcProgress();
        this.node.opacity = this.opacity;
      };
      Garbage_Smear.prototype.calcProgress = function() {
        var _this = this;
        var hitItemCount = 0;
        var ctx = this.ticketNode.getComponent(cc.Graphics);
        this.polygonPointsList.forEach(function(item) {
          if (!item.isHit) return;
          hitItemCount += 1;
          if (!_this.calcDebugger) return;
          ctx.rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
          ctx.fillColor = cc.color(216, 18, 18, 255);
          ctx.fill();
        });
        var per = Math.ceil(hitItemCount / this.polygonPointsList.length * 100);
        console.log("\u5df2\u7ecf\u522e\u5f00\u4e86 " + Math.ceil(hitItemCount / this.polygonPointsList.length * 100) + "%");
        if (per >= 40) {
          GameSys_1.default.game.xSet(Config_1.Config.GARBAGEOPACITY, 3);
          Caches_1.default.get(Caches_1.default.newGuide) || 26 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 27);
          GameSys_1.default.audio.playSFX("audios/gold");
          StaticManager_1.default.getInstance().falllings[this.redIndex][1] = 0;
          GameSys_1.default.game.xSet(Config_1.Config.FALLINGRED, this.redIndex);
          this.node.destroy();
          this.redIndex < 3 ? GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u6d17\u624b\u95f4\u7115\u7136\u4e00\u65b0") : GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u536b\u751f\u95f4\u7115\u7136\u4e00\u65b0");
          var buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
          GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSCHANGE, {
            index: this.redIndex,
            level: buildings[this.redIndex].level,
            dirty: 0,
            upgrade: buildings[this.redIndex].upgrade
          });
          if (DataManager_1.default.getInstance().getClean(this.redIndex)) {
            StaticManager_1.default.getInstance().use_buildings[this.redIndex] = false;
            DataManager_1.default.getInstance().setClean(this.redIndex, false);
            0 == Math.floor(this.redIndex / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVELOO, 0) : 1 == Math.floor(this.redIndex / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETONE, 1) : 2 == Math.floor(this.redIndex / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETTWO, 2) : 3 == Math.floor(this.redIndex / 3) && GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETTHERE, 3);
          }
          DataManager_1.default.getInstance().cleanGarbageInfo = null;
          DataManager_1.default.getInstance().garbageItem = null;
        }
      };
      Garbage_Smear.prototype.cleanOver = function() {
        if (this.node.opacity <= 10) {
          Caches_1.default.get(Caches_1.default.newGuide) || 21 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 22);
          GameSys_1.default.audio.playSFX("audios/gold");
          StaticManager_1.default.getInstance().falllings[this.redIndex][1] = 0;
          GameSys_1.default.game.xSet(Config_1.Config.FALLINGRED, this.redIndex);
          DataManager_1.default.getInstance().cleanGarbageInfo = null;
          this.node.destroy();
          this.redIndex < 3 ? GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u6d17\u624b\u95f4\u7115\u7136\u4e00\u65b0") : GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u536b\u751f\u95f4\u7115\u7136\u4e00\u65b0");
          var buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
          GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSCHANGE, {
            index: this.redIndex,
            level: buildings[this.redIndex].level,
            dirty: 0,
            upgrade: buildings[this.redIndex].upgrade
          });
          if (DataManager_1.default.getInstance().getClean(this.redIndex)) {
            StaticManager_1.default.getInstance().use_buildings[this.redIndex] = false;
            DataManager_1.default.getInstance().setClean(this.redIndex, false);
            0 == Math.floor(this.redIndex / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVELOO, 0) : 1 == Math.floor(this.redIndex / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETONE, 1) : 2 == Math.floor(this.redIndex / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETTWO, 2) : 3 == Math.floor(this.redIndex / 3) && GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETTHERE, 3);
          }
        }
      };
      Garbage_Smear.prototype.clearMask = function(pos) {
        var mask = this.maskNode.getComponent(cc.Mask);
        var stencil = mask._graphics;
        var len = this.tempDrawPoints.length;
        this.tempDrawPoints.push(pos);
        if (len <= 1) {
          stencil.circle(pos.x, pos.y, CLEAR_LINE_WIDTH / 2);
          stencil.fill();
          this.polygonPointsList.forEach(function(item) {
            if (item.isHit) return;
            var xFlag = pos.x > item.rect.x && pos.x < item.rect.x + item.rect.width;
            var yFlag = pos.y > item.rect.y && pos.y < item.rect.y + item.rect.height;
            xFlag && yFlag && (item.isHit = true);
          });
        } else {
          var prevPos_1 = this.tempDrawPoints[len - 2];
          var curPos_1 = this.tempDrawPoints[len - 1];
          stencil.moveTo(prevPos_1.x, prevPos_1.y);
          stencil.lineTo(curPos_1.x, curPos_1.y);
          stencil.lineWidth = CLEAR_LINE_WIDTH;
          stencil.lineCap = cc.Graphics.LineCap.ROUND;
          stencil.lineJoin = cc.Graphics.LineJoin.ROUND;
          stencil.strokeColor = cc.color(255, 255, 255, 255);
          stencil.stroke();
          this.polygonPointsList.forEach(function(item) {
            item.isHit = item.isHit || cc.Intersection.lineRect(prevPos_1, curPos_1, item.rect);
          });
        }
      };
      Garbage_Smear.prototype.reset = function() {
        this.node.opacity = 255;
        var mask = this.maskNode.getComponent(cc.Mask);
        mask._graphics.clear();
        this.tempDrawPoints = [];
        this.polygonPointsList = [];
        this.ticketNode.getComponent(cc.Graphics).clear();
        for (var x = 0; x < this.ticketNode.width; x += CALC_RECT_WIDTH) for (var y = 0; y < this.ticketNode.height; y += CALC_RECT_WIDTH) this.polygonPointsList.push({
          rect: cc.rect(x - this.ticketNode.width / 2, y - this.ticketNode.height / 2, CALC_RECT_WIDTH, CALC_RECT_WIDTH),
          isHit: false
        });
      };
      Garbage_Smear.prototype.onDisable = function() {
        this.reset();
        GameSys_1.default.game.xUnbind(this.binder_name);
      };
      Garbage_Smear.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(this.binder_name);
      };
      __decorate([ property(cc.Sprite) ], Garbage_Smear.prototype, "spr", void 0);
      __decorate([ property(cc.Node) ], Garbage_Smear.prototype, "maskNode", void 0);
      __decorate([ property(cc.Node) ], Garbage_Smear.prototype, "ticketNode", void 0);
      Garbage_Smear = __decorate([ ccclass ], Garbage_Smear);
      return Garbage_Smear;
    }(cc.Component);
    exports.default = Garbage_Smear;
    cc._RF.pop();
  }, {
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/DataManager": "DataManager",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/StaticManager": "StaticManager",
    "../common/manager/UtilsManager": "UtilsManager"
  } ],
  GaussianBlur: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f550cOVCwBCkIweEVb2yV8C", "GaussianBlur");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EditorAsset_1 = require("../../manager/EditorAsset");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent, executeInEditMode = _a.executeInEditMode, disallowMultiple = _a.disallowMultiple, executionOrder = _a.executionOrder;
    var GaussianBlur = function(_super) {
      __extends(GaussianBlur, _super);
      function GaussianBlur() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._effect = null;
        _this._radius = 10;
        _this.sprite = null;
        _this.material = null;
        return _this;
      }
      Object.defineProperty(GaussianBlur.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        set: function(value) {
          this._effect = value;
          this.init();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(GaussianBlur.prototype, "radius", {
        get: function() {
          return this._radius;
        },
        set: function(value) {
          this._radius = value > 50 ? 50 : value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      GaussianBlur.prototype.onLoad = function() {
        this.init();
      };
      GaussianBlur.prototype.resetInEditor = function() {
        this.init();
      };
      GaussianBlur.prototype.init = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              true;
              return [ 3, 2 ];

             case 1:
              _a.sent();
              _a.label = 2;

             case 2:
              if (!this._effect) return [ 2 ];
              this.sprite = this.node.getComponent(cc.Sprite);
              this.sprite.spriteFrame && (this.sprite.spriteFrame.getTexture().packable = false);
              this.material = cc.Material.create(this._effect);
              this.sprite.setMaterial(0, this.material);
              this.updateProperties();
              return [ 2 ];
            }
          });
        });
      };
      GaussianBlur.prototype.updateProperties = function() {
        this.material.setProperty("size", this.getNodeSize());
        this.material.setProperty("radius", this.radius);
      };
      GaussianBlur.prototype.getNodeSize = function() {
        return cc.v2(this.node.width, this.node.height);
      };
      __decorate([ property ], GaussianBlur.prototype, "_effect", void 0);
      __decorate([ property({
        type: cc.EffectAsset,
        tooltip: false,
        readonly: true
      }) ], GaussianBlur.prototype, "effect", null);
      __decorate([ property ], GaussianBlur.prototype, "_radius", void 0);
      __decorate([ property({
        tooltip: false
      }) ], GaussianBlur.prototype, "radius", null);
      GaussianBlur = __decorate([ ccclass, requireComponent(cc.Sprite), executeInEditMode, disallowMultiple, executionOrder(-100) ], GaussianBlur);
      return GaussianBlur;
    }(cc.Component);
    exports.default = GaussianBlur;
    cc._RF.pop();
  }, {
    "../../manager/EditorAsset": "EditorAsset"
  } ],
  GoldAnim: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7f7fdYLEb1MzoVb4doSevoa", "GoldAnim");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var MathManager_1 = require("../common/manager/MathManager");
    var PoolManager_1 = require("../common/manager/PoolManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GoldAnim = function(_super) {
      __extends(GoldAnim, _super);
      function GoldAnim() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.touch = false;
        return _this;
      }
      GoldAnim.prototype.init = function(v, bindername, click) {
        var _this = this;
        this.node.resumeAllActions();
        var xran = MathManager_1.default.getInstance().randomNum(-60, 60);
        var yran = MathManager_1.default.getInstance().randomNum(-10, 0);
        var tran = MathManager_1.default.getInstance().randomNum(2, 6);
        var hran = MathManager_1.default.getInstance().randomNum(50, 100);
        var action1 = cc.jumpBy(.1 * tran, cc.v2(xran, yran), hran, 1);
        var action2 = cc.delayTime(1);
        var action4 = cc.scaleTo(.5, .95);
        var action5 = cc.scaleTo(.5, 1);
        var action = cc.sequence(action4, action5).repeatForever();
        var time = 0;
        time = click ? 5 : 9;
        var action3 = cc.callFunc(function() {
          _this.node.runAction(action);
          _this.scheduleOnce(function() {
            _this.onTouchEnd();
          }, time);
        }, this, 10);
        var actionlist = cc.sequence(action1, action2, action3);
        this.node.runAction(actionlist);
        this.price = v;
        this.bindername = bindername;
        GameSys_1.default.game.xGet(Config_1.Config.HIDEALL) && (this.node.opacity = 0);
        GameSys_1.default.game.xBind(Config_1.Config.HIDEALL, this.hideAll.bind(this), this.bindername);
      };
      GoldAnim.prototype.hideAll = function(v) {
        this.node.opacity = v ? 0 : 255;
      };
      GoldAnim.prototype.onLoad = function() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
      };
      GoldAnim.prototype.onTouchEnd = function() {
        var _this = this;
        if (this.touch) return;
        this.node.stopAllActions();
        this.node.scale = 1;
        this.unscheduleAllCallbacks();
        this.touch = true;
        var canvas = cc.find("Canvas");
        var pos = canvas.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
        this.node.parent = canvas;
        this.node.setPosition(pos);
        this.node.zIndex = 0;
        cc.tween(this.node).to(2, {
          x: GameSys_1.default.game.xGet(Config_1.Config.GOLDPOS).x,
          y: GameSys_1.default.game.xGet(Config_1.Config.GOLDPOS).y
        }, {
          easing: "backInOut"
        }).call(function() {
          GameSys_1.default.gold(_this.price);
          _this.node.stopAllActions();
          _this.node.scale = 1;
          _this.price = 0;
          _this.node.opacity = 255;
          _this.touch = false;
          GameSys_1.default.game.xUnbind(_this.bindername);
          PoolManager_1.default.getInstance().clearGoldList(_this.node);
        }).start();
      };
      GoldAnim.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(this.bindername);
      };
      GoldAnim = __decorate([ ccclass ], GoldAnim);
      return GoldAnim;
    }(cc.Component);
    exports.default = GoldAnim;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/MathManager": "MathManager",
    "../common/manager/PoolManager": "PoolManager"
  } ],
  Gold: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73ebbtnlgNNpLrP4miCUJXT", "Gold");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../manager/Config");
    var GameSys_1 = require("../manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "lab_gold";
    var Gold = function(_super) {
      __extends(Gold, _super);
      function Gold() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.reduce = null;
        _this.goldPos = null;
        _this.label = null;
        return _this;
      }
      Gold.prototype.onLoad = function() {
        this.label.string = GameSys_1.default.game.xGet(Config_1.Config.GOLD).v.toString();
        GameSys_1.default.game.xBind(Config_1.Config.GOLD, this.goldChange.bind(this), BINDER_NAME);
        var canvas = cc.find("Canvas");
        GameSys_1.default.game.xSet(Config_1.Config.GOLDPOS, canvas.convertToNodeSpaceAR(this.goldPos.convertToWorldSpaceAR(cc.v3(0, 0, 0))));
      };
      Gold.prototype.goldChange = function(_data) {
        console.log("\u91d1\u5e01", _data.index);
        if (_data.index > 0) {
          var reduce = cc.instantiate(this.reduce);
          reduce.children[0].getComponent(cc.Label).string = "+" + _data.index;
          this.node.addChild(reduce);
          cc.tween(reduce).to(1, {
            y: reduce.y + 60,
            opacity: 255
          }).to(0, {
            y: reduce.y - 60,
            opacity: 0
          }).start();
        } else {
          var reduce_1 = cc.instantiate(this.reduce);
          this.node.addChild(reduce_1);
          reduce_1.children[0].getComponent(cc.Label).string = "" + _data.index;
          cc.tween(reduce_1).to(1, {
            y: reduce_1.y - 60,
            opacity: 255
          }).to(0, {
            y: reduce_1.y + 60,
            opacity: 0
          }).call(function() {
            reduce_1.destroy();
          }).start();
        }
        this.label.string = _data.v.toString();
      };
      Gold.prototype.onTouchGoldPanel = function() {};
      Gold.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Prefab) ], Gold.prototype, "reduce", void 0);
      __decorate([ property(cc.Node) ], Gold.prototype, "goldPos", void 0);
      __decorate([ property(cc.Label) ], Gold.prototype, "label", void 0);
      Gold = __decorate([ ccclass ], Gold);
      return Gold;
    }(cc.Component);
    exports.default = Gold;
    cc._RF.pop();
  }, {
    "../manager/Config": "Config",
    "../manager/GameSys": "GameSys"
  } ],
  HeadInfo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "798adszBydB6qvAS5G/kr38", "HeadInfo");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var PopupManager_1 = require("../common/manager/PopupManager");
    var StaticManager_1 = require("../common/manager/StaticManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "HeadInfo";
    var HeadInfo = function(_super) {
      __extends(HeadInfo, _super);
      function HeadInfo() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.goldAnim = null;
        _this.goldPar = null;
        _this.experience = null;
        _this.lvl_lab = null;
        _this.gold_lab = null;
        _this.gold_pos = null;
        _this.progress = null;
        _this.appearance = [];
        _this.show = false;
        return _this;
      }
      HeadInfo.prototype.onEnable = function() {
        this.lvl_lab.string = "LV:" + GameSys_1.default.level.toString();
        var canvas = cc.find("Canvas");
        GameSys_1.default.game.xSet(Config_1.Config.GOLDPOS, canvas.convertToNodeSpaceAR(this.gold_pos.convertToWorldSpaceAR(cc.v3(0, 0, 0))));
        GameSys_1.default.game.xBind(Config_1.Config.GOLD, this.change_lvl.bind(this), BINDER_NAME);
        this.gold_lab.string = GameSys_1.default.game.xGet(Config_1.Config.GOLD).v.toFixed(0).toString();
        this.progress.progress = GameSys_1.default.game.xGet(Config_1.Config.GOLD).v / Config_1.LEVELLOCK[GameSys_1.default.level].gold;
      };
      HeadInfo.prototype.online = function() {};
      HeadInfo.prototype.offline = function() {};
      HeadInfo.prototype.change_lvl = function(_data) {
        var _this = this;
        this.gold_lab.string = "";
        this.gold_lab.string = _data.v.toFixed(0).toString();
        this.appearance = GameSys_1.default.game.xGet(Config_1.Config.APPEARANCE);
        if (_data.index > 0) {
          GameSys_1.default.game.xSet(Config_1.Config.ALLRED);
          this.informApp(_data.v);
          var cb_1 = function() {
            GameSys_1.default.level < 39 && (_this.progress.progress = _data.v / Config_1.LEVELLOCK[GameSys_1.default.level].gold);
            var goldAnim = cc.instantiate(_this.goldAnim);
            _this.goldPar.addChild(goldAnim);
            goldAnim.y = 37;
            goldAnim.children[0].getComponent(cc.Label).string = "+" + _data.index.toFixed(0);
            cc.tween(goldAnim).to(1, {
              y: goldAnim.y + 100,
              opacity: 100
            }).call(function() {
              goldAnim.destroy();
            }).start();
            _this.informwarhouse(_data.v);
            if (_data.v >= Config_1.LEVELLOCK[GameSys_1.default.level].gold) {
              GameSys_1.default.level++;
              GameSys_1.default.game.xSet(Config_1.Config.LEVEL, GameSys_1.default.level);
              GameSys_1.default.game.xSet(Config_1.Config.PROPADDS);
              _this.lvl_lab.string = "LV:" + GameSys_1.default.level.toString();
              var len = StaticManager_1.default.getInstance().open_buildings.length;
              for (var i = len; i < Config_1.LOCK_ROOM.length; i++) if (GameSys_1.default.level >= Config_1.LOCK_ROOM[i]) {
                StaticManager_1.default.getInstance().open_buildings.push(i);
                GameSys_1.default.game.xSet(Config_1.Config.LOCKROOMCHANGE, {
                  index: i,
                  state: true
                });
              }
              cb_1();
            }
          };
          cb_1();
        } else this.progress.progress = _data.v / Config_1.LEVELLOCK[GameSys_1.default.level].gold;
      };
      HeadInfo.prototype.onTouch = function() {
        var _this = this;
        if (this.show) return;
        this.show = true;
        this.experience.active = true;
        this.experience.children[2].getComponent(cc.Label).string = GameSys_1.default.game.xGet(Config_1.Config.GOLD).v.toFixed(0) + "/" + Config_1.LEVELLOCK[GameSys_1.default.level].gold.toFixed(0) + "(" + (GameSys_1.default.game.xGet(Config_1.Config.GOLD).v / Config_1.LEVELLOCK[GameSys_1.default.level].gold * 100).toFixed(0) + "%)";
        this.experience.children[0].width = this.experience.children[2].getComponent(cc.Label).string.length + 300;
        cc.tween(this.experience).delay(2).call(function() {
          _this.experience.active = false;
          _this.show = false;
        }).start();
      };
      HeadInfo.prototype.informApp = function(v) {
        var appSelect;
        var _loop_1 = function(i) {
          i < 6 ? appSelect = 0 : i < 11 ? appSelect = 1 : i < 16 ? appSelect = 4 : i < 19 ? appSelect = 5 : i < 24 ? appSelect = 2 : i < 28 ? appSelect = 3 : i < 31 ? appSelect = 6 : i < 34 && (appSelect = 7);
          if (v >= Config_1.APPEARANCE[i].gold_A && !this_1.appearance[i].geta) {
            GameSys_1.default.game.xSet(Config_1.Config.INFORM, {
              index: 1,
              v: "\u6709\u53ef\u89e3\u9501\u5916\u89c2",
              cb: function() {
                GameSys_1.default.game.xSet(Config_1.Config.HIDEALL, true);
                GameSys_1.default.game.xSet(Config_1.Config.APPITEM, {
                  index: i,
                  state: true
                });
                var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
                PopupManager_1.default.show(Config_1.PopupPath.buildings, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
                GameSys_1.default.game.xSet(Config_1.Config.HIDESHOP, false);
                GameSys_1.default.game.xSet(Config_1.Config.APPSELECT, appSelect);
                GameSys_1.default.game.xSet(Config_1.Config.MAGNIFY, {
                  index: appSelect,
                  state: true
                });
              }
            });
            return "break";
          }
          if (v >= Config_1.APPEARANCE[i].gold_S && !this_1.appearance[i].gets) {
            GameSys_1.default.game.xSet(Config_1.Config.INFORM, {
              index: 1,
              v: "\u6709\u53ef\u89e3\u9501\u5916\u89c2",
              cb: function() {
                GameSys_1.default.game.xSet(Config_1.Config.HIDEALL, true);
                GameSys_1.default.game.xSet(Config_1.Config.APPITEM, {
                  index: i,
                  state: true
                });
                var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
                PopupManager_1.default.show(Config_1.PopupPath.buildings, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
                GameSys_1.default.game.xSet(Config_1.Config.HIDESHOP, false);
                GameSys_1.default.game.xSet(Config_1.Config.APPSELECT, appSelect);
                GameSys_1.default.game.xSet(Config_1.Config.MAGNIFY, {
                  index: appSelect,
                  state: true
                });
              }
            });
            return "break";
          }
        };
        var this_1 = this;
        for (var i = 0; i < Config_1.APPEARANCE.length; i++) {
          var state_1 = _loop_1(i);
          if ("break" === state_1) break;
        }
      };
      HeadInfo.prototype.informwarhouse = function(v) {
        for (var i = 0; i < Config_1.WAREHOUSE.length; i++) if (GameSys_1.default.level > Config_1.WAREHOUSE[i].lock && v >= Config_1.WAREHOUSE[i].buy && -1 == GameSys_1.default.game.xGet(Config_1.Config.WAREHOUSE).indexOf(Config_1.WAREHOUSE[i].ID - 1)) {
          GameSys_1.default.game.xSet(Config_1.Config.INFORM, {
            index: 3,
            v: "\u6709\u65b0\u5de5\u5177\u89e3\u9501",
            cb: function() {
              var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
              PopupManager_1.default.show(Config_1.PopupPath.warehouse, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
            }
          });
          break;
        }
      };
      HeadInfo.prototype.informRecurit = function(v) {
        for (var i = 0; i < Config_1.RECRUIT.length; i++) if (v >= Config_1.RECRUIT[i].price && 0 == GameSys_1.default.game.xGet(Config_1.Config.RECRUIT)[i]) {
          GameSys_1.default.game.xSet(Config_1.Config.INFORM, {
            index: 4,
            v: "\u6709\u65b0\u5458\u5de5\u62db\u52df",
            cb: function() {
              var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
              PopupManager_1.default.show(Config_1.PopupPath.recruit, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
            }
          });
          break;
        }
      };
      HeadInfo.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Prefab) ], HeadInfo.prototype, "goldAnim", void 0);
      __decorate([ property(cc.Node) ], HeadInfo.prototype, "goldPar", void 0);
      __decorate([ property(cc.Node) ], HeadInfo.prototype, "experience", void 0);
      __decorate([ property({
        type: cc.Label,
        tooltip: false
      }) ], HeadInfo.prototype, "lvl_lab", void 0);
      __decorate([ property({
        type: cc.Label,
        tooltip: false
      }) ], HeadInfo.prototype, "gold_lab", void 0);
      __decorate([ property({
        type: cc.Node,
        tooltip: false
      }) ], HeadInfo.prototype, "gold_pos", void 0);
      __decorate([ property({
        type: cc.ProgressBar,
        tooltip: false
      }) ], HeadInfo.prototype, "progress", void 0);
      HeadInfo = __decorate([ ccclass ], HeadInfo);
      return HeadInfo;
    }(cc.Component);
    exports.default = HeadInfo;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/PopupManager": "PopupManager",
    "../common/manager/StaticManager": "StaticManager"
  } ],
  HollowOut: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3ea60f2V5RO+IB+WDgN5MHK", "HollowOut");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HollowOutShape = void 0;
    var EditorAsset_1 = require("../../manager/EditorAsset");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent, executeInEditMode = _a.executeInEditMode, disallowMultiple = _a.disallowMultiple, executionOrder = _a.executionOrder;
    var HollowOutShape;
    (function(HollowOutShape) {
      HollowOutShape[HollowOutShape["Rect"] = 1] = "Rect";
      HollowOutShape[HollowOutShape["Circle"] = 2] = "Circle";
    })(HollowOutShape = exports.HollowOutShape || (exports.HollowOutShape = {}));
    var HollowOut = function(_super) {
      __extends(HollowOut, _super);
      function HollowOut() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._effect = null;
        _this._shape = HollowOutShape.Rect;
        _this._center = cc.v2();
        _this._width = 300;
        _this._height = 300;
        _this._round = 1;
        _this._radius = 200;
        _this._feather = .5;
        _this.sprite = null;
        _this.material = null;
        _this.tweenRes = null;
        return _this;
      }
      Object.defineProperty(HollowOut.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        set: function(value) {
          this._effect = value;
          this.init();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "shape", {
        get: function() {
          return this._shape;
        },
        set: function(value) {
          this._shape = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "center", {
        get: function() {
          return this._center;
        },
        set: function(value) {
          this._center = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "width", {
        get: function() {
          return this._width;
        },
        set: function(value) {
          this._width = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "height", {
        get: function() {
          return this._height;
        },
        set: function(value) {
          this._height = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "round", {
        get: function() {
          return this._round;
        },
        set: function(value) {
          this._round = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "radius", {
        get: function() {
          return this._radius;
        },
        set: function(value) {
          this._radius = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "feather", {
        get: function() {
          return this._feather;
        },
        set: function(value) {
          this._feather = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      HollowOut.prototype.onLoad = function() {
        this.init();
      };
      HollowOut.prototype.resetInEditor = function() {
        this.init();
      };
      HollowOut.prototype.init = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              true;
              return [ 3, 2 ];

             case 1:
              _a.sent();
              _a.label = 2;

             case 2:
              if (!this._effect) return [ 2 ];
              this.sprite = this.node.getComponent(cc.Sprite);
              this.sprite.spriteFrame && (this.sprite.spriteFrame.getTexture().packable = false);
              this.material = cc.Material.create(this._effect);
              this.sprite.setMaterial(0, this.material);
              this.updateProperties();
              return [ 2 ];
            }
          });
        });
      };
      HollowOut.prototype.updateProperties = function() {
        switch (this._shape) {
         case HollowOutShape.Rect:
          this.rect(this._center, this._width, this._height, this._round, this._feather);
          break;

         case HollowOutShape.Circle:
          this.circle(this._center, this._radius, this._feather);
        }
      };
      HollowOut.prototype.rect = function(center, width, height, round, feather) {
        this._shape = HollowOutShape.Rect;
        null !== center && (this._center = center);
        null !== width && (this._width = width);
        null !== height && (this._height = height);
        if (null !== round) {
          this._round = round >= 0 ? round : 0;
          var min = Math.min(this._width / 2, this._height / 2);
          this._round = this._round <= min ? this._round : min;
        }
        if (null !== feather) {
          this._feather = feather >= 0 ? feather : 0;
          this._feather = this._feather <= this._round ? this._feather : this._round;
        }
        this.material.setProperty("size", this.getNodeSize());
        this.material.setProperty("center", this.getCenter(this._center));
        this.material.setProperty("width", this.getWidth(this._width));
        this.material.setProperty("height", this.getHeight(this._height));
        this.material.setProperty("round", this.getRound(this._round));
        this.material.setProperty("feather", this.getFeather(this._feather));
      };
      HollowOut.prototype.circle = function(center, radius, feather) {
        this._shape = HollowOutShape.Circle;
        null !== center && (this._center = center);
        null !== radius && (this._radius = radius);
        null !== feather && (this._feather = feather >= 0 ? feather : 0);
        this.material.setProperty("size", this.getNodeSize());
        this.material.setProperty("center", this.getCenter(this._center));
        this.material.setProperty("width", this.getWidth(2 * this._radius));
        this.material.setProperty("height", this.getHeight(2 * this._radius));
        this.material.setProperty("round", this.getRound(this._radius));
        this.material.setProperty("feather", this.getFeather(this._feather));
      };
      HollowOut.prototype.rectTo = function(time, center, width, height, round, feather) {
        var _this = this;
        void 0 === round && (round = 0);
        void 0 === feather && (feather = 0);
        return new Promise(function(res) {
          cc.Tween.stopAllByTarget(_this);
          _this.unscheduleAllCallbacks();
          _this.tweenRes && _this.tweenRes();
          _this.tweenRes = res;
          round > width / 2 && (round = width / 2);
          round > height / 2 && (round = height / 2);
          feather > round && (feather = round);
          _this._shape = HollowOutShape.Rect;
          cc.tween(_this).to(time, {
            center: center,
            width: width,
            height: height,
            round: round,
            feather: feather
          }).call(function() {
            _this.scheduleOnce(function() {
              if (_this.tweenRes) {
                _this.tweenRes();
                _this.tweenRes = null;
              }
            });
          }).start();
        });
      };
      HollowOut.prototype.circleTo = function(time, center, radius, feather) {
        var _this = this;
        void 0 === feather && (feather = 0);
        return new Promise(function(res) {
          cc.Tween.stopAllByTarget(_this);
          _this.unscheduleAllCallbacks();
          _this.tweenRes && _this.tweenRes();
          _this.tweenRes = res;
          _this._shape = HollowOutShape.Circle;
          cc.tween(_this).to(time, {
            center: center,
            radius: radius,
            feather: feather
          }).call(function() {
            _this.scheduleOnce(function() {
              if (_this.tweenRes) {
                _this.tweenRes();
                _this.tweenRes = null;
              }
            });
          }).start();
        });
      };
      HollowOut.prototype.reset = function() {
        this.rect(cc.v2(), 0, 0, 0, 0);
      };
      HollowOut.prototype.nodeSize = function() {
        this._radius = Math.sqrt(this.node.width * this.node.width + this.node.height * this.node.height) / 2;
        this.rect(this.node.getPosition(), this.node.width, this.node.height, 0, 0);
      };
      HollowOut.prototype.getCenter = function(center) {
        var x = (center.x + this.node.width / 2) / this.node.width;
        var y = (-center.y + this.node.height / 2) / this.node.height;
        return cc.v2(x, y);
      };
      HollowOut.prototype.getNodeSize = function() {
        return cc.v2(this.node.width, this.node.height);
      };
      HollowOut.prototype.getWidth = function(width) {
        return width / this.node.width;
      };
      HollowOut.prototype.getHeight = function(height) {
        return height / this.node.width;
      };
      HollowOut.prototype.getRound = function(round) {
        return round / this.node.width;
      };
      HollowOut.prototype.getFeather = function(feather) {
        return feather / this.node.width;
      };
      __decorate([ property ], HollowOut.prototype, "_effect", void 0);
      __decorate([ property({
        type: cc.EffectAsset,
        tooltip: false,
        readonly: true
      }) ], HollowOut.prototype, "effect", null);
      __decorate([ property ], HollowOut.prototype, "_shape", void 0);
      __decorate([ property({
        type: cc.Enum(HollowOutShape),
        tooltip: false
      }) ], HollowOut.prototype, "shape", null);
      __decorate([ property ], HollowOut.prototype, "_center", void 0);
      __decorate([ property({
        tooltip: false
      }) ], HollowOut.prototype, "center", null);
      __decorate([ property ], HollowOut.prototype, "_width", void 0);
      __decorate([ property({
        tooltip: false,
        visible: function() {
          return this.shape === HollowOutShape.Rect;
        }
      }) ], HollowOut.prototype, "width", null);
      __decorate([ property ], HollowOut.prototype, "_height", void 0);
      __decorate([ property({
        tooltip: false,
        visible: function() {
          return this.shape === HollowOutShape.Rect;
        }
      }) ], HollowOut.prototype, "height", null);
      __decorate([ property ], HollowOut.prototype, "_round", void 0);
      __decorate([ property({
        tooltip: false,
        visible: function() {
          return this.shape === HollowOutShape.Rect;
        }
      }) ], HollowOut.prototype, "round", null);
      __decorate([ property ], HollowOut.prototype, "_radius", void 0);
      __decorate([ property({
        tooltip: false,
        visible: function() {
          return this.shape === HollowOutShape.Circle;
        }
      }) ], HollowOut.prototype, "radius", null);
      __decorate([ property ], HollowOut.prototype, "_feather", void 0);
      __decorate([ property({
        tooltip: false,
        visible: function() {
          return this.shape === HollowOutShape.Circle || this.round > 0;
        }
      }) ], HollowOut.prototype, "feather", null);
      HollowOut = __decorate([ ccclass, requireComponent(cc.Sprite), executeInEditMode, disallowMultiple, executionOrder(-100) ], HollowOut);
      return HollowOut;
    }(cc.Component);
    exports.default = HollowOut;
    cc._RF.pop();
  }, {
    "../../manager/EditorAsset": "EditorAsset"
  } ],
  Http: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "06bdanoZT1D75qsRt3N7BdK", "Http");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Props_1 = require("../kernels/Props");
    var Log_1 = require("../manager/Log");
    var eCode_1 = require("./eCode");
    var Http = function(_super) {
      __extends(Http, _super);
      function Http() {
        var _this = _super.call(this) || this;
        _this.onlineAdress = "";
        _this.mId = 0;
        _this.timeOut = 5e3;
        _this.appVersion = "1.0.0";
        return _this;
      }
      Http.prototype.get = function(_url, _args) {
        var _this = this;
        return new Promise(function(resolve, reject) {
          if (_url.indexOf("http") >= 0) {
            reject(eCode_1.default.Error);
            return;
          }
          var str = "";
          for (var k in _args) {
            "" == str ? str = "?" : str += "&";
            Array.isArray(_args[k]) || "object" == typeof _args[k] ? str += k + "=" + JSON.stringify(_args[k]) : str += k + "=" + _args[k];
          }
          var url = _this.onlineAdress + _url + str;
          _this._request("GET", url, {}, function(res) {
            resolve(res);
          }, function(res) {
            reject(res);
          });
        });
      };
      Http.prototype.getTime = function(url, callBack, target) {
        console.log("HTTP GET:", url);
        var request = cc.loader.getXMLHttpRequest();
        request.timeout = 1e4;
        request.open("GET", url, true);
        request.addEventListener("error", onError);
        request.addEventListener("abort", onError);
        request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = function(res) {
          if (4 === request.readyState && request.status >= 200 && request.status < 400) {
            console.log("http res(" + request.responseText.length + "):" + request.responseText);
            try {
              onComplete(request.responseText);
            } catch (e) {
              console.error("err:" + e);
            }
          }
        };
        request.ontimeout = function(e) {
          null != callBack && callBack.call(target, {
            error: true
          });
          console.log(e, "\u8bf7\u6c42\u8d85\u65f6");
        };
        request.send(null);
        function onComplete(responseText) {
          var data = JSON.parse(responseText);
          var code = data["errcode"];
          code || null != callBack && callBack.call(target, data);
        }
        function onError(evt) {
          null != callBack && callBack.call(target, {
            error: true
          });
        }
      };
      Http.prototype.post = function(_url, _args) {
        var _this = this;
        return new Promise(function(resolve, reject) {
          if (_url.indexOf("http") >= 0) {
            reject(eCode_1.default.Error);
            return;
          }
          var url = _this.onlineAdress + _url;
          _this._request("POST", url, _args, function(res) {
            resolve(res);
          }, function(res) {
            reject(res);
          });
        });
      };
      Http.prototype._request = function(_op, _url, _data, _suc, _failed) {
        var errorback = function(code) {
          Log_1.default.error("error" + code);
          _failed(code);
        };
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.mId = ++this.mId;
        xhr.onerror = function() {
          xhr.abort();
          errorback(eCode_1.default.Error);
        };
        xhr.ontimeout = function() {
          xhr.abort();
          errorback(eCode_1.default.TimeOut);
        };
        xhr.onreadystatechange = function() {
          if (4 != xhr.readyState || 0 == xhr.status) return;
          if (xhr.status >= 200 && xhr.status < 300) {
            var ret = void 0;
            try {
              ret = JSON.parse(xhr.responseText);
            } catch (e) {
              errorback(eCode_1.default.BadJson);
              return;
            }
            "object" != typeof ret || "number" != typeof ret.code || "object" != typeof ret.data ? _suc(ret) : ret.code == eCode_1.default.Ok ? _suc(ret.data) : errorback(ret.code);
            return;
          }
          404 == xhr.status && errorback(eCode_1.default.NotFound);
        };
        xhr.open(_op, _url, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("Authorization", null);
        xhr.setRequestHeader("App-Version", this.appVersion);
        xhr.setRequestHeader("Repeated-Submission", new Date().getTime() + "");
        cc.sys.isNative && xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        xhr.timeout = this.timeOut;
        if ("POST" == _op) {
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(_data);
        } else xhr.send();
        Log_1.default.info("%s[%d]:%s", _op, xhr.mId, _url);
        return xhr;
      };
      Http = __decorate([ ccclass ], Http);
      return Http;
    }(Props_1.default);
    exports.default = Http;
    cc._RF.pop();
  }, {
    "../kernels/Props": "Props",
    "../manager/Log": "Log",
    "./eCode": "eCode"
  } ],
  InformPre: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3b438dkzJRHSaRjAmiLW6zp", "InformPre");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DataManager_1 = require("../common/manager/DataManager");
    var GameSys_1 = require("../common/manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "InformPre";
    var InformPre = function(_super) {
      __extends(InformPre, _super);
      function InformPre() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.anim_1 = null;
        _this.anim = null;
        _this.lab = null;
        _this.index = 0;
        return _this;
      }
      InformPre.prototype.init = function(index, v, cb) {
        this.lab.string = v;
        this.index = index;
        this.cb = cb;
        cc.tween(this.anim).to(1, {
          scale: 1.1
        }).to(1, {
          scale: 1
        }).union().repeatForever().start();
        cc.tween(this.lab.node).to(1, {
          scale: 1.1
        }).to(1, {
          scale: 1
        }).union().repeatForever().start();
        cc.tween(this.anim_1).to(.3, {
          angle: 5
        }).to(.2, {
          angle: 0
        }).to(.3, {
          angle: -5
        }).to(.2, {
          angle: 0
        }).delay(.2).union().repeatForever().start();
        this.index = index;
      };
      InformPre.prototype.onTouchIndex = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            this.cb();
            DataManager_1.default.getInstance().spliceInform(this.index);
            this.node.destroy();
            return [ 2 ];
          });
        });
      };
      InformPre.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Node) ], InformPre.prototype, "anim_1", void 0);
      __decorate([ property(cc.Node) ], InformPre.prototype, "anim", void 0);
      __decorate([ property(cc.Label) ], InformPre.prototype, "lab", void 0);
      InformPre = __decorate([ ccclass ], InformPre);
      return InformPre;
    }(cc.Component);
    exports.default = InformPre;
    cc._RF.pop();
  }, {
    "../common/manager/DataManager": "DataManager",
    "../common/manager/GameSys": "GameSys"
  } ],
  Inform: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "86c672oCglLQon81Tpot9Sm", "Inform");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var DataManager_1 = require("../common/manager/DataManager");
    var GameSys_1 = require("../common/manager/GameSys");
    var InformPre_1 = require("./InformPre");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Inform";
    var Inform = function(_super) {
      __extends(Inform, _super);
      function Inform() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.inform = null;
        return _this;
      }
      Inform.prototype.onLoad = function() {
        GameSys_1.default.game.xBind(Config_1.Config.INFORM, this.change.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.HIDEALL, this.hideAll.bind(this), BINDER_NAME);
      };
      Inform.prototype.hideAll = function(v) {
        this.node.opacity = v ? 0 : 255;
      };
      Inform.prototype.change = function(data) {
        if (!Caches_1.default.get(Caches_1.default.newGuide)) return;
        if (this.node.childrenCount >= 3) return;
        if (DataManager_1.default.getInstance().getInform(data.index)) return;
        var inform = cc.instantiate(this.inform);
        inform.parent = this.node;
        inform.getComponent(InformPre_1.default).init(data.index, data.v, data.cb);
      };
      Inform.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Prefab) ], Inform.prototype, "inform", void 0);
      Inform = __decorate([ ccclass ], Inform);
      return Inform;
    }(cc.Component);
    exports.default = Inform;
    cc._RF.pop();
  }, {
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/DataManager": "DataManager",
    "../common/manager/GameSys": "GameSys",
    "./InformPre": "InformPre"
  } ],
  IssueVideo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fd876ncrqxOJb6KPMqFbwfB", "IssueVideo");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSys_1 = require("../manager/GameSys");
    var Config_1 = require("../manager/Config");
    var PopupBase_1 = require("./popups/PopupBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var IssueVideo = function(_super) {
      __extends(IssueVideo, _super);
      function IssueVideo() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.close = null;
        _this.hasReleased = false;
        return _this;
      }
      IssueVideo.prototype.onEnable = function() {
        this.hasReleased = false;
        GameSys_1.default.showBanner();
        cc.tween(this.close).to(.3, {
          scale: 1.2
        }).delay(.1).to(.3, {
          scale: 1
        }).delay(.1).union().repeatForever().start();
        this.node.zIndex = 300;
      };
      IssueVideo.prototype.onTouch = function() {
        return __awaiter(this, void 0, void 0, function() {
          var res;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (this.hasReleased) {
                GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u5f53\u524d\u89c6\u9891\u5df2\u53d1\u5e03");
                return [ 2 ];
              }
              return [ 4, GameSys_1.default.sdk.issueVideo() ];

             case 1:
              res = _a.sent();
              if (res) {
                this.hasReleased = true;
                GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u4f20\u9001\u6210\u529f");
              } else GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u4f20\u9001\u5931\u8d25");
              return [ 2 ];
            }
          });
        });
      };
      IssueVideo.prototype.onTouchClose = function() {
        GameSys_1.default.hideBanner();
        GameSys_1.default.game.xSet(Config_1.Config.TTOVER);
        this.hide();
      };
      __decorate([ property(cc.Node) ], IssueVideo.prototype, "close", void 0);
      IssueVideo = __decorate([ ccclass ], IssueVideo);
      return IssueVideo;
    }(PopupBase_1.default);
    exports.default = IssueVideo;
    cc._RF.pop();
  }, {
    "../manager/Config": "Config",
    "../manager/GameSys": "GameSys",
    "./popups/PopupBase": "PopupBase"
  } ],
  Loading: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d6a71odajlINLV6gH1UVIQl", "Loading");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DataManager_1 = require("./common/manager/DataManager");
    var GameSys_1 = require("./common/manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Loading = function(_super) {
      __extends(Loading, _super);
      function Loading() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.progress = null;
        return _this;
      }
      Loading.prototype.start = function() {
        var _this = this;
        GameSys_1.default.init();
        DataManager_1.default.getInstance().initData();
        cc.director.preloadScene("game", function(num, num1) {
          _this.progress.progress = num / num1;
          num == num1 && console.log("\u52a0\u8f7d\u5b8c\u6210");
        }, function() {
          GameSys_1.default.loadScene("game");
        });
      };
      __decorate([ property(cc.ProgressBar) ], Loading.prototype, "progress", void 0);
      Loading = __decorate([ ccclass ], Loading);
      return Loading;
    }(cc.Component);
    exports.default = Loading;
    cc._RF.pop();
  }, {
    "./common/manager/DataManager": "DataManager",
    "./common/manager/GameSys": "GameSys"
  } ],
  LockShop: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4c380VIFd1HiaBGjGLNyLtP", "LockShop");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "LockShop";
    var LockShop = function(_super) {
      __extends(LockShop, _super);
      function LockShop() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.lock = 0;
        return _this;
      }
      LockShop.prototype.onLoad = function() {
        GameSys_1.default.game.xBind(Config_1.Config.LEVEL, this.change_state.bind(this), BINDER_NAME);
        this.change_state();
      };
      LockShop.prototype.change_state = function() {
        GameSys_1.default.level >= this.lock ? this.node.getComponent(cc.Sprite).enabled = true : this.node.getComponent(cc.Sprite).enabled = false;
      };
      LockShop.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property() ], LockShop.prototype, "lock", void 0);
      LockShop = __decorate([ ccclass ], LockShop);
      return LockShop;
    }(cc.Component);
    exports.default = LockShop;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys"
  } ],
  LockWarhouse: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "93d54DyWnlGBKItmkCzRWW/", "LockWarhouse");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var MathManager_1 = require("../common/manager/MathManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "LockWarhouse";
    var LockWarhouse = function(_super) {
      __extends(LockWarhouse, _super);
      function LockWarhouse() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.id = 0;
        return _this;
      }
      LockWarhouse.prototype.onLoad = function() {
        GameSys_1.default.game.xBind(Config_1.Config.WAREHOUSECHNAGE, this.change_state.bind(this), BINDER_NAME);
        this.change_state();
      };
      LockWarhouse.prototype.change_state = function() {
        var _this = this;
        var warhouse = GameSys_1.default.game.xGet(Config_1.Config.WAREHOUSE);
        MathManager_1.default.getInstance().visitLinearArray(warhouse, function(i) {
          warhouse[i] == _this.id - 1 && (_this.node.getComponent(cc.Sprite).enabled = true);
        });
      };
      LockWarhouse.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property() ], LockWarhouse.prototype, "id", void 0);
      LockWarhouse = __decorate([ ccclass ], LockWarhouse);
      return LockWarhouse;
    }(cc.Component);
    exports.default = LockWarhouse;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/MathManager": "MathManager"
  } ],
  Lock_room: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0d9f7H0gPNMqoodpVILC+OG", "Lock_room");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var StaticManager_1 = require("../common/manager/StaticManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "lock_room";
    var Lock_Room = function(_super) {
      __extends(Lock_Room, _super);
      function Lock_Room() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.toilet_3 = null;
        _this.heye = null;
        _this.toilet_3_32 = null;
        return _this;
      }
      Lock_Room.prototype.onLoad = function() {
        if (StaticManager_1.default.getInstance().open_buildings.length >= 4) {
          this.toilet_3_32.active = true;
          this.toilet_3.active = true;
          this.heye.active = true;
        }
        GameSys_1.default.game.xBind(Config_1.Config.LOCKROOM, this.changeSate.bind(this), BINDER_NAME);
      };
      Lock_Room.prototype.changeSate = function() {
        this.toilet_3.active = true;
        var y = this.toilet_3.y;
        var heyeY = this.heye.y;
        this.toilet_3.y = y + 200;
        this.heye.y = heyeY + 200;
        cc.tween(this.toilet_3).to(1, {
          y: y
        }).start();
        cc.tween(this.heye).to(1, {
          y: heyeY
        }).start();
      };
      Lock_Room.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Node) ], Lock_Room.prototype, "toilet_3", void 0);
      __decorate([ property(cc.Node) ], Lock_Room.prototype, "heye", void 0);
      __decorate([ property(cc.Node) ], Lock_Room.prototype, "toilet_3_32", void 0);
      Lock_Room = __decorate([ ccclass ], Lock_Room);
      return Lock_Room;
    }(cc.Component);
    exports.default = Lock_Room;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/StaticManager": "StaticManager"
  } ],
  Log: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "83698KkSVFDpLjyjkCGhoYv", "Log");
    "use strict";
    var __spreadArrays = this && this.__spreadArrays || function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, 
      k++) r[k] = a[j];
      return r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LOG_LEVEL = {
      All: 0,
      Info: 1,
      Warn: 2,
      Error: 3
    };
    var Logger = function() {
      function Logger() {}
      Logger.setLevel = function(_lv) {
        Logger.level = _lv;
      };
      Logger.debug = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        if (Logger.level != LOG_LEVEL.All) return;
        Logger._output(1, Logger.formatS(args));
      };
      Logger.info = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        if (Logger.level > LOG_LEVEL.Info) return;
        Logger._output(1, Logger.formatS(args));
      };
      Logger.warn = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        if (Logger.level > LOG_LEVEL.Warn) return;
        Logger._output(2, Logger.formatS(args));
      };
      Logger.error = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        if (Logger.level > LOG_LEVEL.Error) return;
        Logger._output(3, Logger.formatS(args));
      };
      Logger.getTime = function() {
        var d = new Date();
        var str = cc.js.formatStr("[%d.%d %d:%d:%d:%d]", d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
        return str;
      };
      Logger._output = function(_type, _text) {
        var text = cc.js.formatStr("%s-> %s", Logger.getTime(), _text);
        switch (_type) {
         case 2:
          console.warn(text);
          break;

         case 3:
          console.error(text);
          break;

         default:
          console.log(text);
        }
        this.caches.push(text);
        this.caches.length > this.limit && this.caches.splice(0, 100);
      };
      Logger.formatS = function() {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        var msg = args[0][0];
        args[0].shift();
        var text = (_a = cc.js).formatStr.apply(_a, __spreadArrays([ msg ], args[0]));
        return text;
      };
      Logger.caches = [];
      Logger.level = LOG_LEVEL.All;
      Logger.limit = 1e3;
      return Logger;
    }();
    exports.default = Logger;
    cc._RF.pop();
  }, {} ],
  Loo_goods: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "82918kDEUFKRa8ShkGsFHe/", "Loo_goods");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var StaticManager_1 = require("../common/manager/StaticManager");
    var UtilsManager_1 = require("../common/manager/UtilsManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Loo_goods = function(_super) {
      __extends(Loo_goods, _super);
      function Loo_goods() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.gather = false;
        return _this;
      }
      Loo_goods.prototype.init = function(_price, _path, _index) {
        return __awaiter(this, void 0, void 0, function() {
          var _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              this.redIndex = _index;
              this.price = _price;
              _a = this.node.getComponent(cc.Sprite);
              return [ 4, UtilsManager_1.default.loadImage("fallings/" + _path) ];

             case 1:
              _a.spriteFrame = _b.sent();
              return [ 2 ];
            }
          });
        });
      };
      Loo_goods.prototype.onLoad = function() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch.bind(this));
      };
      Loo_goods.prototype.onTouch = function() {
        var _this = this;
        this.gather = true;
        GameSys_1.default.audio.playSFX("audios/button");
        StaticManager_1.default.getInstance().falllings[this.redIndex][0] = 0;
        Caches_1.default.get(Caches_1.default.newGuide) || 27 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 28);
        GameSys_1.default.game.xSet(Config_1.Config.FALLINGRED, this.redIndex);
        cc.tween(this.node).to(.2, {
          scale: .8
        }).to(.2, {
          scale: .7
        }).call(function() {
          _this.node.getComponent(cc.Sprite).enabled = false;
          var canvas = cc.find("Canvas");
          var pos = canvas.convertToNodeSpaceAR(_this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
          _this.node.parent = canvas;
          _this.node.zIndex = 100;
          _this.node.x = pos.x;
          _this.node.y = pos.y;
          var x = GameSys_1.default.game.xGet(Config_1.Config.GOLDPOS).x;
          var y = GameSys_1.default.game.xGet(Config_1.Config.GOLDPOS).y;
          _this.node.children[0].active = true;
          cc.tween(_this.node).to(1, {
            x: x,
            y: y
          }).call(function() {
            GameSys_1.default.gold(_this.price);
            GameSys_1.default.audio.playSFX("audios/goldcollect");
            _this.node.destroy();
          }).start();
        }).start();
      };
      Loo_goods = __decorate([ ccclass ], Loo_goods);
      return Loo_goods;
    }(cc.Component);
    exports.default = Loo_goods;
    cc._RF.pop();
  }, {
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/StaticManager": "StaticManager",
    "../common/manager/UtilsManager": "UtilsManager"
  } ],
  Loo_item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8e881/wrGVMX5YjxDztRO8I", "Loo_item");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var DataManager_1 = require("../common/manager/DataManager");
    var GameSys_1 = require("../common/manager/GameSys");
    var PopupManager_1 = require("../common/manager/PopupManager");
    var StaticManager_1 = require("../common/manager/StaticManager");
    var UtilsManager_1 = require("../common/manager/UtilsManager");
    var Garbage_1 = require("../prefab/Garbage");
    var Loo_goods_1 = require("./Loo_goods");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Loo_item";
    var Loo_Item = function(_super) {
      __extends(Loo_Item, _super);
      function Loo_Item() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.graphics = null;
        _this.goods = null;
        _this.red = null;
        _this.spr = null;
        _this.progress = null;
        _this.dirty_lab = null;
        _this.circle = null;
        _this.index = 0;
        _this.initPar = null;
        _this.buildings_save = [];
        _this.room = [ "\u6d17\u624b\u95f4", "\u536b\u751f\u95f41", "\u536b\u751f\u95f42", "\u536b\u751f\u95f43" ];
        _this.count = 0;
        _this.abs = [ -1, 1 ];
        _this.graphicsNode = new cc.Node();
        _this.pathname = "";
        _this.countGarbage = 1e3;
        return _this;
      }
      Loo_Item.prototype.onEnable = function() {
        var _this = this;
        BINDER_NAME = BINDER_NAME + "_" + this.index.toString();
        this.judge_buildings();
        this.circle.node.opacity = 125;
        if (this.buildings && this.buildings_save[this.index].dirty >= this.buildings.max_dirty) {
          var _cb_1 = function() {
            _this.count++;
            if (StaticManager_1.default.getInstance().staff.length > 0) {
              var value = StaticManager_1.default.getInstance().staff[Math.floor(Math.random() * StaticManager_1.default.getInstance().staff.length)];
              GameSys_1.default.game.xSet(Config_1.Config.FIXLOO, {
                index: _this.index,
                value: value
              });
            }
            if (!DataManager_1.default.getInstance().getLeisure(_this.index)) {
              _this.unschedule(_cb_1);
              return;
            }
            if (_this.count % 4 == 0) {
              console.log("\u6389\u843d");
              DataManager_1.default.getInstance().setClean(_this.index, true);
              DataManager_1.default.getInstance().packagingGarbage(_this.index);
            }
          };
          this.schedule(_cb_1, 1, 3);
        }
        this.initPar = this.spr.node.parent;
        this.red.width = 60;
        this.red.height = 60;
        Caches_1.default.get(Caches_1.default.newGuide) || GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSCHANGE, {
          index: 0,
          dirty: 0,
          level: 1,
          upgrade: 0
        });
      };
      Loo_Item.prototype.start = function() {
        GameSys_1.default.game.xBind(Config_1.Config.LOOTIME, this.change_dirty.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.BUILDINGSCHANGE, this.change_level.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.FALLINGRED, this.change_red.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.HIDEALL, this.hideAll.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.FALLINGGOODS, this.add_fallings.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.GRAPHICS, this.change_graphics.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.RECRUITCHANGE, this.recruit_change.bind(this), BINDER_NAME);
      };
      Loo_Item.prototype.hideAll = function(v) {
        if (v) {
          this.circle.node.opacity = 0;
          this.node.children[1].opacity = 0;
          this.progress.node.opacity = 0;
          this.red.getComponent(cc.Sprite).enabled = false;
        } else {
          this.red.getComponent(cc.Sprite).enabled = true;
          this.node.children[1].opacity = 255;
          this.progress.node.opacity = 255;
          this.circle.node.opacity = 125;
        }
      };
      Loo_Item.prototype.change_update = function(data) {
        if (this.index == data.index) {
          this.progress.node.active = !data.v;
          this.node.children[1].active = !data.v;
        }
      };
      Loo_Item.prototype.judge_buildings = function() {
        return __awaiter(this, void 0, void 0, function() {
          var i, path, _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              this.buildings_save = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
              for (i = 0; i < Config_1.BUILDINGS.length; i++) if (Config_1.BUILDINGS[i].level == this.buildings_save[this.index].level && Config_1.BUILDINGS[i].index == this.buildings_save[this.index].index) {
                this.buildings = Config_1.BUILDINGS[i];
                break;
              }
              if (!this.buildings) return [ 3, 2 ];
              if (!(0 != this.buildings_save[this.index].level)) return [ 3, 2 ];
              this.dirty_lab.string = this.buildings_save[this.index].dirty.toFixed(0).toString() + "/" + this.buildings.max_dirty.toString();
              this.progress.progress = this.buildings_save[this.index].dirty / this.buildings.max_dirty;
              path = "buildings/" + this.buildings.icon;
              _a = this.spr;
              return [ 4, UtilsManager_1.default.loadImage(path) ];

             case 1:
              _a.spriteFrame = _b.sent();
              _b.label = 2;

             case 2:
              return [ 2 ];
            }
          });
        });
      };
      Loo_Item.prototype.change_red = function(index) {
        if (index == this.index) {
          var flag = false;
          for (var i = 0; i < 2; i++) 1 == StaticManager_1.default.getInstance().falllings[this.index][i] && (flag = true);
          if (!flag && !Caches_1.default.get(Caches_1.default.newGuide)) {
            console.error("++++", GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON));
            28 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && (this.spr.node.children[0].active = true);
          }
          this.red.active = flag;
        }
      };
      Loo_Item.prototype.change_level = function(_data) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            this.index == _data.index && this.judge_buildings();
            return [ 2 ];
          });
        });
      };
      Loo_Item.prototype.change_dirty = function(_data) {
        var _this = this;
        if (_data._index !== this.index) return;
        Caches_1.default.get(Caches_1.default.newGuide) || (_data.time = 1);
        this.circle.node.active = true;
        this.circle.fillRange = 0;
        var cb = function() {
          _this.circle.fillRange += 1 / (10 * _data.time);
          if (_this.circle.fillRange >= 1) {
            _this.unschedule(cb);
            GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSCHANGE, {
              index: _this.index,
              level: _this.buildings_save[_this.index].level,
              dirty: _this.buildings_save[_this.index].dirty + parseInt(_data.dirty.toFixed(0)),
              upgrade: _this.buildings_save[_this.index].upgrade
            });
            _this.dirty_lab.string = _this.buildings_save[_this.index].dirty.toFixed(0).toString() + "/" + _this.buildings.max_dirty.toString();
            _this.progress.progress = _this.buildings_save[_this.index].dirty / _this.buildings.max_dirty;
            var buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
            if (buildings[_this.index].dirty >= _this.buildings.max_dirty) {
              var _cb_2 = function() {
                _this.count++;
                if (StaticManager_1.default.getInstance().staff.length > 0) {
                  var value = StaticManager_1.default.getInstance().staff[Math.floor(Math.random() * StaticManager_1.default.getInstance().staff.length)];
                  GameSys_1.default.game.xSet(Config_1.Config.FIXLOO, {
                    index: _this.index,
                    value: value
                  });
                }
                if (!DataManager_1.default.getInstance().getLeisure(_this.index)) {
                  _this.unschedule(_cb_2);
                  return;
                }
                if (_this.count % 4 == 0) {
                  DataManager_1.default.getInstance().setClean(_this.index, true);
                  DataManager_1.default.getInstance().packagingGarbage(_this.index);
                }
              };
              _this.schedule(_cb_2, 1, 3);
            } else StaticManager_1.default.getInstance().use_buildings[_this.index] = false;
            0 == Math.floor(_this.index / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVELOO, 0) : 1 == Math.floor(_this.index / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETONE, 1) : 2 == Math.floor(_this.index / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETTWO, 2) : 3 == Math.floor(_this.index / 3) && GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETTHERE, 3);
            _this.circle.fillRange = 0;
            _this.circle.node.active = false;
            _data._cb && _data._cb();
          }
        };
        this.unschedule(cb);
        this.schedule(cb, .1, 10 * _data.time, 1);
      };
      Loo_Item.prototype.onTouchShow = function() {
        return __awaiter(this, void 0, void 0, function() {
          var clean, i, canvas, i;
          return __generator(this, function(_a) {
            if (!this.red.active) return [ 2 ];
            if (GameSys_1.default.game.xGet(Config_1.Config.HIDEALL)) return [ 2 ];
            DataManager_1.default.getInstance().cleanGarbageInfo = null;
            clean = false;
            for (i = 0; i < Config_1.CLEANGARBAGE.length; i++) if (Config_1.CLEANGARBAGE[i].name == this.pathname) {
              DataManager_1.default.getInstance().cleanGarbageInfo = Config_1.CLEANGARBAGE[i];
              break;
            }
            if (null != DataManager_1.default.getInstance().cleanGarbageInfo) {
              DataManager_1.default.getInstance().garbageNode = this.graphicsNode;
              console.log(DataManager_1.default.getInstance().garbageNode);
              clean = true;
            }
            GameSys_1.default.game.xSet(Config_1.Config.BLOCK, {
              state: true,
              spr: true,
              clean: clean
            });
            canvas = cc.find("Canvas");
            this.spr.node.parent = canvas;
            this.spr.node.setPosition(cc.v2(-88, 193));
            this.index < 3 ? this.spr.node.scale = 3 : this.index < 6 ? this.spr.node.scale = 2 : this.index < 9 ? this.spr.node.scale = 2 : this.index < 12 && (this.spr.node.scale = -2);
            this.spr.node.zIndex = 15;
            for (i = 0; i < this.spr.node.childrenCount; i++) {
              this.spr.node.children[i].active = true;
              this.spr.node.children[i].scale = 1 / this.spr.node.scale;
            }
            if (!Caches_1.default.get(Caches_1.default.newGuide) && 20 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON)) {
              GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 21);
              this.spr.node.children[0].active = false;
            }
            Caches_1.default.get(Caches_1.default.newGuide) && GameSys_1.default.game.xSet(Config_1.Config.OPPO, true);
            return [ 2 ];
          });
        });
      };
      Loo_Item.prototype.onTouchClose = function() {
        this.spr.node.children[0].active = false;
        GameSys_1.default.game.xSet(Config_1.Config.BLOCK, {
          state: false,
          spr: false,
          clean: false
        });
        if (!Caches_1.default.get(Caches_1.default.newGuide) && 28 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON)) {
          GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 29);
          this.spr.node.children[0].active = false;
        }
        this.spr.node.parent = this.node;
        this.spr.node.setPosition(cc.v2(0, 0));
        this.spr.node.scale = 1;
        for (var i = 0; i < this.spr.node.childrenCount; i++) {
          this.spr.node.children[i].active = false;
          this.spr.node.children[i].scale = 1;
        }
        this.spr.node.parent = this.initPar;
        DataManager_1.default.getInstance().garbageFlag = 0;
      };
      Loo_Item.prototype.add_fallings = function(data) {
        if (this.index !== data.index) return;
        var graphics = cc.instantiate(this.goods);
        this.spr.node.addChild(graphics);
        data.path.price = DataManager_1.default.getInstance().floating(data.path.price, data.path.percentage);
        graphics.getComponent(Loo_goods_1.default).init(data.path.price, data.path.name, data.index);
        graphics.active = false;
        graphics.setPosition(Config_1.WUPIN[data.path.ID][0]);
      };
      Loo_Item.prototype.change_graphics = function(data) {
        var _this = this;
        if (this.index !== data.index) return;
        var graphics = cc.instantiate(this.graphics);
        this.spr.node.addChild(graphics);
        this.countGarbage++;
        var BINDER = "garbage_" + this.countGarbage;
        graphics.getComponent(Garbage_1.default).init(data.path.name, data.index, BINDER);
        this.pathname = "";
        this.pathname = data.path.name;
        this.graphicsNode = null;
        this.graphicsNode = graphics;
        graphics.setPosition(Config_1.WUZI[data.path.ID][0]);
        graphics.active = false;
        GameSys_1.default.game.xSet(Config_1.Config.INFORM, {
          index: 2,
          v: this.room[Math.floor(this.index / 3)] + "\u8981\u6253\u626b",
          cb: function() {
            _this.onTouchShow();
          }
        });
      };
      Loo_Item.prototype.onClick = function() {
        var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
        PopupManager_1.default.show(Config_1.PopupPath.loo, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
      };
      Loo_Item.prototype.recruit_change = function(_data) {
        var _this = this;
        if (0 == _data.state) {
          console.log("\u89e3\u96c7");
          this.judge_buildings();
          this.circle.node.opacity = 125;
          if (this.buildings && this.buildings_save[this.index].dirty >= this.buildings.max_dirty) {
            console.log("\u89e3\u96c7", this.index);
            DataManager_1.default.getInstance().setLeisure(this.index, true);
            StaticManager_1.default.getInstance().use_buildings[this.index] = false;
            var _cb_3 = function() {
              _this.count++;
              if (StaticManager_1.default.getInstance().staff.length > 0) {
                var value = StaticManager_1.default.getInstance().staff[Math.floor(Math.random() * StaticManager_1.default.getInstance().staff.length)];
                GameSys_1.default.game.xSet(Config_1.Config.FIXLOO, {
                  index: _this.index,
                  value: value
                });
              }
              if (!DataManager_1.default.getInstance().getLeisure(_this.index)) {
                _this.unschedule(_cb_3);
                return;
              }
              if (_this.count % 4 == 0) {
                DataManager_1.default.getInstance().setClean(_this.index, true);
                DataManager_1.default.getInstance().packagingGarbage(_this.index);
              }
            };
            this.schedule(_cb_3, 1, 3);
          }
        }
      };
      Loo_Item.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Prefab) ], Loo_Item.prototype, "graphics", void 0);
      __decorate([ property(cc.Prefab) ], Loo_Item.prototype, "goods", void 0);
      __decorate([ property(cc.Node) ], Loo_Item.prototype, "red", void 0);
      __decorate([ property(cc.Sprite) ], Loo_Item.prototype, "spr", void 0);
      __decorate([ property(cc.ProgressBar) ], Loo_Item.prototype, "progress", void 0);
      __decorate([ property(cc.Label) ], Loo_Item.prototype, "dirty_lab", void 0);
      __decorate([ property(cc.Sprite) ], Loo_Item.prototype, "circle", void 0);
      __decorate([ property ], Loo_Item.prototype, "index", void 0);
      Loo_Item = __decorate([ ccclass ], Loo_Item);
      return Loo_Item;
    }(cc.Component);
    exports.default = Loo_Item;
    cc._RF.pop();
  }, {
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/DataManager": "DataManager",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/PopupManager": "PopupManager",
    "../common/manager/StaticManager": "StaticManager",
    "../common/manager/UtilsManager": "UtilsManager",
    "../prefab/Garbage": "Garbage",
    "./Loo_goods": "Loo_goods"
  } ],
  Loo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "618c4eET8FK05jAL4aYSOu+", "Loo");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Loo";
    var Loo = function(_super) {
      __extends(Loo, _super);
      function Loo() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.hide = null;
        _this.mask = [];
        _this.time_node = [];
        _this.loo_item = [];
        _this.upper = 3;
        _this.lower = 0;
        _this.index = 0;
        _this.buildings = [];
        return _this;
      }
      Loo.prototype.onLoad = function() {
        this.buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
        for (var j = 0; j < Config_1.BUILDINGS.length; j++) ;
        for (var i = this.lower; i < this.upper; i++) {
          if (0 !== this.buildings[i].level || 0 != this.buildings[i].upgrade) {
            this.mask[i - 3 * this.index].active = false;
            this.loo_item[i - 3 * this.index].active = true;
          }
          0 != this.buildings[i].upgrade && (this.time_node[i - 3 * this.index].active = true);
        }
        GameSys_1.default.game.xBind(Config_1.Config.BUILDINGSUPDATE, this.change_state.bind(this), BINDER_NAME);
      };
      Loo.prototype.change_hide = function(_data) {
        _data.index >= this.lower && _data.index < this.upper && (this.hide.active = _data.v);
      };
      Loo.prototype.change_state = function(index) {
        var _this = this;
        if (index >= this.lower && index < this.upper) if (0 == this.buildings[index].level) {
          this.mask[index - 3 * this.index].active = false;
          cc.tween(this.mask[index - 3 * this.index]).to(.5, {
            y: this.mask[index - 3 * this.index].y + 400
          }).call(function() {
            var y = _this.loo_item[index - 3 * _this.index].y;
            _this.loo_item[index - 3 * _this.index].y += 400;
            cc.tween(_this.loo_item[index - 3 * _this.index]).to(.5, {
              y: y
            }).call(function() {
              _this.time_node[index - 3 * _this.index].active = true;
            }).start();
          }).start();
          this.loo_item[index - 3 * this.index].active = true;
        } else this.time_node[index - 3 * this.index].active = true;
      };
      Loo.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Node) ], Loo.prototype, "hide", void 0);
      __decorate([ property(cc.Node) ], Loo.prototype, "mask", void 0);
      __decorate([ property(cc.Node) ], Loo.prototype, "time_node", void 0);
      __decorate([ property(cc.Node) ], Loo.prototype, "loo_item", void 0);
      __decorate([ property ], Loo.prototype, "upper", void 0);
      __decorate([ property ], Loo.prototype, "lower", void 0);
      __decorate([ property ], Loo.prototype, "index", void 0);
      Loo = __decorate([ ccclass ], Loo);
      return Loo;
    }(cc.Component);
    exports.default = Loo;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys"
  } ],
  Magnify: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ac8e7Dy4T1HYIZotzE5bveI", "Magnify");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Magnify";
    var Magnify = function(_super) {
      __extends(Magnify, _super);
      function Magnify() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.hide_1 = null;
        _this.hide = null;
        _this.index = 0;
        _this.initZindex = 0;
        _this.open = false;
        return _this;
      }
      Magnify.prototype.onLoad = function() {
        this.close = this.node.getChildByName("close");
        this.initZindex = this.node.zIndex;
        this.initparent = this.node.parent;
        this.initPos = this.node.position;
        GameSys_1.default.game.xBind(Config_1.Config.MAGNIFY, this.change_magnify.bind(this), BINDER_NAME);
        this.close.on(cc.Node.EventType.TOUCH_END, this.onTouchClose.bind(this));
      };
      Magnify.prototype.change_magnify = function(data) {
        if (data.state) if (this.index == data.index) {
          this.hide && (this.hide.active = true);
          this.hide_1 && (this.hide_1.active = false);
          GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSAPP, {
            index: this.index,
            state: true
          });
          this.open = true;
          GameSys_1.default.game.xSet(Config_1.Config.BLOCK, {
            state: true,
            spr: false,
            clean: false
          });
          this.close.active = true;
          var canvas = cc.find("Canvas");
          this.node.parent = canvas;
          this.node.zIndex = 15;
          cc.tween(this.node).to(0, {
            scale: 1.2,
            x: 0,
            y: 0
          }).start();
        } else this.open && this.onTouchClose(); else this.onTouchClose();
      };
      Magnify.prototype.onTouchClose = function() {
        var _this = this;
        GameSys_1.default.audio.playSFX("audios/close");
        GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSAPP, {
          index: this.index,
          state: false
        });
        GameSys_1.default.game.xSet(Config_1.Config.APPITEM, {
          index: GameSys_1.default.game.xGet(Config_1.Config.APPITEM).index,
          state: false
        });
        this.open = false;
        this.close.active = false;
        GameSys_1.default.game.xSet(Config_1.Config.BLOCK, {
          state: false,
          spr: false,
          clean: false
        });
        cc.tween(this.node).to(0, {
          scale: 1,
          position: this.initPos
        }).call(function() {
          _this.hide && (_this.hide.active = false);
          _this.hide_1 && (_this.hide_1.active = true);
          _this.node.parent = _this.initparent;
          _this.node.zIndex = _this.initZindex;
          _this.close.off(cc.Node.EventType.TOUCH_END, _this.onTouchClose.bind(_this));
        }).start();
      };
      Magnify.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Node) ], Magnify.prototype, "hide_1", void 0);
      __decorate([ property(cc.Node) ], Magnify.prototype, "hide", void 0);
      __decorate([ property ], Magnify.prototype, "index", void 0);
      Magnify = __decorate([ ccclass ], Magnify);
      return Magnify;
    }(cc.Component);
    exports.default = Magnify;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys"
  } ],
  Map: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9bcd29/N1tHcphjwFEHJGC2", "Map");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../manager/Caches");
    var Config_1 = require("../manager/Config");
    var GameSys_1 = require("../manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "map";
    var Map = function(_super) {
      __extends(Map, _super);
      function Map() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.zone = null;
        _this.targetMap = null;
        _this._originW = 0;
        _this._originH = 0;
        _this.newguide = [ 750, 0 ];
        _this.pos = [ cc.v3(147, 0, 0), cc.v3(600, 0, 0), cc.v3(-343, -130, 0), cc.v3(-972, 0, 0) ];
        _this.move = false;
        return _this;
      }
      Map.prototype.onLoad = function() {
        this._originW = this.zone.width;
        this._originH = this.zone.height;
        GameSys_1.default.game.xBind(Config_1.Config.SCREENPOS, this.change_pos.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.NEWGUIDECON, this.change_newguide.bind(this), BINDER_NAME);
      };
      Map.prototype.change_newguide = function(v) {
        9 == v && (this.targetMap.x = 0);
      };
      Map.prototype.change_fix = function(v) {
        this.move = v;
      };
      Map.prototype.change_pos = function(v) {
        cc.tween(this.targetMap).to(.2, {
          position: this.pos[v]
        }).start();
      };
      Map.prototype.start = function() {
        this.targetMap.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
      };
      Map.prototype.onTouchStart = function(event) {
        if (this.move) return;
        var touches = event.getTouches();
        if (1 == touches.length) ; else if (2 == touches.length) {
          this.startPos1 = this.node.convertToNodeSpaceAR(touches[0].getLocation());
          this.startPos2 = this.node.convertToNodeSpaceAR(touches[1].getLocation());
          this.pointsDis = this.startPos1.sub(this.startPos2).mag();
        }
      };
      Map.prototype.onTouchMove = function(event) {
        if (!Caches_1.default.get(Caches_1.default.newGuide)) return;
        if (GameSys_1.default.game.xGet(Config_1.Config.BLOCK).state) return;
        if (this.move) return;
        var pre = event.getPreviousLocation();
        var cur = event.getLocation();
        var dir = cur.sub(pre);
        this.targetMap.x += dir.x / 2;
        this.targetMap.y += dir.y / 2;
        var zoneLeft = this.zone.x - this.zone.width / 2;
        var zoneRight = this.zone.x + this.zone.width / 2;
        var zoneTop = this.zone.y + this.zone.height / 2;
        var zoneBottom = this.zone.y - this.zone.height / 2;
        var halfMapWidth = this.targetMap.width / 2;
        var halfMapHeight = this.targetMap.height / 2;
        this.targetMap.x - halfMapWidth > zoneLeft && (this.targetMap.x = zoneLeft + halfMapWidth);
        this.targetMap.x + halfMapWidth < zoneRight && (this.targetMap.x = zoneRight - halfMapWidth);
        this.targetMap.y + halfMapHeight < zoneTop && (this.targetMap.y = zoneTop - halfMapHeight);
        this.targetMap.y - halfMapHeight > zoneBottom && (this.targetMap.y = zoneBottom + halfMapHeight);
        var touches = event.getTouches();
        if (2 == touches.length) {
          var touchPoint1 = this.node.convertToNodeSpaceAR(touches[0].getLocation());
          var touchPoint2 = this.node.convertToNodeSpaceAR(touches[1].getLocation());
          var newPointsDis = touchPoint1.sub(touchPoint2).mag();
          this.pointsDis || (this.pointsDis = 0);
          if (newPointsDis > this.pointsDis) {
            if (this.targetMap.scale >= 1.2) {
              this.targetMap.scale = 1.2;
              return;
            }
            this.pointsDis = newPointsDis;
            this.targetMap.scale += .1;
          } else if (newPointsDis < this.pointsDis) {
            if (this.targetMap.scale <= 1) {
              this.targetMap.scale = 1;
              return;
            }
            this.pointsDis = newPointsDis;
            this.targetMap.scale -= .1;
          }
          this.restrictPic();
        }
      };
      Map.prototype.restrictPic = function() {
        var picWidth = this.targetMap.getBoundingBox().width;
        var picHeight = this.targetMap.getBoundingBox().height;
        this.targetMap.x > 0 && this.targetMap.x - 0 > picWidth / 2 - this.zone.width / 2 && (this.targetMap.x = picWidth / 2 - this.zone.width / 2);
        this.targetMap.x < 0 && this.targetMap.x - 0 < this.zone.width / 2 - picWidth / 2 && (this.targetMap.x = this.zone.width / 2 - picWidth / 2);
        this.targetMap.y > 0 && this.targetMap.y - 0 > picHeight / 2 - this.zone.height / 2 && (this.targetMap.y = picHeight / 2 - this.zone.height / 2);
        this.targetMap.y < 0 && this.targetMap.y - 0 < this.zone.height / 2 - picHeight / 2 && (this.targetMap.y = this.zone.height / 2 - picHeight / 2);
      };
      Map.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Node) ], Map.prototype, "zone", void 0);
      __decorate([ property(cc.Node) ], Map.prototype, "targetMap", void 0);
      Map = __decorate([ ccclass ], Map);
      return Map;
    }(cc.Component);
    exports.default = Map;
    cc._RF.pop();
  }, {
    "../manager/Caches": "Caches",
    "../manager/Config": "Config",
    "../manager/GameSys": "GameSys"
  } ],
  MathManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ab791BQ4FpLQoJty916H/uv", "MathManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var MathManager = function() {
      function MathManager() {}
      MathManager.getInstance = function() {
        this.instance = this.instance ? this.instance : new MathManager();
        return this.instance;
      };
      MathManager.prototype.moveFunc = function(times, callback) {
        var count = 0;
        var loop = function() {
          if (count >= times) return;
          count++;
          callback();
          loop();
        };
        loop();
      };
      MathManager.prototype.linearArray = function(value, len) {
        var arr = new Array();
        for (var i = 0; i < len; i++) arr.push(value);
        return arr;
      };
      MathManager.prototype.createArray = function(_arr, _size, value) {
        for (var row = 0; row < _size.row; row++) {
          _arr.push([]);
          for (var col = 0; col < _size.col; col++) _arr[row][col] = {
            row: row,
            col: col,
            state: {
              cutting: value,
              group: [ 0 ]
            }
          };
        }
      };
      MathManager.prototype.visitArray = function(_arr, callback) {
        for (var row = 0; row < _arr.length; row++) for (var col = 0; col < _arr[row].length; col++) callback(row, col);
      };
      MathManager.prototype.visitLinearArray = function(_arr, callback) {
        for (var row = 0; row < _arr.length; row++) callback(row);
      };
      MathManager.prototype.transformArray = function(_arr) {
        var newArray = new Array();
        for (var row = 0; row < _arr[0].length; row++) {
          newArray[row] = [];
          for (var col = 0; col < _arr.length; col++) newArray[row][col] = _arr[col][row];
        }
        return newArray;
      };
      MathManager.prototype.binarySearch = function(arr, x, n) {
        var left = 0, right = n - 1, middle = -1;
        while (left <= right) {
          middle = (left + right) / 2;
          if (x == arr[middle]) return middle;
          x > arr[middle] ? left = middle + 1 : right = middle - 1;
        }
        return -1;
      };
      MathManager.prototype.randomNum = function(minNum, maxNum) {
        switch (arguments.length) {
         case 1:
          return Math.floor(Math.random() * minNum + 1);

         case 2:
          return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);

         default:
          return 0;
        }
      };
      return MathManager;
    }();
    exports.default = MathManager;
    cc._RF.pop();
  }, {} ],
  Music: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b3692dX9N9PWYYM3EwszqtQ", "Music");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSys_1 = require("../manager/GameSys");
    var StateManager_1 = require("../manager/StateManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Music = function(_super) {
      __extends(Music, _super);
      function Music() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.state = null;
        return _this;
      }
      Music.prototype.onEnable = function() {
        var bgmVolume = GameSys_1.default.audio.xGet("bgmVolume");
        var sfxVolume = GameSys_1.default.audio.xGet("sfxVolume");
        this.state.stateChange(bgmVolume);
        console.log("\u97f3\u4e50", bgmVolume);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchMusic.bind(this));
      };
      Music.prototype.onTouchMusic = function() {
        if (0 == this.state.nowState) {
          this.state.stateChange(1);
          GameSys_1.default.audio.recoverBGM();
          GameSys_1.default.audio.recoverSFX();
          GameSys_1.default.audio.playBGM("audios/bgm");
        } else if (1 == this.state.nowState) {
          this.state.stateChange(0);
          GameSys_1.default.audio.slientBgm();
          GameSys_1.default.audio.slientSFX();
        }
      };
      __decorate([ property(StateManager_1.default) ], Music.prototype, "state", void 0);
      Music = __decorate([ ccclass ], Music);
      return Music;
    }(cc.Component);
    exports.default = Music;
    cc._RF.pop();
  }, {
    "../manager/GameSys": "GameSys",
    "../manager/StateManager": "StateManager"
  } ],
  NativeOppo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9540bbXbaxBh6LkucbVr9Ho", "NativeOppo");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSys_1 = require("../manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Transit = function(_super) {
      __extends(Transit, _super);
      function Transit() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Transit.prototype.onTouchClose = function() {
        var value = Math.random();
        if (value < .1) {
          this.node.parent.destroy();
          GameSys_1.default.sdk.xSet("hideNative");
        }
      };
      Transit.prototype.onDestroy = function() {
        this.node.parent.destroy();
        GameSys_1.default.sdk.xSet("hideNative");
      };
      Transit = __decorate([ ccclass ], Transit);
      return Transit;
    }(cc.Component);
    exports.default = Transit;
    cc._RF.pop();
  }, {
    "../manager/GameSys": "GameSys"
  } ],
  NewGuide: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a21f6IDXtJE55pfCMmopfYO", "NewGuide");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../manager/Caches");
    var Config_1 = require("../manager/Config");
    var GameSys_1 = require("../manager/GameSys");
    var TouchBlocker_1 = require("../manager/TouchBlocker");
    var HollowOut_1 = require("./effects/HollowOut");
    var BINDER_NAME = "newGuide";
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NewGuide = function(_super) {
      __extends(NewGuide, _super);
      function NewGuide() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.xuankuang = null;
        _this.client = null;
        _this.hand = null;
        _this.hollowOut = null;
        _this.touchBlocker = null;
        _this.startBtn = null;
        _this.startBtn_1 = null;
        _this.oneBtn = null;
        _this.twoBtn = null;
        _this.threeBtn = null;
        _this.fourBtn = null;
        _this.fiveBtn = null;
        _this.sixBtn = null;
        _this.sevenBtn_1 = null;
        _this.sevenBtn = null;
        _this.eightBtn = null;
        _this.nineBtn = null;
        _this.tenBtn = null;
        _this.shiyiBtn = null;
        _this.shierBtn = null;
        _this.shisanBtn = null;
        _this.shisiBtn = null;
        _this.shiwuBtn = null;
        _this.shiliuBtn = null;
        _this.shiqiBtn = null;
        _this.shibaBtn = null;
        _this.shijiu = null;
        _this.ershi = null;
        _this.eryi = null;
        _this.erer = null;
        _this.ersan = null;
        _this.ersi = null;
        _this.erwu = null;
        _this.erliu = null;
        _this.erqi = null;
        _this.erba = null;
        _this.erjiu = null;
        _this.sanshi = null;
        _this.sanyi = null;
        _this.saner = null;
        _this.info = [ {
          hand: cc.v2(0, 0),
          lab: "\u70b9\u51fb\u6309\u94ae1\n\u8fdb\u884c\u5347\u7ea7",
          pos: cc.v2(0, 0),
          width: 180,
          height: 140
        }, {
          hand: cc.v2(-242.856, -363.254),
          lab: "\u9009\u62e9\u5347\u7ea7\u533a\u57df",
          pos: cc.v2(-97.379, -360.702),
          width: 180,
          height: 100
        }, {
          hand: cc.v2(-149.302, 291.34),
          lab: "\u70b9\u51fb\u5347\u7ea7\u6309\u94ae",
          pos: cc.v2(-36.624, 291),
          width: 180,
          height: 100
        }, {
          hand: cc.v2(0, -161.628),
          lab: "\u70b9\u51fb\u89e3\u9501\u6309\u94ae",
          pos: cc.v2(147.635, -159.076),
          width: 180,
          height: 100
        }, {
          hand: cc.v2(-149.302, 291.34),
          lab: "\u606d\u559c\u6210\u529f\n\u89e3\u9501\u6d17\u624b\u95f4",
          pos: cc.v2(-36.624, 291),
          width: 180,
          height: 100
        }, {
          hand: cc.v2(-83.148, -373.598),
          lab: "\u4e0b\u4e00\u6b65\n\u524d\u5f80\u536b\u751f\u95f4",
          pos: cc.v2(58.911, -340.62),
          width: 180,
          height: 100
        }, {
          hand: cc.v2(-129.142, 291.412),
          lab: "\u70b9\u51fb\u5347\u7ea7\u533a\u57df",
          pos: cc.v2(-16.439, 297.354),
          width: 180,
          height: 100
        }, {
          hand: cc.v2(0, -161.628),
          lab: "\u70b9\u51fb\u89e3\u9501\u6309\u94ae",
          pos: cc.v2(147.635, -159.076),
          width: 180,
          height: 100
        }, {
          hand: cc.v2(-129.142, 291.412),
          lab: "\u606d\u559c\u6210\u529f\n\u89e3\u9501\u536b\u751f\u95f4",
          pos: cc.v2(-16.439, 297.354),
          width: 180,
          height: 100
        }, {
          hand: cc.v2(136.404, -293.74),
          lab: "\u70b9\u51fb\u6309\u94ae\n\u8fdb\u5165\u5916\u89c2",
          pos: cc.v2(278.463, -260.662),
          width: 180,
          height: 100
        }, {
          hand: cc.v2(-242.856, -363.254),
          lab: "\u9009\u62e9\u5916\u89c2\u533a\u57df",
          pos: cc.v2(-97.379, -360.702),
          width: 180,
          height: 100
        }, {
          hand: cc.v2(-146.881, -167.205),
          lab: "\u70b9\u51fb\u67e5\u770b",
          pos: cc.v2(-30, -152),
          width: 140,
          height: 100
        }, {
          hand: cc.v2(-10.177, -111.442),
          lab: "\u70b9\u51fb\u66f4\u6362\u5916\u89c2",
          pos: cc.v2(127.882, -128.364),
          width: 180,
          height: 100
        }, {
          hand: cc.v2(335.332, -329.663),
          lab: "\u70b9\u51fb\u5173\u95ed",
          pos: cc.v2(208.397, -296.585),
          width: 140,
          height: 100
        }, {
          hand: cc.v2(0, 0),
          lab: "\u5f00\u59cb\u8425\u4e1a\u5566\uff0c\u987e\u5ba2\u6b63\u5728\u9009\u62e9\u5546\u54c1",
          pos: cc.v2(0, -417.443),
          width: 450,
          height: 100
        }, {
          hand: cc.v2(307.78, -287.679),
          lab: "\u70b9\u51fb\u5546\u5e97",
          pos: cc.v2(205.983, -270.5),
          width: 140,
          height: 100
        }, {
          hand: cc.v2(0, -238.271),
          lab: "\u957f\u6309\u53ef\u5feb\u901f\u8865\u8d27\u54e6",
          pos: cc.v2(172.767, -221.092),
          width: 250,
          height: 100
        }, {
          hand: cc.v2(320.374, 427.01),
          lab: "\u70b9\u51fb\u5173\u95ed",
          pos: cc.v2(213.014, 444.189),
          width: 140,
          height: 100
        }, {
          hand: cc.v2(0, 0),
          lab: "\u987e\u5ba2\u6b63\u5728\u524d\u5f80\u6d17\u624b\u6c60",
          pos: cc.v2(0, -417.443),
          width: 250,
          height: 100
        }, {
          hand: cc.v2(0, 0),
          lab: "\u987e\u5ba2\u6b63\u5728\u524d\u5f80\u6d17\u624b\u6c60",
          pos: cc.v2(0, -417.443),
          width: 250,
          height: 100
        }, {
          hand: cc.v2(-306.493, 304.62),
          lab: "\u6d17\u624b\u6c60\u6bcf\u6b21\u88ab\u4f7f\u7528\u540e\u4f1a\u589e\u52a0\u6e05\u6d01\u5ea6\u3002\n\u6e05\u6d01\u5ea6\u5230\u6700\u5927\u503c\u65f6\u8bbe\u65bd\u5c06\u65e0\u6cd5\u4f7f\u7528\uff0c\n\u8bf7\u5c3d\u5feb\u8fdb\u884c\u6253\u626b\u3002\n\u60a8\u4e5f\u53ef\u4ee5\u96c7\u4f63\u5458\u5de5\u8fdb\u884c\u6253\u626b",
          pos: cc.v2(42.361, 201.372),
          width: 600,
          height: 180
        }, {
          hand: cc.v2(-205, -367),
          lab: "\u70b9\u51fb\u4f7f\u7528\u9ad8\u6548\u53bb\u6c61\u5668",
          pos: cc.v2(0, -250),
          width: 250,
          height: 100
        }, {
          hand: cc.v2(-158, 230),
          lab: "\u5c06\u9ad8\u6548\u53bb\u6c61\u5668\u62d6\u81f3\u8fd9\u91cc\n\u5e76\u6ed1\u52a8\u770b\u770b\u5427",
          pos: cc.v2(51, 145),
          width: 300,
          height: 100
        }, {
          hand: cc.v2(0, -367),
          lab: "\u5f88\u68d2\u54e6\uff0c\u7ee7\u7eed\u70b9\u51fb\u4f7f\u7528\n\u6e05\u6d01\u5242",
          pos: cc.v2(0, -250),
          width: 300,
          height: 100
        }, {
          hand: cc.v2(-158, 230),
          lab: "\u5c06\u6e05\u6d01\u5242\u62d6\u81f3\u8fd9\u91cc\n\u5e76\u6ed1\u52a8\u770b\u770b\u5427",
          pos: cc.v2(51, 145),
          width: 300,
          height: 100
        }, {
          hand: cc.v2(205, -367),
          lab: "\u52a0\u6cb9\u54e6\uff0c\u5783\u573e\u5feb\u6e05\u7406\n\u5e72\u51c0\u4e86\u70b9\u51fb\u4f7f\u7528\u62b9\u5e03",
          pos: cc.v2(0, -250),
          width: 360,
          height: 100
        }, {
          hand: cc.v2(-158, 230),
          lab: "\u5c06\u62b9\u5e03\u62d6\u81f3\u8fd9\u91cc\n\u5e76\u6ed1\u52a8\u770b\u770b\u5427",
          pos: cc.v2(51, 145),
          width: 300,
          height: 100
        }, {
          hand: cc.v2(-8.382, 265.62),
          lab: "\u5783\u573e\u6e05\u7406\u5e72\u51c0\u4e86\uff0c\u70b9\n\u51fb\u6536\u96c6\u987e\u5ba2\u9057\u7559\u7269\u54c1",
          pos: cc.v2(36.163, 88.873),
          width: 300,
          height: 100
        }, {
          hand: cc.v2(125.442, 395.507),
          lab: "\u70b9\u51fb\u5173\u95ed",
          pos: cc.v2(101.763, 221.384),
          width: 140,
          height: 100
        }, {
          hand: cc.v2(-296.505, -285.515),
          lab: "\u70b9\u51fb\u4ed3\u5e93",
          pos: cc.v2(-178.143, -271.501),
          width: 140,
          height: 100
        }, {
          hand: cc.v2(97.056, 205.661),
          lab: "\u70b9\u51fb\u8d2d\u4e70",
          pos: cc.v2(215.418, 219.675),
          width: 140,
          height: 100
        }, {
          hand: cc.v2(317.078, 428.782),
          lab: "\u70b9\u51fb\u5173\u95ed",
          pos: cc.v2(207.671, 442.796),
          width: 140,
          height: 100
        } ];
        _this.typerTimer = 0;
        return _this;
      }
      NewGuide.prototype.onLoad = function() {};
      NewGuide.prototype.onEnable = function() {
        this.fiveBtn.on("touchend", this.onTouch5, this);
        this.nineBtn.on("touchend", this.onTouch9, this);
        this.threeBtn.on("touchend", this.onTouchThree, this);
        this.fourBtn.on("touchend", this.onTouchFour, this);
        this.sevenBtn_1.on("touchend", this.onTouchSeven, this);
        this.eightBtn.on("touchend", this.onTouch8, this);
        GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 0);
        this.node.zIndex = 50;
        GameSys_1.default.game.xBind(Config_1.Config.NEWGUIDECON, this.continue.bind(this), BINDER_NAME);
      };
      NewGuide.prototype.onDisable = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      NewGuide.prototype.cachujixu = function(v) {
        this.hand.setPosition(cc.v2(0, 300));
        this.change(this.shiqiBtn, this.shiwuBtn);
      };
      NewGuide.prototype.change = function(pre, next) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              pre.active = false;
              next.active = true;
              this.hollowOut.nodeSize();
              this.touchBlocker.blockAll();
              if (!(1 !== GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON))) return [ 3, 2 ];
              return [ 4, this.hollowOut.rectTo(.5, next.getPosition(), next.width + 10, next.height + 10, 5, 5) ];

             case 1:
              _a.sent();
              this.touchBlocker.setTarget(next);
              return [ 3, 4 ];

             case 2:
              return [ 4, this.hollowOut.rectTo(1.2, next.getPosition(), next.width + 10, next.height + 10, 5, 5) ];

             case 3:
              _a.sent();
              this.touchBlocker.setTarget(next);
              _a.label = 4;

             case 4:
              return [ 2 ];
            }
          });
        });
      };
      NewGuide.prototype.continue = function(v) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            if (Caches_1.default.get(Caches_1.default.newGuide)) return [ 2 ];
            console.error(v);
            if (v >= 32) {
              console.log("\u7ed3\u675f");
              this.node.active = false;
              Caches_1.default.set(Caches_1.default.newGuide, true);
              GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u536b\u751f\u9053\u957f\uff0c\u5f00\u542f\u4f60\u7684\u7ba1\u7406\u5de5\u4f5c\u5427\uff01");
              GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 33);
              return [ 2 ];
            }
            this.xuankuang.setPosition(this.info[v].pos);
            this.xuankuang.width = this.info[v].width;
            this.xuankuang.height = this.info[v].height;
            this.onTouchLableTyper(this.info[v].lab);
            if (14 == v || 19 == v) {
              this.hand.parent = this.client.children[0];
              this.hand.setPosition(cc.v2(0, 453));
              this.hand.scale = 1;
            } else {
              this.hand.parent = this.node;
              this.hand.scale = .3;
              this.hand.setPosition(this.info[v].hand);
            }
            1 == v && this.change(this.oneBtn, this.twoBtn);
            2 == v && this.change(this.twoBtn, this.threeBtn);
            5 == v && this.change(this.fiveBtn, this.sixBtn);
            6 == v && this.change(this.sixBtn, this.sevenBtn);
            9 == v && this.change(this.nineBtn, this.tenBtn);
            10 == v && this.change(this.tenBtn, this.shiyiBtn);
            11 == v && this.change(this.shiyiBtn, this.shierBtn);
            12 == v && this.change(this.shierBtn, this.shisanBtn);
            13 == v && this.change(this.shisanBtn, this.shisiBtn);
            14 == v && this.change(this.shisiBtn, this.shiwuBtn);
            15 == v && this.change(this.shiwuBtn, this.shiliuBtn);
            16 == v && this.change(this.shiliuBtn, this.shiqiBtn);
            17 == v && this.change(this.shiqiBtn, this.shibaBtn);
            18 == v && this.change(this.shibaBtn, this.shijiu);
            19 == v && this.change(this.shijiu, this.ershi);
            20 == v && this.change(this.ershi, this.eryi);
            21 == v && this.change(this.eryi, this.erer);
            22 == v && this.change(this.erer, this.ersan);
            23 == v && this.change(this.ersan, this.ersi);
            24 == v && this.change(this.ersi, this.erwu);
            25 == v && this.change(this.erwu, this.erliu);
            26 == v && this.change(this.erliu, this.erqi);
            27 == v && this.change(this.erqi, this.erba);
            28 == v && this.change(this.erba, this.erjiu);
            29 == v && this.change(this.erjiu, this.sanshi);
            30 == v && this.change(this.sanshi, this.sanyi);
            31 == v && this.change(this.sanyi, this.saner);
            32 == v && console.log("\u65b0\u624b\u7ed3\u675f");
            return [ 2 ];
          });
        });
      };
      NewGuide.prototype.start = function() {
        this.hollowOut.node.active = true;
        this.hollowOut.nodeSize();
        this.touchBlocker.passAll();
        this.onStartBtnClick();
      };
      NewGuide.prototype.onStartBtnClick = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this.touchBlocker.blockAll();
              return [ 4, this.hollowOut.rectTo(.5, this.oneBtn.getPosition(), this.oneBtn.width + 10, this.oneBtn.height + 10, 5, 5) ];

             case 1:
              _a.sent();
              this.touchBlocker.setTarget(this.oneBtn);
              return [ 2 ];
            }
          });
        });
      };
      NewGuide.prototype.onTouchThree = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (2 !== GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON)) return [ 2 ];
              GameSys_1.default.audio.playSFX("audios/button");
              GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 3);
              this.fourBtn.active = true;
              this.hollowOut.nodeSize();
              this.touchBlocker.blockAll();
              return [ 4, this.hollowOut.rectTo(.5, this.fourBtn.getPosition(), this.fourBtn.width + 10, this.fourBtn.height + 10, 5, 5) ];

             case 1:
              _a.sent();
              this.touchBlocker.setTarget(this.fourBtn);
              return [ 2 ];
            }
          });
        });
      };
      NewGuide.prototype.onTouchFour = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (3 !== GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON)) return [ 2 ];
              GameSys_1.default.audio.playSFX("audios/button");
              GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 4);
              this.fourBtn.active = false;
              this.hollowOut.nodeSize();
              this.touchBlocker.blockAll();
              return [ 4, this.hollowOut.rectTo(.5, this.threeBtn.getPosition(), this.threeBtn.width + 10, this.threeBtn.height + 10, 5, 5) ];

             case 1:
              _a.sent();
              this.touchBlocker.setTarget(this.threeBtn);
              this.scheduleOnce(function() {
                _this.threeBtn.children[1].active = false;
                cc.tween(_this.threeBtn).to(1, {
                  y: _this.threeBtn.y + 300,
                  opacity: 0
                }).call(function() {
                  _this.threeBtn.active = false;
                  _this.scheduleOnce(function() {
                    GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 5);
                  }, .2);
                }).start();
              }, .3);
              return [ 2 ];
            }
          });
        });
      };
      NewGuide.prototype.onTouch5 = function() {};
      NewGuide.prototype.onTouch9 = function() {};
      NewGuide.prototype.onTouchSeven = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (6 !== GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON)) return [ 2 ];
              GameSys_1.default.audio.playSFX("audios/button");
              GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 7);
              this.eightBtn.active = true;
              this.hollowOut.nodeSize();
              this.touchBlocker.blockAll();
              return [ 4, this.hollowOut.rectTo(.5, this.eightBtn.getPosition(), this.eightBtn.width + 10, this.eightBtn.height + 10, 5, 5) ];

             case 1:
              _a.sent();
              this.touchBlocker.setTarget(this.eightBtn);
              return [ 2 ];
            }
          });
        });
      };
      NewGuide.prototype.onTouch8 = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (7 !== GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON)) return [ 2 ];
              GameSys_1.default.audio.playSFX("audios/button");
              GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 8);
              this.eightBtn.active = false;
              this.hollowOut.nodeSize();
              this.touchBlocker.blockAll();
              return [ 4, this.hollowOut.rectTo(.5, this.nineBtn.getPosition(), this.nineBtn.width + 10, this.nineBtn.height + 10, 5, 5) ];

             case 1:
              _a.sent();
              this.touchBlocker.setTarget(this.nineBtn);
              this.scheduleOnce(function() {
                _this.sevenBtn.children[1].active = false;
                cc.tween(_this.sevenBtn).to(1, {
                  y: _this.sevenBtn.y + 300,
                  opacity: 0
                }).call(function() {
                  _this.sevenBtn.active = false;
                  _this.scheduleOnce(function() {
                    GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 9);
                  }, .2);
                }).start();
              }, .3);
              return [ 2 ];
            }
          });
        });
      };
      NewGuide.prototype.onTouchLableTyper = function(strLab) {
        var _this = this;
        this.xuankuang.children[0].getComponent(cc.Label).string = "";
        var charArr = strLab.split("");
        var charIdx = 0;
        this.typerTimer && clearInterval(this.typerTimer);
        this.typerTimer = setInterval(function() {
          if (charIdx >= charArr.length) _this.typerTimer && clearInterval(_this.typerTimer); else {
            charIdx += 1;
            _this.xuankuang.children[0].getComponent(cc.Label).string = charArr.slice(0, charIdx).join("");
          }
        }, 100);
      };
      NewGuide.prototype.onNineBtnClick = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            this.hollowOut.nodeSize();
            this.touchBlocker.passAll();
            return [ 2 ];
          });
        });
      };
      __decorate([ property(cc.Node) ], NewGuide.prototype, "xuankuang", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "client", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "hand", void 0);
      __decorate([ property(HollowOut_1.default) ], NewGuide.prototype, "hollowOut", void 0);
      __decorate([ property(TouchBlocker_1.default) ], NewGuide.prototype, "touchBlocker", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "startBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "startBtn_1", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "oneBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "twoBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "threeBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "fourBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "fiveBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "sixBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "sevenBtn_1", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "sevenBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "eightBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "nineBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "tenBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "shiyiBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "shierBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "shisanBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "shisiBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "shiwuBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "shiliuBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "shiqiBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "shibaBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "shijiu", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "ershi", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "eryi", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "erer", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "ersan", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "ersi", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "erwu", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "erliu", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "erqi", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "erba", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "erjiu", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "sanshi", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "sanyi", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "saner", void 0);
      NewGuide = __decorate([ ccclass ], NewGuide);
      return NewGuide;
    }(cc.Component);
    exports.default = NewGuide;
    cc._RF.pop();
  }, {
    "../manager/Caches": "Caches",
    "../manager/Config": "Config",
    "../manager/GameSys": "GameSys",
    "../manager/TouchBlocker": "TouchBlocker",
    "./effects/HollowOut": "HollowOut"
  } ],
  OPPOApi: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cfe72QmWcBI56KsXn2YSQVx", "OPPOApi");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../manager/Caches");
    var Config_1 = require("../manager/Config");
    var DataManager_1 = require("../manager/DataManager");
    var GameSys_1 = require("../manager/GameSys");
    var Log_1 = require("../manager/Log");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "xxszy_oppoapi";
    var OppoApi = function() {
      function OppoApi() {
        this.time = 0;
        this.isShowBanner = false;
        this.bannerAd = null;
        this.rewardedVideoAd = null;
        this.videoNum = 0;
        this.videoTime = 0;
        this.videoAds = [ "272764" ];
        this.isVoice = false;
        this.createTime = 0;
        this.nativeAd = null;
        this.onLoad();
        GameSys_1.default.sdk.Instance = this;
        Log_1.default.info("oppo\u73af\u5883----------");
        Caches_1.default.get(Caches_1.default.oppoBanner) || Caches_1.default.set(Caches_1.default.oppoBanner, 1);
        Caches_1.default.get(Caches_1.default.oppoNatived) || Caches_1.default.set(Caches_1.default.oppoNatived, 1);
        this.time = new Date().getTime();
        this.instantiationRewardAd();
        GameSys_1.default.sdk.xBind("createBanner", this.createBanner.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("hideBanner", this.hideBanner.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("destroyBanner", this.destroySelf.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("showInter", this.createInsertAd.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("showNativeAd", this.showNativeAd.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("shortcut", this.shortcut.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("hideNative", this.hideNativeAd.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("portalAd", this.createGameBannerAd.bind(this), BINDER_NAME);
      }
      OppoApi_1 = OppoApi;
      OppoApi.prototype.onLoad = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            return [ 2 ];
          });
        });
      };
      OppoApi.prototype.createBanner = function() {
        if (this.banner_count >= 6) return;
        this.banner_count = Caches_1.default.get(Caches_1.default.oppoBanner);
        var self = this;
        if (new Date().getTime() - this.time < 6e4) return;
        if (self.isShowBanner && self.bannerAd) {
          console.error("\u6ca1\u80fdhide", self.isShowBanner, self.bannerAd);
          return;
        }
        var adUnitId = "272758";
        var screenWidth = qg.getSystemInfoSync().screenWidth;
        var screenHeight = qg.getSystemInfoSync().screenHeight;
        self.bannerAd = null;
        self.bannerAd = qg.createBannerAd({
          adUnitId: adUnitId,
          style: {
            left: (screenWidth - 320) / 2,
            top: screenHeight - 100,
            width: screenWidth,
            height: 500
          }
        });
        self.bannerAd.onResize(function(size) {
          self.bannerAd.style.top = screenHeight - size.height - 10;
          self.bannerAd.show();
          self.isShowBanner = true;
          console.log("\u5c55\u793abanner\u6210\u529f", self.isShowBanner);
        });
        self.bannerAd.onError(function(res) {
          cc.log("this.bannerAd   onError", res);
        });
        self.bannerAd.onHide(function() {
          self.bannerAd.hide();
          self.bannerAd.destroy();
          self.bannerAd = null;
          self.isShowBanner = false;
          self.banner_count++;
          Caches_1.default.set(Caches_1.default.oppoBanner, self.banner_count);
          console.log("banner \u5e7f\u544a\u9690\u85cf", self.isShowBanner, self.bannerAd);
        });
      };
      OppoApi.prototype.showBanner = function() {};
      OppoApi.prototype.hideBanner = function() {
        if (this.banner_count >= 6) return;
        console.log("\u8fdb\u5165\u9690\u85cfbanner", this.bannerAd);
        if (this.bannerAd) {
          this.bannerAd.hide();
          this.bannerAd.destroy();
          this.bannerAd = null;
          this.isShowBanner = false;
        }
      };
      OppoApi.prototype.destroySelf = function() {};
      OppoApi.prototype.instantiationRewardAd = function() {
        console.log("\u89c6\u9891\u5b9e\u4f8b\u5316");
        this.rewardedVideoAd = qg.createRewardedVideoAd({
          adUnitId: this.videoAds[this.videoNum % this.videoAds.length]
        });
      };
      OppoApi.prototype.createRewardedVideoAd = function(_callBack) {
        var _this = this;
        this.videoTime++;
        if (this.videoTime >= 3) {
          this.videoTime = 0;
          this.videoNum++;
          this.instantiationRewardAd();
        }
        this.rewardedVideoAd.onLoad(function() {
          _this.rewardedVideoAd.show();
        });
        this.rewardedVideoAd.onClose(function(res) {
          res.isEnded ? _callBack(true) : _callBack(false);
        });
        this.rewardedVideoAd.onError(function(err) {
          console.log("\u89c6\u9891\u5e7f\u544a\u52a0\u8f7d\u5931\u8d25", err);
          GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u5e7f\u544a\u6b63\u5728\u51c6\u5907\u4e2d\uff0c\u8bf7\u91cd\u542f\u6216\u7a0d\u540e\u518d\u8bd5");
        });
        this.rewardedVideoAd.load();
      };
      OppoApi.prototype.createInsertAd = function() {
        return;
        var now;
        var ms;
        var insertAd;
      };
      OppoApi.createImage = function(_url) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve) {
              var tex = new cc.Texture2D();
              var img = new Image();
              img.onload = function() {};
              img.src = _url;
              tex.initWithElement(img);
              resolve(new cc.SpriteFrame(tex));
            }) ];
          });
        });
      };
      OppoApi.prototype.navigateToMiniProgram = function(_pkName) {
        qg.navigateToMiniGame({
          pkgName: _pkName,
          success: function() {},
          fail: function(res) {
            Log_1.default.error(JSON.stringify(res));
          }
        });
      };
      OppoApi.prototype.shortcut = function() {
        qg.hasShortcutInstalled({
          success: function(res) {
            false == res && qg.installShortcut({
              success: function() {},
              fail: function(err) {
                qg.installShortcut({
                  success: function(res) {
                    console.log("\u521b\u5efa\u6210\u529f");
                  },
                  fail: function(err) {
                    console.log("\u521b\u5efa\u5931\u8d25");
                  },
                  complete: function() {}
                });
              },
              complete: function() {}
            });
          },
          fail: function(err) {},
          complete: function() {}
        });
      };
      OppoApi.prototype.showNativeAd = function() {
        console.error("=====", DataManager_1.default.getInstance().oppoNatived);
        if (this.native_count >= 6) return;
        this.native_count = Caches_1.default.get(Caches_1.default.oppoNatived);
        if (new Date().getTime() - this.time < 6e4) {
          console.log("\u5f00\u5c40\u4e00\u5206\u949f");
          return;
        }
        var adUnitId = "272766";
        console.log("====showNativeAd===", adUnitId);
        var self = this;
        self.nativeAd = null;
        if (null == self.nativeAd) {
          self.nativeAd = qg.createNativeAd({
            adUnitId: adUnitId
          });
          console.log("===showNativeAd===", self.nativeAd);
          if (null == self.nativeAd || void 0 == self.nativeAd) return;
          self.nativeAd.onError(function(res) {
            console.error("===showNativeAd=onError:", res);
            self.hideNativeAd();
          });
          self.nativeAd.onLoad(function(res) {
            console.error("===showNativeAd=onLoad:", res);
            var nativeCurrentAd = null;
            res && res.adList && (nativeCurrentAd = res.adList.pop());
            if (null == nativeCurrentAd || void 0 == nativeCurrentAd) {
              self.hideNativeAd();
              return;
            }
            var element = nativeCurrentAd;
            self.nativeAd.reportAdShow({
              adId: element.adId
            });
            console.log("\u67e5\u770b", element);
            cc.loader.load({
              url: element.iconUrlList[0],
              type: "png"
            }, function(error, texture) {
              if (error) console.error("showNativeAd element.icon\uff1a", error); else {
                console.error("-----kongkong++++");
                var btnNode_1 = DataManager_1.default.getInstance().oppoNatived;
                if (!btnNode_1) {
                  console.error("=====kongkong=====");
                  return;
                }
                console.error("+++kongkong++++", btnNode_1.getComponent(cc.Sprite));
                var sprite = btnNode_1.getComponent(cc.Sprite);
                console.error("--------", sprite);
                sprite && (sprite.spriteFrame = new cc.SpriteFrame(texture));
                console.error("+++sprite++++", sprite);
                btnNode_1.on(cc.Node.EventType.TOUCH_END, function() {
                  console.error("btnNode TOUCH_END:", element.adId);
                  self.nativeAd.reportAdClick({
                    adId: element.adId
                  });
                }, self);
                btnNode_1.getChildByName("ad").getComponent(cc.Label).string = "\u5e7f\u544a";
                console.log("\u627e\u5230\u4e86ad", btnNode_1.getChildByName("ad").getComponent(cc.Label));
                var close = btnNode_1.getChildByName("close");
                var circle = btnNode_1.getChildByName("circle");
                close.active = true;
                circle.active = true;
                console.log("\u627e\u5230\u4e86Close", close);
                close.on(cc.Node.EventType.TOUCH_END, function() {
                  var value = Math.random();
                  console.log("\u5173\u95ed\u539f\u751f\u6982\u7387", value);
                  if (value < .9) {
                    btnNode_1.parent.destroy();
                    console.log("natived \u5e7f\u544a\u9690\u85cf", self.native_count, self.nativeAd);
                    self.native_count++;
                    Caches_1.default.set(Caches_1.default.oppoNatived, self.native_count);
                    self.nativeAd && (self.nativeAd = null);
                  }
                }, self);
              }
            });
          });
        }
        self.nativeAd.load();
      };
      OppoApi.prototype.hideNativeAd = function() {
        console.log("\u70b9\u51fb\u76d1\u542c");
        if (null != this.nativeAd) {
          this.nativeAd.destroy();
          this.nativeAd = null;
        }
      };
      OppoApi.prototype.createGameBannerAd = function() {
        return;
        var gamePortalAd;
      };
      var OppoApi_1;
      OppoApi.createNum = 0;
      OppoApi = OppoApi_1 = __decorate([ ccclass ], OppoApi);
      return OppoApi;
    }();
    exports.default = OppoApi;
    cc._RF.pop();
  }, {
    "../manager/Caches": "Caches",
    "../manager/Config": "Config",
    "../manager/DataManager": "DataManager",
    "../manager/GameSys": "GameSys",
    "../manager/Log": "Log"
  } ],
  OPPONative: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7ae0eqbZQ1EmpxX9+KVm9Ji", "OPPONative");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "";
    var OPPONatived = function(_super) {
      __extends(OPPONatived, _super);
      function OPPONatived() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      OPPONatived.prototype.onLoad = function() {};
      OPPONatived.prototype.onDestory = function() {
        console.log("\u9500\u6bc1\u8282\u70b9");
      };
      OPPONatived = __decorate([ ccclass ], OPPONatived);
      return OPPONatived;
    }(cc.Component);
    exports.default = OPPONatived;
    cc._RF.pop();
  }, {} ],
  PoolManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "33d31NECgJI6LhYQ2LZT3LF", "PoolManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PoolManager = function() {
      function PoolManager() {
        this._clientPool = new cc.NodePool();
        this.client = new cc.Prefab();
        this._goldPool = new cc.NodePool();
      }
      PoolManager.getInstance = function() {
        this.instance = this.instance ? this.instance : new PoolManager();
        return this.instance;
      };
      PoolManager.prototype.initGoldPool = function(prefab, size) {
        for (var i = 0; i < size; i++) {
          var block = cc.instantiate(prefab);
          this._goldPool.put(block);
        }
        this.gold = prefab;
      };
      PoolManager.prototype.getGold = function() {
        var block = null;
        block = this._goldPool.size() > 0 ? this._goldPool.get() : cc.instantiate(this.gold);
        return block;
      };
      PoolManager.prototype.clearGoldList = function(node) {
        this._goldPool.put(node);
      };
      PoolManager.prototype.clearGoldPool = function() {
        this._goldPool.clear();
      };
      PoolManager.prototype.initPool = function(prefab, size) {
        for (var i = 0; i < size; i++) {
          var block = cc.instantiate(prefab);
          this._clientPool.put(block);
        }
        this.client = prefab;
      };
      PoolManager.prototype.getBlock = function() {
        var block = null;
        block = this._clientPool.size() > 0 ? this._clientPool.get() : cc.instantiate(this.client);
        return block;
      };
      PoolManager.prototype.clearNodeList = function(node) {
        this._clientPool.put(node);
      };
      PoolManager.prototype.clearPool = function(v) {
        this._clientPool[v].clear();
      };
      return PoolManager;
    }();
    exports.default = PoolManager;
    cc._RF.pop();
  }, {} ],
  PopupBase: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ddb66MT6PBJrZKmyxSQZ+QS", "PopupBase");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PopupBase = function(_super) {
      __extends(PopupBase, _super);
      function PopupBase() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.background = null;
        _this.main = null;
        _this.blocker = null;
        _this.animTime = .3;
        _this.optios = null;
        _this.finishCallback = null;
        return _this;
      }
      PopupBase.prototype.onShow = function() {};
      PopupBase.prototype.onHide = function(hidByForce) {
        void 0 === hidByForce && (hidByForce = false);
      };
      PopupBase.prototype.show = function(options, time) {
        var _this = this;
        void 0 === time && (time = this.animTime);
        this.optios = options;
        this.background.opacity = 0;
        this.background.active = true;
        this.main.scale = 0;
        this.main.active = true;
        this.node.active = true;
        this.init(this.optios);
        if (0 === time) {
          this.background.opacity = 200;
          this.main.scale = 1;
          this.onShow && this.onShow();
          return;
        }
        cc.tween(this.background).to(.8 * this.animTime, {
          opacity: 200
        }).start();
        cc.tween(this.main).to(this.animTime, {
          scale: 1
        }, {
          easing: "backOut"
        }).call(function() {
          _this.onShow && _this.onShow();
        }).start();
      };
      PopupBase.prototype.hide = function(time, hidByForce) {
        var _this = this;
        void 0 === time && (time = this.animTime);
        void 0 === hidByForce && (hidByForce = false);
        if (0 === time) {
          this.node.active = false;
          this.onHide && this.onHide(hidByForce);
          this.finishCallback && this.finishCallback(hidByForce);
          return;
        }
        if (!this.blocker) {
          this.blocker = new cc.Node("blocker");
          this.blocker.addComponent(cc.BlockInputEvents);
          this.blocker.setParent(this.node);
          this.blocker.setContentSize(this.node.getContentSize());
        }
        this.blocker.active = true;
        cc.tween(this.background).delay(.2 * this.animTime).to(.8 * this.animTime, {
          opacity: 0
        }).call(function() {
          _this.background.active = false;
        }).start();
        cc.tween(this.main).to(this.animTime, {
          scale: 0
        }, {
          easing: "backIn"
        }).call(function() {
          _this.blocker.active = false;
          _this.main.active = false;
          _this.node.active = false;
          _this.onHide && _this.onHide();
          _this.finishCallback && _this.finishCallback();
        }).start();
      };
      PopupBase.prototype.init = function(options) {};
      PopupBase.prototype.updateDisplay = function(options) {};
      PopupBase.prototype.setFinishCallback = function(callback) {
        this.finishCallback = callback;
      };
      __decorate([ property({
        type: cc.Node,
        tooltip: false
      }) ], PopupBase.prototype, "background", void 0);
      __decorate([ property({
        type: cc.Node,
        tooltip: false
      }) ], PopupBase.prototype, "main", void 0);
      PopupBase = __decorate([ ccclass ], PopupBase);
      return PopupBase;
    }(cc.Component);
    exports.default = PopupBase;
    cc._RF.pop();
  }, {} ],
  PopupManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4e270P3fUlF1q9R80lO0LDw", "PopupManager");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PopupCacheMode = exports.PopupShowResult = exports.PopupShowPriority = void 0;
    var PopupBase_1 = require("../component/popups/PopupBase");
    var PopupManager = function() {
      function PopupManager() {}
      Object.defineProperty(PopupManager, "prefabMap", {
        get: function() {
          return this._prefabMap;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PopupManager, "nodeMap", {
        get: function() {
          return this._nodeMap;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PopupManager, "queue", {
        get: function() {
          return this._queue;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PopupManager, "currents", {
        get: function() {
          return this._currents;
        },
        enumerable: false,
        configurable: true
      });
      PopupManager.show = function(pathOrPrefab, options, cacheMode, priority) {
        var _this = this;
        void 0 === options && (options = null);
        void 0 === cacheMode && (cacheMode = PopupCacheMode.Normal);
        void 0 === priority && (priority = PopupShowPriority.None);
        return new Promise(function(res) {
          return __awaiter(_this, void 0, void 0, function() {
            var current, cur;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
               case 0:
                if (this._currents.length > 0 || this.reserved) if (priority === PopupShowPriority.Cover) ; else {
                  if (priority !== PopupShowPriority.Force) {
                    this.push(pathOrPrefab, options, cacheMode, priority);
                    return [ 2, res(PopupShowResult.Wait) ];
                  }
                  while (this._currents.length > 0) {
                    current = this._currents[0];
                    if (current.popup) {
                      this.hidByForce = true;
                      current.popup.hide(0, true);
                      this.hidByForce = false;
                    } else if (current.node) {
                      current.node.active = false;
                      current.node.destroy();
                      current.node = null;
                    }
                  }
                }
                cur = {
                  request: {
                    pathOrPrefab: pathOrPrefab,
                    options: options,
                    cacheMode: cacheMode
                  },
                  popup: null,
                  node: null
                };
                this._currents.push(cur);
                if (!("string" === typeof pathOrPrefab)) return [ 3, 3 ];
                this._currents.length > 0 && priority === PopupShowPriority.Cover ? this._prefabMap.has(pathOrPrefab) && (cur.node = cc.instantiate(this._prefabMap.get(pathOrPrefab))) : cur.node = this.getNodeFromCache(pathOrPrefab);
                if (!!cc.isValid(cur.node)) return [ 3, 2 ];
                this.loadStartCallback && this.loadStartCallback();
                return [ 4, new Promise(function(res) {
                  cc.resources.load(pathOrPrefab, function(error, prefab) {
                    if (!error) {
                      cur.node = cc.instantiate(prefab);
                      prefab.addRef();
                      _this._prefabMap.set(pathOrPrefab, prefab);
                    }
                    res(prefab);
                  });
                }) ];

               case 1:
                _a.sent();
                this.loadFinishCallback && this.loadFinishCallback();
                _a.label = 2;

               case 2:
                if (!cc.isValid(cur.node)) {
                  cc.warn("[PopupManager]", "\u5f39\u7a97\u52a0\u8f7d\u5931\u8d25", pathOrPrefab);
                  this._currents.splice(this._currents.indexOf(cur));
                  return [ 2, res(PopupShowResult.Fail) ];
                }
                return [ 3, 4 ];

               case 3:
                cur.node = cc.instantiate(pathOrPrefab);
                _a.label = 4;

               case 4:
                cur.node.setParent(cc.Canvas.instance.node);
                cur.node.setSiblingIndex(cc.macro.MAX_ZINDEX);
                cur.popup = cur.node.getComponent(PopupBase_1.default);
                if (cur.popup) {
                  cur.popup.setFinishCallback(function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      var _this = this;
                      return __generator(this, function(_a) {
                        switch (_a.label) {
                         case 0:
                          this.recycle(cur.request.pathOrPrefab, cur.node, cur.request.cacheMode);
                          this.reserved = this._queue.length > 0;
                          this._currents.splice(this._currents.indexOf(cur));
                          cur = null;
                          res(PopupShowResult.Done);
                          return [ 4, new Promise(function(res) {
                            cc.Canvas.instance.scheduleOnce(res, _this.interval);
                          }) ];

                         case 1:
                          _a.sent();
                          this.hidByForce || this.next();
                          return [ 2 ];
                        }
                      });
                    });
                  });
                  cur.popup.show(options);
                } else {
                  cur.node.active = true;
                  res(PopupShowResult.Dirty);
                }
                return [ 2 ];
              }
            });
          });
        });
      };
      PopupManager.getNodeFromCache = function(path) {
        if (this._nodeMap.has(path)) {
          var node = this._nodeMap.get(path);
          if (cc.isValid(node)) return node;
          this._nodeMap.delete(path);
        }
        if (this._prefabMap.has(path)) {
          var prefab = this._prefabMap.get(path);
          if (cc.isValid(prefab)) return cc.instantiate(prefab);
          this._prefabMap.delete(path);
        }
        return null;
      };
      PopupManager.next = function() {
        if (this._currents.length > 0 || 0 === this._queue.length) return;
        var request = this._queue.shift();
        this.reserved = false;
        this.show(request.pathOrPrefab, request.options, request.cacheMode);
      };
      PopupManager.push = function(pathOrPrefab, options, cacheMode, priority) {
        void 0 === options && (options = null);
        void 0 === cacheMode && (cacheMode = PopupCacheMode.Normal);
        void 0 === priority && (priority = PopupShowPriority.None);
        if (0 === this._currents.length && !this.reserved) {
          this.show(pathOrPrefab, options, cacheMode);
          return;
        }
        priority === PopupShowPriority.Prior ? this._queue.unshift({
          pathOrPrefab: pathOrPrefab,
          options: options,
          cacheMode: cacheMode
        }) : this._queue.push({
          pathOrPrefab: pathOrPrefab,
          options: options,
          cacheMode: cacheMode
        });
      };
      PopupManager.recycle = function(pathOrPrefab, node, cacheMode) {
        if ("string" !== typeof pathOrPrefab) {
          node.destroy();
          return;
        }
        switch (cacheMode) {
         case PopupCacheMode.Once:
          node.destroy();
          this._nodeMap.has(pathOrPrefab) && this._nodeMap.delete(pathOrPrefab);
          for (var i = 0; i < this._currents.length; i++) if (this._currents[i].request.pathOrPrefab === pathOrPrefab) return;
          this.release(pathOrPrefab);
          break;

         case PopupCacheMode.Normal:
          node.destroy();
          this._nodeMap.has(pathOrPrefab) && this._nodeMap.delete(pathOrPrefab);
          break;

         case PopupCacheMode.Frequent:
          node.removeFromParent(false);
          this._nodeMap.has(pathOrPrefab) || this._nodeMap.set(pathOrPrefab, node);
        }
      };
      PopupManager.release = function(path) {
        var prefab = this._prefabMap.get(path);
        if (prefab) {
          this._prefabMap.delete(path);
          prefab.decRef();
          prefab = null;
        }
      };
      PopupManager.hasCurrent = function() {
        if (0 === this._currents.length) return false;
        for (var i = 0; i < this._currents.length; i++) if (null !== this._currents[i]) return true;
        return false;
      };
      PopupManager._prefabMap = new Map();
      PopupManager._nodeMap = new Map();
      PopupManager._queue = [];
      PopupManager._currents = [];
      PopupManager.reserved = false;
      PopupManager.hidByForce = false;
      PopupManager.interval = .1;
      PopupManager.loadStartCallback = null;
      PopupManager.loadFinishCallback = null;
      return PopupManager;
    }();
    exports.default = PopupManager;
    var PopupShowPriority;
    (function(PopupShowPriority) {
      PopupShowPriority[PopupShowPriority["None"] = 1] = "None";
      PopupShowPriority[PopupShowPriority["Prior"] = 2] = "Prior";
      PopupShowPriority[PopupShowPriority["Force"] = 3] = "Force";
      PopupShowPriority[PopupShowPriority["Cover"] = 4] = "Cover";
    })(PopupShowPriority = exports.PopupShowPriority || (exports.PopupShowPriority = {}));
    var PopupShowResult;
    (function(PopupShowResult) {
      PopupShowResult[PopupShowResult["Done"] = 1] = "Done";
      PopupShowResult[PopupShowResult["Fail"] = 2] = "Fail";
      PopupShowResult[PopupShowResult["Wait"] = 3] = "Wait";
      PopupShowResult[PopupShowResult["Dirty"] = 4] = "Dirty";
    })(PopupShowResult = exports.PopupShowResult || (exports.PopupShowResult = {}));
    var PopupCacheMode;
    (function(PopupCacheMode) {
      PopupCacheMode[PopupCacheMode["Once"] = 1] = "Once";
      PopupCacheMode[PopupCacheMode["Normal"] = 2] = "Normal";
      PopupCacheMode[PopupCacheMode["Frequent"] = 3] = "Frequent";
    })(PopupCacheMode = exports.PopupCacheMode || (exports.PopupCacheMode = {}));
    cc._RF.pop();
  }, {
    "../component/popups/PopupBase": "PopupBase"
  } ],
  PopupTest: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4622a9S8fZEHbTHWrX/p5Q+", "PopupTest");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupManager_1 = require("./common/manager/PopupManager");
    var TestPopup_1 = require("./TestPopup");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PopupTest = function(_super) {
      __extends(PopupTest, _super);
      function PopupTest() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.btn = null;
        return _this;
      }
      PopupTest.prototype.onLoad = function() {
        this.registerEvent();
      };
      PopupTest.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      PopupTest.prototype.registerEvent = function() {
        this.btn.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
      };
      PopupTest.prototype.unregisterEvent = function() {
        this.btn.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
      };
      PopupTest.prototype.onClick = function() {
        var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
        PopupManager_1.default.show(TestPopup_1.default.path, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
      };
      __decorate([ property(cc.Node) ], PopupTest.prototype, "btn", void 0);
      PopupTest = __decorate([ ccclass ], PopupTest);
      return PopupTest;
    }(cc.Component);
    exports.default = PopupTest;
    cc._RF.pop();
  }, {
    "./TestPopup": "TestPopup",
    "./common/manager/PopupManager": "PopupManager"
  } ],
  Production: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f1cd81HEWtGfreSuDb3QnzH", "Production");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AStar_1 = require("../common/component/AStar");
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var MathManager_1 = require("../common/manager/MathManager");
    var PoolManager_1 = require("../common/manager/PoolManager");
    var StaticManager_1 = require("../common/manager/StaticManager");
    var Client_1 = require("./Client");
    var Staff_1 = require("./Staff");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Production";
    var Production = function(_super) {
      __extends(Production, _super);
      function Production() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.hand = null;
        _this.solicit = null;
        _this.mask = null;
        _this.staff = null;
        _this.client = null;
        _this.recruit = [];
        _this.all_move = [];
        _this.time = [ 8, 9, 10 ];
        _this.count = 1e3;
        _this.shop_pos = [];
        return _this;
      }
      Production_1 = Production;
      Production.getInstance = function() {
        this.instance = this.instance ? this.instance : new Production_1();
        return this.instance;
      };
      Production.prototype.onLoad = function() {
        var _this = this;
        _super.prototype.onLoad.call(this);
        this.recruit = GameSys_1.default.game.xGet(Config_1.Config.RECRUIT);
        this.Map_Path = [];
        this.Map_Path = MathManager_1.default.getInstance().transformArray(Config_1.JSON_PATH);
        MathManager_1.default.getInstance().visitLinearArray(Config_1.SHOP_POS, function(i) {
          _this.shop_pos[i] = 0;
        });
        GameSys_1.default.game.xSet(Config_1.Config.SHOP_POS, this.shop_pos);
        PoolManager_1.default.getInstance().initPool(this.client, 100);
        if (Caches_1.default.get(Caches_1.default.newGuide)) {
          this.create_customer();
          var time_1 = this.time[Math.floor(Math.random() * this.time.length)];
          var cb_1 = function() {
            _this.create_customer();
            time_1 = _this.time[Math.floor(Math.random() * _this.time.length)];
            _this.scheduleOnce(function() {
              cb_1();
            }, time_1);
          };
          this.scheduleOnce(cb_1, time_1);
          this.limit_pos();
          this.add_staff();
        } else ;
      };
      Production.prototype.onEnable = function() {
        GameSys_1.default.game.xBind(Config_1.Config.SHOP_POS_CHANGE, this.shopChange.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.RECRUITCHANGE, this.recruit_change.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.LOCKROOM, this.limit_pos.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.HIDEALL, this.hideAll.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.SHOP_POS, this.shop_pos_bind.bind(this), BINDER_NAME);
        if (!Caches_1.default.get(Caches_1.default.newGuide)) {
          this.solicit.parent.active = false;
          this.hand.active = false;
          GameSys_1.default.game.xBind(Config_1.Config.NEWGUIDECON, this.newGuide.bind(this), BINDER_NAME);
        }
        Caches_1.default.get(Caches_1.default.hand) ? this.hand.active = false : this.hand.active = true;
      };
      Production.prototype.start = function() {
        this.solicit.on(cc.Node.EventType.TOUCH_START, this.onTochSolicit.bind(this));
      };
      Production.prototype.newGuide = function(v) {
        var _this = this;
        14 == v && this.create_customer();
        if (33 == v) {
          this.solicit.parent.active = true;
          this.hand.active = true;
          GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSCHANGE, {
            index: 0,
            level: 1,
            dirty: Config_1.BUILDINGS[0].max_dirty - 10,
            upgrade: 0
          });
          GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSCHANGE, {
            index: 3,
            level: 1,
            dirty: Config_1.BUILDINGS[9].max_dirty - 10,
            upgrade: 0
          });
          this.create_customer();
          var time_2 = this.time[Math.floor(Math.random() * this.time.length)];
          var cb_2 = function() {
            _this.create_customer();
            time_2 = _this.time[Math.floor(Math.random() * _this.time.length)];
            _this.scheduleOnce(function() {
              cb_2();
            }, time_2);
          };
          this.scheduleOnce(cb_2, time_2);
          this.limit_pos();
          this.add_staff();
        }
      };
      Production.prototype.hideAll = function(v) {
        if (v) for (var i = 0; i < this.node.childrenCount; i++) this.node.children[i].opacity = 0; else for (var i = 0; i < this.node.childrenCount; i++) this.node.children[i].opacity = 255;
      };
      Production.prototype.create_customer = function() {
        var pos = this.shop_pos_change();
        if (pos.length <= 0) {
          return;
          var count_1;
          var client_1;
        }
        this.count++;
        var index = Math.floor(Math.random() * pos.length);
        this.shop_pos[pos[index]] = 1;
        GameSys_1.default.game.xSet(Config_1.Config.SHOP_POS, this.shop_pos);
        this.posEnd = Config_1.SHOP_POS[pos[index]];
        this.initMap();
        this.findPath(this.posStart, this.posEnd);
        var client = cc.instantiate(this.client);
        client.parent = this.node;
        GameSys_1.default.game.xGet(Config_1.Config.HIDEALL) ? client.opacity = 0 : client.opacity = 255;
        client.getComponent(Client_1.default).initPath(this.path, this.posStart, pos[index], this.count);
        client.scale = .17;
        pos = [];
      };
      Production.prototype.shopChange = function(v) {
        this.shop_pos[v] = 0;
        GameSys_1.default.game.xSet(Config_1.Config.SHOP_POS, this.shop_pos);
      };
      Production.prototype.shop_pos_change = function() {
        var _this = this;
        var no_zero = [];
        MathManager_1.default.getInstance().visitLinearArray(this.shop_pos, function(i) {
          1 != _this.shop_pos[i] && no_zero.push(i);
        });
        return no_zero;
      };
      Production.prototype.shop_pos_bind = function() {
        this.shop_pos = GameSys_1.default.game.xGet(Config_1.Config.SHOP_POS);
      };
      Production.prototype.onTochSolicit = function() {
        GameSys_1.default.audio.playSFX("audios/button");
        this.mask.height += 8;
        if (this.mask.height > 40) {
          if (!Caches_1.default.get(Caches_1.default.hand)) {
            Caches_1.default.set(Caches_1.default.hand, true);
            this.hand.active = false;
          }
          this.mask.height = 0;
          this.create_customer();
        }
      };
      Production.prototype.limit_pos = function() {
        var _this = this;
        this.all_move = [];
        MathManager_1.default.getInstance().visitLinearArray(Config_1.STAFF_MOVE_LOO, function(i) {
          _this.all_move.push(Config_1.STAFF_MOVE_LOO[i]);
        });
        MathManager_1.default.getInstance().visitLinearArray(Config_1.STAFF_MOVE_TOILET_1, function(i) {
          _this.all_move.push(Config_1.STAFF_MOVE_TOILET_1[i]);
        });
        MathManager_1.default.getInstance().visitLinearArray(Config_1.STAFF_MOVE_WAREHOUSE, function(i) {
          _this.all_move.push(Config_1.STAFF_MOVE_WAREHOUSE[i]);
        });
        3 == StaticManager_1.default.getInstance().open_buildings.length && MathManager_1.default.getInstance().visitLinearArray(Config_1.STAFF_MOVE_TOILET_2, function(i) {
          _this.all_move.push(Config_1.STAFF_MOVE_TOILET_2[i]);
        });
        4 == StaticManager_1.default.getInstance().open_buildings.length && MathManager_1.default.getInstance().visitLinearArray(Config_1.STAFF_MOVE_TOILET_3, function(i) {
          _this.all_move.push(Config_1.STAFF_MOVE_TOILET_3[i]);
        });
      };
      Production.prototype.add_staff = function() {
        var _this = this;
        MathManager_1.default.getInstance().visitLinearArray(this.recruit, function(i) {
          setTimeout(function() {
            if (0 != _this.recruit[i]) {
              var posStart = _this.all_move[Math.floor(Math.random() * _this.all_move.length)];
              var staff = cc.instantiate(_this.staff);
              staff.parent = _this.node;
              staff.scale = .23;
              staff.getComponent(Staff_1.default).initPath(posStart, Config_1.RECRUIT[i], i);
              StaticManager_1.default.getInstance().staff.push(i);
            }
          }, 500 * i);
        });
      };
      Production.prototype.recruit_change = function(_data) {
        if (1 == _data.state) {
          var posStart = this.all_move[Math.floor(Math.random() * this.all_move.length)];
          var staff = cc.instantiate(this.staff);
          staff.parent = this.node;
          staff.scale = .23;
          staff.getComponent(Staff_1.default).initPath(posStart, Config_1.RECRUIT[_data.index], _data.index);
          StaticManager_1.default.getInstance().staff.push(_data.index);
        } else {
          var indexOf = StaticManager_1.default.getInstance().staff.indexOf(_data.index);
          StaticManager_1.default.getInstance().staff.splice(indexOf, 1);
          console.log("\u89e3\u96c7", StaticManager_1.default.getInstance().staff);
        }
      };
      Production.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      var Production_1;
      __decorate([ property(cc.Node) ], Production.prototype, "hand", void 0);
      __decorate([ property(cc.Node) ], Production.prototype, "solicit", void 0);
      __decorate([ property(cc.Node) ], Production.prototype, "mask", void 0);
      __decorate([ property(cc.Prefab) ], Production.prototype, "staff", void 0);
      __decorate([ property(cc.Prefab) ], Production.prototype, "client", void 0);
      Production = Production_1 = __decorate([ ccclass ], Production);
      return Production;
    }(AStar_1.default);
    exports.default = Production;
    cc._RF.pop();
  }, {
    "../common/component/AStar": "AStar",
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/MathManager": "MathManager",
    "../common/manager/PoolManager": "PoolManager",
    "../common/manager/StaticManager": "StaticManager",
    "./Client": "Client",
    "./Staff": "Staff"
  } ],
  Props: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c39f84ZMglMhoDKlLUFbkXL", "Props");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UtilsManager_1 = require("../manager/UtilsManager");
    var Props = function() {
      function Props() {
        this.flag = "";
        this.props = {};
      }
      Props.prototype.destroy = function() {
        this.vclear();
      };
      Props.prototype.xflag = function(_flag) {
        this.flag = _flag;
      };
      Props.prototype.xSet = function(key, value, notify) {
        void 0 === value && (value = null);
        void 0 === notify && (notify = true);
        if ("" == key) return false;
        var p = this.props[key];
        null != p ? p.v = value : this.props[key] = {
          v: value,
          v2: value,
          t: []
        };
        notify && this._notify(this.props[key]);
        value && (this.props[key].v2 = UtilsManager_1.default.clone(value));
        return true;
      };
      Props.prototype.xGet = function(key, def) {
        void 0 === def && (def = null);
        var p = this._query(key);
        return p ? p.v : def;
      };
      Props.prototype.xBind = function(key, callback, tag) {
        void 0 === tag && (tag = "");
        if ("" == tag) return false;
        var p = this._query(key);
        if (null == p) return false;
        for (var i = 0; i < p.t.length; i++) {
          var cb = p.t[i];
          if (cb == callback) return false;
        }
        p.t.push({
          cb: callback,
          tag: tag
        });
        return true;
      };
      Props.prototype._query = function(_key) {
        if ("" == _key) return null;
        var p = this.props[_key];
        if ("undefined" == typeof p) return null;
        return p;
      };
      Props.prototype._notify = function(_prop) {
        for (var i in _prop.t) {
          var t = _prop.t[i];
          t && "function" == typeof t.cb && t.cb(_prop.v, _prop.v2);
        }
      };
      Props.prototype.xUnbind = function(tag) {
        if ("" == tag) return false;
        var count = 0;
        for (var k in this.props) {
          var p = this.props[k];
          for (var i = p.t.length - 1; i >= 0; i--) {
            var t = p.t[i];
            if (t && t.tag == tag) {
              p.t.splice(i, 1);
              count++;
            }
          }
        }
        return true;
      };
      Props.prototype.vclear = function() {
        this.props = {};
      };
      return Props;
    }();
    exports.default = Props;
    cc._RF.pop();
  }, {
    "../manager/UtilsManager": "UtilsManager"
  } ],
  Recruit_Item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d3763xcwSlKa4nYCITvLc1A", "Recruit_Item");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var StateManager_1 = require("../common/manager/StateManager");
    var UtilsManager_1 = require("../common/manager/UtilsManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "";
    var RecruitItem = function(_super) {
      __extends(RecruitItem, _super);
      function RecruitItem() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.buy = null;
        _this.reduce = null;
        _this.lvl = null;
        _this.head = null;
        _this.name_lab = null;
        _this.efficiency_lab = null;
        _this.time_lab = null;
        _this.price_lab = null;
        _this.star = null;
        _this.state = null;
        _this.ID = 0;
        _this.watchvideo = false;
        return _this;
      }
      RecruitItem.prototype.init = function(_state, recruit) {
        return __awaiter(this, void 0, void 0, function() {
          var _a;
          var _this = this;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              this.efficiency_lab.string = "";
              this.time_lab.string = "";
              this.price_lab.string = "";
              this.recruitInfo = recruit;
              this.state.stateChange(_state);
              this.ID = recruit.ID;
              this.name_lab.string = recruit.name;
              this.efficiency_lab.string = "\u6253\u626b\u65f6\u95f4:" + recruit.efficiency.toString() + "\u79d2/\u6b21";
              this.time_lab.string = "\u4f11\u606f\u65f6\u95f4:" + recruit.time.toString() + "\u79d2/\u6b21";
              this.price_lab.string = "\u62db\u52df\u4ef7\u683c:" + recruit.price.toString();
              if (3 == this.ID || 7 == this.ID) {
                this.price_lab.node.x = -36;
                if (0 == _state) {
                  this.price_lab.string = "\u89c6\u9891\u83b7\u5f97";
                  this.state.node.children[0].children[0].active = true;
                  this.watchvideo = true;
                  this.state.node.children[0].children[1].active = true;
                } else {
                  this.price_lab.string = "\u89c6\u9891\u83b7\u5f97";
                  this.state.node.children[0].children[0].active = false;
                  this.watchvideo = false;
                }
              }
              0 == _state && 3 !== this.ID && 7 !== this.ID && GameSys_1.default.judgeGold(recruit.price, function() {
                _this.state.node.children[0].children[1].active = false;
              }, function() {
                _this.state.node.children[0].children[1].active = true;
              });
              recruit.level > 5 ? this.star.stateChange(5) : this.star.stateChange(recruit.level - 1);
              _a = this.head;
              return [ 4, UtilsManager_1.default.loadImage("staff/staff_" + recruit.ID) ];

             case 1:
              _a.spriteFrame = _b.sent();
              this.lvl.color = new cc.Color().fromHEX(recruit.color);
              return [ 2 ];
            }
          });
        });
      };
      RecruitItem.prototype.onTouchRecruit = function() {
        var _this = this;
        var cb = function() {
          GameSys_1.default.game.xSet(Config_1.Config.TIP, _this.recruitInfo.name + Config_1.TipLab.recruited);
          GameSys_1.default.game.xSet(Config_1.Config.RECRUITCHANGE, {
            index: _this.ID - 1,
            state: 1
          });
          _this.state.stateChange(1);
          GameSys_1.default.game.xSet(Config_1.Config.ALLRED);
        };
        this.watchvideo ? GameSys_1.default.watchVideo(5, cb) : GameSys_1.default.useGold(-this.recruitInfo.price, function() {
          var goldAnim = cc.instantiate(_this.reduce);
          _this.buy.addChild(goldAnim);
          goldAnim.y = -30;
          goldAnim.x = 0;
          goldAnim.children[0].getComponent(cc.Label).string = "-" + _this.recruitInfo.price.toFixed(0);
          goldAnim.children[0].color = cc.Color.BLACK;
          cc.tween(goldAnim).to(1, {
            y: goldAnim.y - 30,
            opacity: 100
          }).call(function() {
            cb();
            goldAnim.destroy();
          }).start();
        });
      };
      RecruitItem.prototype.onTouchDismissal = function() {
        GameSys_1.default.game.xSet(Config_1.Config.TIP, this.recruitInfo.name + Config_1.TipLab.dissmissal);
        GameSys_1.default.game.xSet(Config_1.Config.RECRUITCHANGE, {
          index: this.ID - 1,
          state: 0
        });
        this.state.stateChange(0);
        if (3 == this.ID || 7 == this.ID) {
          this.price_lab.node.x = -36;
          this.price_lab.string = "\u89c6\u9891\u83b7\u5f97";
          this.state.node.children[0].children[0].active = true;
          this.watchvideo = true;
        }
        GameSys_1.default.game.xSet(Config_1.Config.ALLRED);
      };
      __decorate([ property(cc.Node) ], RecruitItem.prototype, "buy", void 0);
      __decorate([ property(cc.Prefab) ], RecruitItem.prototype, "reduce", void 0);
      __decorate([ property(cc.Node) ], RecruitItem.prototype, "lvl", void 0);
      __decorate([ property(cc.Sprite) ], RecruitItem.prototype, "head", void 0);
      __decorate([ property(cc.Label) ], RecruitItem.prototype, "name_lab", void 0);
      __decorate([ property(cc.Label) ], RecruitItem.prototype, "efficiency_lab", void 0);
      __decorate([ property(cc.Label) ], RecruitItem.prototype, "time_lab", void 0);
      __decorate([ property(cc.Label) ], RecruitItem.prototype, "price_lab", void 0);
      __decorate([ property(StateManager_1.default) ], RecruitItem.prototype, "star", void 0);
      __decorate([ property(StateManager_1.default) ], RecruitItem.prototype, "state", void 0);
      RecruitItem = __decorate([ ccclass ], RecruitItem);
      return RecruitItem;
    }(cc.Component);
    exports.default = RecruitItem;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/StateManager": "StateManager",
    "../common/manager/UtilsManager": "UtilsManager"
  } ],
  Recruit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7c03dLFQ39MDbEhuxDdnnb5", "Recruit");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupBase_1 = require("../common/component/popups/PopupBase");
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var Recruit_Item_1 = require("./Recruit_Item");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "RecruitNEW";
    var Recruit = function(_super) {
      __extends(Recruit, _super);
      function Recruit() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.page_1 = null;
        _this.content_1 = null;
        _this.item = null;
        return _this;
      }
      Recruit.prototype.onLoad = function() {
        this.addChild();
      };
      Recruit.prototype.onEnable = function() {
        this.node.zIndex = 10;
        if (Caches_1.default.get(Caches_1.default.newGuide)) {
          GameSys_1.default.game.xSet(Config_1.Config.OPPO, true);
          GameSys_1.default.showBanner();
          GameSys_1.default.showInter();
        }
      };
      Recruit.prototype.start = function() {};
      Recruit.prototype.onDisable = function() {
        Caches_1.default.get(Caches_1.default.newGuide) && GameSys_1.default.hideBanner();
      };
      Recruit.prototype.addChild = function() {
        this.recuit = GameSys_1.default.game.xGet(Config_1.Config.RECRUIT);
        for (var i = 0; i < Math.ceil(Config_1.RECRUIT.length / 5); i++) {
          var page_recruit = this.content_1.children[i];
          for (var j = 0; j < page_recruit.childrenCount; j++) if (5 * i + j < Config_1.RECRUIT.length) {
            var item = cc.instantiate(this.item);
            page_recruit.children[j].addChild(item);
            item.setPosition(cc.v2(0, 0));
            item.getComponent(Recruit_Item_1.default).init(this.recuit[5 * i + j], Config_1.RECRUIT[5 * i + j]);
          }
        }
      };
      Recruit.prototype.onTouchLeft = function() {
        this.page_1.scrollToPage(this.page_1.getCurrentPageIndex() - 1, .3);
      };
      Recruit.prototype.onTouchRight = function() {
        this.page_1.scrollToPage(this.page_1.getCurrentPageIndex() + 1, .3);
      };
      Recruit.prototype.onTouchClose = function() {
        this.hide();
      };
      Recruit.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.PageView) ], Recruit.prototype, "page_1", void 0);
      __decorate([ property(cc.Node) ], Recruit.prototype, "content_1", void 0);
      __decorate([ property(cc.Prefab) ], Recruit.prototype, "item", void 0);
      Recruit = __decorate([ ccclass ], Recruit);
      return Recruit;
    }(PopupBase_1.default);
    exports.default = Recruit;
    cc._RF.pop();
  }, {
    "../common/component/popups/PopupBase": "PopupBase",
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "./Recruit_Item": "Recruit_Item"
  } ],
  SDK: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "76f97IFV49Is64RPTR2zu6D", "SDK");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Props_1 = require("../kernels/Props");
    var Log_1 = require("../manager/Log");
    var GameSys_1 = require("../manager/GameSys");
    var SDK = function(_super) {
      __extends(SDK, _super);
      function SDK() {
        var _this = _super.call(this) || this;
        _this.Instance = null;
        _this.config = {
          switch: true
        };
        _this.videoNum = 0;
        _this.xSet("bannerAd", null, false);
        _this.xSet("createBanner", {}, false);
        _this.xSet("hideBanner", null, false);
        _this.xSet("destroyBanner", null, false);
        _this.xSet("moreGames", null, false);
        _this.xSet("startRec", null, false);
        _this.xSet("stopRec", null, false);
        _this.xSet("preloadAdVideos", null, false);
        _this.xSet("getAntiAddiction", null, false);
        _this.xSet("favoriteGuide", null, false);
        _this.xSet("share", null, false);
        _this.xSet("showInter", null, false);
        _this.xSet("shortcut", null, false);
        _this.xSet("showNativeAd", null, false);
        _this.xSet("hideNative", null, false);
        Log_1.default.info("\u521d\u59cb\u5316sdk\u670d\u52a1\u6210\u529f");
        return _this;
      }
      SDK.prototype.load = function(_channel_id, _game_name) {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve) {
              return __awaiter(_this, void 0, void 0, function() {
                var config, err_1;
                return __generator(this, function(_a) {
                  switch (_a.label) {
                   case 0:
                    _a.trys.push([ 0, 2, , 3 ]);
                    return [ 4, GameSys_1.default.http.get("/api/getConfig", {
                      channel_id: _channel_id,
                      game_name: _game_name
                    }) ];

                   case 1:
                    config = _a.sent();
                    this.config = config.config;
                    console.log("\u52a0\u8f7d\u4fe1\u606f", this.config);
                    resolve(true);
                    return [ 3, 3 ];

                   case 2:
                    err_1 = _a.sent();
                    resolve(false);
                    console.log("\u52a0\u8f7d\u5931\u8d25", JSON.parse(err_1));
                    return [ 3, 3 ];

                   case 3:
                    return [ 2 ];
                  }
                });
              });
            }) ];
          });
        });
      };
      SDK.prototype.watchVideo = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve) {
              _this.Instance.createRewardedVideoAd(function(res) {
                resolve(!!res);
              });
            }) ];
          });
        });
      };
      SDK.prototype.shareApp = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            if ("blank" == GameSys_1.default.channel) return [ 2, true ];
            return [ 2, new Promise(function(resolve) {
              _this.Instance.shareAppMessage(function(res) {
                resolve(!!res);
              });
            }) ];
          });
        });
      };
      SDK.prototype.issueVideo = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve) {
              _this.Instance.issueVideo(function(res) {
                resolve(!!res);
              });
            }) ];
          });
        });
      };
      SDK.createImage = function(_url) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, this.sdkInstance.createImage(_url) ];

             case 1:
              return [ 2, _a.sent() ];
            }
          });
        });
      };
      SDK.sdkInstance = null;
      SDK.clickTime = 0;
      SDK = __decorate([ ccclass ], SDK);
      return SDK;
    }(Props_1.default);
    exports.default = SDK;
    cc._RF.pop();
  }, {
    "../kernels/Props": "Props",
    "../manager/GameSys": "GameSys",
    "../manager/Log": "Log"
  } ],
  Scratch_ticket: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "53873XoNHBPoLV1IALfq7bz", "Scratch_ticket");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var CALC_RECT_WIDTH = 30;
    var CLEAR_LINE_WIDTH = 30;
    var Scratch_ticket = function(_super) {
      __extends(Scratch_ticket, _super);
      function Scratch_ticket() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.maskNode = null;
        _this.ticketNode = null;
        _this.progerss = null;
        _this.calcDebugger = false;
        _this.tempDrawPoints = [];
        _this.polygonPointsList = [];
        return _this;
      }
      Scratch_ticket.prototype.onLoad = function() {
        this.reset();
        this.ticketNode.on(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this);
        this.ticketNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
        this.ticketNode.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, this);
        this.ticketNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this);
      };
      Scratch_ticket.prototype.beforeDestroy = function() {
        this.ticketNode.off(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this);
        this.ticketNode.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
        this.ticketNode.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, this);
        this.ticketNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this);
      };
      Scratch_ticket.prototype.touchStartEvent = function(event) {
        var point = this.ticketNode.convertToNodeSpaceAR(event.getLocation());
        this.clearMask(point);
      };
      Scratch_ticket.prototype.touchMoveEvent = function(event) {
        var point = this.ticketNode.convertToNodeSpaceAR(event.getLocation());
        this.clearMask(point);
      };
      Scratch_ticket.prototype.touchEndEvent = function() {
        this.tempDrawPoints = [];
        this.calcProgress();
      };
      Scratch_ticket.prototype.calcProgress = function() {
        var _this = this;
        var hitItemCount = 0;
        var ctx = this.ticketNode.getComponent(cc.Graphics);
        this.polygonPointsList.forEach(function(item) {
          if (!item.isHit) return;
          hitItemCount += 1;
          if (!_this.calcDebugger) return;
          ctx.rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
          ctx.fillColor = cc.color(216, 18, 18, 255);
          ctx.fill();
        });
        this.progerss.string = "\u5df2\u7ecf\u522e\u5f00\u4e86 " + Math.ceil(hitItemCount / this.polygonPointsList.length * 100) + "%";
      };
      Scratch_ticket.prototype.clearMask = function(pos) {
        var mask = this.maskNode.getComponent(cc.Mask);
        var stencil = mask._graphics;
        var len = this.tempDrawPoints.length;
        this.tempDrawPoints.push(pos);
        if (len <= 1) {
          stencil.circle(pos.x, pos.y, CLEAR_LINE_WIDTH / 2);
          stencil.fill();
          this.polygonPointsList.forEach(function(item) {
            if (item.isHit) return;
            var xFlag = pos.x > item.rect.x && pos.x < item.rect.x + item.rect.width;
            var yFlag = pos.y > item.rect.y && pos.y < item.rect.y + item.rect.height;
            xFlag && yFlag && (item.isHit = true);
          });
        } else {
          var prevPos_1 = this.tempDrawPoints[len - 2];
          var curPos_1 = this.tempDrawPoints[len - 1];
          stencil.moveTo(prevPos_1.x, prevPos_1.y);
          stencil.lineTo(curPos_1.x, curPos_1.y);
          stencil.lineWidth = CLEAR_LINE_WIDTH;
          stencil.lineCap = cc.Graphics.LineCap.ROUND;
          stencil.lineJoin = cc.Graphics.LineJoin.ROUND;
          stencil.strokeColor = cc.color(255, 255, 255, 255);
          stencil.stroke();
          this.polygonPointsList.forEach(function(item) {
            item.isHit = item.isHit || cc.Intersection.lineRect(prevPos_1, curPos_1, item.rect);
          });
        }
      };
      Scratch_ticket.prototype.reset = function() {
        var mask = this.maskNode.getComponent(cc.Mask);
        mask._graphics.clear();
        this.tempDrawPoints = [];
        this.polygonPointsList = [];
        this.progerss.string = "\u5df2\u7ecf\u522e\u5f00\u4e86 0%";
        this.ticketNode.getComponent(cc.Graphics).clear();
        for (var x = 0; x < this.ticketNode.width; x += CALC_RECT_WIDTH) for (var y = 0; y < this.ticketNode.height; y += CALC_RECT_WIDTH) this.polygonPointsList.push({
          rect: cc.rect(x - this.ticketNode.width / 2, y - this.ticketNode.height / 2, CALC_RECT_WIDTH, CALC_RECT_WIDTH),
          isHit: false
        });
      };
      __decorate([ property(cc.Node) ], Scratch_ticket.prototype, "maskNode", void 0);
      __decorate([ property(cc.Node) ], Scratch_ticket.prototype, "ticketNode", void 0);
      __decorate([ property(cc.Label) ], Scratch_ticket.prototype, "progerss", void 0);
      Scratch_ticket = __decorate([ ccclass ], Scratch_ticket);
      return Scratch_ticket;
    }(cc.Component);
    exports.default = Scratch_ticket;
    cc._RF.pop();
  }, {} ],
  ScrollItemPre: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "37a06LeS0NCPKtON5rh1+TE", "ScrollItemPre");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ScrollItemPre = function(_super) {
      __extends(ScrollItemPre, _super);
      function ScrollItemPre() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.picSprite = null;
        _this.descLabel = null;
        _this.placeHolderContentNode = null;
        _this.placeHolderLoadingNode = null;
        _this.data = null;
        return _this;
      }
      ScrollItemPre.prototype.onLoad = function() {
        this.node.opacity = 0;
      };
      ScrollItemPre.prototype.init = function(_data) {
        this.data = _data;
      };
      ScrollItemPre.prototype.onEnterSrcollView = function() {
        this.node.opacity = 255;
        this._loadAndShowPic();
      };
      ScrollItemPre.prototype.onExitScrollView = function() {
        this.node.opacity = 0;
      };
      ScrollItemPre.prototype._showPlaceHolder = function() {
        this.placeHolderContentNode.active = true;
        this.placeHolderContentNode.stopAllActions();
        this.placeHolderContentNode.opacity = 255;
        this.placeHolderLoadingNode.stopAllActions();
        cc.tween(this.placeHolderContentNode).by(1, {
          angle: 360
        }).union().repeatForever().start();
      };
      ScrollItemPre.prototype._loadAndShowPic = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this._showPlaceHolder();
              return [ 4, new Promise(function(resolve, reject) {
                setTimeout(function() {
                  resolve();
                }, 160);
              }) ];

             case 1:
              _a.sent();
              this._hidePlaceHolder();
              return [ 2 ];
            }
          });
        });
      };
      ScrollItemPre.prototype._hidePlaceHolder = function() {
        var _this = this;
        this.placeHolderContentNode.stopAllActions();
        cc.tween(this.placeHolderContentNode).delay(.24).call(function() {
          _this.placeHolderContentNode.active = false;
          _this.placeHolderLoadingNode.stopAllActions();
        }).start();
      };
      ScrollItemPre.prototype.loadSpriteFrameFromResources = function(spriteFrameUrl) {
        return new Promise(function(resolve, reject) {
          cc.loader.loadRes(spriteFrameUrl, cc.SpriteFrame, function(error, spriteFrame) {
            if (null != error) {
              true;
              cc.error("load (" + spriteFrameUrl + ") failed!");
              cc.error(error);
              reject(error);
              return;
            }
            resolve(spriteFrame);
          });
        });
      };
      __decorate([ property(cc.Sprite) ], ScrollItemPre.prototype, "picSprite", void 0);
      __decorate([ property(cc.Label) ], ScrollItemPre.prototype, "descLabel", void 0);
      __decorate([ property(cc.Node) ], ScrollItemPre.prototype, "placeHolderContentNode", void 0);
      __decorate([ property(cc.Node) ], ScrollItemPre.prototype, "placeHolderLoadingNode", void 0);
      ScrollItemPre = __decorate([ ccclass ], ScrollItemPre);
      return ScrollItemPre;
    }(cc.Component);
    exports.default = ScrollItemPre;
    cc._RF.pop();
  }, {} ],
  ScrollItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f0e35bpMYdLrKjqwqejlwMD", "ScrollItem");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ScrollItem = function(_super) {
      __extends(ScrollItem, _super);
      function ScrollItem() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.onEnterScrollViewEvents = [];
        _this.onExitScrollViewEvents = [];
        _this.onPositionChangeEvents = [];
        _this.isShowing = false;
        return _this;
      }
      ScrollItem.prototype.onEnter = function() {
        if (0 == this.onEnterScrollViewEvents.length) return;
        this.onEnterScrollViewEvents.forEach(function(event) {
          event.emit([]);
        });
      };
      ScrollItem.prototype.onExit = function() {
        if (0 == this.onExitScrollViewEvents.length) return;
        this.onExitScrollViewEvents.forEach(function(event) {
          event.emit([]);
        });
      };
      ScrollItem.prototype.onPos = function(xOffsetPercent, yOffsetPercent) {
        if (0 == this.onPositionChangeEvents.length) return;
        this.onPositionChangeEvents.forEach(function(event) {
          event.emit([ xOffsetPercent, yOffsetPercent ]);
        });
      };
      __decorate([ property({
        type: [ cc.Component.EventHandler ],
        displayName: "\u8fdb\u5165ScrollView\u65f6\u56de\u8c03"
      }) ], ScrollItem.prototype, "onEnterScrollViewEvents", void 0);
      __decorate([ property({
        type: [ cc.Component.EventHandler ],
        displayName: "\u79bb\u5f00ScrollView\u56de\u8c03"
      }) ], ScrollItem.prototype, "onExitScrollViewEvents", void 0);
      __decorate([ property({
        type: [ cc.Component.EventHandler ],
        displayName: "\u8fdb\u5165ScrollView\u540e\uff0c\u4f4d\u7f6e\u53d1\u751f\u6539\u53d8\u65f6\u56de\u8c03"
      }) ], ScrollItem.prototype, "onPositionChangeEvents", void 0);
      ScrollItem = __decorate([ ccclass ], ScrollItem);
      return ScrollItem;
    }(cc.Component);
    exports.default = ScrollItem;
    cc._RF.pop();
  }, {} ],
  ScrollViewIVis: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2a2acPYDF5O6blkhm9V38Ni", "ScrollViewIVis");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ScrollViewPlus_1 = require("./ScrollViewPlus");
    var ScrollItemPre_1 = require("./ScrollItemPre");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ScrollViewVis = function(_super) {
      __extends(ScrollViewVis, _super);
      function ScrollViewVis() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.load = null;
        _this.scrollView = null;
        _this.itemPrefab = null;
        return _this;
      }
      ScrollViewVis.prototype.onEnable = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            console.log(this.scrollView.node.getBoundingBox(), "\n", this.scrollView.node.getBoundingBoxToWorld());
            this.onTouchFraming();
            return [ 2 ];
          });
        });
      };
      ScrollViewVis.prototype.onTouchFraming = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, this.executePreFrame(this._getItemGenerator(500), 1) ];

             case 1:
              _a.sent();
              this.scrollView.optDc();
              this.load.active = false;
              return [ 2 ];
            }
          });
        });
      };
      ScrollViewVis.prototype._getItemGenerator = function(length) {
        var i;
        return __generator(this, function(_a) {
          switch (_a.label) {
           case 0:
            i = 0;
            _a.label = 1;

           case 1:
            if (!(i < length)) return [ 3, 4 ];
            return [ 4, this._initItem({
              index: i,
              path: "pic/" + i % 12
            }) ];

           case 2:
            _a.sent();
            _a.label = 3;

           case 3:
            i++;
            return [ 3, 1 ];

           case 4:
            return [ 2 ];
          }
        });
      };
      ScrollViewVis.prototype._initItem = function(data) {
        var itemNode = cc.instantiate(this.itemPrefab);
        itemNode.parent = this.scrollView.content;
        itemNode.getComponent(ScrollItemPre_1.default).init(data);
      };
      ScrollViewVis.prototype.executePreFrame = function(generator, duration) {
        var _this = this;
        return new Promise(function(resolve, reject) {
          var gen = generator;
          var execute = function() {
            var startTime = new Date().getTime();
            for (var iter = gen.next(); ;iter = gen.next()) {
              if (null == iter || iter.done) {
                resolve();
                return;
              }
              if (new Date().getTime() - startTime > duration) {
                _this.scheduleOnce(function() {
                  execute();
                });
                return;
              }
            }
          };
          execute();
        });
      };
      __decorate([ property(cc.Node) ], ScrollViewVis.prototype, "load", void 0);
      __decorate([ property(ScrollViewPlus_1.default) ], ScrollViewVis.prototype, "scrollView", void 0);
      __decorate([ property(cc.Prefab) ], ScrollViewVis.prototype, "itemPrefab", void 0);
      ScrollViewVis = __decorate([ ccclass ], ScrollViewVis);
      return ScrollViewVis;
    }(cc.Component);
    exports.default = ScrollViewVis;
    cc._RF.pop();
  }, {
    "./ScrollItemPre": "ScrollItemPre",
    "./ScrollViewPlus": "ScrollViewPlus"
  } ],
  ScrollViewPlus: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "98cecS41ohPSKbFvtrb56lM", "ScrollViewPlus");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ScrollItem_1 = require("./ScrollItem");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ScrollViewPlus = function(_super) {
      __extends(ScrollViewPlus, _super);
      function ScrollViewPlus() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.caculatePos = false;
        return _this;
      }
      ScrollViewPlus_1 = ScrollViewPlus;
      ScrollViewPlus.prototype.onEnable = function() {
        _super.prototype.onEnable.call(this);
        this.node.on("scrolling", this._onScrollDrawCallOpt.bind(this));
      };
      ScrollViewPlus.prototype.onDisable = function() {
        this.node.off("scrolling", this._onScrollDrawCallOpt.bind(this));
      };
      ScrollViewPlus.prototype._onScrollDrawCallOpt = function() {
        if (0 == this.content.childrenCount) return;
        this.optDc();
      };
      ScrollViewPlus.prototype.optDc = function() {
        ScrollViewPlus_1.optDc(this, this.caculatePos);
      };
      ScrollViewPlus.optDc = function(scrollView, caculatePos) {
        var sLeftBottomPoint = scrollView.node.parent.convertToWorldSpaceAR(cc.v2(scrollView.node.x - scrollView.node.anchorX * scrollView.node.width, scrollView.node.y - scrollView.node.anchorY * scrollView.node.height));
        var sBoxRect = cc.rect(sLeftBottomPoint.x, sLeftBottomPoint.y, scrollView.node.width, scrollView.node.height);
        scrollView.content.children.forEach(function(childNode) {
          var item = childNode.getComponent(ScrollItem_1.default);
          if (null == item) return;
          var childNodeBox = childNode.getBoundingBoxToWorld();
          if (childNodeBox.intersects(sBoxRect)) {
            if (!item.isShowing) {
              item.isShowing = true;
              item.onEnter();
            }
            caculatePos && item.isShowing && item.onPos((childNodeBox.x - (sBoxRect.x - childNodeBox.width / 2)) / (childNodeBox.width + sBoxRect.width), (childNodeBox.y - (sBoxRect.x - childNodeBox.height / 2)) / (childNodeBox.height + sBoxRect.height));
          } else if (item.isShowing) {
            item.isShowing = false;
            item.onExit();
          }
        });
      };
      var ScrollViewPlus_1;
      __decorate([ property({
        tooltip: "\u662f\u5426\u8ba1\u7b97\u5728\u53ef\u89c6\u533a\u57df\u4e2dItem\u7684\u76f8\u5bf9\u4f4d\u7f6e\uff08\u53ef\u80fd\u4f1a\u76f8\u5bf9\u8017\u6027\u80fd\uff09"
      }) ], ScrollViewPlus.prototype, "caculatePos", void 0);
      ScrollViewPlus = ScrollViewPlus_1 = __decorate([ ccclass ], ScrollViewPlus);
      return ScrollViewPlus;
    }(cc.ScrollView);
    exports.default = ScrollViewPlus;
    cc._RF.pop();
  }, {
    "./ScrollItem": "ScrollItem"
  } ],
  Share: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "99b05Q9rXxMObTxpEiY1ULY", "Share");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSys_1 = require("../manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Share = function(_super) {
      __extends(Share, _super);
      function Share() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Share.prototype.onLoad = function() {
        this.node.active = GameSys_1.default.share;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchShare.bind(this));
      };
      Share.prototype.onTouchShare = function() {
        return __awaiter(this, void 0, void 0, function() {
          var res;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              GameSys_1.default.audio.playSFX("audios/click");
              return [ 4, GameSys_1.default.sdk.shareApp() ];

             case 1:
              res = _a.sent();
              res;
              return [ 2 ];
            }
          });
        });
      };
      Share = __decorate([ ccclass ], Share);
      return Share;
    }(cc.Component);
    exports.default = Share;
    cc._RF.pop();
  }, {
    "../manager/GameSys": "GameSys"
  } ],
  Shop_item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "367aa6EgitIXYef2q5HvNZZ", "Shop_item");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var UtilsManager_1 = require("../common/manager/UtilsManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "shop_item";
    var Shop_Item = function(_super) {
      __extends(Shop_Item, _super);
      function Shop_Item() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.red = null;
        _this.spr = null;
        _this.select = null;
        _this.select_1 = null;
        _this.name_lab = null;
        return _this;
      }
      Shop_Item.prototype.init = function(_data, index, selectIndex) {
        return __awaiter(this, void 0, void 0, function() {
          var path, _a, data;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              this.index = index;
              this.name_lab.string = _data.name;
              path = "shop/" + _data.name;
              _a = this.spr;
              return [ 4, UtilsManager_1.default.loadImage(path) ];

             case 1:
              _a.spriteFrame = _b.sent();
              this.select_item(selectIndex);
              GameSys_1.default.game.xBind(Config_1.Config.SELECTSHOP, this.select_item.bind(this), BINDER_NAME);
              GameSys_1.default.game.xBind(Config_1.Config.STOCKOUT, this.change_red.bind(this), BINDER_NAME);
              this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchSelect.bind(this));
              data = GameSys_1.default.game.xGet(Config_1.Config.STOCKOUT);
              data && this.change_red(data);
              return [ 2 ];
            }
          });
        });
      };
      Shop_Item.prototype.change_red = function(data) {
        data.index == this.index && (this.red.active = data.v);
      };
      Shop_Item.prototype.select_item = function(index) {
        if (index == this.index) {
          this.select.active = true;
          this.select_1.active = true;
        } else {
          this.select.active = false;
          this.select_1.active = false;
        }
      };
      Shop_Item.prototype.onTouchSelect = function() {
        GameSys_1.default.audio.playSFX("audios/close");
        GameSys_1.default.game.xSet(Config_1.Config.SELECTSHOP, this.index);
      };
      Shop_Item.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Node) ], Shop_Item.prototype, "red", void 0);
      __decorate([ property(cc.Sprite) ], Shop_Item.prototype, "spr", void 0);
      __decorate([ property(cc.Node) ], Shop_Item.prototype, "select", void 0);
      __decorate([ property(cc.Node) ], Shop_Item.prototype, "select_1", void 0);
      __decorate([ property(cc.Label) ], Shop_Item.prototype, "name_lab", void 0);
      Shop_Item = __decorate([ ccclass ], Shop_Item);
      return Shop_Item;
    }(cc.Component);
    exports.default = Shop_Item;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/UtilsManager": "UtilsManager"
  } ],
  Shop: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c9ac1R9qEhOyaJgetQ9p1bV", "Shop");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupBase_1 = require("../common/component/popups/PopupBase");
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var StateManager_1 = require("../common/manager/StateManager");
    var Shop_item_1 = require("./Shop_item");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Shop";
    var Shop = function(_super) {
      __extends(Shop, _super);
      function Shop() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.reduce = null;
        _this.touch_buy = null;
        _this.page = null;
        _this.page_pre = null;
        _this.item = null;
        _this.button_state = null;
        _this.commodity_name = null;
        _this.buy_lab = null;
        _this.sell_lab = null;
        _this.overlay_lab = null;
        _this.result_name = null;
        _this.result_lab = null;
        _this.jiesuan_lab = null;
        _this.index = 0;
        return _this;
      }
      Shop_1 = Shop;
      Shop.prototype.onLoad = function() {
        this.add_page();
        this.touch_buy.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.touch_buy.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this));
        this.touch_buy.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
        GameSys_1.default.game.xBind(Config_1.Config.SHOPCHANGE, this.change_shop.bind(this), BINDER_NAME);
        GameSys_1.default.game.xBind(Config_1.Config.SELECTSHOP, this.change_data.bind(this), BINDER_NAME);
      };
      Shop.getInstance = function() {
        this.instance = this.instance ? this.instance : new Shop_1();
        return this.instance;
      };
      Shop.prototype.onEnable = function() {
        this.shop = GameSys_1.default.game.xGet(Config_1.Config.SHOP);
        this.node.zIndex = 10;
        GameSys_1.default.game.xSet(Config_1.Config.SELECTSHOP, 0);
        this.index = GameSys_1.default.game.xGet(Config_1.Config.SELECTSHOP);
        if (Caches_1.default.get(Caches_1.default.newGuide)) {
          GameSys_1.default.game.xSet(Config_1.Config.OPPO, true);
          GameSys_1.default.showBanner();
          GameSys_1.default.showInter();
        }
      };
      Shop.prototype.onDisable = function() {
        Caches_1.default.get(Caches_1.default.newGuide) && GameSys_1.default.hideBanner();
      };
      Shop.prototype.add_page = function() {
        for (var i = 0; i < Math.ceil(Config_1.SHOP.length / 8); i++) {
          var page = cc.instantiate(this.page_pre);
          this.page.addPage(page);
          for (var j = 0; j < 8; j++) if (8 * i + j < Config_1.SHOP.length) {
            var item = cc.instantiate(this.item);
            item.parent = page;
            item.getComponent(Shop_item_1.default).init(Config_1.SHOP[8 * i + j], 8 * i + j, this.index);
          }
        }
      };
      Shop.prototype.onTouchLeft = function() {
        this.page.scrollToPage(this.page.getCurrentPageIndex() - 1, .3);
      };
      Shop.prototype.onTouchRight = function() {
        this.page.scrollToPage(this.page.getCurrentPageIndex() + 1, .3);
      };
      Shop.prototype.change_shop = function() {
        this.overlay_lab.string = this.shop[this.index].count.toString() + "/" + Config_1.SHOP[this.index].overlay.toString();
      };
      Shop.prototype.change_data = function(_index) {
        this.index = _index;
        this.commodity_name.string = Config_1.SHOP[_index].name;
        this.buy_lab.string = Config_1.SHOP[_index].buy.toString();
        this.sell_lab.string = Config_1.SHOP[_index].sell.toString();
        this.overlay_lab.string = this.shop[_index].count.toString() + "/" + Config_1.SHOP[_index].overlay.toString();
        this.jiesuan_lab.string = (100 * Config_1.SHOP[_index].jiesuan).toString() + "%";
        if (0 == Config_1.SHOP[_index].use_time) {
          this.result_name.string = "\u6e05\u6d01\u5ea6";
          0 == Config_1.SHOP[_index].clean ? this.result_lab.string = "\u65e0" : this.result_lab.string = 100 * Config_1.SHOP[_index].clean + "%";
        } else {
          this.result_name.string = "\u4f7f\u7528\u65f6\u95f4";
          this.result_lab.string = Config_1.SHOP[_index].use_time + "\u79d2";
        }
        if (GameSys_1.default.level >= Config_1.SHOP[_index].lock) this.button_state.stateChange(0); else {
          this.button_state.node.children[1].children[0].getComponent(cc.Label).string = "\u89e3\u9501\u7b49\u7ea7\uff1a" + Config_1.SHOP[_index].lock;
          this.button_state.stateChange(1);
        }
      };
      Shop.prototype.onTouchBuy = function() {
        var _this = this;
        if (this.shop[this.index].count < Config_1.SHOP[this.index].overlay) {
          GameSys_1.default.game.xSet(Config_1.Config.STOCKOUT, {
            index: this.index,
            v: false
          });
          GameSys_1.default.useGold(-Config_1.SHOP[this.index].buy, function() {
            GameSys_1.default.game.xSet(Config_1.Config.SHOPCHANGE, {
              ID: _this.shop[_this.index].ID,
              count: _this.shop[_this.index].count + 1
            });
            var goldAnim = cc.instantiate(_this.reduce);
            _this.touch_buy.addChild(goldAnim);
            goldAnim.y = 30;
            goldAnim.x = 0;
            goldAnim.children[0].getComponent(cc.Label).string = "-" + Config_1.SHOP[_this.index].buy.toFixed(0);
            cc.tween(goldAnim).to(1, {
              y: goldAnim.y + 50,
              opacity: 100
            }).call(function() {
              goldAnim.destroy();
            }).start();
            _this.overlay_lab.string = _this.shop[_this.index].count.toString() + "/" + Config_1.SHOP[_this.index].overlay.toString();
          });
        }
      };
      Shop.prototype.onTouchStart = function() {
        var _this = this;
        GameSys_1.default.audio.playSFX("audios/button");
        if (this.shop[this.index].count == Config_1.SHOP[this.index].overlay) {
          GameSys_1.default.game.xSet(Config_1.Config.TIP, Config_1.TipLab.levelCap);
          return;
        }
        this.onTouchBuy();
        this.scheduleOnce(function() {
          _this.schedule(function() {
            _this.onTouchBuy();
          }, .05);
        }, .5);
      };
      Shop.prototype.onTouchEnd = function() {
        Caches_1.default.get(Caches_1.default.newGuide) || 16 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 17);
        this.unscheduleAllCallbacks();
      };
      Shop.prototype.onTouchLock = function() {
        GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u7b49\u7ea7\u4e0d\u591f");
      };
      Shop.prototype.onTouchClose = function() {
        Caches_1.default.get(Caches_1.default.newGuide) || 17 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 18);
        this.hide();
      };
      Shop.prototype.onDestory = function() {};
      var Shop_1;
      __decorate([ property(cc.Prefab) ], Shop.prototype, "reduce", void 0);
      __decorate([ property(cc.Node) ], Shop.prototype, "touch_buy", void 0);
      __decorate([ property(cc.PageView) ], Shop.prototype, "page", void 0);
      __decorate([ property(cc.Prefab) ], Shop.prototype, "page_pre", void 0);
      __decorate([ property(cc.Prefab) ], Shop.prototype, "item", void 0);
      __decorate([ property(StateManager_1.default) ], Shop.prototype, "button_state", void 0);
      __decorate([ property(cc.Label) ], Shop.prototype, "commodity_name", void 0);
      __decorate([ property(cc.Label) ], Shop.prototype, "buy_lab", void 0);
      __decorate([ property(cc.Label) ], Shop.prototype, "sell_lab", void 0);
      __decorate([ property(cc.Label) ], Shop.prototype, "overlay_lab", void 0);
      __decorate([ property(cc.Label) ], Shop.prototype, "result_name", void 0);
      __decorate([ property(cc.Label) ], Shop.prototype, "result_lab", void 0);
      __decorate([ property(cc.Label) ], Shop.prototype, "jiesuan_lab", void 0);
      Shop = Shop_1 = __decorate([ ccclass ], Shop);
      return Shop;
    }(PopupBase_1.default);
    exports.default = Shop;
    cc._RF.pop();
  }, {
    "../common/component/popups/PopupBase": "PopupBase",
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/StateManager": "StateManager",
    "./Shop_item": "Shop_item"
  } ],
  SineWave: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8873cgmM19Mb414MmY3ZA8/", "SineWave");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SineWaveDirection = void 0;
    var EditorAsset_1 = require("../../manager/EditorAsset");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent, executeInEditMode = _a.executeInEditMode, disallowMultiple = _a.disallowMultiple, executionOrder = _a.executionOrder;
    var SineWaveDirection;
    (function(SineWaveDirection) {
      SineWaveDirection[SineWaveDirection["Left"] = 1] = "Left";
      SineWaveDirection[SineWaveDirection["Right"] = 2] = "Right";
    })(SineWaveDirection = exports.SineWaveDirection || (exports.SineWaveDirection = {}));
    var SineWave = function(_super) {
      __extends(SineWave, _super);
      function SineWave() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._effect = null;
        _this._amplitude = .05;
        _this._angularVelocity = 10;
        _this._frequency = 10;
        _this._height = .5;
        _this._direction = SineWaveDirection.Left;
        _this.sprite = null;
        _this.material = null;
        return _this;
      }
      Object.defineProperty(SineWave.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        set: function(value) {
          this._effect = value;
          this.init();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SineWave.prototype, "amplitude", {
        get: function() {
          return this._amplitude;
        },
        set: function(value) {
          this._amplitude = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SineWave.prototype, "angularVelocity", {
        get: function() {
          return this._angularVelocity;
        },
        set: function(value) {
          this._angularVelocity = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SineWave.prototype, "frequency", {
        get: function() {
          return this._frequency;
        },
        set: function(value) {
          this._frequency = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SineWave.prototype, "height", {
        get: function() {
          return this._height;
        },
        set: function(value) {
          this._height = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SineWave.prototype, "direction", {
        get: function() {
          return this._direction;
        },
        set: function(value) {
          this._direction = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      SineWave.prototype.onLoad = function() {
        this.init();
      };
      SineWave.prototype.resetInEditor = function() {
        this.init();
      };
      SineWave.prototype.init = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              true;
              return [ 3, 2 ];

             case 1:
              _a.sent();
              _a.label = 2;

             case 2:
              if (!this._effect) return [ 2 ];
              this.sprite = this.node.getComponent(cc.Sprite);
              this.sprite.spriteFrame && (this.sprite.spriteFrame.getTexture().packable = false);
              this.material = cc.Material.create(this._effect);
              this.sprite.setMaterial(0, this.material);
              this.updateProperties();
              return [ 2 ];
            }
          });
        });
      };
      SineWave.prototype.setSpriteFrame = function(spriteFrame) {
        this.sprite.spriteFrame = spriteFrame;
        this.sprite.spriteFrame.getTexture().packable = false;
        this.updateProperties();
      };
      SineWave.prototype.updateProperties = function() {
        if (!this.effect) return cc.warn("[SineWave]", "\u8bf7\u6307\u5b9a Effect \u8d44\u6e90\uff01");
        this.material.setProperty("amplitude", this._amplitude);
        this.material.setProperty("angularVelocity", this._angularVelocity);
        this.material.setProperty("frequency", this._frequency);
        this.material.setProperty("offset", 1 - this._height + this._amplitude);
        this.material.setProperty("toLeft", this._direction === SineWaveDirection.Left);
      };
      __decorate([ property ], SineWave.prototype, "_effect", void 0);
      __decorate([ property({
        type: cc.EffectAsset,
        tooltip: false,
        readonly: true
      }) ], SineWave.prototype, "effect", null);
      __decorate([ property ], SineWave.prototype, "_amplitude", void 0);
      __decorate([ property({
        tooltip: false
      }) ], SineWave.prototype, "amplitude", null);
      __decorate([ property ], SineWave.prototype, "_angularVelocity", void 0);
      __decorate([ property({
        tooltip: false
      }) ], SineWave.prototype, "angularVelocity", null);
      __decorate([ property ], SineWave.prototype, "_frequency", void 0);
      __decorate([ property({
        tooltip: false
      }) ], SineWave.prototype, "frequency", null);
      __decorate([ property ], SineWave.prototype, "_height", void 0);
      __decorate([ property({
        tooltip: false
      }) ], SineWave.prototype, "height", null);
      __decorate([ property ], SineWave.prototype, "_direction", void 0);
      __decorate([ property({
        type: cc.Enum(SineWaveDirection),
        tooltip: false
      }) ], SineWave.prototype, "direction", null);
      SineWave = __decorate([ ccclass, requireComponent(cc.Sprite), executeInEditMode, disallowMultiple, executionOrder(-100) ], SineWave);
      return SineWave;
    }(cc.Component);
    exports.default = SineWave;
    cc._RF.pop();
  }, {
    "../../manager/EditorAsset": "EditorAsset"
  } ],
  Solicit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "25abbDy9HlBULltDQkhMgzq", "Solicit");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var StateManager_1 = require("../common/manager/StateManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "";
    var Solicit = function(_super) {
      __extends(Solicit, _super);
      function Solicit() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.state_1 = null;
        _this.state_2 = null;
        return _this;
      }
      Solicit.prototype.onLoad = function() {
        var _this = this;
        var index = 0;
        this.schedule(function() {
          index++;
          index %= 2;
          _this.state_1.stateChange(index);
          _this.state_2.stateChange(index);
        }, .5);
        var y = this.state_2.node.y;
        cc.tween(this.state_2.node).to(.3, {
          y: y + 25
        }).to(.2, {
          y: y
        }).delay(3).union().repeatForever().start();
      };
      Solicit.prototype.onDestory = function() {};
      __decorate([ property(StateManager_1.default) ], Solicit.prototype, "state_1", void 0);
      __decorate([ property(StateManager_1.default) ], Solicit.prototype, "state_2", void 0);
      Solicit = __decorate([ ccclass ], Solicit);
      return Solicit;
    }(cc.Component);
    exports.default = Solicit;
    cc._RF.pop();
  }, {
    "../common/manager/StateManager": "StateManager"
  } ],
  SpineSkin: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dacf7L19PtG+7ICwqoGDE75", "SpineSkin");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SpineSkin = function(_super) {
      __extends(SpineSkin, _super);
      function SpineSkin() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.sprite = null;
        return _this;
      }
      SpineSkin.prototype.onLoad = function() {
        this.change();
      };
      SpineSkin.prototype.change = function() {};
      SpineSkin.prototype.CreateRegion = function(texture) {};
      __decorate([ property(cc.SpriteFrame) ], SpineSkin.prototype, "sprite", void 0);
      SpineSkin = __decorate([ ccclass ], SpineSkin);
      return SpineSkin;
    }(cc.Component);
    exports.default = SpineSkin;
    cc._RF.pop();
  }, {} ],
  Staff_Production: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "872720uqa1FS7qZzyuIcjeK", "Staff_Production");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AStar_1 = require("../common/component/AStar");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var MathManager_1 = require("../common/manager/MathManager");
    var StaticManager_1 = require("../common/manager/StaticManager");
    var Staff_1 = require("./Staff");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Staff_Production";
    var Staff_Production = function(_super) {
      __extends(Staff_Production, _super);
      function Staff_Production() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.staff = null;
        _this.recruit = [];
        _this.all_move = [];
        return _this;
      }
      Staff_Production_1 = Staff_Production;
      Staff_Production.getInstance = function() {
        this.instance = this.instance ? this.instance : new Staff_Production_1();
        return this.instance;
      };
      Staff_Production.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this.recruit = GameSys_1.default.game.xGet(Config_1.Config.RECRUIT);
        this.Map_Path = [];
        this.Map_Path = MathManager_1.default.getInstance().transformArray(Config_1.JSON_PATH);
        this.limit_pos();
        this.add_staff();
      };
      Staff_Production.prototype.onEnable = function() {};
      Staff_Production.prototype.limit_pos = function() {
        var _this = this;
        MathManager_1.default.getInstance().visitLinearArray(Config_1.STAFF_MOVE_LOO, function(i) {
          _this.all_move.push(Config_1.STAFF_MOVE_LOO[i]);
        });
      };
      Staff_Production.prototype.add_staff = function() {
        var _this = this;
        MathManager_1.default.getInstance().visitLinearArray(this.recruit, function(i) {
          if (0 != _this.recruit[i]) {
            var posStart = _this.all_move[Math.floor(Math.random() * _this.all_move.length)];
            var staff = cc.instantiate(_this.staff);
            staff.parent = _this.node;
            staff.scale = .23;
            staff.getComponent(Staff_1.default).initPath(posStart, Config_1.RECRUIT[i], i);
            StaticManager_1.default.getInstance().staff.push(i);
          }
        });
      };
      Staff_Production.prototype.recruit_change = function(_data) {
        if (1 == _data.state) {
          var posStart = this.all_move[Math.floor(Math.random() * this.all_move.length)];
          var staff = cc.instantiate(this.staff);
          staff.parent = this.node;
          staff.scale = .23;
          staff.getComponent(Staff_1.default).initPath(posStart, Config_1.RECRUIT[_data.index], _data.index);
          StaticManager_1.default.getInstance().staff.push(_data.index);
        }
      };
      Staff_Production.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      var Staff_Production_1;
      __decorate([ property(cc.Prefab) ], Staff_Production.prototype, "staff", void 0);
      Staff_Production = Staff_Production_1 = __decorate([ ccclass ], Staff_Production);
      return Staff_Production;
    }(AStar_1.default);
    exports.default = Staff_Production;
    cc._RF.pop();
  }, {
    "../common/component/AStar": "AStar",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/MathManager": "MathManager",
    "../common/manager/StaticManager": "StaticManager",
    "./Staff": "Staff"
  } ],
  Staff: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f0513vRDSxJQYouyKLOmb7n", "Staff");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var DataManager_1 = require("../common/manager/DataManager");
    var GameSys_1 = require("../common/manager/GameSys");
    var MathManager_1 = require("../common/manager/MathManager");
    var StateManager_1 = require("../common/manager/StateManager");
    var StaticManager_1 = require("../common/manager/StaticManager");
    var Production_1 = require("./Production");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Staff";
    var Staff = function(_super) {
      __extends(Staff, _super);
      function Staff() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.dragonName = null;
        _this.state = null;
        _this.circle = null;
        _this.grid = 40;
        _this.curPos = cc.v2(0, 0);
        _this.endPos = cc.v2(0, 0);
        _this.working = false;
        _this.index = 0;
        _this.time = 1;
        _this.ID = 0;
        _this.value = 0;
        _this.dragonsName = [ "\u5458\u5de5-\u7ea2\u8272", "\u5458\u5de5-\u5927\u849c", "\u5458\u5de5-\u7eff\u7eff\u7684", "\u5458\u5de5-\u7d2b\u8272", "\u5458\u5de5-\u6d77\u76d7", "\u5458\u5de5-\u7c89\u8272\u6d0b\u8471", "\u5458\u5de5-\u75a4\u760c\u773c", "\u5458\u5de5-\u5c0f\u773c\u955c" ];
        _this.time_circle = 0;
        _this.time_boolean = false;
        _this.interval = 0;
        return _this;
      }
      Staff.prototype.initPath = function(startPos, recruit, _index) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
            this.index = _index;
            this.recruit = recruit;
            this.ID = recruit.ID - 1;
            this.dragonName.armatureName = this.dragonsName[this.ID];
            this.node.x = 2 + startPos.x * (this.grid + 2) + this.grid / 2;
            this.node.y = 2 + startPos.y * (this.grid + 2) + this.grid / 2;
            this.curPos.x = startPos.x;
            this.curPos.y = startPos.y;
            this.time = 1;
            this.leave(false, this.endPos);
            GameSys_1.default.game.xBind(Config_1.Config.RECRUITCHANGE, this.dismissal_change.bind(this), this.ID.toString());
            GameSys_1.default.game.xBind(Config_1.Config.FIXLOO, this.fixLoo.bind(this), this.ID.toString());
            return [ 2 ];
          });
        });
      };
      Staff.prototype.onLoad = function() {};
      Staff.prototype.dismissal_change = function(_data) {
        if (_data.index == this.ID && 0 == _data.state) {
          this.node.destroy();
          GameSys_1.default.game.xUnbind(this.ID.toString());
        }
      };
      Staff.prototype.fixLoo = function(_data) {
        var _this = this;
        if (this.working) return;
        if (_data.value == this.index) {
          DataManager_1.default.getInstance().setLeisure(_data.index, false);
          this.value = _data.value;
          this.working = true;
          var indexOf = StaticManager_1.default.getInstance().staff.indexOf(_data.value);
          StaticManager_1.default.getInstance().staff.splice(indexOf, 1);
          this.time = .5;
          var time = 0;
          var interval = 0;
          for (var i = 0; i < GameSys_1.default.game.xGet(Config_1.Config.WAREHOUSE).length; i++) {
            time += Config_1.WAREHOUSE[GameSys_1.default.game.xGet(Config_1.Config.WAREHOUSE)[i]].result_1;
            interval += Config_1.WAREHOUSE[GameSys_1.default.game.xGet(Config_1.Config.WAREHOUSE)[i]].result_2;
          }
          this.interval = 10 * (this.recruit.time - interval);
          var repeat_1 = 10 * (this.recruit.efficiency - time);
          this.leave(true, Config_1.CLEAN_POS[_data.index], function() {
            var pos = _this.node.position;
            var callbck = function() {
              _this.circle.node.active = true;
              _this.circle.node.scale = .4;
              _this.circle.fillRange = 0;
              var _cb = function() {
                _this.circle.fillRange += 1 / repeat_1;
                if (_this.circle.fillRange >= 1) {
                  _this.unschedule(_cb);
                  var cb_1 = function() {
                    var buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
                    _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
                    GameSys_1.default.game.xSet(Config_1.Config.BUILDINGSCHANGE, {
                      index: _data.index,
                      level: buildings[_data.index].level,
                      dirty: 0,
                      upgrade: buildings[_data.index].upgrade
                    });
                    DataManager_1.default.getInstance().setLeisure(_data.index, true);
                    StaticManager_1.default.getInstance().use_buildings[_data.index] = false;
                    console.error("\u6e05\u6d01\u5b8c\u6210", _data.index / 3);
                    0 == Math.floor(_data.index / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVELOO, 0) : 1 == Math.floor(_data.index / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETONE, 1) : 2 == Math.floor(_data.index / 3) ? GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETTWO, 2) : 3 == Math.floor(_data.index / 3) && GameSys_1.default.game.xSet(Config_1.Config.LEAVETOILETTHERE, 3);
                    _this.time_boolean = true;
                    _this.circle.node.scale = .4;
                    _this.circle.fillRange = 0;
                    _this.time = 1;
                    _this.leave(false, _this.endPos);
                  };
                  if (_data.index < 3) {
                    _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u6d17\u624b\u6c60\u4f7f\u7528-\u540e", 1);
                    _this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, function(event) {
                      cc.tween(_this.node).to(1, {
                        position: pos
                      }).call(function() {
                        cb_1 && cb_1();
                      }).start();
                    });
                  } else {
                    _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u536b\u751f\u95f4\u4f7f\u7528-\u540e", 1);
                    _this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, function(event) {
                      cb_1 && cb_1();
                    });
                  }
                }
              };
              _this.schedule(_cb, .1, repeat_1, .1);
            };
            if (_data.index < 3) {
              _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u6d17\u624b\u6c60\u4f7f\u7528-\u524d", 1);
              _this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, function(event) {
                _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u6d17\u624b\u6c60\u4f7f\u7528-\u4e2d", 0);
                callbck && callbck();
              });
            } else {
              _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u5de6\u4e0a", 0);
              cc.tween(_this.node).to(1, {
                position: Config_1.Pre_Toilet[_data.index]
              }).call(function() {
                _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u536b\u751f\u95f4\u4f7f\u7528-\u524d", 0);
                callbck && callbck();
              }).start();
            }
          });
        }
      };
      Staff.prototype.leave = function(work, endPos, _callback) {
        var _this = this;
        this.unscheduleAllCallbacks();
        Production_1.default.getInstance().posStart = this.curPos;
        Production_1.default.getInstance().limit_pos();
        if (work) this.state.stateChange(1); else {
          this.state.stateChange(0);
          var index_1 = Math.floor(Math.random() * Production_1.default.getInstance().all_move.length);
          endPos = Production_1.default.getInstance().all_move[index_1];
        }
        Production_1.default.getInstance().posEnd = endPos;
        Production_1.default.getInstance().Map_Path = [];
        Production_1.default.getInstance().Map_Path = MathManager_1.default.getInstance().transformArray(Config_1.JSON_PATH);
        Production_1.default.getInstance().initMap();
        Production_1.default.getInstance().findPath(this.curPos, endPos);
        var path = Production_1.default.getInstance().path;
        var index = path.length - 1;
        if (index > 0) if (Production_1.default.getInstance().posEnd.x > Production_1.default.getInstance().posStart.x) {
          this.node.scaleX = .17;
          this.node.scaleY = .17;
          this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
        } else {
          this.node.scaleX = -.17;
          this.node.scaleY = .17;
          this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
        }
        var _cb = function() {
          if (path.length > 0) {
            index--;
            if (index < 0) {
              _this.unschedule(_cb);
              _callback && _callback();
              work || _this.leave(false, endPos);
              return;
            }
            _this.scheduleOnce(function() {
              if (index - 1 >= 0) {
                if (11 == path[index].x && 15 == path[index].y) {
                  if (endPos.x > path[index].x) {
                    _this.node.scaleX = .17;
                    _this.node.scaleY = .17;
                  } else {
                    _this.node.scaleX = -.17;
                    _this.node.scaleY = .17;
                  }
                  _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
                }
                if (10 == path[index - 1].x && 11 == path[index - 1].y && 10 == path[index].x && 10 == path[index].y) {
                  _this.node.scaleX = .17;
                  _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u5de6\u4e0a", 0);
                }
                if (17 == path[index].x && 15 == path[index].y) {
                  if (endPos.x > path[index].x) {
                    _this.node.scaleX = .17;
                    _this.node.scaleY = .17;
                  } else {
                    _this.node.scaleX = -.17;
                    _this.node.scaleY = .17;
                  }
                  _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u53f3\u4e0b", 0);
                }
                if (17 == path[index - 1].x && 11 == path[index - 1].y && 17 == path[index].x && 10 == path[index].y) {
                  _this.node.scaleX = .17;
                  _this.node.scaleY = .17;
                  _this.dragons = _this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("\u79fb\u52a8-\u5de6\u4e0a", 0);
                }
              }
            }, .5);
            var x = 2 + path[index].x * (_this.grid + 2) + _this.grid / 2;
            var y = 2 + path[index].y * (_this.grid + 2) + _this.grid / 2;
            if (17 == path[index].x && 11 == path[index].y) {
              x += _this.grid / 2;
              y -= _this.grid / 2;
            }
            if (18 == path[index].x && 12 == path[index].y) {
              x = 2 + 19 * (_this.grid + 2) + _this.grid / 2;
              y = 2 + 12 * (_this.grid + 2) + _this.grid / 2;
            }
            if (37 == path[index].x && 18 == path[index].y) {
              x -= _this.grid / 2;
              y += _this.grid / 2;
            }
            if (10 == path[index].x && 15 == path[index].y) {
              x += _this.grid / 2;
              y -= _this.grid / 2;
            }
            if (9 == path[index].x && 14 == path[index].y) {
              x += _this.grid / 2;
              y -= _this.grid / 2;
            }
            if (10 == path[index].x && 12 == path[index].y) {
              x -= _this.grid / 2;
              y -= _this.grid / 2;
            }
            10 == path[index].x && 10 == path[index].y && (y -= _this.grid / 2);
            _this.curPos.x = path[index].x;
            _this.curPos.y = path[index].y;
            _this.node.zIndex = 24 - path[index].y;
            cc.tween(_this.node).to(_this.time, {
              x: x,
              y: y
            }).start();
          } else {
            _this.unschedule(_cb);
            work || _this.leave(false, endPos);
          }
        };
        this.unschedule(_cb);
        this.schedule(_cb, this.time);
      };
      Staff.prototype.update = function(dt) {
        if (!this.time_boolean) return;
        this.time_circle += dt;
        if (this.time_circle >= .1) {
          this.circle.fillRange += 1 / this.interval;
          if (this.circle.fillRange >= 1) {
            console.log("\u6ca1\u56de\u53bb\u5417");
            this.time_boolean = false;
            this.circle.node.active = false;
            this.working = false;
            StaticManager_1.default.getInstance().staff.push(this.value);
          }
          this.time_circle = 0;
        }
      };
      Staff.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(this.ID.toString());
      };
      __decorate([ property(dragonBones.ArmatureDisplay) ], Staff.prototype, "dragonName", void 0);
      __decorate([ property(StateManager_1.default) ], Staff.prototype, "state", void 0);
      __decorate([ property(cc.Sprite) ], Staff.prototype, "circle", void 0);
      Staff = __decorate([ ccclass ], Staff);
      return Staff;
    }(cc.Component);
    exports.default = Staff;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/DataManager": "DataManager",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/MathManager": "MathManager",
    "../common/manager/StateManager": "StateManager",
    "../common/manager/StaticManager": "StaticManager",
    "./Production": "Production"
  } ],
  Start: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ef5a0S4mFlMIYWVoVbqOXBH", "Start");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TIp_1 = require("./common/component/TIp");
    var Caches_1 = require("./common/manager/Caches");
    var Config_1 = require("./common/manager/Config");
    var GameSys_1 = require("./common/manager/GameSys");
    var MathManager_1 = require("./common/manager/MathManager");
    var PopupManager_1 = require("./common/manager/PopupManager");
    var StaticManager_1 = require("./common/manager/StaticManager");
    var UtilsManager_1 = require("./common/manager/UtilsManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "start";
    var Start = function(_super) {
      __extends(Start, _super);
      function Start() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.oppo = null;
        _this.shop = null;
        _this.warehouse = null;
        _this.recuit = null;
        _this.builds = null;
        _this.notice = null;
        _this.newGuide = null;
        _this.blockPre = null;
        _this.target = null;
        _this.shop_red = null;
        _this.warehouse_red = null;
        _this.recuit_red = null;
        _this.builds_red = null;
        _this.spr = null;
        _this.tip = null;
        _this.block = null;
        _this.oppoNatived = null;
        _this.oppoShow = false;
        _this.blockDestory = false;
        _this.blockHave = false;
        _this.time = 0;
        return _this;
      }
      Start.prototype.onLoad = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              console.log("\u5f53\u524d\u91d1\u5e01", GameSys_1.default.game.xGet(Config_1.Config.GOLD).v);
              _a = this;
              return [ 4, UtilsManager_1.default.loadPrefab(Config_1.PopupPath.tip) ];

             case 1:
              _a.tip = _b.sent();
              GameSys_1.default.game.xBind(Config_1.Config.TIP, this.change_tip.bind(this), BINDER_NAME);
              GameSys_1.default.game.xBind(Config_1.Config.STOCKOUT, this.change_red.bind(this), BINDER_NAME);
              GameSys_1.default.game.xBind(Config_1.Config.BLOCK, this.change_block.bind(this), BINDER_NAME);
              GameSys_1.default.game.xBind(Config_1.Config.HIDEALL, this.hideAll.bind(this), BINDER_NAME);
              GameSys_1.default.game.xBind(Config_1.Config.ALLRED, this.allRed.bind(this), BINDER_NAME);
              GameSys_1.default.game.xBind(Config_1.Config.HIDESHOP, this.hideshop.bind(this), BINDER_NAME);
              GameSys_1.default.game.xBind(Config_1.Config.OPPO, this.change_oppo.bind(this), BINDER_NAME);
              if (Caches_1.default.get(Caches_1.default.notice)) {
                this.notice.active = false;
                Caches_1.default.get(Caches_1.default.newGuide) || (this.newGuide.active = true);
              } else this.notice.active = true;
              this.allRed();
              Caches_1.default.get(Caches_1.default.newGuide) && GameSys_1.default.game.xSet(Config_1.Config.OPPO, true);
              return [ 2 ];
            }
          });
        });
      };
      Start.prototype.change_oppo = function(v) {
        if ("oppo" != GameSys_1.default.channel) return;
        if (this.oppoShow) {
          this.oppoShow = false;
          this.oppoNatived.destroy();
        }
        console.log("111");
        this.oppoNatived = cc.instantiate(this.oppo);
        this.oppoNatived.parent = this.node;
        this.oppoShow = true;
        GameSys_1.default.showNativeAd(this.oppoNatived.children[0]);
      };
      Start.prototype.hideshop = function(v) {
        this.shop.active = v;
        this.warehouse.active = v;
      };
      Start.prototype.allRed = function() {
        this.builds_red.active = false;
        this.warehouse_red.active = false;
        this.recuit_red.active = false;
        var flagwarehouse = 0;
        MathManager_1.default.getInstance().visitLinearArray(Config_1.WAREHOUSE, function(i) {
          Config_1.WAREHOUSE[i].lock <= GameSys_1.default.level && flagwarehouse++;
        });
        flagwarehouse > GameSys_1.default.game.xGet(Config_1.Config.WAREHOUSE).length && (this.warehouse_red.active = true);
        var flagrecuit = 0;
        MathManager_1.default.getInstance().visitLinearArray(Config_1.RECRUIT, function(i) {
          3 !== Config_1.RECRUIT[i].ID && 7 !== Config_1.RECRUIT[i].ID && GameSys_1.default.judgeGold(Config_1.RECRUIT[i].price, function() {}, function() {
            flagrecuit++;
          });
        });
        var recuit = GameSys_1.default.game.xGet(Config_1.Config.RECRUIT);
        var flagcount = 0;
        MathManager_1.default.getInstance().visitLinearArray(recuit, function(i) {
          0 !== recuit[i] && 2 != i && 6 != i && flagcount++;
        });
        0 == recuit[2] || 0 == recuit[6] ? this.recuit_red.active = true : flagrecuit > flagcount && (this.recuit_red.active = true);
        var buildings = GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS);
        for (var i = 0; i < Config_1.BUILDINGS.length; i++) if (Config_1.BUILDINGS[i].lock <= GameSys_1.default.level) if (0 == buildings[Config_1.BUILDINGS[i].index].level) {
          if (GameSys_1.default.game.xGet(Config_1.Config.GOLD).v >= Config_1.BUILDINGS[i].gold) {
            this.builds_red.active = true;
            return;
          }
        } else if (3 !== buildings[Config_1.BUILDINGS[i].index].level && 3 != Config_1.BUILDINGS[i].level && GameSys_1.default.game.xGet(Config_1.Config.GOLD).v >= Config_1.BUILDINGS[i + 1].gold) {
          this.builds_red.active = true;
          return;
        }
        var app = GameSys_1.default.game.xGet(Config_1.Config.APPEARANCE);
        for (var i = 0; i < Config_1.APPEARANCE.length; i++) {
          if (Config_1.APPEARANCE[i].lock_A <= GameSys_1.default.level && Config_1.APPEARANCE[i].gold_A <= GameSys_1.default.game.xGet(Config_1.Config.GOLD).v && !app[i].geta) {
            this.builds_red.active = true;
            return;
          }
          if (Config_1.APPEARANCE[i].lock_S <= GameSys_1.default.level && Config_1.APPEARANCE[i].gold_S <= GameSys_1.default.game.xGet(Config_1.Config.GOLD).v && !app[i].gets) {
            this.builds_red.active = true;
            return;
          }
        }
      };
      Start.prototype.hideAll = function(v) {
        if (v) {
          this.shop_red.getComponent(cc.Sprite).enabled = false;
          this.warehouse_red.getComponent(cc.Sprite).enabled = false;
          this.recuit_red.getComponent(cc.Sprite).enabled = false;
          this.builds_red.getComponent(cc.Sprite).enabled = false;
        } else {
          this.shop_red.getComponent(cc.Sprite).enabled = true;
          this.warehouse_red.getComponent(cc.Sprite).enabled = true;
          this.recuit_red.getComponent(cc.Sprite).enabled = true;
          this.builds_red.getComponent(cc.Sprite).enabled = true;
        }
      };
      Start.prototype.change_block = function(data) {
        if (!data.state) {
          if (!this.blockDestory && null != this.block) {
            this.blockDestory = true;
            this.blockHave = false;
            this.block.destroy();
          }
          return;
        }
        if (this.blockHave) return;
        this.blockHave = true;
        this.blockDestory = false;
        this.block = cc.instantiate(this.blockPre);
        this.block.parent = this.node;
        this.block.children[0].active = data.spr;
        this.block.children[1].active = data.clean;
      };
      Start.prototype.change_red = function(data) {
        this.shop_red.active = data.v;
      };
      Start.prototype.change_tip = function(v) {
        var _this = this;
        if (0 != this.time) return;
        this.time = 1;
        this.scheduleOnce(function() {
          _this.time = 0;
        }, 1);
        var tip = cc.instantiate(this.tip);
        this.node.addChild(tip);
        tip.getComponent(TIp_1.default).init(v);
      };
      Start.prototype.onTouchRecruit = function() {
        if (GameSys_1.default.game.xGet(Config_1.Config.HIDEALL)) return;
        var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
        PopupManager_1.default.show(Config_1.PopupPath.recruit, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
      };
      Start.prototype.onTouchBuildings = function() {
        if (GameSys_1.default.game.xGet(Config_1.Config.HIDEALL)) return;
        Caches_1.default.get(Caches_1.default.newGuide) || 0 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 1);
        GameSys_1.default.game.xSet(Config_1.Config.HIDEALL, true);
        var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
        PopupManager_1.default.show(Config_1.PopupPath.buildings, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
        GameSys_1.default.game.xSet(Config_1.Config.HIDESHOP, false);
      };
      Start.prototype.onTouchShop = function() {
        console.log("\u5efa\u7b51", GameSys_1.default.game.xGet(Config_1.Config.BUILDINGS));
        console.log("\u6d17\u624bloo_queue", StaticManager_1.default.getInstance().loo_queue);
        console.log("\u5395\u6240toilet_queue_1", StaticManager_1.default.getInstance().toilet_queue_1);
        console.log("\u60c5\u51b5use_buildings", StaticManager_1.default.getInstance().use_buildings);
        if (GameSys_1.default.game.xGet(Config_1.Config.HIDEALL)) return;
        Caches_1.default.get(Caches_1.default.newGuide) || 15 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 16);
        var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
        PopupManager_1.default.show(Config_1.PopupPath.shop, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
      };
      Start.prototype.onTouchWarehouse = function() {
        if (GameSys_1.default.game.xGet(Config_1.Config.HIDEALL)) return;
        Caches_1.default.get(Caches_1.default.newGuide) || 29 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 30);
        console.log(StaticManager_1.default.getInstance().toilet_queue_1);
        var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
        PopupManager_1.default.show(Config_1.PopupPath.warehouse, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
      };
      Start.prototype.onTouchStart = function() {
        this.notice.active = false;
        this.newGuide.active = true;
        Caches_1.default.set(Caches_1.default.notice, true);
      };
      Start.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Prefab) ], Start.prototype, "oppo", void 0);
      __decorate([ property(cc.Node) ], Start.prototype, "shop", void 0);
      __decorate([ property(cc.Node) ], Start.prototype, "warehouse", void 0);
      __decorate([ property(cc.Node) ], Start.prototype, "recuit", void 0);
      __decorate([ property(cc.Node) ], Start.prototype, "builds", void 0);
      __decorate([ property(cc.Node) ], Start.prototype, "notice", void 0);
      __decorate([ property(cc.Node) ], Start.prototype, "newGuide", void 0);
      __decorate([ property(cc.Prefab) ], Start.prototype, "blockPre", void 0);
      __decorate([ property(cc.Node) ], Start.prototype, "target", void 0);
      __decorate([ property(cc.Node) ], Start.prototype, "shop_red", void 0);
      __decorate([ property(cc.Node) ], Start.prototype, "warehouse_red", void 0);
      __decorate([ property(cc.Node) ], Start.prototype, "recuit_red", void 0);
      __decorate([ property(cc.Node) ], Start.prototype, "builds_red", void 0);
      __decorate([ property(cc.Sprite) ], Start.prototype, "spr", void 0);
      Start = __decorate([ ccclass ], Start);
      return Start;
    }(cc.Component);
    exports.default = Start;
    cc._RF.pop();
  }, {
    "./common/component/TIp": "TIp",
    "./common/manager/Caches": "Caches",
    "./common/manager/Config": "Config",
    "./common/manager/GameSys": "GameSys",
    "./common/manager/MathManager": "MathManager",
    "./common/manager/PopupManager": "PopupManager",
    "./common/manager/StaticManager": "StaticManager",
    "./common/manager/UtilsManager": "UtilsManager"
  } ],
  StateManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2467dI5tjdCW6T2lupGjNz3", "StateManager");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var StateManager = function(_super) {
      __extends(StateManager, _super);
      function StateManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.nowState = 0;
        return _this;
      }
      StateManager.prototype.start = function() {};
      StateManager.prototype.stateChange = function(v) {
        return __awaiter(this, void 0, void 0, function() {
          var i;
          return __generator(this, function(_a) {
            for (i = 0; i < this.node.children.length; i++) this.node.children[i].active = false;
            if (v >= 0 && v < this.node.children.length) {
              this.nowState = v;
              this.node.children[v].active = true;
              return [ 2, this.node.children[v] ];
            }
            return [ 2 ];
          });
        });
      };
      StateManager.prototype.stateAll = function(v) {
        if (v >= 0 && v < this.node.children.length) for (var i = 0; i < v; i++) this.node.children[i].active = true;
      };
      StateManager.prototype.stateHide = function() {
        for (var i = 0; i < this.node.children.length; i++) this.node.children[i].active = false;
      };
      StateManager = __decorate([ ccclass, menu("\u6309\u94ae\u7ec4\u4ef6/StateManager") ], StateManager);
      return StateManager;
    }(cc.Component);
    exports.default = StateManager;
    cc._RF.pop();
  }, {} ],
  StaticManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "28eeasUYANK3Yw0sMTRwpc+", "StaticManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var StaticManager = function() {
      function StaticManager() {
        this.open_buildings = [];
        this.use_buildings = [];
        this.loo_queue = [];
        this.toilet_queue_1 = [];
        this.toilet_queue_2 = [];
        this.toilet_queue_3 = [];
        this.staff = [];
        this.shop_queue = [];
        this.goldCount = -1;
        this.goldPreSecond = 0;
        this.falllings = [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ];
      }
      StaticManager.getInstance = function() {
        this.instance = this.instance ? this.instance : new StaticManager();
        return this.instance;
      };
      return StaticManager;
    }();
    exports.default = StaticManager;
    cc._RF.pop();
  }, {} ],
  TIp: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "57cc4ADFNdAqpmK7Ru3QcDX", "TIp");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Tip = function(_super) {
      __extends(Tip, _super);
      function Tip() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        return _this;
      }
      Tip.prototype.init = function(_label) {
        var _this = this;
        this.label.string = _label;
        this.node.zIndex = 120;
        cc.tween(this.node).to(.2, {
          y: this.node.y + 100
        }).delay(.5).to(.5, {
          opacity: 0
        }).call(function() {
          _this.label.string = "";
          _this.node.destroy();
        }).start();
      };
      __decorate([ property(cc.Label) ], Tip.prototype, "label", void 0);
      Tip = __decorate([ ccclass ], Tip);
      return Tip;
    }(cc.Component);
    exports.default = Tip;
    cc._RF.pop();
  }, {} ],
  TTApi: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5b45cOmOkBNlZnjYHn6RKfi", "TTApi");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Log_1 = require("../manager/Log");
    var GameSys_1 = require("../manager/GameSys");
    var Config_1 = require("../manager/Config");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "ttapi";
    var TTAPI = function() {
      function TTAPI() {
        this.screenRec = null;
        this.isShowBanner = false;
        this.bAdUnit = "";
        this.oldBannerAd = null;
        this.showTime = 0;
        this.bannerPar = [ "e2fci6b80fi42lbhek" ];
        this.bannerIndex = 0;
        this.index = 0;
        this.videoNum = 0;
        this.rewardedVideoAd = null;
        this.isVoice = false;
        this.videoTime = 0;
        this.videoAds = [ "2784honbplhp2eb164" ];
        this.recordTime = 0;
        this.issueSuc = false;
        this.videoPath = null;
        this.shareTimes = 0;
        Log_1.default.info("\u5934\u6761\u73af\u5883------");
        GameSys_1.default.sdk.Instance = this;
        this.onLoad();
        this.instantiationRewardAd();
        GameSys_1.default.sdk.xBind("createBanner", this.createBanner.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("destroyBanner", this.destroySelf.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("hideBanner", this.hideBanner.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("startRec", this.startRec.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("stopRec", this.stopRec.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("moreGames", this.onMoreGames.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("showInter", this.inter.bind(this), BINDER_NAME);
      }
      TTAPI_1 = TTAPI;
      TTAPI.prototype.onLoad = function() {
        console.log("\u5934\u6761\u73af\u5883");
        tt.showShareMenu({
          withShareTicket: true
        });
        tt.onShareAppMessage(function(res) {
          console.log(res.channel);
          return {
            templateId: "88dhenci58lli6bp9p",
            success: function() {
              console.log("\u5206\u4eab\u6210\u529f");
            },
            fail: function(e) {
              console.log("\u5206\u4eab\u5931\u8d25", e);
            }
          };
        });
        this.screenRec = tt.getGameRecorderManager();
      };
      TTAPI.prototype.createBanner = function() {
        var _this = this;
        this.bannerIndex++;
        var _adUnitId = this.bannerPar[this.index % this.bannerPar.length];
        if (this.oldBannerAd) this.isShowBanner ? this.hideBanner() : this.showBanner(); else {
          var _a = tt.getSystemInfoSync(), windowWidth_1 = _a.windowWidth, windowHeight_1 = _a.windowHeight;
          var targetBannerAdWidth = 200;
          var bannerAd_1 = tt.createBannerAd({
            adUnitId: _adUnitId,
            style: {
              width: targetBannerAdWidth,
              top: windowHeight_1 - targetBannerAdWidth / 16 * 9
            }
          });
          bannerAd_1.style.left = (windowWidth_1 - targetBannerAdWidth) / 2;
          bannerAd_1.style.left = (windowWidth_1 - targetBannerAdWidth) / 2;
          bannerAd_1.onResize(function(size) {
            if (targetBannerAdWidth != size.width) {
              targetBannerAdWidth = size.width;
              bannerAd_1.style.top = windowHeight_1 - size.height;
              bannerAd_1.style.left = (windowWidth_1 - size.width) / 2;
            }
          });
          this.oldBannerAd = bannerAd_1;
          bannerAd_1.onLoad(function(res) {
            _this.oldBannerAd && _this.oldBannerAd.hide();
            _this.isShowBanner ? _this.hideBanner() : _this.showBanner();
          });
          bannerAd_1.onError(function(err) {
            console.log(err);
          });
        }
      };
      TTAPI.prototype.showBanner = function() {
        this.isShowBanner = true;
        var bannerAd = this.oldBannerAd;
        bannerAd && bannerAd.show();
      };
      TTAPI.prototype.hideBanner = function() {
        this.isShowBanner = false;
        var bannerAd = this.oldBannerAd;
        bannerAd && bannerAd.hide();
      };
      TTAPI.prototype.destroySelf = function() {
        var bannerAd = this.oldBannerAd;
        if (bannerAd) {
          bannerAd.destroy();
          this.oldBannerAd = null;
        }
        this.isShowBanner = false;
      };
      TTAPI.prototype.instantiationRewardAd = function() {
        console.log("\u89c6\u9891\u5b9e\u4f8b\u5316");
        this.rewardedVideoAd = tt.createRewardedVideoAd({
          adUnitId: this.videoAds[this.videoNum % this.videoAds.length]
        });
      };
      TTAPI.prototype.createRewardedVideoAd = function(_callback) {
        var _this = this;
        this.videoTime++;
        if (this.videoTime >= 3) {
          this.videoTime = 0;
          this.videoNum++;
          this.instantiationRewardAd();
        }
        var onClose = function(res) {
          res.isEnded ? _callback(true) : _callback(false);
          _this.rewardedVideoAd.offClose(onClose);
          _this.rewardedVideoAd.offError(onError);
        };
        var onError = function(res) {
          console.log("rewardad" + res.errCode + " : " + res.errMsg);
          GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u5e7f\u544a\u6b63\u5728\u51c6\u5907\u4e2d\uff0c\u8bf7\u91cd\u542f\u6216\u7a0d\u540e\u518d\u8bd5");
          _this.rewardedVideoAd.offError(onError);
        };
        this.rewardedVideoAd.load().then(function() {
          return _this.rewardedVideoAd.show();
        }).catch(function(err) {
          return console.log(err.errMsg);
        });
        this.rewardedVideoAd.onClose(onClose);
        this.rewardedVideoAd.onError(onError);
      };
      TTAPI.prototype.startRec = function() {
        var _this = this;
        this.screenRec.onStart(function(res) {
          _this.recordTime = new Date().getTime();
        });
        this.screenRec.start({
          duration: 300
        });
      };
      TTAPI.prototype.stopRec = function() {
        var _this = this;
        if (this.screenRec) {
          this.screenRec.onStop(function(res) {
            _this.recordTime = new Date().getTime() - _this.recordTime;
            _this.videoPath = res.videoPath;
          });
          this.screenRec.stop();
        }
      };
      TTAPI.prototype.issueVideo = function(_callback) {
        if (this.recordTime <= 3e3) {
          GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u89c6\u9891\u5c0f\u4e8e3s\u65e0\u6cd5\u5206\u4eab\u554a");
          return;
        }
        this.videoPath ? tt.shareAppMessage({
          channel: "video",
          templateId: "88dhenci58lli6bp9p",
          extra: {
            videoPath: this.videoPath,
            videoTopics: [ "\u4e94\u661f\u536b\u751f\u9662", "2020\u6211\u4eec\u4e00\u8d77\u8de8\u8fc7" ]
          },
          success: function() {
            this.issueSuc = true;
            this.videoPath = null;
            _callback(true);
          },
          fail: function(e) {
            _callback(false);
          }
        }) : console.log(this.videoPath);
      };
      TTAPI.prototype.shareAppMessage = function(_callback) {
        tt.shareAppMessage({
          templateId: "88dhenci58lli6bp9p",
          success: function() {
            _callback(true);
          },
          fail: function(e) {
            _callback(false);
          }
        });
        return;
      };
      TTAPI.prototype.onMoreGames = function() {
        tt.navigateToMiniProgram ? tt.navigateToMiniProgram() : tt.showModal({
          title: "\u63d0\u793a",
          content: "\u5f53\u524d\u5ba2\u6237\u7aef\u7248\u672c\u8fc7\u4f4e\uff0c\u65e0\u6cd5\u4f7f\u7528\u8be5\u529f\u80fd\uff0c\u8bf7\u5347\u7ea7\u5ba2\u6237\u7aef\u6216\u5173\u95ed\u540e\u91cd\u542f\u66f4\u65b0\u3002"
        });
        tt.onMoreGamesModalClose(function(res) {
          console.log("modal closed", res);
        });
        tt.onNavigateToMiniProgram(function(res) {
          console.log(res.errCode);
          console.log(res.errMsg);
        });
        var systemInfo = tt.getSystemInfoSync();
        "ios" !== systemInfo.platform ? tt.showMoreGamesModal({
          appLaunchOptions: [],
          success: function(res) {
            console.log("success", res.errMsg);
          },
          fail: function(res) {
            console.log("fail", res.errMsg);
          }
        }) : GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u529f\u80fd\u672a\u5f00\u653e");
      };
      TTAPI.prototype.inter = function() {
        console.log(tt.getSystemInfoSync().appName);
        if ("Toutiao" == tt.getSystemInfoSync().appName || "Douyin" == tt.getSystemInfoSync().appName) {
          console.log("\u63d2\u5c4f\u5c55\u793a");
          var interstitialAd_1 = tt.createInterstitialAd({
            adUnitId: "9676je1jdfsff4camw"
          });
          interstitialAd_1.onLoad(function() {
            Log_1.default.info("\u52a0\u8f7d\u63d2\u5c4f");
          });
          interstitialAd_1.onError(function(err) {
            Log_1.default.warn("\u63d2\u5c4f\u6709\u8bef", JSON.stringify(err));
          });
          interstitialAd_1.onClose(function(err) {
            Log_1.default.warn("\u63d2\u5c4f\u5173\u95ed", JSON.stringify(err));
            interstitialAd_1.destroy();
          });
          interstitialAd_1.show().catch(function(err) {
            Log_1.default.warn("\u63d2\u5c4f", JSON.stringify(err));
            interstitialAd_1.show();
          });
        }
      };
      var TTAPI_1;
      TTAPI.clickTime = 0;
      TTAPI.interNum0 = 0;
      TTAPI.interNum2 = 0;
      TTAPI = TTAPI_1 = __decorate([ ccclass ], TTAPI);
      return TTAPI;
    }();
    exports.default = TTAPI;
    cc._RF.pop();
  }, {
    "../manager/Config": "Config",
    "../manager/GameSys": "GameSys",
    "../manager/Log": "Log"
  } ],
  TTRec: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3e379JsHiVPbbq4kGReVqoO", "TTRec");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var PopupManager_1 = require("../common/manager/PopupManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "ttrec";
    var TTRec = function(_super) {
      __extends(TTRec, _super);
      function TTRec() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.bg = null;
        _this.time = 0;
        _this.keeping = 0;
        _this.over = false;
        _this.click = false;
        return _this;
      }
      TTRec.prototype.onLoad = function() {
        if ("tt" == GameSys_1.default.channel) {
          GameSys_1.default.startRec();
          this.time = Math.floor(20 * Math.random()) + 40;
          console.error("=====", this.time);
          GameSys_1.default.game.xBind(Config_1.Config.TTOVER, this.change_over.bind(this), BINDER_NAME);
          this.bg.on(cc.Node.EventType.TOUCH_START, this.onTouchRec.bind(this));
        }
      };
      TTRec.prototype.change_over = function() {
        console.log("++++++");
        GameSys_1.default.startRec();
        this.keeping = 0;
        this.click = false;
        this.unscheduleAllCallbacks();
        this.bg.stopAllActions();
        this.bg.active = false;
        this.time = Math.floor(20 * Math.random()) + 40;
        this.over = false;
      };
      TTRec.prototype.anim = function() {
        var _this = this;
        GameSys_1.default.stopRec();
        this.keeping = 0;
        this.over = true;
        this.bg.active = true;
        cc.tween(this.bg).to(.3, {
          scale: 1.2
        }).delay(.1).to(.3, {
          scale: 1
        }).delay(.1).union().repeatForever().start();
        this.scheduleOnce(function() {
          _this.bg.stopAllActions();
          _this.bg.active = false;
          _this.time = Math.floor(20 * Math.random()) + 40;
          _this.over = false;
          GameSys_1.default.startRec();
        }, 5);
      };
      TTRec.prototype.onTouchRec = function() {
        if (this.click) return;
        this.click = true;
        this.unscheduleAllCallbacks();
        var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
        PopupManager_1.default.show(Config_1.PopupPath.ttrec, options, PopupManager_1.PopupCacheMode.Frequent, PopupManager_1.PopupShowPriority.None);
      };
      TTRec.prototype.onDestroy = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      TTRec.prototype.update = function(dt) {
        if ("tt" !== GameSys_1.default.channel) return;
        if (this.over) return;
        if (this.click) return;
        this.keeping += dt;
        this.keeping > this.time && this.anim();
      };
      __decorate([ property(cc.Node) ], TTRec.prototype, "bg", void 0);
      TTRec = __decorate([ ccclass ], TTRec);
      return TTRec;
    }(cc.Component);
    exports.default = TTRec;
    cc._RF.pop();
  }, {
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/PopupManager": "PopupManager"
  } ],
  TestPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "af3eapXGmNOI5sNf6jfmFAF", "TestPopup");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupBase_1 = require("./common/component/popups/PopupBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TestPopup = function(_super) {
      __extends(TestPopup, _super);
      function TestPopup() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Object.defineProperty(TestPopup, "path", {
        get: function() {
          return "prefabs/testPopup";
        },
        enumerable: false,
        configurable: true
      });
      TestPopup = __decorate([ ccclass ], TestPopup);
      return TestPopup;
    }(PopupBase_1.default);
    exports.default = TestPopup;
    cc._RF.pop();
  }, {
    "./common/component/popups/PopupBase": "PopupBase"
  } ],
  Test: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c27deFujotMZ4aD7hn2XNh6", "Test");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("./common/manager/Config");
    var GameSys_1 = require("./common/manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Test = function(_super) {
      __extends(Test, _super);
      function Test() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.red = null;
        _this.par = null;
        _this.index = 0;
        _this.initZindex = 0;
        return _this;
      }
      Test.prototype.onEnable = function() {
        this.close = this.par.getChildByName("close");
        this.initZindex = this.par.zIndex;
        this.initparent = this.par.parent;
        this.initPos = this.par.getPosition();
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch.bind(this));
        this.close.on(cc.Node.EventType.TOUCH_END, this.onTouchClose.bind(this));
      };
      Test.prototype.onTouch = function() {
        var _this = this;
        if (GameSys_1.default.game.xGet(Config_1.Config.HIDEALL)) return;
        if (!this.red.active) return;
        GameSys_1.default.game.xSet(Config_1.Config.BLOCK, true);
        var canvas = cc.find("Canvas");
        this.par.parent = canvas;
        cc.tween(this.par).to(0, {
          x: 0,
          y: 0,
          scale: 1.3
        }).call(function() {
          _this.close.active = true;
        }).start();
      };
      Test.prototype.onTouchClose = function() {
        var _this = this;
        this.close.active = false;
        GameSys_1.default.game.xSet(Config_1.Config.BLOCK, false);
        cc.tween(this.par).to(0, {
          x: this.initPos.x,
          y: this.initPos.y,
          scale: 1
        }).call(function() {
          _this.par.parent = _this.initparent;
          _this.par.zIndex = _this.initZindex;
        }).start();
      };
      __decorate([ property(cc.Node) ], Test.prototype, "red", void 0);
      __decorate([ property(cc.Node) ], Test.prototype, "par", void 0);
      __decorate([ property ], Test.prototype, "index", void 0);
      Test = __decorate([ ccclass ], Test);
      return Test;
    }(cc.Component);
    exports.default = Test;
    cc._RF.pop();
  }, {
    "./common/manager/Config": "Config",
    "./common/manager/GameSys": "GameSys"
  } ],
  Time: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e59d9lyO2BKxojM1+JlmzoL", "Time");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../manager/Caches");
    var Config_1 = require("../manager/Config");
    var GameSys_1 = require("../manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Time = function(_super) {
      __extends(Time, _super);
      function Time() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.taskList = [];
        _this.signInState = [];
        _this.timeCout = 0;
        _this.tasks = {
          0: {
            title: "\u83b7\u5f97\u94a5\u5319",
            introduce: "\u89c2\u770b\u4e09\u6b21\u89c6\u9891",
            amount: 3,
            award: 1
          },
          1: {
            title: "\u9700\u8981\u63d0\u793a",
            introduce: "\u89c2\u770b\u4e00\u6b21\u63d0\u793a",
            amount: 1,
            award: 1
          },
          2: {
            title: "\u96be\u4e0d\u5012\u6211",
            introduce: "\u8df3\u8fc7\u4e00\u6b21\u5173\u5361",
            amount: 1,
            award: 1
          },
          3: {
            title: "\u5c0f\u83dc\u4e00\u789f",
            introduce: "\u4e0d\u6c42\u52a9\uff0c\u4e0d\u5931\u8d25\uff0c\u4e0d\u8df3\u8fc7\u8fde\u95ef\u4e09\u5173",
            amount: 3,
            award: 1
          },
          4: {
            title: "\u667a\u6167\u4e4b\u5b50",
            introduce: "5\u79d2\u5185\u5b8c\u6210\u4e00\u5173",
            amount: 1,
            award: 1
          },
          5: {
            title: "\u624b\u6c14\u771f\u597d",
            introduce: "\u83b7\u5f97\u4e00\u6b21\u8f6c\u76d8\u5956\u52b1",
            amount: 1,
            award: 1
          },
          6: {
            title: "\u673a\u667a\u5982\u6211",
            introduce: "\u5b8c\u62105\u6b21\u95ef\u5173",
            amount: 5,
            award: 1
          }
        };
        return _this;
      }
      Time.prototype.onLoad = function() {
        return __awaiter(this, void 0, void 0, function() {
          var curDate, _a, _b, sub;
          return __generator(this, function(_c) {
            switch (_c.label) {
             case 0:
              _b = (_a = Math).floor;
              return [ 4, this.getTime() ];

             case 1:
              curDate = _b.apply(_a, [ _c.sent() / 1e3 / 24 / 60 / 60 ]);
              Caches_1.default.get(Caches_1.default.curDate) || Caches_1.default.set(Caches_1.default.curDate, curDate);
              sub = curDate - Caches_1.default.get(Caches_1.default.curDate);
              if (sub >= 1) {
                Caches_1.default.set(Caches_1.default.oppoBanner, 1);
                Caches_1.default.set(Caches_1.default.oppoNatived, 1);
                Caches_1.default.set(Caches_1.default.curDate, curDate);
              }
              return [ 2 ];
            }
          });
        });
      };
      Time.prototype.task = function() {
        for (var i in this.tasks) this.taskList.push({
          state: 0,
          title: this.tasks[i].title,
          introduce: this.tasks[i].introduce,
          amount: this.tasks[i].amount,
          award: this.tasks[i].award,
          index: i
        });
      };
      Time.prototype.getTime = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve) {
              return __awaiter(_this, void 0, void 0, function() {
                var res;
                return __generator(this, function(_a) {
                  res = new Date().getTime();
                  "string" == typeof res && (res = parseInt(res));
                  resolve(res);
                  return [ 2 ];
                });
              });
            }) ];
          });
        });
      };
      Time.prototype.online = function() {
        return __awaiter(this, void 0, void 0, function() {
          var onlineTime, offline, timeInterval, goldOffline, i;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, this.time() ];

             case 1:
              _a.sent();
              onlineTime = this.timeCout;
              console.log("\u4e0a\u7ebf\u65f6\u95f4", onlineTime);
              offline = Caches_1.default.get(Caches_1.default.offline);
              console.log("\u79bb\u7ebf\u65f6\u957f", offline);
              if (!offline) {
                console.log("\u65b0");
                return [ 2 ];
              }
              timeInterval = onlineTime - offline;
              console.log("\u79bb\u7ebf\u65f6\u957f" + timeInterval);
              goldOffline = GameSys_1.default.game.xGet(Config_1.Config.GOLDOFFLINE);
              timeInterval >= 7200 ? GameSys_1.default.gold(Math.abs(goldOffline[1]) / goldOffline[2] * 7200) : GameSys_1.default.gold(Math.abs(goldOffline[1]) / goldOffline[2] * timeInterval);
              for (i = 0; i < goldOffline.length; i++) GameSys_1.default.game.xGet(Config_1.Config.GOLDOFFLINECHANGE, {
                index: i,
                state: 0
              });
              return [ 2 ];
            }
          });
        });
      };
      Time.prototype.offline = function() {
        return __awaiter(this, void 0, void 0, function() {
          var offline;
          return __generator(this, function(_a) {
            this.timeCout = new Date().getTime();
            offline = Math.floor(this.timeCout / 1e3);
            Caches_1.default.set(Caches_1.default.offline, offline);
            return [ 2 ];
          });
        });
      };
      Time.prototype.time = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve) {
              GameSys_1.default.http.getTime("https://www.dingxuanxx.com/time?_=" + Date.now(), function(data) {
                if (data.error) {
                  _this.timeCout = new Date().getTime();
                  resolve(Math.floor(_this.timeCout / 1e3));
                }
                _this.timeCout = data.data.time;
                resolve(_this.timeCout);
              });
            }) ];
          });
        });
      };
      Time.prototype.resetSignIn = function() {
        for (var i = 0; i < this.signInState.length; i++) GameSys_1.default.game.xSet(Config_1.Config.SIGNINCHANGE, {
          index: i,
          state: 0
        });
        GameSys_1.default.game.xSet(Config_1.Config.SIGNINCHANGE, {
          index: 0,
          state: 1
        });
      };
      Time = __decorate([ ccclass ], Time);
      return Time;
    }(cc.Component);
    exports.default = Time;
    cc._RF.pop();
  }, {
    "../manager/Caches": "Caches",
    "../manager/Config": "Config",
    "../manager/GameSys": "GameSys"
  } ],
  TouchBlocker: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f1532ZaJTdLh57ZPiS9ek+r", "TouchBlocker");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TouchBlocker = function(_super) {
      __extends(TouchBlocker, _super);
      function TouchBlocker() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.target = null;
        _this.isBlockAll = false;
        _this.isPassAll = false;
        return _this;
      }
      TouchBlocker.prototype.onLoad = function() {
        this.node.on("touchstart", this.onTouchStart, this);
      };
      TouchBlocker.prototype.start = function() {
        this.setSwallowTouches(false);
      };
      TouchBlocker.prototype.onDestroy = function() {
        this.node.off("touchstart", this.onTouchStart, this);
      };
      TouchBlocker.prototype.onTouchStart = function(event) {
        if (this.isPassAll) return;
        if (this.isBlockAll || !this.target) {
          event.stopPropagationImmediate();
          return;
        }
        var targetRect = this.target.getBoundingBoxToWorld();
        var isContains = targetRect.contains(event.getLocation());
        isContains || event.stopPropagationImmediate();
      };
      TouchBlocker.prototype.blockAll = function() {
        this.isBlockAll = true;
        this.isPassAll = false;
      };
      TouchBlocker.prototype.passAll = function() {
        this.isPassAll = true;
        this.isBlockAll = false;
      };
      TouchBlocker.prototype.setTarget = function(node) {
        this.target = node;
        this.isBlockAll = false;
        this.isPassAll = false;
      };
      TouchBlocker.prototype.setSwallowTouches = function(swallow) {
        this.node._touchListener.setSwallowTouches(swallow);
      };
      __decorate([ property({
        type: cc.Node,
        tooltip: false
      }) ], TouchBlocker.prototype, "target", void 0);
      TouchBlocker = __decorate([ ccclass ], TouchBlocker);
      return TouchBlocker;
    }(cc.Component);
    exports.default = TouchBlocker;
    cc._RF.pop();
  }, {} ],
  TouchManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b4829fC0z5J+4uXHqXRBNJp", "TouchManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TouchManager = function() {
      function TouchManager(node) {
        this.delta = 200;
        this.lock = 0;
        this.offset = 100;
        this.node = node;
        this.register();
      }
      TouchManager.prototype.submit = function(callbackLeft, callbackRight, callbackUp, callbackDown) {
        this.callbackLeft = callbackLeft;
        this.callbackRight = callbackRight;
        this.callbackUp = callbackUp;
        this.callbackDown = callbackDown;
      };
      TouchManager.prototype.register = function() {
        var _this = this;
        var initPos;
        this.node.on("touchstart", function(e) {
          initPos = e.getLocation();
        }, this);
        this.node.on("touchmove", function() {
          _this.lock++;
        }, this);
        this.node.on("touchend", function(e) {
          _this.lock < _this.delta ? _this.direction(initPos, e.getLocation()) : null;
          _this.lock = 0;
        }, this);
        this.node.on("touchcancel", function(e) {
          _this.lock < _this.delta ? _this.direction(initPos, e.getLocation()) : null;
          _this.lock = 0;
        }, this);
      };
      TouchManager.prototype.direction = function(initPos, touchPos) {
        if (Math.abs(touchPos.x - initPos.x) < this.offset && Math.abs(touchPos.y - initPos.y) < this.offset) return;
        Math.abs(touchPos.x - initPos.x) > Math.abs(touchPos.y - initPos.y) ? touchPos.x - initPos.x > this.offset ? this.callbackRight() : touchPos.x - initPos.x < -this.offset && this.callbackLeft() : touchPos.y - initPos.y > this.offset ? this.callbackUp() : touchPos.y - initPos.y < -this.offset && this.callbackDown();
      };
      return TouchManager;
    }();
    exports.default = TouchManager;
    cc._RF.pop();
  }, {} ],
  UtilsManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71383SVJmZAZ5MCSlo032NX", "UtilsManager");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UtilsManager = function() {
      function UtilsManager() {}
      UtilsManager.clone = function(src) {
        if (!src || "object" !== typeof src) return src;
        var out = src.constructor === Array ? [] : {};
        var _clone = function(o, c) {
          for (var i in o) if (o[i] && "object" === typeof o[i]) {
            o[i].constructor === Array ? c[i] = [] : c[i] = {};
            _clone(o[i], c[i]);
          } else c[i] = o[i];
          return c;
        };
        return _clone(src, out);
      };
      UtilsManager.loadJson = function(_address) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve) {
              cc.loader.loadRes(_address, cc.JsonAsset, function(err, asset) {
                if (err) {
                  console.error(err);
                  resolve({});
                } else resolve(asset.json);
              });
            }) ];
          });
        });
      };
      UtilsManager.loadAudioClip = function(_address) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve) {
              cc.loader.loadRes(_address, cc.AudioClip, function(err, asset) {
                if (err) {
                  console.error(err);
                  resolve(null);
                } else resolve(asset);
              });
            }) ];
          });
        });
      };
      UtilsManager.loadPrefab = function(_address) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve) {
              cc.resources.load(_address, cc.Prefab, function(err, asset) {
                if (err) {
                  console.error(err);
                  resolve(null);
                } else resolve(asset);
              });
            }) ];
          });
        });
      };
      UtilsManager.loadImage = function(_address) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve) {
              cc.resources.load(_address, cc.SpriteFrame, function(err, asset) {
                if (err) {
                  console.error(err, _address);
                  resolve(null);
                } else resolve(asset);
              });
            }) ];
          });
        });
      };
      return UtilsManager;
    }();
    exports.default = UtilsManager;
    cc._RF.pop();
  }, {} ],
  VivoApi: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4354aGCsvtJxJJSXegFDb72", "VivoApi");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSys_1 = require("../manager/GameSys");
    var Log_1 = require("../manager/Log");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "tzxxs_vivoapi";
    var VIVOApi = function() {
      function VIVOApi() {
        this.onOff = true;
        this.clickTime = 0;
        this.isShow = false;
        this.oldBannerAd = null;
        this.bannerIndex = 0;
        this.index = 0;
        this.bannerPar = [ "94521699ab834cc487bd41ac0b4f1316" ];
        this.bannerTime = 0;
        this.isVoice = false;
        this.videoTime = 0;
        this.videoAds = [ "8efae17c032e4d748c2406be950ac7f7" ];
        this.isInstall = false;
        this.interTime = null;
        this.nativeTime = null;
        this.nativeAd = null;
        GameSys_1.default.sdk.Instance = this;
        console.log("\u8fdb\u5165vivo\u73af\u5883");
        GameSys_1.default.sdk.xBind("createBanner", this.createBanner.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("hideBanner", this.hideBanner.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("destroyBanner", this.destroySelf.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("shortcut", this.shortCut.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("showNativeAd", this.showNativeAd.bind(this), BINDER_NAME);
        GameSys_1.default.sdk.xBind("hideNative", this.hideNativeAd.bind(this), BINDER_NAME);
      }
      VIVOApi.prototype.createBanner = function() {
        if (!this.onOff) return;
        var code = qg.getSystemInfoSync().platformVersionCode;
        if (code < 1031) return;
        if (new Date().getTime() - this.bannerTime < 1e4) return;
        this.isShow && this.hideBanner();
        var posId = "94521699ab834cc487bd41ac0b4f1316";
        var bannerAd = qg.createBannerAd({
          posId: posId,
          style: {}
        });
        console.log(posId);
        this.oldBannerAd = bannerAd;
        this.showBanner();
      };
      VIVOApi.prototype.showBanner = function() {
        var _this = this;
        var bannerAd = this.oldBannerAd;
        console.log("\u5c55\u793abanner", bannerAd);
        if (bannerAd) {
          bannerAd.onError(function(err) {
            console.log("banner\u5e7f\u544a\u52a0\u8f7d\u5931\u8d25", err);
          });
          bannerAd.show().then(function() {
            _this.isShow = true;
            _this.bannerTime = new Date().getTime();
            console.log("banner\u5e7f\u544a\u5c55\u793a\u5b8c\u6210");
          }).catch(function(err) {
            console.log("banner\u5e7f\u544a\u5c55\u793a\u5931\u8d25", JSON.stringify(err));
          });
        }
      };
      VIVOApi.prototype.hideBanner = function() {
        if (!this.onOff) return;
        if (new Date().getTime() - this.bannerTime < 1e4) return;
        if (!this.isShow) return;
        Log_1.default.info("\u8fdb\u5165banner\u9690\u85cf");
        this.isShow = false;
        var bannerAd = this.oldBannerAd;
        if (bannerAd) {
          bannerAd.hide();
          this.oldBannerAd = null;
        }
      };
      VIVOApi.prototype.destroySelf = function() {
        var bannerAd = this.oldBannerAd;
        if (bannerAd) {
          var addestroy = bannerAd.destroy();
          addestroy && addestroy.then(function() {
            console.log("banner\u5e7f\u544a\u9500\u6bc1\u6210\u529f");
          }).catch(function(err) {
            console.log("banner\u5e7f\u544a\u9500\u6bc1\u5931\u8d25", err);
          });
          this.oldBannerAd = null;
        }
      };
      VIVOApi.prototype.createRewardedVideoAd = function(_callback) {
        var _this = this;
        if (!this.onOff) {
          GameSys_1.default.game.xSet("tip", "\u529f\u80fd\u672a\u5f00\u653e");
          return;
        }
        var bgmVolume = GameSys_1.default.audio.xGet("bgmVolume");
        console.log("\u58f0\u97f3\u5224\u65ad", bgmVolume);
        var code = qg.getSystemInfoSync().platformVersionCode;
        if (code < 1041) {
          GameSys_1.default.game.xSet("tip", "\u66f4\u65b0\u5e73\u53f0\u5373\u53ef\u4f7f\u7528\u8be5\u529f\u80fd\u54e6");
          return;
        }
        var videoAd = null;
        this.videoTime++;
        videoAd = qg.createRewardedVideoAd({
          adUnitId: this.videoAds[this.videoTime % this.videoAds.length]
        });
        if (new Date().getTime() - this.clickTime < 6e4) {
          Log_1.default.info("\u65f6\u95f4\u5c0f\u4e8e1\u5206\u949f");
          GameSys_1.default.game.xSet("tip", "\u5e7f\u544a\u8bf7\u6c42\u9891\u7e41\u8bf7\u7a0d\u540e\u91cd\u8bd5");
          return;
        }
        videoAd.onLoad(function() {
          1 == bgmVolume && GameSys_1.default.audio.pauseAll();
          _this.clickTime = new Date().getTime();
          videoAd.show();
          var adshow = videoAd.show();
          adshow && adshow.then(function() {
            console.log("\u6fc0\u52b1\u89c6\u9891\u5e7f\u544a\u663e\u793a\u6210\u529f");
          }).catch(function(err) {
            console.log("\u6fc0\u52b1\u89c6\u9891\u5e7f\u544a\u663e\u793a\u5931\u8d25", err);
          });
        });
        videoAd.onClose(function(res) {
          console.log("\u58f0\u97f3\u5904\u7406", bgmVolume);
          1 == bgmVolume && GameSys_1.default.audio.resumeAll();
          videoAd.offLoad();
          videoAd.offClose();
          videoAd.offError();
          res.isEnded ? _callback(true) : _callback(false);
        });
        videoAd.onError(function(err) {});
        videoAd.load();
        var adload = videoAd.load();
        adload && adload.then(function() {
          console.log("\u6fc0\u52b1\u89c6\u9891\u5e7f\u544a\u52a0\u8f7d\u6210\u529f");
        }).catch(function(err) {
          console.log("\u6fc0\u52b1\u89c6\u9891\u5e7f\u544a\u52a0\u8f7d\u5931\u8d25", err);
        });
      };
      VIVOApi.prototype.createInsertAd = function() {
        var _this = this;
        if (!this.onOff) {
          console.log("\u63d2\u5c4f\u5e7f\u544a\u7533\u8bf7\u4e2d");
          return;
        }
        if (new Date().getTime() - this.interTime < 1e4) return;
        var interstitialAd = qg.createInterstitialAd({
          posId: "c3698282b75d4f17bec5355d1d5c0a0f"
        });
        console.log("\u63d2\u5c4f\u6570\u636e", interstitialAd);
        interstitialAd.onError(function(err) {
          console.log("\u63d2\u5c4f\u5e7f\u544a\u52a0\u8f7d\u5931\u8d25", err);
        });
        interstitialAd.show().then(function() {
          console.log("\u63d2\u5c4f\u5e7f\u544a\u5c55\u793a\u5b8c\u6210");
          _this.interTime = new Date().getTime();
        }).catch(function(err) {
          console.log("\u63d2\u5c4f\u5e7f\u544a\u5c55\u793a\u5931\u8d25", JSON.stringify(err));
        });
      };
      VIVOApi.prototype.shareAppMessage = function() {
        qg.share();
      };
      VIVOApi.prototype.shortCut = function() {
        qg.hasShortcutInstalled({
          success: function(status) {
            if (status) {
              console.log("\u5df2\u521b\u5efa");
              this.isInstall = true;
            } else this.isInstall = false;
          }
        });
        this.isInstall || qg.installShortcut({
          success: function() {
            console.log("\u521b\u5efa\u6210\u529f");
          },
          fail: function() {
            console.log("\u521b\u5efa\u5931\u8d25");
          }
        });
      };
      VIVOApi.prototype.showNativeAd = function(nativeNode) {
        var _this = this;
        var adUnitId = "28802d29fd314872b5ec2d28aef3ef7c";
        console.log("====showNativeAd===", adUnitId);
        if (new Date().getTime() - this.nativeTime < 1e4) {
          nativeNode.parent.destroy();
          this.createInsertAd();
          return;
        }
        var self = this;
        if (null == self.nativeAd) {
          self.nativeAd = qg.createNativeAd({
            adUnitId: adUnitId
          });
          console.log("===showNativeAd===", self.nativeAd);
          if (null == self.nativeAd || void 0 == self.nativeAd) return;
          self.nativeAd.onError(function(res) {
            console.error("===showNativeAd=onError:", res);
            self.hideNativeAd();
          });
          self.nativeAd.onLoad(function(res) {
            console.error("===showNativeAd=onLoad:", res);
            var nativeCurrentAd = null;
            res && res.adList && (nativeCurrentAd = res.adList.pop());
            if (null == nativeCurrentAd || void 0 == nativeCurrentAd) {
              self.hideNativeAd();
              return;
            }
            var element = nativeCurrentAd;
            self.nativeAd.reportAdShow({
              adId: element.adId
            });
            console.log("\u67e5\u770b", element);
            cc.assetManager.loadRemote(element.imgUrlList[0], function(error, texture) {
              console.log(texture);
              if (error) {
                self.createInsertAd();
                nativeNode.parent.destroy();
                console.error("showNativeAd element.icon\uff1a", error);
              } else {
                self.nativeTime = new Date().getTime();
                var btnNode_1 = nativeNode;
                var size = btnNode_1.getContentSize();
                var sprite = btnNode_1.getComponent(cc.Sprite);
                sprite && (sprite.spriteFrame = new cc.SpriteFrame(texture));
                btnNode_1.parent.getComponent(cc.BlockInputEvents).enabled = true;
                btnNode_1.setContentSize(size);
                btnNode_1.on(cc.Node.EventType.TOUCH_END, function() {
                  console.error("btnNode TOUCH_END:", element.adId);
                  self.nativeAd.reportAdClick({
                    adId: element.adId
                  });
                }, self);
                var titleLabel = btnNode_1.getChildByName("titleLabel").getComponent(cc.Label);
                var ad = btnNode_1.getChildByName("ad").getComponent(cc.Label);
                ad.string = "\u5e7f\u544a";
                titleLabel.string = element.title;
                var close = btnNode_1.getChildByName("close");
                close.active = true;
                console.log("\u627e\u5230\u4e86Close", close);
                close.on(cc.Node.EventType.TOUCH_END, function() {
                  var value = Math.random();
                  console.log("\u5173\u95ed\u539f\u751f\u6982\u7387", value);
                  if (value < .1) {
                    btnNode_1.parent.destroy();
                    null != _this.nativeAd && (_this.nativeAd = null);
                  }
                }, self);
              }
            });
          });
        }
        self.nativeAd.load();
      };
      VIVOApi.prototype.hideNativeAd = function() {
        console.log("\u70b9\u51fb\u76d1\u542c");
        null != this.nativeAd && (this.nativeAd = null);
      };
      VIVOApi = __decorate([ ccclass ], VIVOApi);
      return VIVOApi;
    }();
    exports.default = VIVOApi;
    cc._RF.pop();
  }, {
    "../manager/GameSys": "GameSys",
    "../manager/Log": "Log"
  } ],
  Warehouse_item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a124e66JT5KkKzl8vh/J8N9", "Warehouse_item");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var StateManager_1 = require("../common/manager/StateManager");
    var UtilsManager_1 = require("../common/manager/UtilsManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Warehouse_item";
    var Warehouse_item = function(_super) {
      __extends(Warehouse_item, _super);
      function Warehouse_item() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.buy = null;
        _this.reduce = null;
        _this.lock_lab = null;
        _this.state = null;
        _this.spr = null;
        _this.buy_lab = null;
        _this.time_lab = null;
        _this.interval_lab = null;
        _this.add_lab = null;
        _this.count_lab = null;
        _this.ID = 0;
        _this.gold = 0;
        _this.index = 0;
        _this.watchvideo = false;
        _this.buyFlag = false;
        return _this;
      }
      Warehouse_item.prototype.init = function(warehouse, _index) {
        return __awaiter(this, void 0, void 0, function() {
          var path, _a, i;
          var _this = this;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              this.buyFlag = false;
              this.ID = warehouse.ID - 1;
              this.index = _index;
              path = "warehouse/" + warehouse.name;
              _a = this.spr;
              return [ 4, UtilsManager_1.default.loadImage(path) ];

             case 1:
              _a.spriteFrame = _b.sent();
              this.buy_lab.string = "-" + warehouse.buy.toString();
              this.time_lab.string = "-" + warehouse.result_1 + "s";
              this.interval_lab.string = "-" + warehouse.result_2 + "s";
              this.add_lab.string = "+" + 100 * warehouse.result_3 + "%";
              this.count_lab.string = warehouse.name;
              this.gold = warehouse.buy;
              this.watchvideo = false;
              if (GameSys_1.default.level >= warehouse.lock) {
                this.state.stateChange(0);
                GameSys_1.default.judgeGold(this.gold, function() {
                  _this.state.node.children[0].children[0].active = true;
                  _this.watchvideo = true;
                }, function() {
                  _this.state.node.children[0].children[0].active = false;
                  _this.watchvideo = false;
                });
                this.lock_lab.string = "";
              } else {
                this.state.stateChange(2);
                this.lock_lab.string = "\u89e3\u9501\u7b49\u7ea7\uff1a" + warehouse.lock;
              }
              for (i = 0; i < GameSys_1.default.game.xGet(Config_1.Config.WAREHOUSE).length; i++) if (this.ID == GameSys_1.default.game.xGet(Config_1.Config.WAREHOUSE)[i]) {
                this.state.stateChange(1);
                this.buy_lab.string = "";
              }
              GameSys_1.default.game.xBind(Config_1.Config.WAREHOUSEANIM, this.anim.bind(this), BINDER_NAME);
              return [ 2 ];
            }
          });
        });
      };
      Warehouse_item.prototype.onTouchLock = function() {
        GameSys_1.default.game.xSet(Config_1.Config.TIP, "\u7b49\u7ea7\u4e0d\u591f\u65e0\u6cd5\u8d2d\u4e70\uff01");
      };
      Warehouse_item.prototype.onTouhcHave_buy = function() {
        Caches_1.default.get(Caches_1.default.newGuide) || 30 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 31);
      };
      Warehouse_item.prototype.anim = function(_index) {
        var _this = this;
        this.node.stopAllActions();
        this.node.opacity = 255;
        if (this.index + 3 * _index >= Config_1.WAREHOUSE.length) {
          cc.tween(this.node).to(.2, {
            opacity: 0
          }).start();
          return;
        }
        cc.tween(this.node).to(.2, {
          opacity: 0
        }).call(function() {
          _this.init(Config_1.WAREHOUSE[_this.index + 3 * _index], _this.index);
          cc.tween(_this.node).to(.1, {
            opacity: 255
          }).start();
        }).start();
      };
      Warehouse_item.prototype.onTouchBuy = function() {
        var _this = this;
        if (this.buyFlag) return;
        this.buyFlag = true;
        var cb = function() {
          _this.state.stateChange(1);
          _this.lock_lab.string = "";
          _this.buy_lab.string = "";
          GameSys_1.default.game.xSet(Config_1.Config.WAREHOUSECHNAGE, _this.ID);
          GameSys_1.default.game.xSet(Config_1.Config.ALLRED);
        };
        if (Caches_1.default.get(Caches_1.default.newGuide)) this.watchvideo ? GameSys_1.default.watchVideo(4, cb) : GameSys_1.default.useGold(-this.gold, function() {
          var goldAnim = cc.instantiate(_this.reduce);
          _this.buy.addChild(goldAnim);
          goldAnim.y = 0;
          goldAnim.x = 0;
          goldAnim.children[0].getComponent(cc.Label).string = "-" + _this.gold.toFixed(0);
          goldAnim.children[0].color = cc.Color.BLACK;
          cc.tween(goldAnim).to(1, {
            y: goldAnim.y + 50,
            opacity: 100
          }).call(function() {
            goldAnim.destroy();
            cb();
          }).start();
        }); else if (30 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON)) {
          GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 31);
          GameSys_1.default.useGold(-this.gold, function() {
            var goldAnim = cc.instantiate(_this.reduce);
            _this.buy.addChild(goldAnim);
            goldAnim.y = 0;
            goldAnim.x = 0;
            goldAnim.children[0].getComponent(cc.Label).string = "-" + _this.gold.toFixed(0);
            goldAnim.children[0].color = cc.Color.BLACK;
            cc.tween(goldAnim).to(1, {
              y: goldAnim.y + 50,
              opacity: 100
            }).call(function() {
              goldAnim.destroy();
              cb();
            }).start();
          });
        }
      };
      Warehouse_item.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Node) ], Warehouse_item.prototype, "buy", void 0);
      __decorate([ property(cc.Prefab) ], Warehouse_item.prototype, "reduce", void 0);
      __decorate([ property(cc.Label) ], Warehouse_item.prototype, "lock_lab", void 0);
      __decorate([ property(StateManager_1.default) ], Warehouse_item.prototype, "state", void 0);
      __decorate([ property(cc.Sprite) ], Warehouse_item.prototype, "spr", void 0);
      __decorate([ property(cc.Label) ], Warehouse_item.prototype, "buy_lab", void 0);
      __decorate([ property(cc.Label) ], Warehouse_item.prototype, "time_lab", void 0);
      __decorate([ property(cc.Label) ], Warehouse_item.prototype, "interval_lab", void 0);
      __decorate([ property(cc.Label) ], Warehouse_item.prototype, "add_lab", void 0);
      __decorate([ property(cc.Label) ], Warehouse_item.prototype, "count_lab", void 0);
      Warehouse_item = __decorate([ ccclass ], Warehouse_item);
      return Warehouse_item;
    }(cc.Component);
    exports.default = Warehouse_item;
    cc._RF.pop();
  }, {
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "../common/manager/StateManager": "StateManager",
    "../common/manager/UtilsManager": "UtilsManager"
  } ],
  Warehouse: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cde6abFvQ1IGpykr4gmNwPj", "Warehouse");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupBase_1 = require("../common/component/popups/PopupBase");
    var Caches_1 = require("../common/manager/Caches");
    var Config_1 = require("../common/manager/Config");
    var GameSys_1 = require("../common/manager/GameSys");
    var Warehouse_item_1 = require("./Warehouse_item");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "";
    var Warehouse = function(_super) {
      __extends(Warehouse, _super);
      function Warehouse() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.content = null;
        _this.item = null;
        _this.index = 0;
        return _this;
      }
      Warehouse.prototype.onLoad = function() {
        for (var i = 0; i < 3; i++) {
          var item = cc.instantiate(this.item);
          item.parent = this.content;
          item.getComponent(Warehouse_item_1.default).init(Config_1.WAREHOUSE[i], i);
        }
      };
      Warehouse.prototype.onEnable = function() {
        this.node.zIndex = 10;
        for (var i = 0; i < this.content.childrenCount; i++) this.content.children[i].getComponent(Warehouse_item_1.default).init(Config_1.WAREHOUSE[i + 3 * this.index], i);
        if (Caches_1.default.get(Caches_1.default.newGuide)) {
          GameSys_1.default.game.xSet(Config_1.Config.OPPO, true);
          GameSys_1.default.showBanner();
          GameSys_1.default.showInter();
        }
      };
      Warehouse.prototype.onTouchLeft = function() {
        if (0 == this.index) return;
        this.index--;
        console.log(this.index);
        GameSys_1.default.game.xSet(Config_1.Config.WAREHOUSEANIM, this.index);
      };
      Warehouse.prototype.onTouchRight = function() {
        if (3 == this.index) return;
        this.index++;
        console.log(this.index);
        GameSys_1.default.game.xSet(Config_1.Config.WAREHOUSEANIM, this.index);
      };
      Warehouse.prototype.onTouchhide = function() {
        Caches_1.default.get(Caches_1.default.newGuide) && GameSys_1.default.hideBanner();
        Caches_1.default.get(Caches_1.default.newGuide) || 31 == GameSys_1.default.game.xGet(Config_1.Config.NEWGUIDECON) && GameSys_1.default.game.xSet(Config_1.Config.NEWGUIDECON, 32);
        this.hide();
      };
      Warehouse.prototype.onDestory = function() {};
      __decorate([ property(cc.Node) ], Warehouse.prototype, "content", void 0);
      __decorate([ property(cc.Prefab) ], Warehouse.prototype, "item", void 0);
      Warehouse = __decorate([ ccclass ], Warehouse);
      return Warehouse;
    }(PopupBase_1.default);
    exports.default = Warehouse;
    cc._RF.pop();
  }, {
    "../common/component/popups/PopupBase": "PopupBase",
    "../common/manager/Caches": "Caches",
    "../common/manager/Config": "Config",
    "../common/manager/GameSys": "GameSys",
    "./Warehouse_item": "Warehouse_item"
  } ],
  Water_spread: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5f580qmPYJFY4Jbz2GVIcjO", "Water_spread");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Water_spread = function(_super) {
      __extends(Water_spread, _super);
      function Water_spread() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.bg = null;
        _this.material = null;
        _this.waveOffset = 0;
        return _this;
      }
      Water_spread.prototype.onLoad = function() {
        this.material = this.bg.getComponent(cc.Sprite).getMaterial(0);
        this.bg.on(cc.Node.EventType.TOUCH_END, this.touchStartEvent, this);
      };
      Water_spread.prototype.touchStartEvent = function(evt) {
        console.log("\u6ca1\u6709\u89e6\u6478\u5230");
        var pos = evt.getLocation();
        this.material.setProperty("center", [ pos.x / this.bg.width, (this.bg.height - pos.y) / this.bg.height ]);
        this.waveOffset = 0;
      };
      Water_spread.prototype.update = function(dt) {
        this.waveOffset > 2 && (this.waveOffset = 0);
        this.waveOffset += dt;
        this.material.setProperty("wave_offset", this.waveOffset);
      };
      __decorate([ property(cc.Node) ], Water_spread.prototype, "bg", void 0);
      Water_spread = __decorate([ ccclass ], Water_spread);
      return Water_spread;
    }(cc.Component);
    exports.default = Water_spread;
    cc._RF.pop();
  }, {} ],
  XBGM: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "01beezUoDFOgKrEeSBp30xA", "XBGM");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Log_1 = require("../manager/Log");
    var GameSys_1 = require("../manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var XBGM = function(_super) {
      __extends(XBGM, _super);
      function XBGM() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.bgmAudio = null;
        _this.slientPlay = false;
        _this.volumeRate = .8;
        return _this;
      }
      XBGM.prototype.start = function() {
        var _this = this;
        if (!this.bgmAudio) {
          Log_1.default.error("\u6ca1\u6709\u6dfb\u52a0\u80cc\u666f\u97f3\u4e50");
          GameSys_1.default.audio.stopBGM();
          return;
        }
        var vol = GameSys_1.default.audio.xGet("bgmVolume");
        if (vol <= .001 && !this.slientPlay) {
          Log_1.default.info("\u97f3\u91cf\u592a\u5c0f\u6216\u6ca1\u6709\u5141\u8bb8\u64ad\u653e", vol);
          return;
        }
        this.scheduleOnce(function() {
          Log_1.default.info("\u5f00\u59cb\u64ad\u653e\u97f3\u4e50", _this.bgmAudio);
          GameSys_1.default.audio.playBGM(_this.bgmAudio, _this.volumeRate);
        }, .05);
      };
      __decorate([ property({
        type: cc.AudioClip,
        displayName: "\u80cc\u666f\u97f3\u4e50"
      }) ], XBGM.prototype, "bgmAudio", void 0);
      __decorate([ property({
        displayName: "\u9759\u9ed8\u64ad\u653e"
      }) ], XBGM.prototype, "slientPlay", void 0);
      __decorate([ property({
        type: cc.Float,
        displayName: "\u97f3\u91cf\u6bd4"
      }) ], XBGM.prototype, "volumeRate", void 0);
      XBGM = __decorate([ ccclass ], XBGM);
      return XBGM;
    }(cc.Component);
    exports.default = XBGM;
    cc._RF.pop();
  }, {
    "../manager/GameSys": "GameSys",
    "../manager/Log": "Log"
  } ],
  XButton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "191a33mtMxK35Q0TPFR0T8b", "XButton");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSys_1 = require("../manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var XButton = function(_super) {
      __extends(XButton, _super);
      function XButton() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.touchAudio = null;
        _this.touchAnim = false;
        _this.clickInterval = .4;
        _this.touchEvents = [];
        _this.touchStartEvents = [];
        _this.touchCancelEvents = [];
        _this.isDown = false;
        _this.rawScale = 0;
        _this.clickTime = null;
        _this.initScale = 1;
        return _this;
      }
      XButton.prototype.onLoad = function() {
        this.rawScale = this.node.scale;
        this.node.on("touchstart", this.touchStart.bind(this), this.node);
        this.node.on("touchend", this.touchEnd.bind(this), this.node);
        this.node.on("touchcancel", this.touchCancel.bind(this), this.node);
      };
      XButton.prototype.touchStart = function(event) {
        if (false == this.enabled || this.isDown) return;
        this.initScale = this.node.scale;
        this.isDown = true;
        this.touchAudio ? GameSys_1.default.audio.playSFX(this.touchAudio) : GameSys_1.default.audio.playSFX("audios/close");
        if (this.touchAnim) {
          this.node.stopAllActions();
          this.node.runAction(cc.sequence(cc.scaleTo(.1, 1.1), cc.callFunc(function() {})).repeatForever());
        }
        this.touchStartEvents.length > 0 && cc.Component.EventHandler.emitEvents(this.touchStartEvents);
      };
      XButton.prototype.touchEnd = function(event) {
        var _this = this;
        if (false == this.enabled) return;
        if (this.touchAnim) {
          this.node.stopAllActions();
          this.node.runAction(cc.sequence(cc.scaleTo(.1, this.initScale), cc.callFunc(function() {
            _this.isDown = false;
          })));
        } else this.isDown = false;
        var now = new Date();
        var ms = 1e3 * this.clickInterval;
        if (now.getTime() - this.clickTime < ms) return;
        this.clickTime = now.getTime();
        this.touchEvents.length > 0 && cc.Component.EventHandler.emitEvents(this.touchEvents);
      };
      XButton.prototype.touchCancel = function(event) {
        var _this = this;
        if (false == this.enabled) return;
        if (this.touchAnim) if (this.touchAnim) {
          this.node.stopAllActions();
          this.node.runAction(cc.sequence(cc.scaleTo(.1, 1), cc.callFunc(function() {
            _this.isDown = false;
          })));
        } else this.isDown = false;
        this.touchCancelEvents.length > 0 && cc.Component.EventHandler.emitEvents(this.touchCancelEvents);
      };
      XButton.prototype.addTouchStartEvent = function(_targetNode, _componentName, _handlerName, _customEventData) {
        void 0 === _customEventData && (_customEventData = "");
        var handler = new cc.Component.EventHandler();
        handler.target = _targetNode;
        handler.component = _componentName;
        handler.customEventData = _customEventData + "";
        handler.handler = _handlerName;
        this.touchStartEvents.push(handler);
      };
      XButton.prototype.addTouchEvent = function(_targetNode, _componentName, _handlerName, _customEventData) {
        void 0 === _customEventData && (_customEventData = "");
        var handler = new cc.Component.EventHandler();
        handler.target = _targetNode;
        handler.component = _componentName;
        handler.customEventData = _customEventData + "";
        handler.handler = _handlerName;
        this.touchEvents.push(handler);
      };
      XButton.prototype.addTouchCancelEvent = function(_targetNode, _componentName, _handlerName, _customEventData) {
        void 0 === _customEventData && (_customEventData = "");
        var handler = new cc.Component.EventHandler();
        handler.target = _targetNode;
        handler.component = _componentName;
        handler.customEventData = _customEventData + "";
        handler.handler = _handlerName;
        this.touchCancelEvents.push(handler);
      };
      __decorate([ property({
        type: cc.AudioClip,
        displayName: "\u89e6\u6478\u97f3"
      }) ], XButton.prototype, "touchAudio", void 0);
      __decorate([ property({
        displayName: "\u89e6\u6478\u52a8\u753b"
      }) ], XButton.prototype, "touchAnim", void 0);
      __decorate([ property({
        type: cc.Float,
        displayName: "\u70b9\u51fb\u95f4\u9694"
      }) ], XButton.prototype, "clickInterval", void 0);
      __decorate([ property({
        type: cc.Component.EventHandler,
        displayName: "\u89e6\u6478\u56de\u8c03"
      }) ], XButton.prototype, "touchEvents", void 0);
      XButton = __decorate([ ccclass, menu("\u6309\u94ae\u7ec4\u4ef6/XButton") ], XButton);
      return XButton;
    }(cc.Component);
    exports.default = XButton;
    cc._RF.pop();
  }, {
    "../manager/GameSys": "GameSys"
  } ],
  ZIndex: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bf10e6Q4yZLaZtsL/Nh82C/", "ZIndex");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "";
    var NewClass = function(_super) {
      __extends(NewClass, _super);
      function NewClass() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.index = 0;
        return _this;
      }
      NewClass.prototype.onLoad = function() {
        this.node.zIndex = this.index;
      };
      NewClass.prototype.onDestory = function() {};
      __decorate([ property() ], NewClass.prototype, "index", void 0);
      NewClass = __decorate([ ccclass ], NewClass);
      return NewClass;
    }(cc.Component);
    exports.default = NewClass;
    cc._RF.pop();
  }, {} ],
  Zoom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b3a61Sik4FNaYSjWzNiBJn9", "Zoom");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../manager/Config");
    var GameSys_1 = require("../manager/GameSys");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BINDER_NAME = "Zoom";
    var Zoom = function(_super) {
      __extends(Zoom, _super);
      function Zoom() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.zone = null;
        _this.targetMap = null;
        _this.stopmove = false;
        return _this;
      }
      Zoom.prototype.onLoad = function() {
        GameSys_1.default.game.xBind(Config_1.Config.HIDEALL, this.hideAll.bind(this), BINDER_NAME);
      };
      Zoom.prototype.hideAll = function(v) {
        this.stopmove = v;
        this.node.scale = 1;
      };
      Zoom.prototype.onTouchStart = function(event) {
        if (this.stopmove) return;
        var touches = event.getTouches();
        if (1 == touches.length) ; else if (2 == touches.length) {
          this.startPos1 = this.node.convertToNodeSpaceAR(touches[0].getLocation());
          this.startPos2 = this.node.convertToNodeSpaceAR(touches[1].getLocation());
          this.pointsDis = this.startPos1.sub(this.startPos2).mag();
        }
      };
      Zoom.prototype.onTouchMove = function(event) {
        if (this.stopmove) return;
        var touches = event.getTouches();
        if (2 == touches.length) {
          var touchPoint1 = this.node.convertToNodeSpaceAR(touches[0].getLocation());
          var touchPoint2 = this.node.convertToNodeSpaceAR(touches[1].getLocation());
          var newPointsDis = touchPoint1.sub(touchPoint2).mag();
          this.pointsDis || (this.pointsDis = 0);
          if (newPointsDis > this.pointsDis) {
            if (this.targetMap.scale >= 1.2) {
              this.targetMap.scale = 1.2;
              return;
            }
            this.pointsDis = newPointsDis;
            this.targetMap.scale += .1;
          } else if (newPointsDis < this.pointsDis) {
            if (this.targetMap.scale <= 1) {
              this.targetMap.scale = 1;
              return;
            }
            this.pointsDis = newPointsDis;
            this.targetMap.scale -= .1;
          }
          this.restrictPic();
        }
      };
      Zoom.prototype.restrictPic = function() {
        var picWidth = this.targetMap.getBoundingBox().width;
        var picHeight = this.targetMap.getBoundingBox().height;
        this.targetMap.x > 0 && this.targetMap.x - 0 > picWidth / 2 - this.zone.width / 2 && (this.targetMap.x = picWidth / 2 - this.zone.width / 2);
        this.targetMap.x < 0 && this.targetMap.x - 0 < this.zone.width / 2 - picWidth / 2 && (this.targetMap.x = this.zone.width / 2 - picWidth / 2);
        this.targetMap.y > 0 && this.targetMap.y - 0 > picHeight / 2 - this.zone.height / 2 && (this.targetMap.y = picHeight / 2 - this.zone.height / 2);
        this.targetMap.y < 0 && this.targetMap.y - 0 < this.zone.height / 2 - picHeight / 2 && (this.targetMap.y = this.zone.height / 2 - picHeight / 2);
      };
      Zoom.prototype.onDestory = function() {
        GameSys_1.default.game.xUnbind(BINDER_NAME);
      };
      __decorate([ property(cc.Node) ], Zoom.prototype, "zone", void 0);
      __decorate([ property(cc.Node) ], Zoom.prototype, "targetMap", void 0);
      Zoom = __decorate([ ccclass ], Zoom);
      return Zoom;
    }(cc.Component);
    exports.default = Zoom;
    cc._RF.pop();
  }, {
    "../manager/Config": "Config",
    "../manager/GameSys": "GameSys"
  } ],
  eCode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "da37daHEWNOapHWbDUnptKs", "eCode");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var eCode = function() {
      function eCode() {}
      eCode.Ok = 200;
      eCode.Error = 400;
      eCode.NotFound = 404;
      eCode.BadJson = 405;
      eCode.TimeOut = 1e4;
      return eCode;
    }();
    exports.default = eCode;
    cc._RF.pop();
  }, {} ]
}, {}, [ "Loading", "PopupTest", "Start", "Test", "TestPopup", "CountDown", "Loo", "Loo_goods", "Loo_item", "AStar", "Audio", "Coin_fly_to_wallet", "Gold", "IssueVideo", "Map", "Music", "NativeOppo", "NewGuide", "Scratch_ticket", "ScrollItem", "ScrollItemPre", "ScrollViewIVis", "ScrollViewPlus", "Share", "SpineSkin", "TIp", "Time", "Water_spread", "XBGM", "XButton", "ZIndex", "Zoom", "GaussianBlur", "HollowOut", "SineWave", "PopupBase", "Props", "AnimManager", "Caches", "Config", "DataManager", "EditorAsset", "Game", "GameSys", "Log", "MathManager", "PoolManager", "PopupManager", "StateManager", "StaticManager", "TouchBlocker", "TouchManager", "UtilsManager", "Http", "eCode", "BDApi", "OPPOApi", "OPPONative", "SDK", "TTApi", "VivoApi", "GoldAnim", "HeadInfo", "Inform", "InformPre", "Magnify", "Solicit", "TTRec", "Appearance", "Buildings", "Buildings_app", "Buildings_facade", "Buildings_updrage", "Builds", "Builds_item", "Builds_state", "Change_Appearance", "Lock_room", "Recruit", "Recruit_Item", "Shop", "Shop_item", "Warehouse", "Warehouse_item", "Block", "BlockPre", "Cashier", "Client", "Counter", "Garbage", "LockShop", "LockWarhouse", "Production", "Staff", "Staff_Production" ]);