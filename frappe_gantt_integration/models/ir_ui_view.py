from odoo import models, fields,api,_


class IrUiView(models.Model):
    _inherit = 'ir.ui.view'

    type = fields.Selection(selection_add=[('frappe_gantt', 'Frappe Gantt')], ondelete={'frappe_gantt': 'cascade'})

    @api.model
    def _get_view_info(self):
        res = super()._get_view_info()
        res.update({
            'frappe_gantt': {
                'icon': 'fa fa-tasks',
                'multi_record': True,
                'has_action': True,
                'view_type': 'frappe_gantt'  # 关键添加
            }
        })
        return res