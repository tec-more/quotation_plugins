# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError


class ProjectQuotation(models.Model):
    _inherit = 'project.project'
    pm_ids = fields.One2many('project.module', 'project_id', string='项目模块')

class ProjectTask(models.Model):
    _inherit = 'project.task'

class ProjectModule(models.Model):
    _name = 'project.module'
    _rec_name = 'complete_name'
    _description = '项目模块'

    project_id = fields.Many2one('project.project', string='项目名')
    parent_id = fields.Many2one('project.module', string='上级模块',domain='[("id", "!=", id)]')
    name = fields.Char(string='模块名称')
    level = fields.Integer(string='模块层级',compute='_compute_path_level',store=True)
    path = fields.Char(string='模块路径',compute='_compute_path_level',store=True)
    complete_name = fields.Char(string='模块完整名称',compute='_compute_path_level',store=True)
    note = fields.Text(string='模块描述')
    status = fields.Selection(string='模块状态', selection = [
        ('draft', '草稿'),
        ('confirm', '确认'),
        ('done', '完成'),
    ],default='draft')
    is_function_point = fields.Boolean('是否功能点',default=False)
    is_story_point = fields.Boolean('是否故事点',default=False)


    @api.constrains('parent_id')
    def _check_parent_id(self):
        if self._has_cycle():
            raise ValidationError(_('不能设置循环的上级模块.'))

    @api.depends('parent_id','note')
    def _compute_path_level(self):
        for record in self:
            if record.parent_id and record.parent_id.path:
                record.path = record.parent_id.path + '/' + str(record.id)
                record.complete_name = record.parent_id.complete_name + '/' + record.name
            else:
                record.path = '/' + str(record.id)
                record.complete_name = record.name
            record.level = record.path.count('/')