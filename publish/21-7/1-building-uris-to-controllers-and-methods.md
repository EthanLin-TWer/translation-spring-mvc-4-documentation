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



There are additional ways to use `MvcUriComponentsBuilder`. For example you
can use a technique akin to mock testing through proxies to avoid referring to
the controller method by name (the example assumes static import of
`MvcUriComponentsBuilder.on`):



    UriComponents uriComponents = MvcUriComponentsBuilder
        .fromMethodCall(on(BookingController.class).getBooking(21)).buildAndExpand(42);

    URI uri = uriComponents.encode().toUri();

The above examples use static methods in `MvcUriComponentsBuilder`. Internally
they rely on `ServletUriComponentsBuilder` to prepare a base URL from the
scheme, host, port, context path and servlet path of the current request. This
works well in most cases, however sometimes it may be insufficient. For
example you may be outside the context of a request (e.g. a batch process that
prepares links) or perhaps you need to insert a path prefix (e.g. a locale
prefix that was removed from the request path and needs to be re-inserted into
links).

For such cases you can use the static "fromXxx" overloaded methods that accept
a `UriComponentsBuilder` to use base URL. Or you can create an instance of
`MvcUriComponentsBuilder` with a base URL and then use the instance-based
"withXxx" methods. For example:



    UriComponentsBuilder base = ServletUriComponentsBuilder.fromCurrentContextPath().path("/en");
    MvcUriComponentsBuilder builder = MvcUriComponentsBuilder.relativeTo(base);
    builder.withMethodCall(on(BookingController.class).getBooking(21)).buildAndExpand(42);

    URI uri = uriComponents.encode().toUri();
