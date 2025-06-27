# -*- coding: utf-8 -*-
# from odoo import http


# class SoftQuotation(http.Controller):
#     @http.route('/soft_quotation/soft_quotation', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/soft_quotation/soft_quotation/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('soft_quotation.listing', {
#             'root': '/soft_quotation/soft_quotation',
#             'objects': http.request.env['soft_quotation.soft_quotation'].search([]),
#         })

#     @http.route('/soft_quotation/soft_quotation/objects/<model("soft_quotation.soft_quotation"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('soft_quotation.object', {
#             'object': obj
#         })

