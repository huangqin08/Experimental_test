#! usr/bin/env python
# -*- encoding: utf-8 -*-

"""
    auth: wormer@wormer.cn
    proj: base_sys
    date: 2017-10-27
    desc:
        错误对照表
        10000为正确， 10000以下为错误， 10000以上为正确
"""

__all__ = ['ApiCode']

class ApiCode:
    def __init__(self):
        self.unkonwnerror = {
            'code': 0,
            'mess': '未知错误！'
        }
        self.usernotexist = {
            'code': 1,
            'mess': '用户不存在！'
        }
        self.pasworderror = {
            'code': 2,
            'mess': '用户或密码错误！'
        }
        self.unsernologin = {
            'code': 3,
            'mess': '用户未登录！'
        }
        self.nopermission = {
            'code': 4,
            'mess': '用户未授权！'
        }
        self.userhadlogin = {
            'code': 5,
            'mess': '用户已登录！'
        }
        self.edilineerror = {
            'code': 6,
            'mess': '保存记录出错！'
        }
        self.linenoexists = {
            'code': 7,
            'mess': '请求的记录不存在！'
        }
        self.submitsecond = {
            'code': 8,
            'mess': '重复提交！'
        }
        self.parametererror = {
            'code': 9,
            'mess': '参数错误!'
        }
        self.logincodeerr = {
            'code': 10,
            'mess': '验证码失效，请重新获取！'
        }
        self.recordserror = {
            'code': 11,
            'mess': '没有数据权限！'
        }
        self.repeatserror = {
            'code': 12,
            'mess': '数据重复！'
        }
        self.exportxerror = {
            'code': 13,
            'mess': '导出异常'
        }
        self.datanoexists = {
            'code': 14,
            'mess': '查无数据！'
        }
        self.nomodify = {
            'code': 15,
            'mess': '禁止修改'
        }
        self.filedelerror = {
            'code': 16,
            'mess': '文件操作错误！'
        }
        self.success = {
            'code': 10000,
            'mess': '请求成功!'
        }

    def set_mess(self,api_code,mess):
        return api_code.update(mess)
