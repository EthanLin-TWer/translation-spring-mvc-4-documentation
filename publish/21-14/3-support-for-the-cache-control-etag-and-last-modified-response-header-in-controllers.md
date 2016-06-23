# 21.14.3 在控制器中设置Cache-Control、ETag和Last-Modified响应头

控制器能处理带有`'Cache-Control'`、`'ETag'`及/或`'If-Modified-Since'`头的请求，如果服务端在响应中设置了`'Cache-Control'`响应头，那么我们推荐在控制器内对这些请求头进行处理。这涉及一些工作：计算最后更改时间`long`和/或请求的ETag值、与请求头的`'If-Modified-Since'`值做比较，并且在资源未更改的情况下在响应中返回一个304（资源未更改）状态码。

正如在["使用HttpEntity"一节](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html#mvc-ann-httpentity "Using HttpEntity")中所讲，控制器可以通过`HttpEntity`类与请求/响应交互。返回`ResponseEntity`的控制器可以在响应中包含HTTP缓存的信息，如下代码所示：

```java
@RequestMapping("/book/{id}")
public ResponseEntity<Book> showBook(@PathVariable Long id) {

    Book book = findBook(id);
    String version = book.getVersion();

    return ResponseEntity
                .ok()
                .cacheControl(CacheControl.maxAge(30, TimeUnit.DAYS))
                .eTag(version) // 这里也能操作最后修改时间lastModified，只不过没有一一展示
                .body(book);
}
```

这样做不仅会在响应头中设置`'ETag'`及`'Cache-Control'`相关的信息，同时也会 **尝试将响应状态码设置为`HTTP 304 Not Modified`（资源未修改）及将响应体置空**——如果客户端携带的请求头信息与控制器设置的缓存信息能够匹配的话。

如果希望在`@RequestMapping`方法上也能完成同样的事，那么你可以这样做：

```java
@RequestMapping
public String myHandleMethod(WebRequest webRequest, Model model) {

    long lastModified = // 1. 应用相关的方式计算得到(application-specific calculation)

    if (request.checkNotModified(lastModified)) {
        // 2. 快速退出 — 不需要更多处理了
        return null;
    }

    // 3. 若资源更改了，那么再进行请求处理阶段，一般而言是准备响应内容
    model.addAttribute(...);
    return "myViewName";
}
```

这里最重要的两个地方是：调用`request.checkNotModified(lastModified)`方法，以及返回`null`。前者（方法调用）在返回`true`之前会将响应状态码设为304；而后者，在检查是否更改的方法调用返回`true`的基础上直接将方法返回，这会通知Spring MVC不再对请求做任何处理。

另外要注意的是，检查资源是否发生了更改有3种方式：

* `request.checkNotModified(lastModified)`方法会将传入的参数值（最后修改时间）与请求头`'If-Modified-Since'`的值进行比较
* `request.checkNotModified(eTag)`方法会将传入的参数值与请求头`'ETag'`的值进行比较
* `request.checkNotModified(eTag, lastModified)`方法会同时进行以上两种比较。也即是说，只有在两个比较都被判定为未修改时，服务器才会返回一个304响应状态码`HTTP 304 Not Modified`（资源未修改）
