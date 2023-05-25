"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.formatField = void 0;
var handlebars_1 = __importDefault(require("handlebars"));
var formatField = function (context, options) {
    var signedIn = options.data.root.signedin;
    if (signedIn) {
        return new handlebars_1["default"].SafeString("<div class=\"rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600\">\n      <label for=\"name\" class=\"block text-xs font-medium text-gray-900\">Name</label>\n      <input type=\"text\" name=\"name\" id=\"name\" class=\"block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6\" value=\"".concat(handlebars_1["default"].escapeExpression(options
            .fn(context)
            .replace(/(<([^>]+)>)/gi, '')
            .replace(/['"]+/g, '')), "\">\n    </div>"));
    }
    else {
        return new handlebars_1["default"].SafeString(options.fn(context));
    }
};
exports.formatField = formatField;
