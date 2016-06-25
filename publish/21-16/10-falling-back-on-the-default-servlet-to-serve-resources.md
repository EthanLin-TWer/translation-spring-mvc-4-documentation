# 21.16.10 回到默认的Servlet来进行资源服务

这些配置允许你将`DispatcherServlet`映射到"/"路径（也即覆盖了容器默认Servlet的映射），但依然保留容器默认的Servlet以处理静态资源的请求。这可以通过配置一个URL映射到"/**"的处理器`DefaultServletHttpRequestHandler`来实现，并且该处理器在其他所有URL映射关系中优先级应该是最低的。

该处理器会将所有请求转发（forward）到默认的Servlet，因此需要保证它在所有URL处理器映射`HandlerMappings`的最后。如果你是通过`<mvc:annotation-driven>`的方式进行配置，或自己定制了`HandlerMapping`实例，那么你需要确保该处理器`order`属性的值比`DefaultServletHttpRequestHandler`的次序值`Integer.MAXVALUE`小。

使用默认的配置启用该特性，你可以：

```java
@Configuration
@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter {

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

}
```

XML命名空间只需一行：

```xml
    <mvc:default-servlet-handler/>
```

不过需要注意，覆写了"/"的Servlet映射后，默认Servlet的`RequestDispatcher`就必须通过名字而非路径来取得了。`DefaultServletHttpRequestHandler`会尝试在容器初始化的时候自动检测默认Servlet，这里它使用的是一份主流Servlet容器（包括Tomcat、Jetty、GlassFish、JBoss、Resin、WebLogic，和WWebSphere）已知的名称列表。如果默认Servlet被配置了一个其他的名字，或者使用了一个列表里未提供默认Servlet名称的容器，那么默认Servlet的名称必须被显式指定。正如下面代码所示：

```java
    @Configuration
    @EnableWebMvc
    public class WebConfig extends WebMvcConfigurerAdapter {

        @Override
        public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
            configurer.enable("myCustomDefaultServlet");
        }

    }

```

XML命名空间的配置方式：

```xml
    <mvc:default-servlet-handler default-servlet-name="myCustomDefaultServlet"/>
```
