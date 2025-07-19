/** @odoo-module **/
import { registry } from "@web/core/registry";
import { RelationalModel } from "@web/model/relational_model/relational_model";
import { FrappeGanttController } from "./frappe_gantt_controller";
import { FrappeGanttModel } from "./frappe_gantt_model";
import { FrappeGanttRenderer } from "./frappe_gantt_renderer";
import { FrappeGanttArchParser } from "./frappe_gantt_arch_parser"
import { FrappeGanttCompiler } from './frappe_gantt_compiler'

export const frappeGanttView = {
    type: "frappe_gantt",
    ArchParser: FrappeGanttArchParser,
    Controller: FrappeGanttController,
    Model: RelationalModel,
    Renderer: FrappeGanttRenderer,
    Compiler: FrappeGanttCompiler,

    buttonTemplate: "web.KanbanView.Buttons",

    props: (genericProps, view) => {
        const { arch, relatedModels, resModel } = genericProps;
        const { ArchParser } = view;
        const archInfo = new ArchParser().parse(arch, relatedModels, resModel);
        const defaultGroupBy =
            genericProps.searchMenuTypes.includes("groupBy") && archInfo.defaultGroupBy;

        return {
            ...genericProps,
            // Compiler: view.Compiler, // don't pass it automatically in stable, for backward compat
            Model: view.Model,
            Renderer: view.Renderer,
            buttonTemplate: view.buttonTemplate,
            archInfo,
            defaultGroupBy,
        };
    },
};
registry.category("views").add("frappe_gantt", frappeGanttView);
