import {
    append,
    combineAttributes,
    createElement,
    extractAttributes,
    getTag,
} from "@web/core/utils/xml";
import { toStringExpression } from "@web/views/utils";
import { toInterpolatedStringExpression, ViewCompiler } from "@web/views/view_compiler";

/**
 * @typedef {Object} DropdownDef
 * @property {Element} el
 * @property {boolean} inserted
 * @property {boolean} shouldInsert
 * @property {("dropdown" | "toggler" | "menu")[]} parts
 */

const ACTION_TYPES = ["action", "object"];
const SPECIAL_TYPES = [
    ...ACTION_TYPES,
    "edit",
    "open",
    "delete",
    "url",
    "set_cover",
    "archive",
    "unarchive",
];

export class FrappeGanttCompiler extends ViewCompiler {
    setup() {
        this.ctx.readonly = "read_only_mode";
        this.compilers.push(
            { selector: "t[t-call]", fn: this.compileTCall },
            { selector: "img", fn: this.compileImage }
        );
    }

    //-----------------------------------------------------------------------------
    // Compilers
    //-----------------------------------------------------------------------------

    /**
     * @override
     */
    compileButton(el, params) {
        const type = el.getAttribute("type");
        if (!SPECIAL_TYPES.includes(type)) {
            // Not a kanban-specific action type.
            return super.compileButton(el, params);
        }

        combineAttributes(el, "class", ["oe_kanban_action"]);

        if (ACTION_TYPES.includes(type)) {
            if (!el.hasAttribute("debounce")) {
                // action buttons are debounced in kanban records
                el.setAttribute("debounce", 300);
            }
            return super.compileButton(el, params);
        }

        const nodeParams = extractAttributes(el, ["type"]);
        if (type === "set_cover") {
            const { "auto-open": autoOpen, "data-field": fieldName } = extractAttributes(el, [
                "auto-open",
                "data-field",
            ]);
            Object.assign(nodeParams, { autoOpen, fieldName });
        }
        const strParams = Object.entries(nodeParams)
            .map(([k, v]) => [k, toStringExpression(v)].join(":"))
            .join(",");
        el.setAttribute("t-on-click", `()=>__comp__.triggerAction({${strParams}})`);

        const compiled = createElement(el.nodeName);
        for (const { name, value } of el.attributes) {
            compiled.setAttribute(name, value);
        }
        if (getTag(el, true) === "a" && !compiled.hasAttribute("href")) {
            compiled.setAttribute("href", "#");
        }
        for (const child of el.childNodes) {
            append(compiled, this.compileNode(child, params));
        }

        return compiled;
    }
    /**
     * @returns {Element}
     */
    compileImage(el) {
        const element = el.cloneNode(true);
        element.setAttribute("loading", "lazy");
        return element;
    }

    /**
     * @override
     */
    compileField(el, params) {
        let compiled;
        let isSpan = false;
        const recordExpr = params.recordExpr || "__comp__.props.record";
        const dataPointIdExpr = params.dataPointIdExpr || `${recordExpr}.id`;
        if (!el.hasAttribute("widget")) {
            isSpan = true;
            // fields without a specified widget are rendered as simple spans in kanban records
            const fieldId = el.getAttribute("field_id");
            compiled = createElement("span", {
                "t-out": params.formattedValueExpr || `__comp__.getFormattedValue("${fieldId}")`,
            });
        } else {
            compiled = super.compileField(el, params);
            const fieldId = el.getAttribute("field_id");
            compiled.setAttribute("id", `'${fieldId}_' + ${dataPointIdExpr}`);
            // In x2many kanban, records can be edited in a dialog. The same record as the one of
            // the kanban is used for the form view dialog, so its mode is switched to "edit", but
            // we don't want to see it in edition in the background. For that reason, we force its
            // fields to be readonly when the record is in edition, i.e. when it is opened in a form
            // view dialog.
            const readonlyAttr = compiled.getAttribute("readonly");
            if (readonlyAttr) {
                compiled.setAttribute("readonly", `${recordExpr}.isInEdition || (${readonlyAttr})`);
            } else {
                compiled.setAttribute("readonly", `${recordExpr}.isInEdition`);
            }
        }

        if (params.isLegacy) {
            const { bold, display } = extractAttributes(el, ["bold", "display"]);
            const classNames = [];
            if (display === "right") {
                classNames.push("float-end");
            } else if (display === "full") {
                classNames.push("o_text_block");
            }
            if (bold) {
                classNames.push("o_text_bold");
            }
            if (classNames.length > 0) {
                const clsFormatted = isSpan
                    ? classNames.join(" ")
                    : toStringExpression(classNames.join(" "));
                compiled.setAttribute("class", clsFormatted);
            }
        }

        const attrs = {};
        for (const attr of el.attributes) {
            attrs[attr.name] = attr.value;
        }

        if (el.hasAttribute("widget")) {
            const attrsParts = Object.entries(attrs).map(([key, value]) => {
                if (key.startsWith("t-attf-")) {
                    key = key.slice(7);
                    value = toInterpolatedStringExpression(value);
                } else if (key.startsWith("t-att-")) {
                    key = key.slice(6);
                    value = `"" + (${value})`;
                } else if (key.startsWith("t-att")) {
                    throw new Error("t-att on <field> nodes is not supported");
                } else if (!key.startsWith("t-")) {
                    value = toStringExpression(value);
                }
                return `'${key}':${value}`;
            });
            compiled.setAttribute("attrs", `{${attrsParts.join(",")}}`);
        }

        for (const attr in attrs) {
            if (attr.startsWith("t-") && !attr.startsWith("t-att")) {
                compiled.setAttribute(attr, attrs[attr]);
            }
        }

        return compiled;
    }

    /**
     * @param {Element} el
     * @param {Object} params
     * @returns {Element}
     */
    compileTCall(el, params) {
        const compiled = this.compileGenericNode(el, params);
        const tname = el.getAttribute("t-call");
        if (tname in this.templates) {
            compiled.setAttribute("t-call", `{{__comp__.templates[${toStringExpression(tname)}]}}`);
        }
        return compiled;
    }
}
FrappeGanttCompiler.OWL_DIRECTIVE_WHITELIST = [
    ...ViewCompiler.OWL_DIRECTIVE_WHITELIST,
    "t-name",
    "t-esc",
    "t-out",
    "t-set",
    "t-value",
    "t-if",
    "t-else",
    "t-elif",
    "t-foreach",
    "t-as",
    "t-key",
    "t-att.*",
    "t-call",
];
