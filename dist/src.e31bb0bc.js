// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"lib.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillTurnElements = exports.rerollTwoController = exports.rerollOneController = exports.selectDiceElements = exports.renderPool = exports.updateResults = exports.addEventListeners = exports.simpleSumElements = exports.getTurnElements = exports.clearState = exports.updateTurnCounter = exports.turnRoll = exports.diceStatus = exports.makeTurnElements = exports.rollDice = exports.diceIds = exports.getRandomId = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var getRandomId = function getRandomId() {
  return "_" + Math.random().toString(26).substr(2, 9);
};

exports.getRandomId = getRandomId;
var diceIds = ["a", "b", "c", "d", "e"];
exports.diceIds = diceIds;

var rollDice = function rollDice() {
  var dice = Math.floor(Math.random() * 6) + 1;
  return dice;
};

exports.rollDice = rollDice;

var makeTurnElements = function makeTurnElements() {
  return {
    id: getRandomId(),
    diceNumber: rollDice(),
    status: diceStatus.forChoose
  };
};

exports.makeTurnElements = makeTurnElements;
var diceStatus = {
  forChoose: "for_choose",
  chosen: "chosen"
};
exports.diceStatus = diceStatus;

var turnRoll = function turnRoll(state, numOfDices) {
  var turnResults = [];

  for (var i = 0; i < numOfDices; i++) {
    turnResults.push(makeTurnElements());
  }

  state.pool = turnResults;
  updateTurnCounter(state);
};

exports.turnRoll = turnRoll;

var updateTurnCounter = function updateTurnCounter(state) {
  var currTurnRef;

  if (state.rerollCounter === 1) {
    currTurnRef = state.pool;
  } else if (state.rerollCounter === 2) {
    currTurnRef = state.rerollOne;
  } else if (state.rerollCounter === 3) {
    currTurnRef = state.rerollTwo;
  }

  renderPool(currTurnRef);
  addEventListeners(state, currTurnRef);
};

exports.updateTurnCounter = updateTurnCounter;

var clearState = function clearState(state) {
  state.rerollCounter = 1;
  state.rerollOne = [];
  state.rerollTwo = [];
  state.currentSelectedOne = [];
  state.currentSelectedTwo = [];
  state.turnTotalSum = 0;
};

exports.clearState = clearState;

var getTurnElements = function getTurnElements(state, num, turnNumbersEl) {
  state.finalElements = turnNumbersEl.filter(function (n) {
    return n === num;
  });
};

exports.getTurnElements = getTurnElements;

var simpleSumElements = function simpleSumElements(state, num) {
  var turnElRemainingSum = state.finalElements.reduce(function (total, val) {
    return total + val;
  }, 0);
  state.turnTotalSum = turnElRemainingSum;
  console.log(state.turnTotalSum);
  updateResults(state, num);
};

exports.simpleSumElements = simpleSumElements;

var addEventListeners = function addEventListeners(state, currTurnRef) {
  //
  var simpleSumController = function simpleSumController(num) {
    getTurnElements(state, num, currTurnRef.map(function (d) {
      return d.diceNumber;
    }));
    simpleSumElements(state, num);
  };

  var simpleSumEvent = document.getElementsByClassName("actionButton");

  _toConsumableArray(simpleSumEvent).map(function (filterEl) {
    return filterEl.onclick = function () {
      return simpleSumController(+filterEl.id);
    };
  });

  var reRollButton = document.getElementById("re_roll_button");

  reRollButton.onclick = function () {
    selectDiceElements(state, currTurnRef.map(function (d) {
      return d.diceNumber;
    }));
    updateTurnCounter(state, currTurnRef.map(function (d) {
      return d.diceNumber;
    }));
  };

  var changeCellStatus = function changeCellStatus(currTurnRef, arrposition) {
    if (currTurnRef[arrposition].status === diceStatus.forChoose) {
      currTurnRef[arrposition].status = diceStatus.chosen;
      console.log("A ".concat(currTurnRef[arrposition].status));
    } else {
      currTurnRef[arrposition].status = diceStatus.forChoose;
      console.log("A ".concat(currTurnRef[arrposition].status));
    }
  };

  var diceIds = ["a", "b", "c", "d", "e"];
  diceIds.map(function (id, index) {
    document.getElementById("dice_".concat(id, "_button")).onclick = function () {
      return changeCellStatus(currTurnRef, index);
    };
  });
};

