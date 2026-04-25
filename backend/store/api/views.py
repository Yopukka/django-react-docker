from rest_framework import viewsets, status
from rest_framework.decorators import action 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAdminUser, AllowAny
from django.shortcuts import get_object_or_404

from store.models import Category, Product, Cart, CartItem, Order, OrderItem
from store.api.serializers import (
    CategorySerializer,
    ProductSerializer,
    CartSerializer,
    CartItemSerializer,
    OrderItemSerializer,
    OrderSerializer
)

from django.db.models import Sum, Count


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    #Solo lectura - el admin crea las categorias

    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    
    #Productos publicos con filtro y categoria
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category')


        #filtro por categoria
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)


        #Busqueda por nombre
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset
    


class CartViewSet(viewsets.GenericViewSet):
    #Carrito del usuario authenticado
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get_cart(self):
        #Obtiene o crea el carrito de usuario
        cart, _= Cart.objects.get_or_create(user=self.request.user)
        return cart
    

    #GET /cart/
    def list(self, request):
        cart = self.get_cart()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    #POST/card/add/
    @action(detail=False, methods=['post'], url_path='add')
    def add_item(self, request):
        cart = self.get_cart()
        serializer = CartItemSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']

        cart_item, created = CartItem.objects.get_or_create(
            cart = cart,
            product = product,
            defaults={'quantity': quantity}
        )

        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock:
                return Response(
                    {"quantity": f"Only {product.stock} units available"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = new_quantity
            cart_item.save()

        return Response(CartSerializer(cart).data, status = status.HTTP_200_OK)
    
    #PATCH /card/update/{item_id}/
    @action(detail=False, methods=['patch'], url_path='update/(?P<item_id>[^/.]+)')
    def update_item(self, request, item_id=None):
        cart = self.get_cart()
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

        quantity = request.data.get('quantity')

        if not quantity:
            return Response(
                {"quantity": "This field is required"},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        quantity = int(quantity)

        if quantity < 1:
            return Response(
                {"quantity": "Quantity must be ar least 1"},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        if quantity > cart_item.product.stock:
            return Response(
                {"quantity": f"only {cart_item.product.stock} units available"},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        cart_item.quantity = quantity
        cart_item.save()

        return Response(CartSerializer(cart).data)
    

    @action(detail=False, methods=['delete'], url_path='remove/(?P<item_id>[^/.]+)')
    def remove_item(self, request, item_id=None):
        cart = self.get_cart()
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        return Response(CartSerializer(cart).data)
    
    
    #Delete /cart/Remove/{item_id}/
    @action(detail=False, methods=['delete'], url_path='clear')
    def clear_cart(self, request):
        cart = self.get_cart()
        cart.cart_items.all().delete()
        return Response(CartSerializer(cart).data)
    



class OrderViewSet(viewsets.GenericViewSet):
    
    #ordenes del usuario atunteticado
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(
            user = self.request.user
        ).prefetch_related('items__product')
    

    #GET /orders/
    def list(self, request):
        orders= self.get_queryset()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    

    #GET /orders/{id}/
    def retrieve(self, request, pk=None):
        order = get_object_or_404(self.get_queryset(), id=pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    

    #POST /orders/checkout/
    @action(detail=False, methods=['post'], url_path='checkout')
    def checkout(self, request):
        cart = get_object_or_404(Cart, user=request.user)

        if not cart.cart_items.exists():
            return Response(
                {"error": "Your cart is empty"},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        #Verificamos que hayan productos en el stock
        for item in cart.cart_items.select_related('product'):
            if item.quantity > item.product.stock:
                return Response(
                    {"error": f" '{item.product.name}' only has {item.product.stock}"},
                    status = status.HTTP_400_BAD_REQUEST
                )
            

        #Creamos la order
        order = Order.objects.create(
            user = request.user,
            total = cart.total,
            shipping_address = request.data.get('shipping_address', ''),
            notes = request.data.get('notes','')
        )


        #Creamos los items de la orden y los descantamos del stock
        for item in cart.cart_items.select_related('product'):
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                unit_price=item.product.price
            )
            item.product.stock -= item.quantity
            item.product.save()

        #limpiamos el carrito
        cart.cart_items.all().delete()

        return Response(
            OrderSerializer(order).data,
            status = status.HTTP_201_CREATED
        )
    


class AdminDashboardViewSet(viewsets.GenericViewSet):
    """Dashnoar para admin"""

    permission_classes = [IsAuthenticated, IsAdminUser]


    #Get /store/admin/dashboard
    @action(detail=False, methods=['get'], url_path='dashboar')
    def dashboard(self,request):

        #Resumen de los productos
        products = Product.objects.filter(is_active=True)
        total_products = products.count()
        out_of_stock = products.filter(stock=0).count()
        low_stock = products.filter(stock__gt=0, stock__lte=5).count()


        #Resumen de las ordenes
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()


        #Productos con poco o sin stock
        low_stock_products = ProductSerializer(
            products.filter(stock__lte=5).order_by('stock'),
            many=True
        ).data

        #Ordenes recientes
        recent_orders = Order.objects.select_related('user').prefetch_related('items__product').order_by('-created_at')[:10]


        recent_orders_data = [{
            'id': o.id,
            'user_email': o.user.email if o.user else '',
            'status': o.status,
            'total': str(o.total),
            'created_at': o.created_at,
            'items_count': o.items.count()
        } for o in recent_orders]

        return Response({
            'summary': {
                'total_products': total_products,
                'out_of_stock': out_of_stock,
                'low_stock':low_stock,
                'total_orders': total_orders,
                'pending_order': pending_orders
            },
            'low_stock_products': low_stock_products,
            'recents_order': recent_orders_data
        })
    
    @action(detail=False, methods=['patch'], url_path='orders/(?P<order_id>[^/.]+)/status')
    def update_order_status(self,request, order_id=None):

        #el admin puede cambiar el estado de una orden
        order = get_object_or_404(Order, id=order_id)
        new_status = request.data.get('status')

        valid_statuses = [s[0] for s in Order.StatusChoices.choices]
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid statu: {valid_statuses}'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save(update_fields=['status'])

        return Response({'id': order.id, 'status': order.status})