# 21.5.3 视图重定向

如前所述，控制器通常都会返回一个逻辑视图名，然后视图解析器会把它解析到一个具体的视图技术上去渲染。对于一些可以由Servlet或JSP引擎来处理的视图技术，比如JSP等，这个解析过程通常是由`InternalResourceViewResolver`和`InternalResourceView`协作来完成的，而这通常会调用Servlet的API`RequestDispatcher.forward(..)`方法或`RequestDispatcher.include(..)`方法，并发生一次内部的转发（forward）或引用（include）。而对于其他的视图技术，比如Velocity、XSLT等，视图本身的内容是直接被写回响应流中的。

有时，我们想要在视图渲染之前，先把一个HTTP重定向请求发送回客户端。比如，当一个控制器成功地接受到了`POST`过来的数据，而响应仅仅是委托另一个控制器来处理（比如一次成功的表单提交）时，我们希望发生一次重定向。在这种场景下，如果只是简单地使用内部转发，那么意味着下一个控制器也能看到这次`POST`请求携带的数据，这可能导致一些潜在的问题，比如可能会与其他期望的数据混淆，等。此外，另一种在渲染视图前对请求进行重定向的需求是，防止用户多次提交表单的数据。此时若使用重定向，则浏览器会先发送第一个`POST`请求；请求被处理后浏览器会收到一个重定向响应，然后浏览器直接被重定向到一个不同的URL，最后浏览器会使用重定向响应中携带的URL发起一次`GET`请求。因此，从浏览器的角度看，当前所见的页面并不是`POST`请求的结果，而是一次`GET`请求的结果。这就防止了用户因刷新等原因意外地提交了多次同样的数据。此时刷新会重新`GET`一次结果页，而不是把同样的`POST`数据再发送一遍。

## 重定向视图 RedirectView

强制重定向的一种方法是，在控制器中创建并返回一个Spring重定向视图`RedirectView`的实例。它会使得`DispatcherServlet`放弃使用一般的视图解析机制，因为你已经返回一个（重定向）视图给`DispatcherServlet`了，所以它会构造一个视图来满足渲染的需求。紧接着`RedirectView`会调用`HttpServletResponse.sendRedirect()`方法，发送一个HTTP重定向响应给客户端浏览器。

如果你决定返回`RedirectView`，并且这个视图实例是由控制器内部创建出来的，那我们更推荐在外部配置重定向URL然后注入到控制器中来，而不是写在控制器里面。这样它就可以与视图名一起在配置文件中配置。关于如何实现这个解耦，请参考 [重定向前缀——redirect:](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html#mvc-redirecting-redirect-prefix "The redirect: prefix")一小节。

## 向重定向目标传递数据

模型中的所有属性默认都会考虑作为URI模板变量被添加到重定向URL中。剩下的其他属性，如果是基本类型或者基本类型的集合或数组，那它们将被自动添加到URL的查询参数中去。如果model是专门为该重定向所准备的，那么把所有基本类型的属性添加到查询参数中可能是我们期望那个的结果。但是，在包含注解的控制器中，model可能包含了专门作为渲染用途的属性（比如一个下拉列表的字段值等）。为了避免把这样的属性也暴露在URL中，`@RequestMapping`方法可以声明一个`RedirectAttributes`类型的方法参数，用它来指定专门供重定向视图`RedirectView`取用的属性。如果重定向成功发生，那么`RedirectAttributes`对象中的内容就会被使用；否则则使用模型model中的数据。

`RequestMappingHandlerAdapter`提供了一个`"ignoreDefaultModelOnRedirect"`标志。它被用来标记默认`Model`中的属性永远不应该被用于控制器方法的重定向中。控制器方法应该声明一个`RedirectAttributes`类的参数。如果不声明，那就没有参数被传递到重定向的视图`RedirectView`中。在MVC命名空间或MVC Java编程配置方式中，为了维持向后的兼容性，这个标志都仍被保持为`false`。但如果你的应用是一个新的项目，那么我们推荐把它的值设置成`true`。

请注意，当前请求URI中的模板变量会在填充重定向URL的时候自动对应用可见，而不需要显式地在`Model`或`RedirectAttributes`中再添加属性。请看下面的例子：

```java
@RequestMapping(path = "/files/{path}", method = RequestMethod.POST)
public String upload(...) {
    // ...
    return "redirect:files/{path}";
}
```

另外一种向重定向目标传递数据的方法是通过 _闪存属性（Flash Attributes）_。与其他重定向属性不同，flash属性是存储在HTTP session中的（因此不会出现在URL中）。更多内容，请参考 [21.6 使用闪存属性](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html#mvc-flash-attributes "21.6 Using flash attributes")一节。


## 重定向前缀——redirect:

尽管使用`RedirectView`来做重定向能工作得很好，但如果控制器自身还是需要创建一个`RedirectView`，那无疑控制器还是了解重定向这么一件事情的发生。这还是有点不尽完美，不同范畴的耦合还是太强。控制器其实不应该去关心响应会如何被渲染。In general it should operate only in terms of view names that have been injected into it.

一个特别的视图名前缀能完成这个解耦：`redirect:`。如果返回的视图名中含有`redirect:`前缀，那么`UrlBasedViewResolver`（及它的所有子类）就会接受到这个信号，意识到这里需要发生重定向。然后视图名剩下的部分会被解析成重定向URL。

这种方式与通过控制器返回一个重定向视图`RedirectView`所达到的效果是一样的，不过这样一来控制器就可以只专注于处理并返回逻辑视图名了。如果逻辑视图名是这样的形式：`redirect:/myapp/some/resource`，他们重定向路径将以Servlet上下文作为相对路径进行查找，而逻辑视图名如果是这样的形式：`redirect:http://myhost.com/some/arbitrary/path`，那么重定向URL使用的就是绝对路径。

注意的是，如果控制器方法注解了`@ResponseStatus`，那么注解设置的状态码值会覆盖`RedirectView`设置的响应状态码值。

## 重定向前缀——forward:

对于最终会被`UrlBasedViewResolver`或其子类解析的视图名，你可以使用一个特殊的前缀：`forward:`。这会导致一个`InternalResourceView`视图对象的创建（它最终会调用`RequestDispatcher.forward()`方法），后者会认为视图名剩下的部分是一个URL。因此，这个前缀在使用`InternalResourceViewResolver`和`InternalResourceView`时并没有特别的作用（比如对于JSP来说）。但当你主要使用的是其他的视图技术，而又想要强制把一个资源转发给Servlet/JSP引擎进行处理时，这个前缀可能就很有用（或者，你也可能同时串联多个视图解析器）。

与`redirect:`前缀一样，如果控制器中的视图名使用了`forward:`前缀，控制器本身并不会发觉任何异常，它关注的仍然只是如何处理响应的问题。
