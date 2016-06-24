# 21.14.4 弱ETag（Shallow ETag)

对ETag的支持是由Servlet的过滤器`ShallowEtagHeaderFilter`提供的。它是纯Servlet技术实现的过滤器，因此，它可以与任何web框架无缝集成。`ShallowEtagHeaderFilter`过滤器会创建一个我们称为弱ETag（与强ETag相对，后面会详述）

Support for ETags is provided by the Servlet filter `ShallowEtagHeaderFilter`.
It is a plain Servlet Filter, and thus can be used in combination with any web
framework. The `ShallowEtagHeaderFilter` filter creates so-called shallow
ETags (as opposed to deep ETags, more about that later).The filter caches the
content of the rendered JSP (or other content), generates an MD5 hash over
that, and returns that as an ETag header in the response. The next time a
client sends a request for the same resource, it uses that hash as the `If-
None-Match` value. The filter detects this, renders the view again, and
compares the two hashes. If they are equal, a `304` is returned. This filter
will not save processing power, as the view is still rendered. The only thing
it saves is bandwidth, as the rendered response is not sent back over the
wire.

Note that this strategy saves network bandwidth but not CPU, as the full
response must be computed for each request. Other strategies at the controller
level (described above) can save network bandwidth and avoid computation. mvc-
config-static-resources

You configure the `ShallowEtagHeaderFilter` in `web.xml`:



    <filter>
        <filter-name>etagFilter</filter-name>
        <filter-class>org.springframework.web.filter.ShallowEtagHeaderFilter</filter-class>
    </filter>

    <filter-mapping>
        <filter-name>etagFilter</filter-name>
        <servlet-name>petclinic</servlet-name>
    </filter-mapping>

Or in Servlet 3.0+ environments,



    public class MyWebAppInitializer extends AbstractDispatcherServletInitializer {

        // ...

        _@Override_
        protected Filter[] getServletFilters() {
            return new Filter[] { new ShallowEtagHeaderFilter() };
        }

    }

See [Section 21.15, "Code-based Servlet container initialization"](mvc.html
#mvc-container-config "21.15 Code-based Servlet container initialization" )
for more details.
