# 21.16.11 路径匹配

这些配置允许你对许多与URL映射和路径匹配有关的设置进行定制。关于所有可用的配置选项，请参考[PathMatchConfigurer](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/javadoc-api/org/springframework/web/servlet/config/annotation/PathMatchConfigurer.html)类的API文档。

下面是采用MVC Java编程配置的一段代码：

```java
    @Configuration
    @EnableWebMvc
    public class WebConfig extends WebMvcConfigurerAdapter {

        @Override
        public void configurePathMatch(PathMatchConfigurer configurer) {
            configurer
                .setUseSuffixPatternMatch(true)
                .setUseTrailingSlashMatch(false)
                .setUseRegisteredSuffixPatternMatch(true)
                .setPathMatcher(antPathMatcher())
                .setUrlPathHelper(urlPathHelper());
        }

        @Bean
        public UrlPathHelper urlPathHelper() {
            //...
        }

        @Bean
        public PathMatcher antPathMatcher() {
            //...
        }

    }
```

在XML命名空间下实现同样的功能，可以使用`<mvc:path-matching>`元素：

```xml
    <mvc:annotation-driven>
        <mvc:path-matching
            suffix-pattern="true"
            trailing-slash="false"
            registered-suffixes-only="true"
            path-helper="pathHelper"
            path-matcher="pathMatcher"/>
    </mvc:annotation-driven>

    <bean id="pathHelper" class="org.example.app.MyPathHelper"/>
    <bean id="pathMatcher" class="org.example.app.MyPathMatcher"/>
```
