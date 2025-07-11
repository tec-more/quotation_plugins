# -*- coding: utf-8 -*-
from email.policy import default

from odoo import models, fields, api


class SoftwareQuotation(models.Model):
    _name = 'software.quotation'
    _description = '软件价格'

    software_scale_id = fields.Many2one('software.scale', string='软件规模')
    name = fields.Char(related='software_scale_id.name', string='项目名')

    person_num = fields.Integer(string='团队人数', related='software_scale_id.sd_id.team_num')
    work_duration = fields.Float(string='项目工期(月)', related='software_scale_id.sd_id.duration_months')
    person_price = fields.Float(string='软件开发费用(元/人/月)',default=0)
    other_price = fields.Float(string='其他费用(元)',default=0)
    maintenance_price = fields.Float(string='软件维护费用(元/人/月)',default=0)
    software_maintenance_total = fields.Float(string='软件维护总费用',compute='_compute_total_amount',default=0,store=True)
    software_develop_total = fields.Float(string='软件开发总费用',compute='_compute_total_amount',default=0,store=True)
    total_amount = fields.Float(string='总价', compute='_compute_total_amount', store=True)




    @api.depends('software_scale_id', 'person_price','other_price','maintenance_price','software_scale_id.sd_id.team_num', 'software_scale_id.sd_id.duration_months')
    def _compute_total_amount(self):
        # 总成本 = 人数 * 工期 * 单人月费用
        # 运维费用计算
        # 工作量=（软件规模×生产率）×运维级别要求调整因子×运维能力调整因子×运维系统及业务特征调整因子
        for record in self:
            # 运维工作量
            maintenance_work_num = record.software_scale_id.swv_id.maintenance_ae if record.software_scale_id.swv_id.maintenance_ae > 0 else 0
            # 运维所需人月
            maintenance_per_month = maintenance_work_num/record.software_scale_id.sd_id.person_month
            record.software_develop_total = record.person_num * record.work_duration * record.person_price
            record.software_maintenance_total = maintenance_per_month * record.maintenance_price
            record.total_amount = record.software_develop_total + record.software_maintenance_total + record.other_price
