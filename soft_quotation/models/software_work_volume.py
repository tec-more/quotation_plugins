# -*- coding: utf-8 -*-
import logging
import typing
from datetime import datetime
from email.policy import default

from odoo import models, fields, api
from odoo.api import ValuesType


class WorkVolume(models.Model):
    _name = 'software.work.volume'
    _description = '工作量'

    software_scale_id = fields.Many2one('software.scale', string='软件规模')
    name = fields.Char(related='software_scale_id.name',string='名称')
    # AE = (S * PDR) * SWF * RDF
    # AE（Adjust Effort）: 调整后的估算工作量，单位为人时（person-hour）
    # S（Size）: 调整后的软件规模，单位为功能点（Function Point, FP）
    # PDR（Productivity Rate）: 功能点耗时率，即生产率，单位为人时/功能点(person-hour/FP)
    # SWF（Software Factor）: 软件因素调整因子，反应软件特性对工作量的影响
    # RDF（Development Factor）: 开发因素调整因子，反应开发环境对工作量的影响，通常无特殊要求时取值为1
    s = fields.Float(related='software_scale_id.scale_amount',string='软件规模(S)',help='单位:功能点(FP)',store=True)
    pdr = fields.Float(string='功能点耗时率(PDR)',help='单位:人时/功能点(person-hour/FP)',default=1)
    swf = fields.Float(string='软件因素调整因子(SWF)',help='软件因素调整因子，反应软件特性对工作量的影响',default=1)
    rdf = fields.Float(string='开发因素调整因子(RDF)',help='开发因素调整因子，反应开发环境对工作量的影响',default=1)
    ae = fields.Float(string='调整后的估算工作量(AE)',compute='_compute_ae',help='单位:人时',store=True)
    ae_min = fields.Float(string='估算工作量最小值',compute='_compute_ae',store=True)
    ae_max = fields.Float(string='估算工作量最大值',compute='_compute_ae',store=True)
    ae_possible = fields.Float(string='调整后的估算工作量最可能值',store=True,default=0)

    maintenance_factor = fields.Float(string='软件维护因素调整因子(MDF)',help='取值范围(0.15~0.20)',default=0.15
                                      )
    # 运维工作量包含了运维团队在限定运维周期（一年）内所有运维活动
    # （如优化完善、例行操作、响应支持、调研评估）
    # 及相关的管理和支持活动所耗费的工作量
    maintenance_ae = fields.Float(string='软件维护工作量(MDF)',compute='_compute_ae',store=True)

    def create(self, vals):
        """ 创建时默认设置软件阶段为开发 """
        obj = super(WorkVolume, self).create(vals)
        if obj:
            self.software_scale_id.write({'swv_id':obj.id})
        return obj

    def write(self, vals):
        result = super(WorkVolume, self).write(vals)
        if len(vals)>0:
            self.software_scale_id.write({'swv_id':self.id})
        return result
    @api.depends('software_scale_id','s','pdr','swf','rdf')
    def _compute_ae(self):
        last_year = datetime.now().year -1
        logging.info("年份:%s",last_year)
        pdr_env = self.env['software.production.date.rate'].sudo()

        soft_stage_obj1 = self.env['system.data.dictionary'].sudo().search([('category', '=', '软件阶段'),('name','=','开发')],limit=1)
        soft_stage_obj2 = self.env['system.data.dictionary'].sudo().search([('category', '=', '软件阶段'),('name','=','运维')],limit=1)

        for record in self:
            # 取生产率数据
            if record.software_scale_id:
                logging.info("行业:%s",record.software_scale_id.profession)
                pdr_obj = pdr_env.search([('profession','=',record.software_scale_id.profession.id),('soft_stage','=',soft_stage_obj1.id),('year','=',last_year)],limit=1)
                maintenance_pdr_obj = pdr_env.search([('profession','=',record.software_scale_id.profession.id),('soft_stage','=',soft_stage_obj2.id),('year','=',last_year)],limit=1)
                # 取生产率的中位数P50
                # logging.info("software_scale_id:%s",record.software_scale_id.scale_amount)
                logging.info("软件规模:%s,生产率:%s,软件因子:%s,开发因子:%s",record.s,pdr_obj.p50,record.swf,record.rdf)
                record.pdr = pdr_obj.p50
                record.ae = record.s * pdr_obj.p50 * record.swf * record.rdf
                record.ae_min = record.s * pdr_obj.p25 * record.swf * record.rdf
                record.ae_max = record.s * pdr_obj.p75 * record.swf * record.rdf
                record.maintenance_ae = record.s * maintenance_pdr_obj.p50 * record.maintenance_factor


class ProductionDateRate(models.Model):
    _name = 'software.production.date.rate'
    _description = '生产率'

    def _get_years(self):
        """ 动态生成最近10年的年份选项 """
        current_year = datetime.now().year
        return [(str(year), str(year)) for year in range(current_year - 10, current_year + 1)]
    profession = fields.Many2one('system.data.dictionary',string='行业',domain='[("category","=","行业")]')
    soft_stage = fields.Many2one('system.data.dictionary',string='软件阶段',domain='[("category","=","软件阶段")]')
    # city = fields.Many2one('res.city', string='城市')
    year = fields.Selection(
        selection=lambda self: self._get_years(),
        string='年份'
    )
    p10 = fields.Float(string='P10',help='单位:人时/功能点')
    p25 = fields.Float(string='P25', help='单位:人时/功能点')
    p50 = fields.Float(string='P50', help='单位:人时/功能点')
    p75 = fields.Float(string='P75', help='单位:人时/功能点')
    p90 = fields.Float(string='P90', help='单位:人时/功能点')