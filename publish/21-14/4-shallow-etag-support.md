# 21.14.4 弱ETag（Shallow ETag)

对ETag的支持是由Servlet的过滤器`ShallowEtagHeaderFilter`提供的。它是纯Servlet技术实现的过滤器，因此，它可以与任何web框架无缝集成。`ShallowEtagHeaderFilter`过滤器会创建一个我们称为弱ETag（与强ETag相对，后面会详述）的对象。过滤器会将渲染的JSP页面的内容（包括其他类型的内容）缓存起来，然后以此生成一个MD5哈希值，并把这个值作为ETag头的值写回响应中。下一次客户端再次请求这个同样的资源时，它会将这个ETag的值写到`If-None-Match`头中。过滤器会检测到这个请求头，然后再次把视图渲染出来并比较两个哈希值。如果比较的结果是相同的，那么服务器会返回一个`304`。正如你所见，视图仍然会被渲染，因此本质上这个过滤器并非节省任何计算资源。唯一节省的东西，是带宽，因为被渲染的响应不会被整个发送回客户端。

请注意，这个策略节省的是网络带宽，而非CPU。因为对于每个请求，完整的响应仍然需要被整个计算出来。而其他在控制器层级实现的策略（上几节所述的）可以同时节省网络带宽及避免多余计算。

你可以在`web.xml`中配置`ShallowEtagHeaderFilter`：

```xml
<filter>
    <filter-name>etagFilter</filter-name>
    <filter-class>org.springframework.web.filter.ShallowEtagHeaderFilter</filter-class>
</filter>

<filter-mapping>
    <filter-name>etagFilter</filter-name>
    <servlet-name>petclinic</servlet-name>
</filter-mapping>
```

如果是在Servlet 3.0以上的环境下，可以这么做：

```java
public class MyWebAppInitializer extends AbstractDispatcherServletInitializer {

    // ...

    @Override
    protected Filter[] getServletFilters() {
        return new Filter[] { new ShallowEtagHeaderFilter() };
    }

}
```

更多配置细节，请参考第[21.15 基于代码的Servlet容器初始化](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html#mvc-container-config "21.15 Code-based Servlet container initialization")一小节。
