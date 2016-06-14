# 21.3.4 异步请求的处理

Spring MVC 3.2开始引入了基于Servlet 3的异步请求处理。相比以前，控制器方法已经不一定需要返回一个值，而是可以返回一个`java.util.concurrent.Callable`的对象，并通过Spring MVC所管理的线程来产生返回值。与此同时，Servlet容器的主线程则可以退出并释放其资源了，同时也允许容器去处理其他的请求。通过一个`TaskExecutor`，Spring MVC可以在另外的线程中调用`Callable`。当`Callable`返回时，请求再携带`Callable`返回的值，再次被分配到Servlet容器中恢复处理流程。以下代码给出了一个这样的控制器方法作为例子：

```java
@RequestMapping(method=RequestMethod.POST)
public Callable<String> processUpload(final MultipartFile file) {

    return new Callable<String>() {
        public String call() throws Exception {
            // ...
            return "someView";
        }
    };

}
```

另一个选择，是让控制器方法返回一个`DeferredResult`的实例。这种场景下，返回值可以由任何一个线程产生，也包括那些不是由Spring MVC管理的线程。举个例子，返回值可能是为了响应某些外部事件所产生的，比如一条JMS的消息，一个计划任务，等等。以下代码给出了一个这样的控制器作为例子：

```java
@RequestMapping("/quotes")
@ResponseBody
public DeferredResult<String> quotes() {
    DeferredResult<String> deferredResult = new DeferredResult<String>();
    // Save the deferredResult somewhere..
    return deferredResult;
}

// In some other thread...
deferredResult.setResult(data);
```

如果对Servlet 3.0的异步请求处理特性没有了解，理解这个特性可能会有点困难。因此，阅读一下前者的文档将会很有帮助。以下给出了这个机制运作背后的一些原理：

* 一个servlet请求`ServletRequest`可以通过调用`request.startAsync()`方法而进入异步模式。这样做的主要结果就是该servlet以及所有的过滤器都可以结束，但其响应（response）会留待异步处理结束后再返回
* 调用`request.startAsync()`方法会返回一个`AsyncContext`对象，可用它对异步处理进行进一步的控制和操作。比如说它也提供了一个与转向（forward）很相似的`dispatch`方法，只不过它允许应用恢复Servlet容器的请求处理进程
* `ServletRequest`提供了获取当前`DispatherType`的方式，后者可以用来区别当前处理的是原始请求、异步分发请求、转向，或是其他类型的请求分发类型。

有了上面的知识，下面可以来看一下`Callable`的异步请求被处理时所依次发生的事件：

* 控制器先返回一个`Callable`对象
* Spring MVC开始进行异步处理，并把该`Callable`对象提交给另一个独立线程的执行器`TaskExecutor`处理
* `DispatcherServlet`和所有过滤器都退出Servlet容器线程，但此时方法的响应对象仍未返回
* `Callable`对象最终产生一个返回结果，此时Spring MVC会重新把请求分派回Servlet容器，恢复处理
* `DispatcherServlet`再次被调用，恢复对`Callable`异步处理所返回结果的处理

对`DeferredResult`异步请求的处理顺序也非常类似，区别仅在于应用可以通过任何线程来计算返回一个结果：

* 控制器先返回一个`DeferredResult`对象，并把它存取在内存（队列或列表等）中以便存取
* Spring MVC开始进行异步处理
* `DispatcherServlet`和所有过滤器都退出Servlet容器线程，但此时方法的响应对象仍未返回
* 由处理该请求的线程对 `DeferredResult`进行设值，然后Spring MVC会重新把请求分派回Servlet容器，恢复处理
* `DispatcherServlet`再次被调用，恢复对该异步返回结果的处理

