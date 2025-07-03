# -*- coding: utf-8 -*-

import ast
import base64
import json
import logging
import lxml
import os
import pathlib
import requests
import sys
import zipfile
from collections import defaultdict
from io import BytesIO
from os.path import join as opj

from odoo import api, fields, models, _
from odoo.exceptions import AccessDenied, AccessError, UserError
from odoo.http import request
from odoo.modules.module import adapt_version, MANIFEST_NAMES
from odoo.osv.expression import is_leaf
from odoo.release import major_version
from odoo.tools import convert_csv_import, convert_sql_import, convert_xml_import, exception_to_unicode
from odoo.tools import file_open, file_open_temporary_directory, ormcache

_logger = logging.getLogger(__name__)


def _domain_asks_for_industries(domain):
    for dom in domain:
        if is_leaf(dom) and dom[0] == 'module_type':
            if dom[2] == 'industries':
                if dom[1] != '=':
                    raise UserError('%r is an unsupported leaf' % (dom,))
                return True
    return False

class DisableEnterpriseModule(models.Model):
    _inherit = "ir.module.module"

    @api.model
    def web_search_read(self, domain, specification, offset=0, limit=None, order=None, count_limit=None):
        domain.append(['to_buy','=',False])
        if _domain_asks_for_industries(domain):
            fields_name = list(specification.keys())
            modules_list = self._get_modules_from_apps(fields_name, 'industries', False, domain, offset=offset,
                                                       limit=limit)
            return {
                'length': len(modules_list),
                'records': modules_list,
            }
        else:
            return super().web_search_read(domain, specification, offset=offset, limit=limit, order=order,
                                           count_limit=count_limit)




