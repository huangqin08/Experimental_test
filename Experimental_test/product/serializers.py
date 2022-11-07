from rest_framework import serializers

from product.models import ProductSubject


class S_ProductSubject(serializers.ModelSerializer):
    """
        单一用户列表序列化,基类序列
    """
    # 这里利用rest_framework里提供的ModelSerializer来对数据进行序列化
    # ModelSerializer序列化必须跟数据库字段相关
    # fields里写需要输出的参数，不需要的则不用写，写了就表示输出
    # 序列化是有一个好处的，可以任意添加一个数据库没有的字段作为参数输出
    # 这里添加一个add_time MethodField 相当于给fields添加一个额外的字段
    # 这里给你演示错误信息，一旦添加了 那么fields里就必须有这个参数
    # 翻车的原因是 add_time 设置了  但是没有匹配的值 ， 所以这里需要一个函数对add_time进行值的处理
    # 写法是有标准说明的 是名称前面带 get_
    # def的里面默认是一个self  self里面拿到的是当前序列化的类信息
    # obj是手动加进去的 def的第二个参数默认获取数据库中所有的查询值
    add_time = serializers.SerializerMethodField()

    class Meta:
        model = ProductSubject
        fields = [
            "name", "code_num", "desc","add_time"
        ]

    def get_add_time(self,obj):
        return obj.code_num