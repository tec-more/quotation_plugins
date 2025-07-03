# -*- coding: utf-8 -*-
# from odoo import http


# class DisableEnterpriseModule(http.Controller):
#     @http.route('/disable_enterprise_module/disable_enterprise_module', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/disable_enterprise_module/disable_enterprise_module/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('disable_enterprise_module.listing', {
#             'root': '/disable_enterprise_module/disable_enterprise_module',
#             'objects': http.request.env['disable_enterprise_module.disable_enterprise_module'].search([]),
#         })

#     @http.route('/disable_enterprise_module/disable_enterprise_module/objects/<model("disable_enterprise_module.disable_enterprise_module"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('disable_enterprise_module.object', {
#             'object': obj
#         })

