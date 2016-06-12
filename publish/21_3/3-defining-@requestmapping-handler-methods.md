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


## 对方法使用@ModelAttribute注解

`@ModelAttribute`注解可被应用在方法或方法参数上。本节将介绍其被注解于方法上时的用法，下节会介绍其被用于注解方法参数的用法。

注解在方法上的`@ModelAttribute`说明了方法的作用是用于添加一个或多个属性到model上。这样的方法能接受与`@RequestMapping`注解相同的参数类型，只不过不能直接被映射到具体的请求上。在同一个控制器中，注解了`@ModelAttribute`的方法实际上会在`@RequestMapping`方法之前被调用。以下是几个例子：

```java
// Add one attribute
// The return value of the method is added to the model under the name "account"
// You can customize the name via @ModelAttribute("myAccount")

@ModelAttribute
public Account addAccount(@RequestParam String number) {
    return accountManager.findAccount(number);
}

// Add multiple attributes

@ModelAttribute
public void populateModel(@RequestParam String number, Model model) {
    model.addAttribute(accountManager.findAccount(number));
    // add more ...
}
```

`@ModelAttribute`方法通常被用来填充一些公共需要的属性或数据，比如一个下拉列表所预设的几种状态，或者宠物的几种类型，或者去取得一个HTML表单渲染所需要的命令对象，比如`Account`等。

留意`@ModelAttribute`方法的两种风格。在第一种写法中，方法通过返回值的方式默认地将添加一个属性；在第二种写法中，方法接收一个`Model`对象，然后可以向其中添加任意数量的属性。你可以在根据需要，在两种风格中选择合适的一种。

一个控制器可以拥有数量不限的`@ModelAttribute`方法。同个控制器内的所有这些方法，都会在`@RequestMapping`方法之前被调用。

`@ModelAttribute`方法也可以定义在`@ControllerAdvice`注解的类中，并且这些`@ModelAttribute`可以同时对许多控制器生效。具体的信息可以参考[使用@ControllerAdvice辅助控制器](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-controller-advice "Advising controllers with @ControllerAdvice")。

> 属性名没有被显式指定的时候又当如何呢？在这种情况下，框架将根据属性的类型给予一个默认名称。举个例子，若方法返回一个`Account`类型的对象，则默认的属性名为"account"。你可以通过设置`@ModelAttribute`注解的值来改变默认值。当向`Model`中直接添加属性时，请使用合适的重载方法`addAttribute(..)`-即，带或不带属性名的方法。

`@ModelAttribute`注解也可以被用在`@RequestMapping`方法上。这种情况下，`@RequestMapping`方法的返回值将会被解释为model的一个属性，而非一个视图名。此时视图名将以视图命名约定来方式来决议，与返回值为void的方法所采用的处理方法类似——请见[视图：请求与视图名的对应](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-coc-r2vnt "21.13.3 The View - RequestToViewNameTranslator")。


## 在方法参数上使用@ModelAttribute注解

如上一小节所解释，`@ModelAttribute`注解既可以被用在方法上，也可以被用在方法参数上。这一小节将介绍它注解在方法参数上时的用法。

注解在方法参数上的`@ModelAttribute`说明了该方法参数的值将由model中取得。如果model中找不到，那么该参数会先被实例化，然后被添加到model中。在model中存在以后，请求中所有名称匹配的参数都会填充到该参数中。这在Spring MVC中被称为数据绑定，一个非常有用的特性，节约了你每次都需要手动从表格数据中转换这些字段数据的时间。

```java
@RequestMapping(path = "/owners/{ownerId}/pets/{petId}/edit", method = RequestMethod.POST)
public String processSubmit(@ModelAttribute Pet pet) { }
```

以上面的代码为例，这个Pet类型的实例可能来自哪里呢？有几种可能:

* 它可能因为`@SessionAttributes`注解的使用已经存在于model中——详见["在请求之间使用@SessionAttributes注解，使用HTTP会话保存模型数据"一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-sessionattrib "Using @SessionAttributes to store model attributes in the HTTP Session between requests")
* 它可能因为在同个控制器中使用了`@ModelAttribute`方法已经存在于model中——正如上一小节所叙述的
* 它可能是由URI模板变量和类型转换中取得的（下面会详细讲解）
* 它可能是调用了自身的默认构造器被实例化出来的

