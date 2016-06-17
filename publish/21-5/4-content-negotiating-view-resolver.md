# 21.5.4 内容协商解析器ContentNegotiatingViewResolver

`ContentNegotiatingViewResolver`自己并不会解析视图，而是委托给其他的视图解析器去处理。

The `ContentNegotiatingViewResolver` does not resolve views itself but rather
delegates to other view resolvers, selecting the view that resembles the
representation requested by the client. Two strategies exist for a client to
request a representation from the server:

  * Use a distinct URI for each resource, typically by using a different file extension in the URI. For example, the URI `<http://www.example.com/users/fred.pdf>` requests a PDF representation of the user fred, and `<http://www.example.com/users/fred.xml>` requests an XML representation.
  * Use the same URI for the client to locate the resource, but set the `Accept` HTTP request header to list the [media types](http://en.wikipedia.org/wiki/Internet_media_type) that it understands. For example, an HTTP request for `<http://www.example.com/users/fred>` with an `Accept` header set to `application/pdf` requests a PDF representation of the user fred, while `<http://www.example.com/users/fred>` with an `Accept` header set to `text/xml` requests an XML representation. This strategy is known as [content negotiation](http://en.wikipedia.org/wiki/Content_negotiation).

![\[Note\]](images/note.png)| Note
---|---

One issue with the `Accept` header is that it is impossible to set it in a web
browser within HTML. For example, in Firefox, it is fixed to:

```
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
```

For this reason it is common to see the use of a distinct URI for each
representation when developing browser based web applications.

To support multiple representations of a resource, Spring provides the
`ContentNegotiatingViewResolver` to resolve a view based on the file extension
or `Accept` header of the HTTP request. `ContentNegotiatingViewResolver` does
not perform the view resolution itself but instead delegates to a list of view
resolvers that you specify through the bean property `ViewResolvers`.

The `ContentNegotiatingViewResolver` selects an appropriate `View` to handle
the request by comparing the request media type(s) with the media type (also
known as `Content-Type`) supported by the `View` associated with each of its
`ViewResolvers`. The first `View` in the list that has a compatible `Content-
Type` returns the representation to the client. If a compatible view cannot be
supplied by the `ViewResolver` chain, then the list of views specified through
the `DefaultViews` property will be consulted. This latter option is
appropriate for singleton `Views` that can render an appropriate
representation of the current resource regardless of the logical view name.
The `Accept` header may include wild cards, for example `text/*`, in which
case a `View` whose Content-Type was `text/xml` is a compatible match.

To support custom resolution of a view based on a file extension, use a
`ContentNegotiationManager`: see [Section 21.16.6, "Content
Negotiation"](mvc.html#mvc-config-content-negotiation "21.16.6 Content
Negotiation" ).

Here is an example configuration of a `ContentNegotiatingViewResolver`:


```xml
<bean class="org.springframework.web.servlet.view.ContentNegotiatingViewResolver">
    <property name="viewResolvers">
        <list>
            <bean class="org.springframework.web.servlet.view.BeanNameViewResolver"/>
            <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
                <property name="prefix" value="/WEB-INF/jsp/"/>
                <property name="suffix" value=".jsp"/>
            </bean>
        </list>
    </property>
    <property name="defaultViews">
        <list>
            <bean class="org.springframework.web.servlet.view.json.MappingJackson2JsonView"/>
        </list>
    </property>
</bean>

<bean id="content" class="com.foo.samples.rest.SampleContentAtomView"/>
```

The `InternalResourceViewResolver` handles the translation of view names and
JSP pages, while the `BeanNameViewResolver` returns a view based on the name
of a bean. (See "[Resolving views with the ViewResolver interface](mvc.html
#mvc-viewresolver-resolver "21.5.1 Resolving views with the ViewResolver
interface" )" for more details on how Spring looks up and instantiates a
view.) In this example, the `content` bean is a class that inherits from
`AbstractAtomFeedView`, which returns an Atom RSS feed. For more information
on creating an Atom Feed representation, see the section Atom Views.

In the above configuration, if a request is made with an `.html` extension,
the view resolver looks for a view that matches the `text/html` media type.
The `InternalResourceViewResolver` provides the matching view for `text/html`.
If the request is made with the file extension `.atom`, the view resolver
looks for a view that matches the `application/atom+xml` media type. This view
is provided by the `BeanNameViewResolver` that maps to the
`SampleContentAtomView` if the view name returned is `content`. If the request
is made with the file extension `.json`, the `MappingJackson2JsonView`
instance from the `DefaultViews` list will be selected regardless of the view
name. Alternatively, client requests can be made without a file extension but
with the `Accept` header set to the preferred media-type, and the same
resolution of request to views would occur.

![\[Note\]](images/note.png)| Note
---|---

If `ContentNegotiatingViewResolver's list of ViewResolvers is not configured
explicitly, it automatically uses any ViewResolvers defined in the application
context.

The corresponding controller code that returns an Atom RSS feed for a URI of
the form `<http://localhost/content.atom>` or `<http://localhost/content>`
with an `Accept` header of application/atom+xml is shown below.


```java
@Controller
public class ContentController {

    private List<SampleContent> contentList = new ArrayList<SampleContent>();

    @RequestMapping(path="/content", method=RequestMethod.GET)
    public ModelAndView getContent() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content");
        mav.addObject("sampleContentList", contentList);
        return mav;
    }

}
```
