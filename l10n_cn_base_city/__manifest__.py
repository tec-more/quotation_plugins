# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
# Copyright (C) 2025-now  yuqian_go@outlook.com

{
    'name': 'China - Base City Data',
    'countries': ['cn'],
    'version': '1.8',
    'category': 'Accounting/Localizations',
    'author': 'hepan<yuqian_go@outlook.com>',
    'description': """
        Includes the following data for the Chinese localization
        ========================================================
        Base City Data/城市数据,数据采集https://map.360.cn/zt/postcode.html
        用腾讯元宝生成的数据格式
    """,
    'depends': ['l10n_cn', 'base_address_extended'],
    'data': [
        'data/res_city_base_data.xml',
        'data/res_country_base_data.xml',
    ],
    'license': 'LGPL-3',
}
