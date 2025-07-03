# -*- coding: utf-8 -*-

from odoo import models, fields, api


class SystemDataDictionary(models.Model):
    _name = 'system.data.dictionary'
    _description = '数据字典'

    category = fields.Char(string="类型", required=True)
    code = fields.Char(string="编号", required=True)
    name = fields.Char(string="名称", required=True)
    remark = fields.Text(string="描述")


