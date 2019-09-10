(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common"],{

/***/ "./src/app/recipe.service.ts":
/*!***********************************!*\
  !*** ./src/app/recipe.service.ts ***!
  \***********************************/
/*! exports provided: RecipeService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecipeService", function() { return RecipeService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");




var RecipeService = /** @class */ (function () {
    function RecipeService(http) {
        this.http = http;
    }
    Object.defineProperty(RecipeService.prototype, "basePublicUrl", {
        get: function () {
            return _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].basePublicUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecipeService.prototype, "basePrivateUrl", {
        get: function () {
            return 'http://localhost:7890';
        },
        enumerable: true,
        configurable: true
    });
    RecipeService.prototype.getRecipesUrl = function (local) {
        return (local ? this.basePrivateUrl : this.basePublicUrl) + "/recipes";
    };
    RecipeService.prototype.getRecipeUrl = function (id, local) {
        return this.getRecipesUrl(local) + "/" + id;
    };
    RecipeService.prototype.getRecipe = function (id) {
        return this.http.get(this.getRecipeUrl(id, false));
    };
    RecipeService.prototype.getRecipes = function (page, count, query) {
        var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({
            fromObject: Object.assign({}, query, { page: page, count: count })
        });
        return this.http.get(this.getRecipesUrl(false), { params: params });
    };
    RecipeService.prototype.getRecipeTypes = function () {
        return this.http.get(this.basePublicUrl + "/recipe-types");
    };
    RecipeService.prototype.saveRecipe = function (recipe) {
        return this.http.post(this.getRecipesUrl(true), recipe);
    };
    RecipeService.prototype.deleteRecipe = function (recipe) {
        return this.http.delete(this.getRecipeUrl(recipe.id, true));
    };
    RecipeService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], RecipeService);
    return RecipeService;
}());



/***/ })

}]);
//# sourceMappingURL=common.js.map