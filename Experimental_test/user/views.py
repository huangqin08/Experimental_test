from django.shortcuts import render, redirect

# Create your views here.
from django.forms import fields
from django.http import JsonResponse, HttpResponse
from django.urls import reverse
from rest_framework.views import APIView

from Experimental_test.commer.apicode import ApiCode
from Experimental_test.commer.params_check import CheckParams
from Experimental_test.setting.set_logging import logger
from product.models import ProductSubject, ProductCode
from product.serializers import S_ProductSubject
from user.models import ExamineUser

app_name = 'user'


class CreateProduct(APIView, CheckParams):
    """
        做一个测试接口，创建产品信息
        CheckParams是一个独立封装好的类  目的是用来校验前端传递过来的参数类型

    """

    def post(self, request, *args, **kwargs):
        # 假如创建产品需要这些参数，那么后端需要对这些参数进行校验，防止必传参数丢失，或者参数类型错误
        param_fields = {
            'name': fields.CharField(required=True, max_length=500, help_text="产品名称",
                                     error_messages={'required': '产品名称不能为空', 'max_length': '名称长度超过500字符'}),
            'name_short': fields.CharField(required=False, help_text="产品名称", ),
            'code_num': fields.CharField(required=True, max_length=20, help_text="产品编码",
                                         error_messages={'required': '产品编码不能为空', 'max_length': '名称长度超过20字符'}),
            'img': fields.ImageField(required=False, help_text="产品图片"),
            'desc': fields.CharField(required=False, help_text="产品说明"),
        }
        api_code_dict = self.check_params(request, param_fields)
        if api_code_dict != ApiCode().success:
            # 一旦代码到这了，就表示前端的参数传递有问题
            return JsonResponse(api_code_dict)
        else:
            # 这里就是业务逻辑的代码
            return JsonResponse({})

        # 如果不明白check_params的校验方式和逻辑  那么就自己写原有的校验方式

        # 原来的校验方式是这么写的
        # name = request.POST.get('request',None)
        # if not name:
        #     # 必传参数丢失
        #     pass
        # if name.__len__:
        #     # name长度超过500
        #     pass


class QueryProduct(APIView, CheckParams):

    def get(self, request, *args, **kwargs):
        # 首先初始化接口返回参数为正常
        api_code_dict = ApiCode().success

        # 很多时候产品查询是需要带ID进行查询的，为了演示查询效果 这里不做参数传递
        pro_obj = ProductSubject.objects.all()
        if not pro_obj:
            # 产品查询失败，则提示错误
            api_code_dict = ApiCode().datanoexists
        else:
            # 已经查到产品信息了，正常的提取数据的方式是通过for来一个一个拿
            # 还得通过for循环来自己组装json数据传递到页面上，比如
            # data_list = list()
            # for data_obj_list in pro_obj:
            #     data = {
            #         'name':data_obj_list.name,
            #         'code_num':data_obj_list.code_num,
            #         'desc':data_obj_list.desc,
            #     }
            #     data_list.append(data)
            # api_code_dict.update({'json':data_list})
            # 传统写法就是这样，复杂，如果需要调整产品的信息 需要调整data里面的字典结构 比如添加一个desc

            # 这里利用序列化对数据进行输出
            # 首先得开始创建序列化对象 这是一个类，S_ProductSubject序列化类创建好之后直接使用 将数据直接载入即可
            # S_ProductSubject的返回值是一个列表  或者一个字典  当载入数据是多个时返回列表  当载入数据是一个时返回字典
            # 这里pro_obj的查询结果集是一个queryset列表，所以many=True告诉序列化用列表的方式输出数据，反之则用字典的方式输出数据
            pro_list = S_ProductSubject(pro_obj, many=True).data
            api_code_dict.update({'json': pro_list})
            # 平时要做日志记录  用这个
            # logger.info('这是一段日志信息')
            # logger.info('这是pro_obj的序列化结果：{}'.format(pro_list))

        return JsonResponse(api_code_dict)


def addInfo_normal(request):
    if request.method == 'GET':
        code = request.POST.get('project_code')
        project_code = ProductCode.objects.filter(code_num=code).first()
        if not project_code:
            msg = '您的检测还未出报告！'
    return render(request, 'page1-1.html', locals())


def addinfo(request):
    if request.method == "POST":
        # 前端获取提交的信息
        code_num = request.POST.get('code_num')
        examine_name = request.POST.get('examine_name')
        # certificate_type = request.POST.get('certificateType')
        certificate_type = 1  # 证件类型写死为身份证
        certificate_num = request.POST.get('certificate_num')
        phone = request.POST.get('phone')‘’
        # 查询产品编码是否存在
        project_code = ProductCode.objects.filter(code_num=code_num).first()
        if project_code:
            # 判断此产品编码是待绑定状态
            if project_code.project_code_status == 1:
                examiner = ExamineUser.objects.create(code_num=project_code, examine_name=examine_name,
                                                      certificate_type=certificate_type,
                                                      certificate_num=certificate_num,
                                                      phone=phone)
                # 绑定成功后更新产品编码状态为待寄回
                if examiner:
                    # product_code = ProductCode.objects.filter(code_num=examiner.code_num).first()
                    project_code.project_code_status = 2
                    project_code.save()
                    return JsonResponse({'status': 'success', 'msg': '提交成功!'})
                else:
                    return JsonResponse({'status': 'fail', 'errmsg': '提交不成功!'})
            else:
                return JsonResponse({'status': 'fail', 'errmsg': '此产品编码不能提交受检人信息！'})
        else:
            return JsonResponse({'status': 'fail', 'errmsg': '此产品编码不存在！'})
