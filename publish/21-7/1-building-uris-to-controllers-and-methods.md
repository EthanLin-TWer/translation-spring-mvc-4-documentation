# 21.7.1 为控制器和方法指定URI

Spring MVC也提供了构造指定控制器方法链接的机制。以下面代码为例子，假设我们有这样一个控制器：

```java
@Controller
@RequestMapping("/hotels/{hotel}")
public class BookingController {

    @RequestMapping("/bookings/{booking}")
    public String getBooking(@PathVariable Long booking) {

    // ...

    }
}
```

你可以通过引用方法名字的办法来准备一个链接：

```java
UriComponents uriComponents = MvcUriComponentsBuilder
    .fromMethodName(BookingController.class, "getBooking", 21).buildAndExpand(42);

URI uri = uriComponents.encode().toUri();
```

在上面的例子中，我们为方法参数准备了填充值：一个long型的变量值21，以用于填充路径变量并插入到URL中。另外，我们还提供了一个值42，以用于填充其他剩余的URI变量，比如从类层级的请求映射中继承来的`hotel`变量。如果方法还有更多的参数，你可以为那些不需要参与URL构造的变量赋予null值。一般而言，只有`@PathVariable`和`@RequestParam`注解的参数才与URL的构造相关。

还有其他使用`MvcUriComponentsBuilder`的方法。比如，你可以通过类似mock掉测试对象的方法，用代理来避免直接通过名字引用一个控制器方法（以下方法假设`MvcUriComponentsBuilder.on`方法已经被静态导入）：

```java
UriComponents uriComponents = MvcUriComponentsBuilder
    .fromMethodCall(on(BookingController.class).getBooking(21)).buildAndExpand(42);

URI uri = uriComponents.encode().toUri();
```

上面的代码例子中使用了`MvcUriComponentsBuilder`类的静态方法。内部实现中，它依赖于`ServletUriComponentsBuilder`来从当前请求中抽取schema、主机名、端口号、context路径和servlet路径，并准备一个基本URL。大多数情况下它能良好工作，但有时还不行。比如，在准备链接时，你可能在当前请求的上下文（context）之外（比如，执行一个准备链接links的批处理），或你可能需要为路径插入一个前缀（比如一个地区性前缀，它从请求中被移除，然后又重新被插入到链接中去）。

对于上面所提的场景，你可以使用重载过的静态方法`fromXxx`，它接收一个`UriComponentsBuilder`参数，然后从中获取基本URL以便使用。或你也可以使用一个基本URL创建一个`MvcUriComponentsBuilder`对象，然后使用实例对象的`fromXxx`方法。如下面的示例：

```java
UriComponentsBuilder base = ServletUriComponentsBuilder.fromCurrentContextPath().path("/en");
MvcUriComponentsBuilder builder = MvcUriComponentsBuilder.relativeTo(base);
builder.withMethodCall(on(BookingController.class).getBooking(21)).buildAndExpand(42);

URI uri = uriComponents.encode().toUri();
```
