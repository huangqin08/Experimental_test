from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from product.models import ProductCode, ProductSubject, ProductAddress


def sampleReturn(request):
    project_code = request.GET.get('project_code', None)
    project_code = ProductCode.objects.filter(code_num=project_code).first()
    if project_code:
        if project_code.project_code_status == 2:
            return render(request, 'page2.html', {"project_code": project_code})
        else:
            return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})
    else:
        return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})


def express_code(request):
    project_code = request.GET.get('project_code', None)
    project_code = ProductCode.objects.filter(code_num=project_code).first()
    if project_code:
        if project_code.project_code_status == 2:
            return render(request, 'page4-1.html', {"project_code": project_code})
        else:
            return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})
    else:
        return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})


def placeOrder(request):
    code = request.GET.get('project_code', None)
    project_code = ProductCode.objects.filter(code_num=code).first()
    if project_code:
        if project_code.project_code_status == 2:
            product_name = project_code.project_name.name
            name = ProductSubject.objects.filter(name=product_name).first()
            pro_addr = ProductAddress.objects.filter(project_name=name).first()
            print(pro_addr)
    else:
        msg = '您的检测还未出报告！'
    return render(request, 'page2-2.html', locals())

def sreachOrder(request):
    code = request.GET.get('project_code', None)
    project_code = ProductCode.objects.filter(code_num=code).first()
    if project_code:
        if project_code.project_code_status == 2:
            product_name = project_code.project_name.name
            name = ProductSubject.objects.filter(name=product_name).first()
            pro_addr = ProductAddress.objects.filter(project_name=name).first()
            print(pro_addr)
    else:
        msg = '您的检测还未出报告！'
    return render(request, 'page2-3.html', locals())

def addresserSubmit(request):
    if request.method == "POST":
        # 前端获取提交的信息
        code_num = request.POST.get('code_num')
        addresser = request.POST.get('addresser')
        addresser_phone = request.POST.get('addresser_phone')
        addr = request.POST.get('addr')
        addr_desc = request.POST.get('addr_desc')
        print("code_num----------",code_num)
        # 接下来走jd接口
        project_code = ProductCode.objects.filter(code_num=code_num).first()
        project_code.project_code_status = 3
        project_code.save()
        return JsonResponse({'status': 'success', 'msg': '提交成功!'})


def reportSchedule(request):
    project_code = request.GET.get('project_code', None)
    project_code = ProductCode.objects.filter(code_num=project_code).first()
    if project_code:
        if project_code.project_code_status == 3 or project_code.project_code_status == 4:
            css_active = project_code.project_code_status
            return render(request, 'page3.html', locals())
        else:
            return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})
    else:
        return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})


def reportCopmlete(request):
    project_code = request.GET.get('project_code', None)
    project_code = ProductCode.objects.filter(code_num=project_code).first()
    if project_code:
        if project_code.project_code_status == 5:
            report=project_code.report
            return render(request, 'page4.html', locals())
        else:
            return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})
    else:
        return render(request, 'page0.html', {'meg': '您的检测还未出报告！'})