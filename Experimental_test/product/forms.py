from django.forms import ModelForm

from product.models import ProductCode


class ProductForm(ModelForm):
    class Meta:
        model=ProductCode
        fields=['code_num']


