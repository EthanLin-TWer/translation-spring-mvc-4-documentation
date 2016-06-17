# 21.7 URI构造

在Spring MVC中，使用了`UriComponentsBuilder`和`UriComponents`两个类来提供一种构造和加密URI的机制。

比如，你可以通过一个URI模板字符串来填充并加密一个URI：

```java
UriComponents uriComponents = UriComponentsBuilder.fromUriString(
        "http://example.com/hotels/{hotel}/bookings/{booking}").build();

URI uri = uriComponents.expand("42", "21").encode().toUri();
```

请注意`UriComponents`是不可变对象。因此`expand()`与`encode()`操作在必要的时候会返回一个新的实例。

你也可以使用一个URI组件实例对象来实现URI的填充与加密：

```java
UriComponents uriComponents = UriComponentsBuilder.newInstance()
        .scheme("http").host("example.com").path("/hotels/{hotel}/bookings/{booking}").build()
        .expand("42", "21")
        .encode();
```

在Servlet环境下，`ServletUriComponentsBuilder`类提供了一个静态的工厂方法，可以用于从Servlet请求中获取URL信息：

```java
HttpServletRequest request = ...

// 主机名、schema, 端口号、请求路径和查询字符串都重用请求里已有的值
// 替换了其中的"accountId"查询参数

ServletUriComponentsBuilder ucb = ServletUriComponentsBuilder.fromRequest(request)
        .replaceQueryParam("accountId", "{id}").build()
        .expand("123")
        .encode();
```

或者，你也可以选择只复用请求中一部分的信息：

```java
    // 重用主机名、端口号和context path
    // 在路径后添加"/accounts"

    ServletUriComponentsBuilder ucb = ServletUriComponentsBuilder.fromContextPath(request)
            .path("/accounts").build()
```

或者，如果你的`DispatcherServlet`是通过名字（比如，`/main/*`）映射请求的，you can also have the literal part of the servlet mapping included:

```java
    // Re-use host, port, context path
    // Append the literal part of the servlet mapping to the path
    // Append "/accounts" to the path

    ServletUriComponentsBuilder ucb = ServletUriComponentsBuilder.fromServletMapping(request)
            .path("/accounts").build()
```