`@ModelAttribute`方法常用于从数据库中取一个属性值，该值可能通过`@SessionAttributes`注解在请求中间传递。在一些情况下，使用URI模板变量和类型转换的方式来取得一个属性是更方便的方式。这里有个例子：

```java
@RequestMapping(path = "/accounts/{account}", method = RequestMethod.PUT)
public String save(@ModelAttribute("account") Account account) {

}

```

上面这个例子中，model属性的名称（"account"）与URI模板变量的名称相匹配。如果你配置了一个可以将`String`类型的账户值转换成`Account`类型实例的转换器`Converter<String, Account>`，那么上面这段代码就可以工作的很好，而不需要再额外写一个`@ModelAttribute`方法。

下一步就是数据的绑定。`WebDataBinder`类能将请求参数——包括字符串的查询参数和表单字段等——通过名称匹配到model的属性上。成功匹配的字段在需要的时候会进行一次类型转换（从String类型到目标字段的类型），然后被填充到model对应的属性中。数据绑定和数据验证的问题在[第8章 _验证，数据绑定和类型转换_](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/validation.html "8. Validation, Data Binding, and Type Conversion")中提到。如何在控制器层来定制数据绑定的过程，在[这一节 "定制WebDataBinder的初始化"](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-webdatabinder "Customizing WebDataBinder initialization")中提及。

进行了数据绑定后，则可能会出现一些错误，比如没有提供必须的字段、类型转换过程的错误等。若想检查这些错误，可以在注解了`@ModelAttribute`的参数紧跟着声明一个`BindingResult`参数：

```java
@RequestMapping(path = "/owners/{ownerId}/pets/{petId}/edit", method = RequestMethod.POST)
public String processSubmit(@ModelAttribute("pet") Pet pet, BindingResult result) {
    if (result.hasErrors()) {
        return "petForm";
    }

    // ...

}
```

拿到`BindingResult`参数后，你可以检查是否有错误。有时你可以通过Spring的`<errors>`表单标签来在同一个表单上显示错误信息。

`BindingResult`被用于记录数据绑定过程的错误，因此除了数据绑定外，你还可以把该对象传给自己定制的验证器来调用验证。这使得数据绑定过程和验证过程出现的错误可以被搜集到一处，然后一并返回给用户：

```java
@RequestMapping(path = "/owners/{ownerId}/pets/{petId}/edit", method = RequestMethod.POST)
public String processSubmit(@ModelAttribute("pet") Pet pet, BindingResult result) {

    new PetValidator().validate(pet, result);
    if (result.hasErrors()) {
        return "petForm";
    }

    // ...

}
```

又或者，你可以通过添加一个JSR-303规范的`@Valid`注解，这样验证器会自动被调用。


```java
@RequestMapping(path = "/owners/{ownerId}/pets/{petId}/edit", method = RequestMethod.POST)
public String processSubmit(@Valid @ModelAttribute("pet") Pet pet, BindingResult result) {

    if (result.hasErrors()) {
        return "petForm";
    }

    // ...

}
```

