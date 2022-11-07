# Create your views here.
import os
from email.header import make_header

from django.core.mail import send_mail, EmailMultiAlternatives
from django.forms import fields
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from rest_framework.views import APIView

from Experimental_test import settings
from Experimental_test.commer.apicode import ApiCode
from Experimental_test.commer.params_check import CheckParams
# from Experimental_test.setting.set_logging import logger
from Experimental_test.settings import MEDIA_ROOT, MEDIA_URL, SERVERNAME_URL
from product.models import ProductSubject, ProductCode
from product.serializers import S_ProductSubject


class CreateProduct(APIView, CheckParams):
    """
        做一个测试接口，创建产品信息
        CheckParams是一个独立封装好的类  目的是用来校验前端传递过来的参数类型

    """

    def post(self, request, *args, **kwargs):
        # 假如创建产品需要这些参数，那么后端需要对这些参数进行校验，防止必传参数丢失，或者参数类型错误
        param_fields = {
            'name': fields.CharField(required=True, max_length=500, help_text="产品名称", error_messages={'required': '产品名称不能为空', 'max_length': '名称长度超过500字符'}),
            'name_short': fields.CharField(required=False, help_text="产品名称", ),
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


def query_product_code(request):
    if request.method == 'GET':
        code = request.GET.get('product_code')
        project_code = ProductCode.objects.filter(code_num=code).first()
        if project_code:
            code_num = project_code.code_num
            # print('project_code.project_code_status-------->', code_num)
            if project_code.project_code_status == 1:
                return redirect(reverse('user:addInfo_normal') + "?project_code=" + code_num)
            elif project_code.project_code_status == 2:
                return redirect(reverse('logistics:sampleReturn') + "?project_code=" + code_num)
            elif project_code.project_code_status in (3, 4):
                return redirect(reverse('logistics:reportSchedule') + "?project_code=" + code_num)
            elif project_code.project_code_status == 5:
                return redirect(reverse('logistics:reportCopmlete') + "?project_code=" + code_num)
        else:
            return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})


def getReport(request):
    product_code = request.GET.get('product_code', None)
    project_code = ProductCode.objects.filter(code_num=product_code).first()
    if project_code:
        if project_code.project_code_status == 5:

            return render(request, 'page4-2.html', locals())
        else:
            return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})
    else:
        return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})


def getReportEmail(request):
    if request.method == "POST":
        Email = request.POST.get('Email')
        project_code = request.POST.get('id')
        if project_code:
            project_code = ProductCode.objects.filter(code_num=project_code).first()
            if project_code.project_code_status == 5:
                report = project_code.report
                report_path = SERVERNAME_URL  + str(report)
                if Email:
                    # 发送邮件需要的参数
                    subject = '检测报告邮件'
                    text_content = '这是您的检测报告'
                    from_email = settings.EMAIL_HOST_USER
                    message = '''
                            感谢检测！亲爱的请赶快查看检测报告吧！
                            <br> <a href='{}'>点击查看</a>
                            <br>
                            如果链接不可用可以复制以下内容到浏览器查看：
                            <br>
                            {}
                            <br>
                            <br>                        
                            '''.format(report_path, report_path)

                    # 实际发送邮件的方法
                    msg = EmailMultiAlternatives(subject, text_content, from_email, [Email,])

                    msg.attach_alternative(message, "text/html")

                    text = open(report.path, 'rb').read()
                    file_name = 'aaa.pdf'
                    # 对文件进行编码处理
                    # b = make_header([(file_name, 'utf-8')]).encode('utf-8')
                    msg.attach(file_name, text)
                    msg.send()
                    # send_mail(subject=subject, message='', from_email=settings.EMAIL_HOST_USER, recipient_list=[Email, ],
                    #           html_message=message)
                    return redirect(reverse("logistics:reportCopmlete") + "?project_code=" + project_code.code_num)
        else:
            return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})
