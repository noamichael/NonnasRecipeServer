(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["recipes-recipes-module"],{

/***/ "./src/app/recipes/recipe-table.service.ts":
/*!*************************************************!*\
  !*** ./src/app/recipes/recipe-table.service.ts ***!
  \*************************************************/
/*! exports provided: RecipeTableService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecipeTableService", function() { return RecipeTableService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



var RecipeTableService = /** @class */ (function () {
    function RecipeTableService() {
        this.$recipes = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](null);
        this.$addRecipe = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.$removeRecipe = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
    }
    RecipeTableService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], RecipeTableService);
    return RecipeTableService;
}());



/***/ }),

/***/ "./src/app/recipes/recipes.component.css":
/*!***********************************************!*\
  !*** ./src/app/recipes/recipes.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3JlY2lwZXMvcmVjaXBlcy5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/recipes/recipes.component.html":
/*!************************************************!*\
  !*** ./src/app/recipes/recipes.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>"

/***/ }),

/***/ "./src/app/recipes/recipes.component.ts":
/*!**********************************************!*\
  !*** ./src/app/recipes/recipes.component.ts ***!
  \**********************************************/
/*! exports provided: RecipesComponent, RecipesResolver, RecipeTypesResolver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecipesComponent", function() { return RecipesComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecipesResolver", function() { return RecipesResolver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecipeTypesResolver", function() { return RecipeTypesResolver; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _recipe_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../recipe.service */ "./src/app/recipe.service.ts");
/* harmony import */ var _recipe_table_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./recipe-table.service */ "./src/app/recipes/recipe-table.service.ts");





var RecipesComponent = /** @class */ (function () {
    function RecipesComponent(recipeTableService, route) {
        this.recipeTableService = recipeTableService;
        this.route = route;
    }
    RecipesComponent.prototype.ngOnInit = function () {
        var _this = this;
        var recipes;
        this.route.data.subscribe(function (data) {
            recipes = data.recipes;
            _this.recipeTableService.$recipes.next(recipes);
            var NULL_SELECT = { label: '-- Select --', value: null };
            var recipeTypes = data.recipeTypes.data.map(function (s) { return { label: s, value: s }; });
            recipeTypes.unshift(NULL_SELECT);
            _this.recipeTableService.recipeTypes = recipeTypes;
        });
        this.recipeTableService.$addRecipe.subscribe(function (recipe) {
            recipes.data.push(recipe);
            recipes.totalRecordCount++;
            _this.recipeTableService.$recipes.next(recipes);
        });
        this.recipeTableService.$removeRecipe.subscribe(function (recipe) {
            recipes.data = recipes.data.filter(function (r) { return r.id != recipe.id; });
            recipes.totalRecordCount--;
            _this.recipeTableService.$recipes.next(recipes);
        });
    };
    RecipesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'nr-recipes',
            template: __webpack_require__(/*! ./recipes.component.html */ "./src/app/recipes/recipes.component.html"),
            providers: [_recipe_table_service__WEBPACK_IMPORTED_MODULE_4__["RecipeTableService"]],
            styles: [__webpack_require__(/*! ./recipes.component.css */ "./src/app/recipes/recipes.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_recipe_table_service__WEBPACK_IMPORTED_MODULE_4__["RecipeTableService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]])
    ], RecipesComponent);
    return RecipesComponent;
}());

var RecipesResolver = /** @class */ (function () {
    function RecipesResolver(recipeService) {
        this.recipeService = recipeService;
    }
    RecipesResolver.prototype.resolve = function (route, state) {
        var page = route.params.page || 1;
        var count = route.params.count || 25;
        return this.recipeService.getRecipes(page, count, route.params);
    };
    RecipesResolver = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_recipe_service__WEBPACK_IMPORTED_MODULE_3__["RecipeService"]])
    ], RecipesResolver);
    return RecipesResolver;
}());

var RecipeTypesResolver = /** @class */ (function () {
    function RecipeTypesResolver(recipeService) {
        this.recipeService = recipeService;
    }
    RecipeTypesResolver.prototype.resolve = function (route, state) {
        return this.recipeService.getRecipeTypes();
    };
    RecipeTypesResolver = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_recipe_service__WEBPACK_IMPORTED_MODULE_3__["RecipeService"]])
    ], RecipeTypesResolver);
    return RecipeTypesResolver;
}());



/***/ }),

/***/ "./src/app/recipes/recipes.module.ts":
/*!*******************************************!*\
  !*** ./src/app/recipes/recipes.module.ts ***!
  \*******************************************/
/*! exports provided: RecipesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecipesModule", function() { return RecipesModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _recipes_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./recipes.component */ "./src/app/recipes/recipes.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");





var RecipesModule = /** @class */ (function () {
    function RecipesModule() {
    }
    RecipesModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_recipes_component__WEBPACK_IMPORTED_MODULE_3__["RecipesComponent"]],
            providers: [_recipes_component__WEBPACK_IMPORTED_MODULE_3__["RecipesResolver"], _recipes_component__WEBPACK_IMPORTED_MODULE_3__["RecipeTypesResolver"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"].forChild([
                    {
                        path: '',
                        component: _recipes_component__WEBPACK_IMPORTED_MODULE_3__["RecipesComponent"],
                        resolve: {
                            recipes: _recipes_component__WEBPACK_IMPORTED_MODULE_3__["RecipesResolver"],
                            recipeTypes: _recipes_component__WEBPACK_IMPORTED_MODULE_3__["RecipeTypesResolver"]
                        },
                        children: [
                            {
                                path: '',
                                loadChildren: './recipe-list/recipe-list.module#RecipeListModule'
                            },
                            {
                                path: ':id',
                                loadChildren: './recipe-entry/recipe-entry.module#RecipeEntryModule'
                            }
                        ]
                    }
                ])
            ]
        })
    ], RecipesModule);
    return RecipesModule;
}());



/***/ })

}]);
//# sourceMappingURL=recipes-recipes-module.js.map