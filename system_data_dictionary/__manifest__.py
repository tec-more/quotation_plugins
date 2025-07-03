# -*- coding: utf-8 -*-
{
    'name': "数据字典",

    'summary': "数据字典",

    'description': """
        数据字典
    """,

    'author': "Hepan",
    'website': "https://t.zsxq.com/G3r9x",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': '模块优化',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/system_data_dictionary_views.xml',
    ],
    # only loaded in demonstration mode
    'application': True,
    'auto_install': True,
}

