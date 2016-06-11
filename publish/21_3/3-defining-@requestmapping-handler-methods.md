# 21.3.3 定义@RequestMapping注解的处理方法(handler method)

使用`@RequestMapping`注解的处理方法可以拥有非常灵活的方法签名，它支持的方法参数及返回值类型将在接下来的小节讲述。大多数参数都可以任意的次序出现，除了唯一的一个例外：`BindingResult`参数。这在下节也会详细描述。

> Spring 3.1中新增了一些类，用以增强注解了`@RequestMapping`的处理方法，分别是`RequestMappingHandlerMapping`类和`RequestMappingHandlerAdapter`类。我们鼓励使用这组新的类，如果要使用Spring 3.1及以后版本的新特性，这组类甚至是必须使用的。这些增强类在MVC的命名空间配置和MVC的Java编程方式配置中都是默认开启的，如果不是使用这两种方法，那么就需要显式地配置。

## 支持的方法参数类型

下面列出所有支持的方法参数类型：

* 请求或响应对象（Servlet API）。可以是任何具体的请求或响应类型的对象，比如，`ServletRequest`或`HttpServletRequest`对象等。
* `HttpSession`类型的会话对象（Servlet API）。使用该类型的参数将要求这样一个session的存在，因此这样的参数永不为`null`。

> 存取session可能不是线程安全的，特别是在一个Servlet的运行环境中。如果应用可能有多个请求同时并发存取一个session场景，请考虑将RequestMappingHandlerAdapter类中的"synchronizeOnSession"标志设置为"true"。

