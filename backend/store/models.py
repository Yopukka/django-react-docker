from django.db import models
from django.conf import settings
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=199, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Categories'

        def __str__(self):
            return self.name
        

class Product(models.Model):

    category = models.ForeignKey(
        Category,
        on_delete= models.SET_NULL,
        null=True,
        related_name='products'
    )

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']


    def __str__(self):
        return self.name
    
    @property
    def in_stock(self):
        return self.stock > 0
    

class Cart(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name = 'cart'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    

    def __str__(self):
        return f"Cart - {self.user.email}"
    
    @property
    def total(self):
        return sum(item.subtotal for item in self.cart_items.all())
    

    @property
    def item_count(self):
        return self.cart_items.count()
    

class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete = models.CASCADE,
        related_name = 'cart_items'
    )

    product = models.ForeignKey(
        Product,
        on_delete = models.CASCADE,
        related_name = 'cart_items'
    )

    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cart','product')


    def __str__(self):
        return f"{self.quantity}x {self.product.name}"
    

    @property
    def subtotal(self):
        return self.product.price * self.quantity
    


class Order(models.Model):

    class StatusChoices(models.TextChoices):
        
        PENDING = 'pending', 'Pending'
        CONFIRMEND = 'confirmed', 'Confirmed'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete = models.SET_NULL,
        null = True,
        related_name = 'orders'
    )

    status = models.CharField(
        max_length = 20,
        choices = StatusChoices.choices,
        default = StatusChoices.PENDING
    )
    total = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - {self.user.email} "
    
class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete = models.CASCADE,
        related_name = 'items'
    )
    product = models.ForeignKey(
        Product,
        on_delete = models.SET_NULL,
        null = True,
        related_name = 'orders_items'
    )
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits = 10, decimal_places=2)

    def __str__(self):
        return f" {self.quantity} x {self.product.name} "
    
    @property
    def subtotal(self):
        return self.unit_price * self.quantity
    

