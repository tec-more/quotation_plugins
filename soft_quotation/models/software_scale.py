# -*- coding: utf-8 -*-
import logging
from email.policy import default

from odoo import models, fields, api


class SoftwareScale(models.Model):
    _name = 'software.scale'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _description = '软件规模'

    def _default_complexity(self):
        record = self.env['system.data.dictionary'].search([
            ('category', '=', '软件规模复杂度'),
            ('name', '=', '中')
        ], limit=1)
        return record.id if record else False

    def _default_quotation_type(self):
        record = self.env['system.data.dictionary'].search([
            ('category', '=', '软件报价精度'),
            ('name', '=', '估算')
        ], limit=1)
        return record.id if record else False

    project_id = fields.Many2one('project.project', string='项目名')
    # stage_id = fields.Many2one('project_id.stage_id', string='阶段')
    name = fields.Char(string='软件规模名称',related='project_id.name')
    # 评估方式 之间的转换 1故事点 ≈ 5 功能点 ≈ 250行代码
    scale_type =fields.Selection([('function_point', '功能点'),
                                  ('story_point', '故事点'),
                                  ('loc', 'LOC')], '评估方式',
                                 default='function_point')
    # 复杂度
    complexity = fields.Many2one('system.data.dictionary',string='复杂度',domain='[("category", "=", "软件规模复杂度")]',default=_default_complexity)
    quotation_type = fields.Many2one('system.data.dictionary',string='报价精度',domain='[("category", "=", "软件报价精度")]',default=_default_quotation_type)

    # 项目的报价精度
    # quotation_type = fields.Selection([
    #     ('estimate', '估算'),
    #     ('actuary', '精算'),
    # ],'报价精度',default='estimate')

    status = fields.Selection( [
        ('draft', '草稿'),
        ('confirm', '确认'),
        ('done', '完成'),
    ],'规模状态',default='draft')
    scale_amount = fields.Integer(string='软件规模数')
    scl_ids = fields.One2many('software.scale.line', 'software_scale_id', string='软件规模明细')
    show_function = fields.Boolean(string='是否显示功能点数',default=True,compute='_compute_show_type',store=True)
    show_story = fields.Boolean(string='是否显示故事点数',default=False,compute='_compute_show_type',store=True)
    show_loc = fields.Boolean(string='是否显示代码行数',default=False,compute='_compute_show_type',store=True)

    @api.depends('scale_type')
    def _compute_show_type(self):
        for record in self:  # 只需操作主记录
            if record.scale_type == 'function_point':
                record.show_function = True
                record.show_story = False
                record.show_loc = False
            elif record.scale_type == 'story_point':
                record.show_function = False
                record.show_story = True
                record.show_loc = False
            elif record.scale_type == 'loc':
                record.show_function = False
                record.show_story = False
                record.show_loc = True

    def import_project_module(self):
        logging.info('导入项目模块')
        domain = [('project_id', '=', self.project_id.id)]
        if self.show_function:
            domain.append(('is_function_point', '=', True))
        elif self.show_story:
            domain.append(('is_story_point', '=', True))
        # 获取项目模块
        project_modules = self.env['project.module'].sudo().search(domain)
        scl_lines = []
        for module in project_modules:
            scl_lines.append((0,0,{
                'module_id':module.id,
                'show_function':self.show_function,
                'show_story':self.show_story,
                'show_loc':self.show_loc,
                })
            )
        self.scl_ids = scl_lines
        pass

class SoftwareScaleLine(models.Model):
    _name = 'software.scale.line'
    _description = '软件规模明细'

    software_scale_id = fields.Many2one('software.scale', string='软件规模')
    module_id = fields.Many2one('project.module',string='项目模块')
    name = fields.Char(string='模块名称',related = "module_id.name")
    ilf = fields.Integer(string='内部逻辑文件(ILF)',default=1)
    ilf_weight = fields.Integer(string='内部逻辑文件权重',default=7)
    eif = fields.Integer(string='内部接口文件(EIF)',default=1)
    eif_weight = fields.Integer(string='内部接口文件权重', default=5)
    eq = fields.Integer(string='外部查询(EQ)',default=1)
    eq_weight = fields.Integer(string='外部查询权重',default=4)
    ei = fields.Integer(string='外部输入(EI)',default=1)
    ei_weight = fields.Integer(string='外部输入权重',default=4)
    eo = fields.Integer(string='外部输出(EO)',default=1)
    eo_weight = fields.Integer(string='外部输出权重',default=5)
    story_point_num = fields.Many2one('system.data.dictionary',string='故事点数',domain='[("category", "=", "斐波拉契数列")]')
    loc_num = fields.Integer(string='代码行数',default=0)
    amount = fields.Integer(string='明细规模数',compute='_compute_scale_amount',store=True)
    show_function = fields.Boolean(string='是否显示功能点数',default=True,compute='_compute_show_type',store=True)
    show_story = fields.Boolean(string='是否显示故事点数',default=False,compute='_compute_show_type',store=True)
    show_loc = fields.Boolean(string='是否显示代码行数',default=False,compute='_compute_show_type',store=True)

    @api.depends('software_scale_id.scale_type')
    def _compute_show_type(self):
        for line in self:
            scale_type = line.software_scale_id.scale_type
            line.show_function = (scale_type == 'function_point')
            line.show_story = (scale_type == 'story_point')
            line.show_loc = (scale_type == 'loc')
    @api.depends('ilf', 'ilf_weight','eif','eif_weight', 'eq','eq_weight','ei','ei_weight','eo','eo_weight','story_point_num','loc_num')
    def _compute_scale_amount(self):
        logging.info('计算规模容量')
        for record in self:
            if record.software_scale_id.scale_type == 'function_point':
                # 如果类型是功能点评估方式,
                # 则根据内部逻辑文件、内部接口文件、外部查询、外部输入、外部输出的个数
                # 来确定项目规模数
                if record.software_scale_id.quotation_type.name == '估算':
                    # 如果是估算方式,则将项目规模数除以10000
                    record.amount = record.ilf_weight*record.ilf + record.eif_weight*record.eif
                elif record.software_scale_id.quotation_type == '精算':
                    # 如果是精算方式,则将项目规模数除以100
                    record.amount = record.ilf_weight*record.ilf + record.eif_weight*record.eif + record.eq_weight*record.eq + record.ei_weight*record.ei + record.eo_weight*record.eo
            elif record.software_scale_id.scale_type == 'story_point':
                # 斐波拉契数列,每个故事点的子故事点不超过5层，如果超过5层则需要进行拆分
                record.amount = int(record.story_point_num.name)
            elif record.software_scale_id.scale_type == 'loc':
                record.amount = record.loc_num