关于如何配置并使用验证，可以参考[第8.8小节 "Spring验证"](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/validation.html#validation-beanvalidation "8.8 Spring Validation")和[第8章 _验证，数据绑定和类型转换_](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/validation.html "8. Validation, Data Binding, and Type Conversion")。


## 在请求之间使用@SessionAttributes注解，使用HTTP会话保存模型数据

类型级别的`@SessionAttributes`注解声明了某个特定处理器所使用的会话属性。通常它会列出该类型希望存储到session或converstaion中的model属性名或model的类型名，一般是用于在请求之间保存一些表单数据的bean。

以下的代码段演示了该注解的用法，它指定了模型属性的名称

```java
@Controller
@RequestMapping("/editPet.do")
@SessionAttributes("pet")
public class EditPetForm {
    // ...
}
```

## 使用"application/x-www-form-urlencoded"数据

上一小节讲述了如何使用`@ModelAttribute`支持客户端浏览器的多次表单提交请求。对于不是使用的浏览器的客户端，我们也推荐使用这个注解来处理请求。但当请求是一个HTTP PUT方法的请求时，有一个事情需要注意。浏览器可以通过HTTP的GET方法或POST方法来提交表单数据，非浏览器的客户端还可以通过HTTP的PUT方法来提交表单。这就设计是个挑战，因为在Servlet规范中明确规定，`ServletRequest.getParameter*()`系列的方法只能支持通过HTTP POST方法的方式提交表单，而不支持HTTP PUT的方式。

为了支持HTTP的PUT类型和PATCH类型的请求，Spring的`spring-web`模块提供了一个过滤器`HttpPutFormContentFilter`。你可以在`web.xml`文件中配置它：

```xml
    <filter>
        <filter-name>httpPutFormFilter</filter-name>
        <filter-class>org.springframework.web.filter.HttpPutFormContentFilter</filter-class>
    </filter>

    <filter-mapping>
        <filter-name>httpPutFormFilter</filter-name>
        <servlet-name>dispatcherServlet</servlet-name>
    </filter-mapping>

    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    </servlet>
```

上面的过滤器将会拦截内容类型(content type)为`application/x-www-form-urlencoded`、HTTP方法为PUT或PATCH类型的请求，然后从请求体中读取表单数据，把它们包装在`ServletRequest`中。这是为了使表单数据能够通过`ServletRequest.getParameter*()`系列的方法来拿到。

> 因为`HttpPutFormContentFilter`会消费请求体的内容，因此，它不应该用于处理那些依赖于其他`application/x-www-form-urlencoded`转换器的PUT和PATCH请求，这包括了`@RequestBodyMultiValueMap<String, String>`和`HttpEntity<MultiValueMap<String, String>>`。


## 使用@CookieValue注解映射cookie值

`@CookieValue`注解能将一个方法参数与一个HTTP cookie的值进行绑定。

看一个这样的场景：以下的这个cookie存储在一个HTTP请求中：

```
JSESSIONID=415A4AC178C59DACE0B2C9CA727CDD84
```

下面的代码演示了拿到`JSESSIONID`这个cookie值的方法：

```java
@RequestMapping("/displayHeaderInfo.do")
public void displayHeaderInfo(@CookieValue("JSESSIONID") String cookie) {
    //...
}
```

若注解的目标方法参数不是`String`类型，则类型转换会自动进行。详见["方法参数与类型转换"](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-typeconversion "Method Parameters And Type Conversion")一节。

这个注解可以注解到处理器方法上，在Servlet环境和Portlet环境都能使用。


## 使用`@RequestHeader`注解映射请求头属性

`@RequestHeader`注解能将一个方法参数与一个请求头属性进行绑定。

以下是一个请求头的例子：

```
    Host                    localhost:8080
    Accept                  text/html,application/xhtml+xml,application/xml;q=0.9
    Accept-Language         fr,en-gb;q=0.7,en;q=0.3
    Accept-Encoding         gzip,deflate
    Accept-Charset          ISO-8859-1,utf-8;q=0.7,*;q=0.7
    Keep-Alive              300
```

以下的代码片段展示了如何取得`Accept-Encoding`请求头和`Keep-Alive`请求头的值：


```java
@RequestMapping("/displayHeaderInfo.do")
public void displayHeaderInfo(@RequestHeader("Accept-Encoding") String encoding,
        @RequestHeader("Keep-Alive") long keepAlive) {
    //...
}
```

若注解的目标方法参数不是`String`类型，则类型转换会自动进行。["方法参数与类型转换"](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-typeconversion "Method Parameters And Type Conversion")一节。

如果`@RequestHeader`注解应用在`Map<String, String>`、`MultiValueMap<String, String>`或`HttpHeaders`类型的参数上，那么所有的请求头属性值都会被填充到map中。

> Spring内置支持将一个逗号分隔的字符串（或其他类型转换系统所能识别的类型）转换成一个String类型的列表/集合。举个例子，一个注解了`@RequestHeader("Accept")`的方法参数可以是一个`String`类型，但也可以是`String[]`或`List<String>`类型的。

这个注解可以注解到处理器方法上，在Servlet环境和Portlet环境都能使用。


## 方法参数与类型转换

从请求参数、路径变量、请求头属性或者cookie中抽取出来的`String`类型的值，可能需要被转换成其所绑定的目标方法参数或字段的类型（比如，通过`@ModelAttribute`将请求参数绑定到方法参数上）。如果目标类型不是`String`，Spring会自动进行类型转换。所有的简单类型诸如int、long、Date都有内置的支持。如果想进一步定制这个转换过程，你可以通过`WebDataBinder`（详见["定制WebDataBinder的初始化"](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-webdatabinder "Customizing WebDataBinder initialization")一节），或者为`Formatters`配置一个`FormattingConversionService`（详见[8.6节 "Spring字段格式化"](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/validation.html#format "8.6 Spring Field Formatting")一节）来做到。


## 定制WebDataBinder的初始化

如果想通过Spring的`WebDataBinder`在属性编辑器中做请求参数的绑定，你可以使用在控制器内使用`@InitBinder`注解的方法、在注解了`@ControllerAdvice`的类中使用`@InitBinder`注解的方法，或者提供一个定制的`WebBindingInitializer`。更多的细节，请参考[使用@ControllerAdvice辅助控制器](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-controller-advice "Advising controllers with @ControllerAdvice")一节。


### 数据绑定的定制：使用@InitBinder

使用`@InitBinder`注解控制器的方法，你可以直接在你的控制器类中定制应用的数据绑定。`@InitBinder`用来标记一些方法，这些方法会初始化一个`WebDataBinder`并用以为处理器方法填充命令对象和表单对象的参数。

除了命令/表单对象以及相应的验证结果对象，这样的“绑定器初始化”方法能够接收`@RequestMapping`所支持的所有参数类型。“绑定器初始化”方法不能有返回值，因此，一般将它们声明为`void`返回类型。特别地，当`WebDataBinder`与`WebRequest`或`java.util.Locale`一起作为方法参数时，你可以在代码中注册上下文相关的编辑器。

下面的代码示例演示了如何使用`@InitBinder`来配置一个`CustomerDateEditor`，后者会对所有`java.util.Date`类型的表单字段进行操作：


```java
@Controller
public class MyFormController {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, false));
    }

    // ...
}
```

或者，你可以使用Spring 4.2提供的`addCustomFormatter`来指定`Formatter`的实现，而非通过`PropertyEditor`实例。这在你拥有一个需要`Formatter`的setup方法，并且该方法位于一个共享的`FormattingConversionService`中时非常有用。这样对于控制器级别的绑定规则的定制，代码更容易被复用。

```java
@Controller
public class MyFormController {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.addCustomFormatter(new DateFormatter("yyyy-MM-dd"));
    }

    // ...
}
```

### 配置定制的WebBindingInitializer

为了externalize数据绑定的初始化过程，你可以为`WebBindingInitializer`接口提供一个自己的实现，在其中你可以为`AnnotationMethodHandlerAdapter`提供一个默认的配置bean，以此来覆写默认的配置。

以下的代码来自PetClinic的应用，它展示了为`WebBindingInitializer`接口提供一个自定义实现：`org.springframework.samples.petclinic.web.ClinicBindingInitializer`完整的配置过程。后者中配置了PetClinic应用中许多控制器所需要的属性编辑器PropertyEditors。

```xml
<bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
    <property name="cacheSeconds" value="0"/>
    <property name="webBindingInitializer">
        <bean class="org.springframework.samples.petclinic.web.ClinicBindingInitializer"/>
    </property>
</bean>
```

`@InitBinder`方法也可以定义在`@ControllerAdvice`注解的类上，这样配置可以为许多控制器所共享。这提供了除使用`WebBindingInitializer`外的另外一种方法。更多细节请参考[使用@ControllerAdvice辅助控制器](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-controller-advice "Advising controllers with @ControllerAdvice")一节。


## 使用@ControllerAdvice辅助控制器

`@ControllerAdvice`是一个组件注解，它使得其实现类能够被classpath扫描自动发现。若应用是通过MVC命令空间或MVC Java编程方式配置，那么该特性默认是自动开启的。

注解`@ControllerAdvice`的类可以拥有`@ExceptionHandler`、`@InitBinder`或`@ModelAttribute`注解的方法，并且这些方法会被应用至控制器类层次??的所有`@RequestMapping`方法上。

你也可以通过`@ControllerAdvice`的属性来指定其只对一个子集的控制器生效：

```java
// Target all Controllers annotated with @RestController
@ControllerAdvice(annotations = RestController.class)
public class AnnotationAdvice {}

// Target all Controllers within specific packages
@ControllerAdvice("org.example.controllers")
public class BasePackageAdvice {}

// Target all Controllers assignable to specific classes
@ControllerAdvice(assignableTypes = {ControllerInterface.class, AbstractController.class})
public class AssignableTypesAdvice {}
```

更多的细节，请查阅[`@ControllerAdvice`的文档](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/javadoc-api/org/springframework/web/bind/annotation/ControllerAdvice.html)。
