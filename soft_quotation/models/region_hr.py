# -*- coding: utf-8 -*-
from datetime import datetime
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError

class RegionHr(models.Model):
    _name = 'region.hr'
    _rec_name = 'job_position'
    _description = '地区人才'

    def _default_country(self):
        record = self.env['res.country'].sudo().search([('code', '=', 'CN')],limit=1)
        return record.id if record else False
    def _get_years(self):
        """ 动态生成最近10年的年份选项 """
        current_year = datetime.now().year
        return [(str(year), str(year)) for year in range(current_year - 10, current_year + 1)]

    job_position = fields.Many2one('system.data.dictionary',string='职位名称',domain='[("category", "=", "职位名称")]')
    res_country = fields.Many2one('res.country', string='国家',default=_default_country)
    province = fields.Many2one('res.country.state', string='省',domain="[('country_id', '=', res_country)]")
    city = fields.Many2one('res.city', string='城市',domain="[('state_id', '=', province)]")
    year = fields.Selection(
        selection=lambda self: self._get_years(),
        string='年份'
    )
    job_level = fields.Many2one('system.data.dictionary',string='职位级别',domain='[("category", "=", "职位级别")]')
    average_salary = fields.Float(string='平均薪资(K)', help = '该平均薪资单位为K')