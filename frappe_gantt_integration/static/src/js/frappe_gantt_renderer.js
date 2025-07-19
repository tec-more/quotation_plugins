/** @odoo-module **/
import { Component, onMounted, onWillUpdateProps, useRef, useState } from "@odoo/owl";

export class FrappeGanttRenderer extends Component {
    static template = "frappe_gantt_integration.FrappeGanttRenderer";
    static props = {
        model: Object,
        openRecord: { type: Function, optional: true },
    };

    setup() {

        this.state = useState({
            loading: true,
            error: null
        });
        this.ganttRef = useRef("gantt");
        this.ganttInstance = null;

        onMounted(() => this.initGantt());
        onWillUpdateProps(() => this.updateGantt());
    }

    get tasks() {
        return this.props.model.records.map(record => ({
            id: record.id,
            name: record.display_name,
            start: record.date_start,
            end: record.date_end,
            progress: (record.progress || 0) * 100,
            dependencies: ""
        }));
    }

    initGantt() {
        if (!window.Gantt) {
            this.state.error = "Frappe Gantt library not loaded";
            return;
        }
        this.state.loading = false;
        this.updateGantt();
    }

    updateGantt() {
        if (this.state.loading || !this.ganttRef.el) return;

        if (this.ganttInstance) {
            this.ganttInstance.refresh(this.tasks);
        } else {
            this.ganttInstance = new window.Gantt(this.ganttRef.el, this.tasks, {
                header_height: 50,
                column_width: 30,
                step: 24,
                view_mode: 'Day',
                date_format: 'YYYY-MM-DD',
                on_click: task => this.props.openRecord?.(task.id),
                on_date_change: (task, start, end) => {
                    this.props.model.updateTaskDates(task.id, start, end);
                }
            });
        }
    }
}
