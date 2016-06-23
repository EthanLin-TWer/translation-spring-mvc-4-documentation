# 21.14.2 对静态资源的HTTP缓存支持

为优化站点性能，静态资源应该带有恰当的`'Cache-Control'`值与其他必要的头。[配置一个`ResourceHttpRequestHandler`处理器](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html#mvc-config-static-resources "21.16.9
Serving of Resources" )服务静态资源请求不仅会读取文件的元数据并填充`'Last-Modified'`头的值，正确配置时`'Cache-Control'`头也会被填充。【这段翻得还不是很清晰】

你可以设置`ResourceHttpRequestHandler`上的`cachePeriod`属性值，或使用一个`CacheControl`实例来支持更细致的指令：

```java
@Configuration
@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("/public-resources/")
                .setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic());
    }

}
```

XML中写法则如下：

```xml
<mvc:resources mapping="/resources/**" location="/public-resources/">
    <mvc:cache-control max-age="3600" cache-public="true"/>
</mvc:resources>
```
