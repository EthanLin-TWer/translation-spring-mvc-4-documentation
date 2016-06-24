# 21.16.7 视图控制器

以下的一段代码相当于定义一个`ParameterizableViewController`视图控制器的快捷方式，该控制器会立即将一个请求转发（forwards）给一个视图。请确保仅在以下情景下才使用这个类：当控制器除了将视图渲染到响应中外不需要执行任何逻辑时。

以下是一个例子，展示了如何在MVC Java编程配置方式下将所有`"/"`请求直接转发给名字为`"home"`的视图：

```java
@Configuration
@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("home");
    }

}
```

在MVC XML命名空间下完成同样的配置，则使用`<mvc:view-controller>`元素：

```xml
<mvc:view-controller path="/" view-name="home"/>
```
