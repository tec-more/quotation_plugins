/** @odoo-module **/
import { Model } from "@web/model/model";
import { useState } from "@odoo/owl";

export class FrappeGanttModel extends Model {
    setup(params, { orm }) {
        super.setup(...arguments);
        this.orm = orm;
        this.state = useState({
            loading: false,
            records: [],
            error: null
        });
    }

    async load() {
        try {
            this.state.loading = true;
            const fields = ["id", "name"];
            this.state.records = await this.orm.searchRead(
                this.props.resModel,
                [],
                fields,
                { limit: 100 }  // 限制加载数量
            );
        } catch (error) {
            this.state.error = error;
            console.error("Failed to load tasks:", error);
        } finally {
            this.state.loading = false;
        }
    }

    // 更新任务日期
    async updateTaskDates(taskId, start, end) {
        try {
            await this.orm.write(
                this.props.resModel,
                [taskId]
            );
            await this.load();  // 刷新数据
        } catch (error) {
            this.state.error = error;
        }
    }
}
