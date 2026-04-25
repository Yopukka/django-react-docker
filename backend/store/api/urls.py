from rest_framework.routers import DefaultRouter
from store.api.views import (
    CategoryViewSet, 
    ProductViewSet, 
    CartViewSet, 
    OrderViewSet,
    AdminDashboardViewSet
)


router = DefaultRouter()

router.register('categories', CategoryViewSet, basename = 'category')
router.register('products', ProductViewSet, basename='product')
router.register('cart', CartViewSet, basename='cart')
router.register('orders', OrderViewSet, basename='order')
router.register('admin', AdminDashboardViewSet, basename='admin')

urlpatterns = router.urls