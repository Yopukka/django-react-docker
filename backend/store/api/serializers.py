from rest_framework import serializers
from store.models import (
    Category,
    Product,
    Cart,
    CartItem, 
    Order, 
    OrderItem
)


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = [
            'id', 
            'name', 
            'slug', 
            'description', 
            'is_active'
            ]



class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'category',
            'category_name',
            'name',
            'slug',
            'description',
            'price',
            'stock',
            'in_stock',
            'image',
            'is_active'
            ]
        



class CartItemSerializer(serializers.ModelSerializer):

    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset = Product.objects.filter(is_active=True),
        source='product',
        write_only=True
    )
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id',
            'product',
            'product_id', 
            'quantity', 
            'subtotal'
            ]
        
    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value
    
    def validate(self, data):
        product = data.get('product')
        quantity = data.get('quantity', 1)
        if product and quantity > product.stock:
            raise serializers.ValidationError({
                "quantity": f"Only {product.stock} units available"
            })
        return data




class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source='cart_items', many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2,read_only=True)
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = [
            'id',
            'items',
            'total',
            'item_count'
        ]




class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10,decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields =[
            'id',
            'product_name',
            'quantity',
            'unit_price',
            'subtotal'
        ]




class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'user_email',
            'status',
            'total',
            'shipping_address',
            'notes',
            'items',
            'created_at'
        ]
        read_only_fields = ['total', 'status', 'user_email']