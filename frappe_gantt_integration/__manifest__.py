# -*- coding: utf-8 -*-
{
    'name': "Frappe Gantt Integration",

    'summary': "甘特图",

    'description': """
        甘特图
    """,

    'author': "hepan",
    'website': "https://t.zsxq.com/G3r9x",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': '模块优化',
    'version': '1.0.1',

    # any module necessary for this one to work correctly
    'depends': ['base','web','project'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/frappe_gantt_views.xml',
    ],
    'assets': {  # 使用新的 assets 声明方式
        'web.assets_backend': [
            '/frappe_gantt_integration/static/src/lib/frappe-gantt.css',
            '/frappe_gantt_integration/static/src/lib/frappe-gantt.umd.js',
            '/frappe_gantt_integration/static/src/lib/googlechartjsloader.js',
            '/frappe_gantt_integration/static/src/js/frappe_gantt_model.js',
            '/frappe_gantt_integration/static/src/js/frappe_gantt_arch_parser.js',
            '/frappe_gantt_integration/static/src/js/frappe_gantt_compiler.js',
            '/frappe_gantt_integration/static/src/js/frappe_gantt_controller.js',
            '/frappe_gantt_integration/static/src/js/frappe_gantt_controller_views.xml',
            '/frappe_gantt_integration/static/src/js/frappe_gantt_renderer.js',
            '/frappe_gantt_integration/static/src/js/frappe_gantt_renderer_views.xml',
            '/frappe_gantt_integration/static/src/js/frappe_gantt_views.js',
            '/frappe_gantt_integration/static/src/scss/frappe_gantt.scss',
        ],
    },
    'installable': True,
    'application': True,
}