exports.addEventListeners = addEventListeners;

var updateResults = function updateResults(state, num) {
  document.getElementById("".concat(num, "__total")).innerHTML = "Total: ".concat(state.turnTotalSum);
  clearState(state);
  turnRoll(state, 5);
};

exports.updateResults = updateResults;
diceIds.map(function (id, index) {
  document.getElementById("dice_".concat(id, "_button")).onclick = function () {
    return changeCellStatus(currTurnRef, index);
  };
});

var renderPool = function renderPool(currTurnRef) {
  diceIds.map(function (id, index) {
    document.getElementById("ui_dice_".concat(id)).innerHTML = "Dice: ".concat(currTurnRef[index].diceNumber);
  });
};

exports.renderPool = renderPool;

var selectDiceElements = function selectDiceElements(state, turnNumbersEl) {
  if (state.rerollCounter === 1) {
    rerollOneController(state, turnNumbersEl);
    state.rerollCounter++;
  } else if (state.rerollCounter === 2) {
    rerollTwoController(state, turnNumbersEl);
    state.rerollCounter++;
  }
};

exports.selectDiceElements = selectDiceElements;

var rerollOneController = function rerollOneController(state, turnNumbersEl) {
  diceIds.map(function (id, index) {
    if (state.pool[index].status === diceStatus.chosen) {
      state.currentSelectedOne.push(state.pool[index]);
    }
  });
  fillTurnElements(state, turnNumbersEl);
};

exports.rerollOneController = rerollOneController;

var rerollTwoController = function rerollTwoController(state, turnNumbersEl) {
  diceIds.map(function (id, index) {
    if (state.rerollOne[index].status === diceStatus.chosen) {
      state.currentSelectedTwo.push(state.rerollOne[index]);
    }
  });
  fillTurnElements(state, turnNumbersEl);
};

exports.rerollTwoController = rerollTwoController;

var fillTurnElements = function fillTurnElements(state, turnNumbersEl) {
  var numOfAddDices;

  if (state.rerollCounter === 1) {
    numOfAddDices = 5 - state.currentSelectedOne.length;
    turnRoll(state, 5);

    for (var i = 0; i < numOfAddDices; i++) {
      state.rerollOne.push(state.pool[i]);
    }

    for (var _i = 0; _i < state.currentSelectedOne.length; _i++) {
      state.rerollOne.push(state.currentSelectedOne[_i]);
    }

    updateTurnCounter(state, turnNumbersEl);
  } else if (state.rerollCounter === 2) {
    numOfAddDices = 5 - state.currentSelectedTwo.length;
    turnRoll(state, 5);

    for (var _i2 = 0; _i2 < numOfAddDices; _i2++) {
      state.rerollTwo.push(state.pool[_i2]);
    }

    for (var _i3 = 0; _i3 < state.currentSelectedTwo.length; _i3++) {
      state.rerollTwo.push(state.currentSelectedTwo[_i3]);
    }

    updateTurnCounter(state, turnNumbersEl);
    console.log("final");
  }
};

exports.fillTurnElements = fillTurnElements;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _lib = require("./lib");

var main = function main() {
  var state = {
    pool: (0, _lib.makeTurnElements)(5),
    rerollOne: [],
    rerollTwo: [],
    currentSelectedOne: [],
    currentSelectedTwo: [],
    finalElements: [],
    turnTotalSum: 0,
    rerollCounter: 1
  };
  (0, _lib.turnRoll)(state, 5);
  console.log("first roll pool ", state.pool);
};

main();
},{"./lib":"lib.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50068" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map