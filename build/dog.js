"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Dog = /** @class */ (function () {
    function Dog(onload) {
        var _this = this;
        this.loaded = false;
        this.image = new Image();
        this.image.onload = function () {
            _this.loaded = true;
            onload && onload();
        };
        this.fetchdog();
    }
    Dog.prototype.fetchdog = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, message, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("https://dog.ceo/api/breed/pomeranian/images/random")];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        message = (_a.sent()).message;
                        this.image.src = message;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Dog.prototype.draw = function (context, x, y, w, h) {
        if (!this.loaded) {
            return;
        }
        context.drawImage(this.image, x, y, w, h);
    };
    return Dog;
}());
var DogManager = /** @class */ (function () {
    function DogManager() {
    }
    DogManager.add = function (x, y) {
        var _this = this;
        var dog = new Dog(function () {
            var photo = new NineSlice("./src/assets/frame.png", 64, 366, 63, 444, dog);
            _this.dogs.push({
                photo: photo,
                x: x,
                y: y,
                w: dog.image.width / 2,
                h: dog.image.height / 2
            });
        });
    };
    DogManager.randomize = function (min, max) {
        var numDogs = Math.floor(Math.random() * (max - min + 1) + min);
        for (var i = 0; i < numDogs; i++) {
            var _a = this.getrandompos(), x = _a.x, y = _a.y;
            this.add(window.innerWidth * (i / numDogs), y);
        }
    };
    DogManager.getrandompos = function () {
        var x = Math.floor(Math.random() * window.innerWidth);
        var y = Math.floor(Math.random() * window.innerHeight / 2);
        return { x: x, y: y };
    };
    DogManager.clamp = function (num, min, max) {
        return Math.min(Math.max(num, min), max);
    };
    DogManager.draw = function (context) {
        var _this = this;
        __spreadArray([], this.dogs, true).forEach(function (dog) {
            var _a = dog.photo.getfitsize(dog.w, dog.h), w = _a.w, h = _a.h;
            var x = _this.clamp(dog.x, 0, window.innerWidth - w);
            var y = _this.clamp(dog.y, 0, window.innerHeight - h);
            dog.photo.draw(context, x, y, w, h);
        });
    };
    DogManager.dogs = [];
    return DogManager;
}());
//# sourceMappingURL=dog.js.map