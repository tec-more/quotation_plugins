# -*- coding: utf-8 -*-
from email.policy import default

from odoo import models, fields, api


class SoftwareDuration(models.Model):
    _name = 'software.duration'
    _description = '软件工期'

    software_scale_id = fields.Many2one('software.scale', string='软件规模')
    name = fields.Char(string='软件工期名称',related='software_scale_id.name')

    scale_factor = fields.Float(string='缩放因子',help='用于调整模型输出的基准值,使其更符合实际项目工期的分布规律\n'
                                                       '它反应了项目管理中常见的效率损耗或非线性增长特性(如团队协作开销、任务切换成本)'
                                ,store=True,default=1.277,digits=(24,3))

    elasticity_exponent = fields.Float(string='弹性指数',help='表示工作量与工期之间的非线性关系(其值小于1)\n'
                                                    '规模效应:随着工作量增加，工期增长会逐渐放缓\n'
                                                    '并行化潜力:团队可通过增加资源或任务并行化压缩工期,但受限于沟通协调成本(如布鲁克斯法则)\n'
                                                    '该指数通常基于大量历史项目的回归分析得出，与软件工程的"人月神话"现象一致'
                                       ,default=0.404,digits=(24,3))
    team_num = fields.Integer(string='团队人数',default=1)

    person_month = fields.Float(string='人月数',default=176,help='按每月22天,每天8小时计算得出')
    # 每压缩10%工期,则工作量增加10%
    duration_months = fields.Float(string='工期(月)',compute='_compute_duration_months',store=True)

    def create(self, vals):
        """ 创建时默认设置软件阶段为开发 """
        obj = super(SoftwareDuration, self).create(vals)
        if obj:
            self.software_scale_id.write({'sd_id':obj.id})
        return obj

    def write(self, vals):
        result = super(SoftwareDuration, self).write(vals)
        if len(vals)>0:
            self.software_scale_id.write({'sd_id':self.id})
        return result

    @api.depends('software_scale_id','scale_factor','elasticity_exponent','person_month','team_num')
    def _compute_duration_months(self):
        for record in self:
            work_num = record.software_scale_id.swv_id.ae_possible if record.software_scale_id.swv_id.ae_possible > 0 else record.software_scale_id.swv_id.ae
            record.duration_months = record.scale_factor * ((work_num/record.team_num)/record.person_month) ** record.elasticity_exponent



