from odoo import models, fields,_


class IrActWindowView(models.Model):
    _inherit = 'ir.actions.act_window.view'

    view_mode = fields.Selection(selection_add=[('frappe_gantt', 'Frappe Gantt')], ondelete={'frappe_gantt': 'cascade'})
