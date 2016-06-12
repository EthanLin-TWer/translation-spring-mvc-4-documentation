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


With the above in mind, the following is the sequence of events for async
request processing with a `Callable`:

  * Controller returns a `Callable`.
  * Spring MVC starts asynchronous processing and submits the `Callable` to a `TaskExecutor` for processing in a separate thread.
  * The `DispatcherServlet` and all Filter's exit the Servlet container thread but the response remains open.
  * The `Callable` produces a result and Spring MVC dispatches the request back to the Servlet container to resume processing.
  * The `DispatcherServlet` is invoked again and processing resumes with the asynchronously produced result from the `Callable`.

The sequence for `DeferredResult` is very similar except it's up to the
application to produce the asynchronous result from any thread:

  * Controller returns a `DeferredResult` and saves it in some in-memory queue or list where it can be accessed.
  * Spring MVC starts async processing.
  * The `DispatcherServlet` and all configured Filter's exit the request processing thread but the response remains open.
  * The application sets the `DeferredResult` from some thread and Spring MVC dispatches the request back to the Servlet container.
  * The `DispatcherServlet` is invoked again and processing resumes with the asynchronously produced result.

For further background on the motivation for async request processing and when
or why to use it please read [this blog post
series](https://spring.io/blog/2012/05/07/spring-mvc-3-2-preview-introducing-
servlet-3-async-support).

#### Exception Handling for Async Requests

What happens if a `Callable` returned from a controller method raises an
Exception while being executed? The short answer is the same as what happens
when a controller method raises an exception. It goes through the regular
exception handling mechanism. The longer explanation is that when a `Callable`
raises an Exception Spring MVC dispatches to the Servlet container with the
`Exception` as the result and that leads to resume request processing with the
`Exception` instead of a controller method return value. When using a
`DeferredResult` you have a choice whether to call `setResult` or
`setErrorResult` with an `Exception` instance.

#### Intercepting Async Requests

A `HandlerInterceptor` can also implement `AsyncHandlerInterceptor` in order
to implement the `afterConcurrentHandlingStarted` callback, which is called
instead of `postHandle` and `afterCompletion` when asynchronous processing
starts.

A `HandlerInterceptor` can also register a `CallableProcessingInterceptor` or
a `DeferredResultProcessingInterceptor` in order to integrate more deeply with
the lifecycle of an asynchronous request and for example handle a timeout
event. See the Javadoc of `AsyncHandlerInterceptor` for more details.

The `DeferredResult` type also provides methods such as `onTimeout(Runnable)`
and `onCompletion(Runnable)`. See the Javadoc of `DeferredResult` for more
details.

When using a `Callable` you can wrap it with an instance of `WebAsyncTask`
which also provides registration methods for timeout and completion.

#### HTTP Streaming

A controller method can use `DeferredResult` and `Callable` to produce its
return value asynchronously and that can be used to implement techniques such
as [long polling](http://spring.io/blog/2012/05/08/spring-mvc-3-2-preview-
techniques-for-real-time-updates/) where the server can push an event to the
client as soon as possible.

What if you wanted to push multiple events on a single HTTP response? This is
a technique related to "Long Polling" that is known as "HTTP Streaming".
Spring MVC makes this possible through the `ResponseBodyEmitter` return value
type which can be used to send multiple Objects, instead of one as is normally
the case with `@ResponseBody`, where each Object sent is written to the
response with an `HttpMessageConverter`.

Here is an example of that:



    _@RequestMapping("/events")_
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

Note that `ResponseBodyEmitter` can also be used as the body in a
`ResponseEntity` in order to customize the status and headers of the response.

#### HTTP Streaming With Server-Sent Events

`SseEmitter` is a sub-class of `ResponseBodyEmitter` providing support for
[Server-Sent Events](http://www.w3.org/TR/eventsource/). Server-sent events is
a just another variation on the same "HTTP Streaming" technique except events
pushed from the server are formatted according to the W3C Server-Sent Events
specification.

Server-Sent Events can be used for their intended purpose, that is to push
events from the server to clients. It is quite easy to do in Spring MVC and
requires simply returning a value of type `SseEmitter`.

Note however that Internet Explorer does not support Server-Sent Events and
that for more advanced web application messaging scenarios such as online
games, collaboration, financial applicatinos, and others it's better to
consider Spring's WebSocket support that includes SockJS-style WebSocket
emulation falling back to a very wide range of browsers (including Internet
Explorer) and also higher-level messaging patterns for interacting with
clients through a publish-subscribe model within a more messaging-centric
architecture. For further background on this see [the following blog
post](http://blog.pivotal.io/pivotal/products/websocket-architecture-in-
spring-4-0).

#### HTTP Streaming Directly To The OutputStream

`ResponseBodyEmitter` allows sending events by writing Objects to the response
through an `HttpMessageConverter`. This is probably the most common case, for
example when writing JSON data. However sometimes it is useful to bypass
message conversion and write directly to the response `OutputStream` for
example for a file download. This can be done with the help of the
`StreamingResponseBody` return value type.

Here is an example of that:



    _@RequestMapping("/download")_
    public StreamingResponseBody handle() {
        return new StreamingResponseBody() {
            _@Override_
            public void writeTo(OutputStream outputStream) throws IOException {
                // write...
            }
        };
    }

Note that `StreamingResponseBody` can also be used as the body in a
`ResponseEntity` in order to customize the status and headers of the response.

#### Configuring Asynchronous Request Processing

##### Servlet Container Configuration

For applications configured with a `web.xml` be sure to update to version 3.0:



    <web-app xmlns="http://java.sun.com/xml/ns/javaee"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                http://java.sun.com/xml/ns/javaee
                http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
        version="3.0">

        ...

    </web-app>

Asynchronous support must be enabled on the `DispatcherServlet` through the
`<async-supported>true</async-supported>` web.xml sub-element. Additionally
any `Filter` that participates in asyncrequest processing must be configured
to support the ASYNC dispatcher type. It should be safe to enable the ASYNC
dispatcher type for all filters provided with the Spring Framework since they
usually extend `OncePerRequestFilter` and that has runtime checks for whether
the filter needs to be involved in async dispatches or not.

Below is some example web.xml configuration:


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

If using Servlet 3, Java based configuration for example via
`WebApplicationInitializer`, you'll also need to set the "asyncSupported" flag
as well as the ASYNC dispatcher type just like with `web.xml`. To simplify all
this configuration, consider extending `AbstractDispatcherServletInitializer`
or `AbstractAnnotationConfigDispatcherServletInitializer` which automatically
set those options and make it very easy to register `Filter` instances.

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
