# -*- coding: utf-8 -*-
from datetime import datetime
from odoo import models, fields, api


class WorkVolume(models.Model):
    _name = 'software.work.volume'
    _description = '工作量'


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