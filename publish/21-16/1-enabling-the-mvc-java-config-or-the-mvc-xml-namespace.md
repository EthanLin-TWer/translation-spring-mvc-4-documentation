# 21.16.1 启用MVC Java编程配置或MVC命名空间

要启用MVC Java编程配置，你需要在其中一个注解了`@Configuration`的类上添加`@EnableWebMvc`注解：

```java
@Configuration
@EnableWebMvc
public class WebConfig {

}
```

要启用XML命名空间，请在你的DispatcherServlet上下文中（如果没有定义任何DispatcherServlet上下文，那么就在根上下文中）添加一个`mvc:annotation-driven`元素：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:mvc="http://www.springframework.org/schema/mvc"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <mvc:annotation-driven/>

</beans>
```

上面的简单的声明代码，就已经默认注册了一个`RequestMappingHandlerMapping`、一个`RequestMappingHandlerAdapter`，以及一个`ExceptionHandlerExceptionResolver`，以支持对使用了`@RequestMapping`、`@ExceptionHandler`及其他注解的控制器方法的请求处理。

同时，上面的代码还启用了以下的特性：

1. Spring 3风格的类型转换支持。这是使用一个配置的转换服务[ConversionService](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/validation.html#core-convert "8.5 Spring Type Conversion" )实例，以及the JavaBeans PropertyEditors used for Data Binding.
2. 使用`@NumberFormat`对数字字段进行[格式化](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/validation.html#format "8.6 Spring Field Formatting" )，类型转换由`ConversionService`实现
3. 使用`@DateTimeFormat`注解对`Date`、`Calendar`、`Long`及Joda Time类型的字段进行[格式化](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/validation.html#format "8.6 Spring Field Formatting" )
4. 使用`@Valid`注解对`@Controller`输入进行[验证](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html#mvc-config-validation "21.16.4 Validation" )——前提是classpath路径下比如提供符合JSR-303规范的验证器
5. HTTP消息转换`HttpMessageConverter`的支持，对注解了`@RequestMapping`或`@ExceptionHandler`方法的`@RequestBody`方法参数或`@ResponseBody`返回值生效

下面给出了一份由`mvc:annotation-driven`注册可用的HTTP消息转换器的完整列表：

1. 转换字节数组的`ByteArrayHttpMessageConverter`
2. 转换字符串的`StringHttpMessageConverter`
3. `ResourceHttpMessageConverter`：`org.springframework.core.io.Resource`与所有媒体类型之间的互相转换
4. `SourceHttpMessageConverter`：从（到）`javax.xml.transform.Source`的转换
5. `FormHttpMessageConverter`：数据与`MultiValueMap<String, String>`之间的互相转换
6. `Jaxb2RootElementHttpMessageConverter`：Java对象与XML之间的互相转换——该转换器在classpath路径下有JAXB2依赖并且没有Jackson 2 XML扩展时被注册
7. `MappingJackson2HttpMessageConverter`：从（到）JSON的转换——该转换器在classpath下有Jackson 2依赖时被注册
8. `MappingJackson2XmlHttpMessageConverter`：从（到）XML的转换——该转换器在classpath下有[Jackson 2 XML扩展](https://github.com/FasterXML/jackson-dataformat-xml)时被注册
9. `AtomFeedHttpMessageConverter`：Atom源的转换——该转换器在classpath路径下有Rome时被注册
10. `RssChannelHttpMessageConverter`：RSS源的转换——该转换器在classpath路径下有Rome时被注册

你可以参考[21.16.12 消息转换器](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html#mvc-config-message-converters "21.16.12 Message Converters")一小节，了解如何进一步定制这些默认的转换器。

> Jackson JSON和XML转换器是通过[`Jackson2ObjectMapperBuilder`](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/javadoc-api/org/springframework/http/converter/json/Jackson2ObjectMapperBuilder.html)创建的`ObjectMapper`实例创建的，目的在于提供更好的默认配置
>
> 该builder会使用以下的默认属性对Jackson进行配置：
>
> 1. 禁用[`DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES`](http://fasterxml.github.io/jackson-databind/javadoc/2.6/com/fasterxml/jackson/databind/DeserializationFeature.html#FAIL_ON_UNKNOWN_PROPERTIES)
>
> 2. 禁用[`MapperFeature.DEFAULT_VIEW_INCLUSION`](http://fasterxml.github.io/jackson-databind/javadoc/2.6/com/fasterxml/jackson/databind/MapperFeature.html#DEFAULT_VIEW_INCLUSION)
>
> 同时，如果检测到在classpath路径下存在这些模块，该builder也会自动地注册它们：
>
> 1. [jackson-datatype-jdk7](https://github.com/FasterXML/jackson-datatype-jdk7): 支持Java 7的一些类型，例如`java.nio.file.Path`
>
> 2. [jackson-datatype-joda](https://github.com/FasterXML/jackson-datatype-joda): 支持Joda-Time类型
>
> 3. [jackson-datatype-jsr310](https://github.com/FasterXML/jackson-datatype-jsr310): 支持Java 8的Date & Time API类型
>
> 4. [jackson-datatype-jdk8](https://github.com/FasterXML/jackson-datatype-jdk8): 支持Java 8其他的一些类型，比如`Optional`等
