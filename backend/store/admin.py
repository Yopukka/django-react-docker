from django.contrib import admin
from store.models import (
    Category,
    Product,
    CartItem,
    Order,
    OrderItem
)

#Mostramos los productos dentro de la categoria
class ProductInline(admin.TabularInline):
    model = Product
    extra = 0  # no mostrar filas vacias



#Mostramos los items de la orden
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0



@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    
    #Columnas visibles en la tabla
    list_display = ['name', 'slug', 'is_active']

    #Genera el slug automatico
    prepopulated_fields = {'slug': ('name',)}
    inline = [ProductInline]



@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    #Columnas visibles en la lista
    list_display = ['name', 'category', 'stock', 'is_active']

    #Filtros en el palen
    list_filter = ['category','is_active']

    #Busqueda por nombre
    search_fields = ['name']

    #Genera el slug automatico desde el nombre
    prepopulated_fields = {'slug': ('name',)}

    #permite editar desde la lista sin entrar en detalle 
    list_editable = ['is_active', 'stock']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    
    #columnas visibles en la lista
    list_display = [ 'id', 'user', 'status', 'total', 'created_at']

    #Filtrar por estado
    list_filter = ['status']
    inlines = [OrderItemInline]

    #Permite cambiar el estado directo de la lista
    list_editable = ['status']