关于引入异步请求处理的背景和原因，以及什么时候使用它、为什么使用异步请求处理等问题，你可以从[这个系列的博客](https://spring.io/blog/2012/05/07/spring-mvc-3-2-preview-introducing-servlet-3-async-support)中了解更多信息。

## 异步请求的异常处理

若控制器返回的`Callable`在执行过程中抛出了异常，又会发生什么事情？简单来说，这与一般的控制器方法抛出异常是一样的。它会被正常的异常处理流程捕获处理。更具体地说呢，当`Callable`抛出异常时，Spring MVC会把一个`Exception`对象分派给Servlet容器进行处理，而不是正常返回方法的返回值，然后容器恢复对此异步请求异常的处理。若方法返回的是一个`DeferredResult`对象，你可以选择调`Exception`实例的`setResult`方法还是`setErrorResult`方法。

## 拦截异步请求

处理器拦截器`HandlerInterceptor`可以实现`AsyncHandlerInterceptor`接口拦截异步请求，因为在异步请求开始时，被调用的回调方法是该接口的`afterConcurrentHandlingStarted`方法，而非一般的`postHandle`和`afterCompletion`方法。

如果需要与异步请求处理的生命流程有更深入的集成，比如需要处理timeout的事件等，则`HandlerInterceptor`需要注册一个`CallableProcessingInterceptor`或`DeferredResultProcessingInterceptor`拦截器。具体的细节可以参考`AsyncHandlerInterceptor`类的Java文档。

`DeferredResult`类还提供了`onTimeout(Runnable)`和`onCompletion(Runnable)`等方法，具体的细节可以参考`DeferredResult`类的Java文档。

`Callable`需要请求过期(timeout)和完成后的拦截时，可以把它包装在一个`WebAsyncTask`实例中，后者提供了相关的支持。

## HTTP streaming(不知道怎么翻)

如前所述，控制器可以使用`DeferredResult`或`Callable`对象来异步地计算其返回值，这可以用于实现一些有用的技术，比如 [long polling](http://spring.io/blog/2012/05/08/spring-mvc-3-2-preview-techniques-for-real-time-updates/)技术，让服务器可以尽可能快地向客户端推送事件。

如果你想在一个HTTP响应中同时推送多个事件，怎么办？这样的技术已经存在，与"Long Polling"相关，叫"HTTP Streaming"。Spring MVC支持这项技术，你可以通过让方法返回一个`ResponseBodyEmitter`类型对象来实现，该对象可被用于发送多个对象。通常我们所使用的`@ResponseBody`只能返回一个对象，它是通过`HttpMessageConverter`写到响应体中的。

下面是一个实现该技术的例子：

```java
@RequestMapping("/events")
public ResponseBodyEmitter handle() {
    ResponseBodyEmitter emitter = new ResponseBodyEmitter();
    // Save the emitter somewhere..
    return emitter;
}

// In some other thread
emitter.send("Hello once");

// and again later on
emitter.send("Hello again");

// and done at some point
emitter.complete();
```

`ResponseBodyEmitter`也可以被放到`ResponseEntity`体里面使用，这可以对响应状态和响应头做一些定制。

Note that `ResponseBodyEmitter` can also be used as the body in a
`ResponseEntity` in order to customize the status and headers of the response.


## 使用“服务器端事件推送”的HTTP Streaming

`SseEmitter`是`ResponseBodyEmitter`的一个子类，提供了对[服务器端事件推送](http://www.w3.org/TR/eventsource/)的技术的支持。服务器端事件推送其实只是一种HTTP Streaming的类似实现，只不过它服务器端所推送的事件遵循了W3C Server-Sent Events规范中定义的事件格式。

“服务器端事件推送”技术正如其名，是用于由服务器端向客户端进行的事件推送。这在Spring MVC中很容易做到，只需要方法返回一个`SseEmitter`类型的对象即可。

需要注意的是，Internet Explorer并不支持这项服务器端事件推送的技术。另外，对于更大型的web应用及更精致的消息传输场景——比如在线游戏、在线协作、金融应用等——来说，使用Spring的WebSocket（包含SockJS风格的实时WebSocket）更成熟一些，因为它支持的浏览器范围非常广（包括IE），并且，对于一个以消息为中心的架构中，它为服务器端-客户端间的事件发布-订阅模型的交互提供了更高层级的消息模式（messaging patterns）的支持。


## 直接写回输出流OutputStream的HTTP Streaming

`ResponseBodyEmitter`也允许通过`HttpMessageConverter`向响应体中支持写事件对象。这可能是最常见的情形，比如写返回的JSON数据的时候。但有时，跳过消息转换的阶段，直接把数据写回响应的输出流`OutputStream`可能更有效，比如文件下载这样的场景。这可以通过返回一个`StreamingResponseBody`类型的对象来实现。

以下是一个实现的例子：

```java
@RequestMapping("/download")
public StreamingResponseBody handle() {
    return new StreamingResponseBody() {
        @Override
        public void writeTo(OutputStream outputStream) throws IOException {
            // write...
        }
    };
}
```

`ResponseBodyEmitter`也可以被放到`ResponseEntity`体里面使用，这可以对响应状态和响应头做一些定制。

## 异步请求处理的相关配置

### Servlet容器配置

对于那些使用`web.xml`配置文件的应用，请确保`web.xml`的版本更新到3.0：

```xml
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance http://java.sun.com/xml/ns/javaee
                    http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0">

    ...

</web-app>
```

异步请求必须在`web.xml`将`DispatcherServlet`下的子元素`<async-supported>true</async-supported>`设置为true。此外，所有可能参与异步请求处理的过滤器`Filter`都必须配置为支持ASYNC类型的请求分派。在Spring框架中为过滤器启用支持ASYNC类型的请求分派应是安全的，因为这些过滤器一般都继承了基类`OncePerRequestFilter`，后者在运行时会检查该过滤器是否需要参与到异步分派的请求处理中。

以下是一个例子，展示了`web.xml`的配置：

```xml
    <web-app xmlns="http://java.sun.com/xml/ns/javaee"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="
                http://java.sun.com/xml/ns/javaee
                http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
        version="3.0">

        <filter>
            <filter-name>Spring OpenEntityManagerInViewFilter</filter-name>
            <filter-class>org.springframework.~.OpenEntityManagerInViewFilter</filter-class>
            <async-supported>true</async-supported>
        </filter>

        <filter-mapping>
            <filter-name>Spring OpenEntityManagerInViewFilter</filter-name>
            <url-pattern>/*</url-pattern>
            <dispatcher>REQUEST</dispatcher>
            <dispatcher>ASYNC</dispatcher>
        </filter-mapping>

    </web-app>
```

如果应用使用的是Servlet 3规范基于Java编程的配置方式，比如通过`WebApplicationInitializer`，那么你也需要设置"asyncSupported"标志和ASYNC分派类型的支持，就像你在`web.xml`中所配置的一样。你可以考虑直接继承`AbstractDispatcherServletInitializer`或`AbstractAnnotationConfigDispatcherServletInitializer`来简化配置，它们都自动地为你设置了这些配置项，并使得注册`Filter`过滤器实例变得非常简单。


##### Spring MVC Configuration

The MVC Java config and the MVC namespace provide options for configuring
asynchronous request processing. `WebMvcConfigurer` has the method
`configureAsyncSupport` while `<mvc:annotation-driven>` has an `<async-
support>` sub-element.

Those allow you to configure the default timeout value to use for async
requests, which if not set depends on the underlying Servlet container (e.g.
10 seconds on Tomcat). You can also configure an `AsyncTaskExecutor` to use
for executing `Callable` instances returned from controller methods. It is
highly recommended to configure this property since by default Spring MVC uses
`SimpleAsyncTaskExecutor`. The MVC Java config and the MVC namespace also
allow you to register `CallableProcessingInterceptor` and
`DeferredResultProcessingInterceptor` instances.

If you need to override the default timeout value for a specific
`DeferredResult`, you can do so by using the appropriate class constructor.
Similarly, for a `Callable`, you can wrap it in a `WebAsyncTask` and use the
appropriate class constructor to customize the timeout value. The class
constructor of `WebAsyncTask` also allows providing an `AsyncTaskExecutor`.
