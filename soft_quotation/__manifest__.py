# -*- coding: utf-8 -*-
{
    'name': "软件报价",

    'summary': "根据工业和信息化部标准化相关标准，开发的软件报价模块",

    'description': """
        软件报价功能包含软件规模，工作量，工期，价格
    """,

    'author': "hepan",
    'website': "https://t.zsxq.com/G3r9x",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': '报价-软件报价',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base','project','system_data_dictionary','l10n_cn_city'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/relevant_standard.xml',
        'views/project_quotation.xml',
        'views/software_scale.xml',
        'views/software_work_volume.xml',
        'views/software_duration.xml',
        'views/software_quotation.xml',
        'views/region_hr.xml',
        'views/menus.xml',
    ],
    # only loaded in demonstration mode
}

