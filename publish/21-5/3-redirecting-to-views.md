# 21.5.3 视图重定向

如前所述，控制器通常都会返回一个逻辑视图名，然后视图解析器会把它解析到一个具体的视图技术上去渲染。对于一些可以由Servlet或JSP引擎来处理的视图技术，比如JSP等，这个解析过程通常是由`InternalResourceViewResolver`和`InternalResourceView`协作来完成的，而这通常会调用Servlet的API`RequestDispatcher.forward(..)`方法或`RequestDispatcher.include(..)`方法，并发生一次内部的转发（forward）或引用（include）。而对于其他的视图技术，比如Velocity、XSLT等，视图本身的内容是直接被写回响应流中的。

有时，我们想要在视图渲染之前，先把一个HTTP重定向请求发送回客户端。比如，当一个控制器成功地接受到了`POST`过来的数据，而响应仅仅是委托另一个控制器来处理（比如一次成功的表单提交）时，我们希望发生一次重定向。在这种场景下，如果只是简单地使用内部转发，那么意味着下一个控制器也能看到这次`POST`请求携带的数据，这可能导致一些潜在的问题，比如可能会与其他期望的数据混淆，等。此外，另一种在渲染视图前对请求进行重定向的需求是，防止用户多次提交表单的数据。此时若使用重定向，则浏览器会先发送第一个`POST`请求；请求被处理后浏览器会收到一个重定向响应，然后浏览器直接被重定向到一个不同的URL，最后浏览器会使用重定向响应中携带的URL发起一次`GET`请求。因此，从浏览器的角度看，当前所见的页面并不是`POST`请求的结果，而是一次`GET`请求的结果。这就防止了用户因刷新等原因意外地提交了多次同样的数据。此时刷新会重新`GET`一次结果页，而不是把同样的`POST`数据再发送一遍。

## 重定向视图 RedirectView

强制重定向的一种方法是，在控制器中创建并返回一个Spring重定向视图`RedirectView`的实例。它会使得`DispatcherServlet`放弃使用一般的视图解析机制，因为你已经返回一个（重定向）视图给`DispatcherServlet`了，所以它会构造一个视图来满足渲染的需求。紧接着`RedirectView`会调用`HttpServletResponse.sendRedirect()`方法，发送一个HTTP重定向响应给客户端浏览器。

如果你决定返回`RedirectView`，并且这个视图实例是由控制器内部创建出来的，那我们更推荐在外部配置重定向URL然后注入到控制器中来，而不是写在控制器里面。这样它就可以与视图名一起在配置文件中配置。关于如何实现这个解耦，请参考 [重定向前缀：redirect:](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html#mvc-redirecting-redirect-prefix "The redirect: prefix")一小节。


##### Passing Data To the Redirect Target

By default all model attributes are considered to be exposed as URI template
variables in the redirect URL. Of the remaining attributes those that are
primitive types or collections/arrays of primitive types are automatically
appended as query parameters.

Appending primitive type attributes as query parameters may be the desired
result if a model instance was prepared specifically for the redirect.
However, in annotated controllers the model may contain additional attributes
added for rendering purposes (e.g. drop-down field values). To avoid the
possibility of having such attributes appear in the URL, an `@RequestMapping`
method can declare an argument of type `RedirectAttributes` and use it to
specify the exact attributes to make available to `RedirectView`. If the
method does redirect, the content of `RedirectAttributes` is used. Otherwise
the content of the model is used.

The `RequestMappingHandlerAdapter` provides a flag called
`"ignoreDefaultModelOnRedirect"` that can be used to indicate the content of
the default `Model` should never be used if a controller method redirects.
Instead the controller method should declare an attribute of type
`RedirectAttributes` or if it doesn't do so no attributes should be passed on
to `RedirectView`. Both the MVC namespace and the MVC Java config keep this
flag set to `false` in order to maintain backwards compatibility. However, for
new applications we recommend setting it to `true`

Note that URI template variables from the present request are automatically
made available when expanding a redirect URL and do not need to be added
explicitly neither through `Model` nor `RedirectAttributes`. For example:



    _@RequestMapping(path = "/files/{path}", method = RequestMethod.POST)_
    public String upload(...) {
        // ...
        return "redirect:files/{path}";
    }

Another way of passing data to the redirect target is via _Flash Attributes_.
Unlike other redirect attributes, flash attributes are saved in the HTTP
session (and hence do not appear in the URL). See [Section 21.6, "Using flash
attributes"](mvc.html#mvc-flash-attributes "21.6 Using flash attributes" ) for
more information.

#### The redirect: prefix

While the use of `RedirectView` works fine, if the controller itself creates
the `RedirectView`, there is no avoiding the fact that the controller is aware
that a redirection is happening. This is really suboptimal and couples things
too tightly. The controller should not really care about how the response gets
handled. In general it should operate only in terms of view names that have
been injected into it.

The special `redirect:` prefix allows you to accomplish this. If a view name
is returned that has the prefix `redirect:`, the `UrlBasedViewResolver` (and
all subclasses) will recognize this as a special indication that a redirect is
needed. The rest of the view name will be treated as the redirect URL.

The net effect is the same as if the controller had returned a `RedirectView`,
but now the controller itself can simply operate in terms of logical view
names. A logical view name such as `redirect:/myapp/some/resource` will
redirect relative to the current Servlet context, while a name such as
`redirect:http://myhost.com/some/arbitrary/path` will redirect to an absolute
URL.

Note that the controller handler is annotated with the `@ResponseStatus`, the
annotation value takes precedence over the response status set by
`RedirectView`.

#### The forward: prefix

It is also possible to use a special `forward:` prefix for view names that are
ultimately resolved by `UrlBasedViewResolver` and subclasses. This creates an
`InternalResourceView` (which ultimately does a `RequestDispatcher.forward()`)
around the rest of the view name, which is considered a URL. Therefore, this
prefix is not useful with `InternalResourceViewResolver` and
`InternalResourceView` (for JSPs for example). But the prefix can be helpful
when you are primarily using another view technology, but still want to force
a forward of a resource to be handled by the Servlet/JSP engine. (Note that
you may also chain multiple view resolvers, instead.)

As with the `redirect:` prefix, if the view name with the `forward:` prefix is
injected into the controller, the controller does not detect that anything
special is happening in terms of handling the response.