* `org.springframework.web.context.request.WebRequest`或`org.springframework.web.context.request.NativeWebRequest`。允许存取一般的请求参数和请求/会话范围的属性（attribute），同时无需绑定使用Servlet/Portlet的API
* 当前请求的地区信息`java.util.Locale`，由已配置的最相关的地区解析器解析得到。在MVC的环境下，就是应用中配置的`LocaleResolver`或`LocaleContextResolver`
* 与当前请求绑定的时区信息`java.util.TimeZone`（java 6以上的版本）/`java.time.ZoneId`（java 8），由`LocaleContextResolver`解析得到
* 用于存取请求正文的`java.io.InputStream`或`java.io.Reader`。该对象与通过Servlet API拿到的输入流/Reader是一样的
* 用于生成响应正文的`java.io.OutputStream`或`java.io.Writer`。该对象与通过Servlet API拿到的输出流/Writer是一样的
* `org.springframework.http.HttpMethod`。可以拿到HTTP请求方法
* 包装了当前被认证用户信息的`java.security.Principal`
* 带`@PathVariable`注解的方法参数，其存放了URI模板变量中的值。详见[“URI模板变量”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestmapping-uri-templates "URI Template Patterns" )
* 带`@MatrixVariable`注解的方法参数，其存放了URI路径段中的键值对。详见[“矩阵变量”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-matrix-variables "Matrix Variables")
* 带`@RequestParam`注解的方法参数，其存放了Servlet请求中所指定的参数。参数的值会被转换成方法参数所声明的类型。详见[“使用@RequestParam注解绑定请求参数至方法参数”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestparam "Binding request parameters to method parameters with @RequestParam" )
* 带`@RequestHeader`注解的方法参数，其存放了Servlet请求中所指定的HTTP请求头的值。参数的值会被转换成方法参数所声明的类型。详见[“使用@RequestHeader注解映射请求头属性”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestheader "Mapping request header attributes with the @RequestHeader annotation" ).
* 带`@RequestBody`注解的参数，提供了对HTTP请求体的存取。参数的值通过`HttpMessageConverter`被转换成方法参数所声明的类型。详见[“使用@RequestBody注解映射请求体”一节"](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestbody "Mapping the request body with the @RequestBody annotation" )
* 带`@RequestPart`注解的参数，提供了对一个"multipart/form-data请求块（request part）内容的存取。更多的信息请参考[21.10.5 “处理客户端文件上传的请求”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-multipart-forms-non-browsers "21.10.5 Handling a file upload request from programmatic clients")和[21.10 “Spring对多部分文件上传的支持”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-multipart "21.10 Spring's multipart \(file upload\) support")
* `HttpEntity<?>`类型的参数，其提供了对HTTP请求头和请求内容的存取。请求流是通过`HttpMessageConverter`被转换成entity对象的。详见[“HttpEntity”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-httpentity "Using HttpEntity")
* `java.util.Map`/`org.springframework.io.Model`/`org.springframework.ui.ModelMap`类型的参数，用以增强默认暴露给视图层的模型(model)的功能
* `org.springframework.web.servlet.mvc.support.RedirectAttributes`类型的参数，用以指定重定向下要使用到的属性集以及添加flash属性（暂存在服务端的属性，它们会在下次重定向请求的范围中有效）。详见[“向重定向请求传递参数”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-flash-attributes "21.6 Using flash attributes")
* 命令或表单对象，它们用于将请求参数直接绑定到bean字段（可能是通过setter方法）。你可以通过`@InitBinder`注解和/或`HanderAdapter`的配置来定制这个过程的类型转换。具体请参考`RequestMappingHandlerAdapter`类`webBindingInitializer`属性的文档。这样的命令对象，以及其上的验证结果，默认会被添加到模型model中，键名默认是该命令对象类的类名——比如，`some.package.OrderAddress`类型的命令对象就使用属性名`orderAddress`类获取。`ModelAttribute`注解可以应用在方法参数上，用以指定该模型所用的属性名
* `org.springframework.validation.Errors` / `org.springframework.validation.BindingResult`验证结果对象，用于存储前面的命令或表单对象的验证结果（紧接其前的第一个方法参数）。
* `org.springframework.web.bind.support.SessionStatus`对象，用以标记当前的表单处理已结束。这将触发一些清理操作：`@SessionAttributes`在类级别注解的属性将被移除
* `org.springframework.web.util.UriComponentsBuilder`构造器对象，用于构造当前请求URL相关的信息，比如主机名、端口号、资源类型（scheme）、上下文路径、servlet映射中的相对部分（literal part）等

在参数列表中，`Errors`或`BindingResult`参数必须紧跟在其所绑定的验证对象后面。这是因为，在参数列表中允许有多于一个的模型对象，Spring会为它们创建不同的`BindingResult`实例。因此，下面这样的代码是不能工作的：

__BindingResult与@ModelAttribute错误的参数次序__
```java
@RequestMapping(method = RequestMethod.POST)
public String processSubmit(@ModelAttribute("pet") Pet pet, Model model, BindingResult result) { ... }
```

上例中，因为在模型对象`Pet`和验证结果对象`BindingResult`中间还插了一个`Model`参数，这是不行的。要达到预期的效果，必须调整一下参数的次序：

```java
@RequestMapping(method = RequestMethod.POST)
public String processSubmit(@ModelAttribute("pet") Pet pet, BindingResult result, Model model) { ... }
```

> 对于一些带有`required`属性的注解（比如`@RequestParam`、`@RequestHeader`等），JDK 1.8的`java.util.Optional`可以作为被它们注解的方法参数。在这种情况下，使用`java.util.Optional`与`required=false`的作用是相同的。

## 支持的方法返回类型

以下是handler方法允许的所有返回类型：

* `ModelAndView`对象，其中model隐含填充了命令对象，以及注解了`@ModelAttribute`字段的存取器被调用所返回的值。
* `Model`对象，其中视图名称默认由`RequestToViewNameTranslator`决定，model隐含填充了命令对象以及注解了`@ModelAttribute`字段的存取器被调用所返回的值
* `Map`对象，用于暴露model，其中视图名称默认由`RequestToViewNameTranslator`决定，model隐含填充了命令对象以及注解了`@ModelAttribute`字段的存取器被调用所返回的值
* `View`对象。其中model隐含填充了命令对象，以及注解了`@ModelAttribute`字段的存取器被调用所返回的值。handler方法也可以增加一个`Model`类型的方法参数来增强model
* `String`对象，其值会被解析成一个逻辑视图名。其中，model将默认填充了命令对象以及注解了`@ModelAttribute`字段的存取器被调用所返回的值。handler方法也可以增加一个`Model`类型的方法参数来增强model
* `void`。如果处理器方法中已经对response响应数据进行了处理（比如在方法参数中定义一个`ServletResponse`或`HttpServletResponse`类型的参数并直接向其响应体中写东西），那么方法可以返回void。handler方法也可以增加一个`Model`类型的方法参数来增强model
* 如果处理器方法注解了`ResponseBody`，那么返回类型将被写到HTTP的响应体中，而返回值会被`HttpMessageConverters`转换成所方法声明的参数类型。详见[使用"@ResponseBody注解映射响应体"一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-responsebody "Mapping the response body with the @ResponseBody annotation)
* `HttpEntity<?>`或`ResponseEntity<?>`对象，用于提供对Servlet HTTP响应头和响应内容的存取。对象体会被`HttpMessageConverters`转换成响应流。详见[使用HttpEntity一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvn-ann-httpentity "Using Entity")
* `HttpHeaders`对象，返回一个不含响应体的response
* `Callable<?>`对象。当应用希望异步地返回方法值时使用，这个过程由Spring MVC自身的线程来管理
* `DeferredResult<?>`对象。当应用希望方法的返回值交由线程自身决定时使用
* `ListenableFuture<?>`对象。当应用希望方法的返回值交由线程自身决定时使用
* `ResponseBodyEmitter`对象，可用它异步地向响应体中同时写多个对象，also supported as the body within a `ResponseEntity`
* `SseEmitter`对象，可用它异步地向响应体中写服务器端事件（Server-Sent Events）,also supported as the body within a `ResponseEntity`
* `StreamingResponseBody`对象，可用它异步地向响应对象的输出流中写东西。also supported as the body within a `ResponseEntity`
* 其他任何返回类型，都会被处理成model的一个属性并返回给视图，该属性的名称为方法级的`@ModelAttribute`所注解的字段名（或者以返回类型的类名作为默认的属性名）。model隐含填充了命令对象以及注解了`@ModelAttribute`字段的存取器被调用所返回的值


## 使用@RequestParam将请求参数绑定至方法参数

你可以使用`@RequestParam`注解将请求参数绑定到你控制器的方法参数上。

下面这段代码展示了它的用法：

```java
@Controller
@RequestMapping("/pets")
@SessionAttributes("pet")
public class EditPetForm {
    // ...
    @RequestMapping(method = RequestMapping.GET)
    public String setupForm(@RequestParam("petId") int petId, ModelMap model) {
        Pet pet = this.clinic.loadPet(petId);
        model.addAttribute("pet", pet);
        return "petForm";
    }

    // ,..
}
```

若参数使用了该注解，则该参数默认是必须提供的，但你也可以把该参数标注为非必须的：只需要将`@RequestParam`注解的`required`属性设置为`false`即可（比如，`@RequestParam(path="id", required=false)`）。

若所注解的方法参数类型不是`String`，则类型转换会自动地发生。详见["方法参数与类型转换"一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-typeconversion "Method Parameters And Type
Conversion")

若`@RequestParam`注解的参数类型是`Map<String, String>`或者`MultiValueMap<String, String>`，则该Map中会自动填充所有的请求参数。

## 使用@RequestBody注解映射请求体

方法参数中的`@RequestBody`注解暗示了方法参数应该被绑定了HTTP请求体的值。举个例子：

```java
@RequestMapping(path = "/something", method = RequestMethod.PUT)
public void handle(@RequestBody String body, Writer writer) throws IOException {
    writer.write(body);
}
```

请求体到方法参数的转换是由`HttpMessageConverter`完成的。`HttpMessageConverter`负责将HTTP请求信息转换成对象，以及将对象转换回一个HTTP响应体。对于`@RequestBody`注解，`RequestMappingHandlerAdapter`提供了以下几种默认的`HttpMessageConverter`支持：

* `ByteArrayHttpMessageConverter`用以转换字节数组
* `StringHttpMessageConverter`用以转换字符串
* `FormHttpMessageConverter`用以将表格数据转换成`MultiValueMap<String, String>`或从`MultiValueMap<String, String>`中转换出表格数据
* `SourceHttpMessageConverter`用于`javax.xml.transform.Source`类的互相转换

关于这些转换器的更多信息，请参考["HTTP信息转换器"一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/remoting.html#rest-message-conversion "27.10.2 HTTP Message Conversion")。另外，如果使用的是MVC命名空间或Java编程的配置方式，会有更多默认注册的消息转换器。更多信息，請參考["启用MVC Java编程配置或MVC XML命令空间配置"一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-config-enable "21.16.1 Enabling the MVC Java Config or the MVC XML Namespace")。

若你更倾向于阅读和编写XML文件，那么你需要配置一个`MarshallingHttpMessageConverter`并为其提供`org.springframework.oxm`包下的一个`Marshaller`和`Unmarshaller`实现。下面的示例就为你展示如何直接在配置文件中配置它。但如果你的应用是使用MVC命令空间或MVC Java编程的方式进行配置的，则请参考["启用MVC Java编程配置或MVC XML命令空间配置"这一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-config-enable "21.16.1 Enabling the MVC Java Config or the MVC XML Namespace")。

```xml
<bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
    <property name="messageConverters">
        <util:list id="beanList">
            <ref bean="stringHttpMessageConverter"/>
            <ref bean="marshallingHttpMessageConverter"/>
        </util:list>
    </property
</bean>

<bean id="stringHttpMessageConverter" class="org.springframework.http.converter.StringHttpMessageConverter"/>

<bean id="marshallingHttpMessageConverter"
        class="org.springframework.http.converter.xml.MarshallingHttpMessageConverter">
    <property name="marshaller" ref="castorMarshaller"/>
    <property name="unmarshaller" ref="castorMarshaller"/>
</bean>

<bean id="castorMarshaller" class="org.springframework.oxm.castor.CastorMarshaller"/>    
```

注解了`@RequestBody`的方法参数还可以被`@Valid`注解，这样框架会使用已配置的`Validator`实例来对该参数进行验证。若你的应用是使用MVC命令空间或MVC Java编程的方式配置的，框架会假设在classpath路径下存在一个符合JSR-303规范的验证器，并自动将其作为默认配置。

与`@ModelAttribute`注解的参数一样，`Errors`也可以被传入为方法参数，用于检查错误。如果没有声明这样一个参数，那么程序会抛出一个`MethodArgumentNotValidException`异常。该异常默认由`DefaultHandlerExceptionResolver`处理，处理程序会返回一个`400`错误给客户端。

> 关于如何通过MVC命令空间或MVC Java编程的方式配置消息转换器和验证器，也请参考["启用MVC Java编程配置或MVC XML命令空间配置"一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-config-enable "21.16.1 Enabling the MVC Java Config or the MVC XML Namespace")。

## 使用@ResponseBody注解映射响应体

`@ResponseBody`注解与`@RequestBody`注解类似。`@ResponseBody`注解可被应用于方法上，标志该方法的返回值（更正，原文是return type，看起来应该是返回值）应该被直接写回到HTTP响应体中去（而不会被被放置到Model中或被解释为一个视图名）。举个例子：

```java
@RequestMapping(path = "/something", method = RequestMethod.PUT)
@ResponseBody
public String helloWorld() {
    return "Hello World"
}
```

上面的代码结果是文本`Hello World`将被写入HTTP的响应流中。

与`@RequestBody`注解类似，Spring使用了一个`HttpMessageConverter`来将返回对象转换到响应体中。关于这些转换器的更多信息，请参考["HTTP信息转换器"一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/remoting.html#rest-message-conversion "27.10.2 HTTP Message Conversion")。

## 使用@RestController注解创建REST控制器

当今让控制器实现一个REST API是非常常见的，这种场景下控制器只需要提供JSON、XML或其他自定义的媒体类型内容即可。你不需要在每个`@RequestMapping`方法上都增加一个`@ResponseBody`注解，更简明的做法是，给你的控制器加上一个`@RestController`的注解。

[`@RestController`](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE
/javadoc-api/org/springframework/web/bind/annotation/RestController.html)是一个原生内置的注解，它结合了`@ResponseBody`与`@Controller`注解的功能。不仅如此，它也让你的控制器更表义，而且在框架未来的发布版本中，它也可能承载更多的意义。

与普通的`@Controller`无异，`@RestController`也可以与`@ControllerAdvice`bean配合使用。更多细节，请见[使用@ControllerAdvice辅助控制器](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-controller-advice "Advising controllers with @ControllerAdvice")。


## 使用HTTP实体HttpEntity

`HttpEntity`与`@RequestBody`和`@ResponseBody`很相似。除了能获得请求体和响应体中的内容之外，`HttpEntity`（以及专门负责处理响应的`ResponseEntity`子类）还可以存取请求头和响应头，像下面这样：

```java
@RequestMapping("/something")
public ResponseEntity<String> handle(HttpEntity<byte[]> requestEntity) throws UnsupportedEncodingException {
    String requestHeader = requestEntity.getHeaders().getFirst("MyRequestHeader"));
    byte[] requestBody = requestEntity.getBody();

    // do something with request header and body

    HttpHeaders responseHeaders = new HttpHeaders();
    responseHeaders.set("MyResponseHeader", "MyValue");
    return new ResponseEntity<String>("Hello World", responseHeaders, HttpStatus.CREATED);
}
```

上面这段示例代码先是获取了`MyRequestHeader`请求头的值，然后读取请求体的主体内容。读完以后往影响头中添加了一个自己的响应头`MyResponseHeader`，然后向响应流中写了字符串`Hello World`，最后把响应状态码设置为201（创建成功）。

与`@RequestBody`与`@ResponseBody`注解一样，Spring使用了`HttpMessageConverter`来对请求流和响应流进行转换。关于这些转换器的更多信息，请阅读上一小节以及["HTTP信息转换器"这一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/remoting.html#rest-message-conversion "27.10.2 HTTP Message Conversion")。
