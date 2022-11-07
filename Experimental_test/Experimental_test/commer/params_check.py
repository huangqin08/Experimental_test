from django import forms

from Experimental_test.commer.apicode import ApiCode


class CheckParams:
    # 利用Form表单的特性进行参数校验
    def check_params(self, request, param_fields):
        # param_fields 获取Form的校验规则，param_fields的类型是一个字典类型  字典的key是前端传递的参数  字典的value是form表单的校验规则
        # param_fields 获取到参数之后 利用type来动态创建一个类 类的名称为type的第一个参数（WditFormDefine）
        # type的第二个参数是一个元组，此元组表示类的继承父类是谁 也就是forms.Form
        # type的第三给参数是一个字典，字典用来给动态类设置属性与值，字典的key就是类的属性，字典的值 就是该属性的值
        # 所以type执行完成后  等同于
        '''
        class WditFormDefine(forms.Form):
            name = fields.CharField(required=True,max_length=500, help_text="产品名称", error_messages={'required': '产品名称不能为空','max_length':'名称长度超过500字符'})
            .......
        '''
        # django 的Form自带校验规则 只需要动态组件这个类就够了
        # Form中的form.is_valid() 会帮你完成所有的参数校验操作  失败的信息在循环里  通过断点可以看到

        WditFormDefine = type('WditFormDefine', (forms.Form,), param_fields)
        if not request.query_params:
            form = WditFormDefine(request.data)
        else:
            form = WditFormDefine(request.query_params)
        if not form.is_valid():
            # 如果校验失败则提示错误信息
            data = dict()
            for k, v in form.declared_fields.items():
                data[k] = v.error_messages
            api_code_dict = ApiCode().parametererror
            api_code_dict.update(data)
        else:
            api_code_dict = ApiCode().success
        return api_code_dict
