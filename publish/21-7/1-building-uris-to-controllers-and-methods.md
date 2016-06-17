# 21.7.1 为控制器和方法指定URI

Spring MVC also provides a mechanism for building links to controller methods.
For example, given:

```java
@Controller
@RequestMapping("/hotels/{hotel}")
public class BookingController {

    @RequestMapping("/bookings/{booking}")
    public String getBooking(_@PathVariable_ Long booking) {

    // ...

    }
}
```


You can prepare a link by referring to the method by name:



    UriComponents uriComponents = MvcUriComponentsBuilder
        .fromMethodName(BookingController.class, "getBooking", 21).buildAndExpand(42);

    URI uri = uriComponents.encode().toUri();

In the above example we provided actual method argument values, in this case
the long value 21, to be used as a path variable and inserted into the URL.
Furthermore, we provided the value 42 in order to fill in any remaining URI
variables such as the "hotel" variable inherited from the type-level request
mapping. If the method had more arguments you can supply null for arguments
not needed for the URL. In general only `@PathVariable` and `@RequestParam`
arguments are relevant for constructing the URL.

There are additional ways to use `MvcUriComponentsBuilder`. For example you
can use a technique akin to mock testing through proxies to avoid referring to
the controller method by name (the example assumes static import of
`MvcUriComponentsBuilder.on`):



    UriComponents uriComponents = MvcUriComponentsBuilder
        .fromMethodCall(on(BookingController.class).getBooking(21)).buildAndExpand(42);

    URI uri = uriComponents.encode().toUri();

The above examples use static methods in `MvcUriComponentsBuilder`. Internally
they rely on `ServletUriComponentsBuilder` to prepare a base URL from the
scheme, host, port, context path and servlet path of the current request. This
works well in most cases, however sometimes it may be insufficient. For
example you may be outside the context of a request (e.g. a batch process that
prepares links) or perhaps you need to insert a path prefix (e.g. a locale
prefix that was removed from the request path and needs to be re-inserted into
links).

For such cases you can use the static "fromXxx" overloaded methods that accept
a `UriComponentsBuilder` to use base URL. Or you can create an instance of
`MvcUriComponentsBuilder` with a base URL and then use the instance-based
"withXxx" methods. For example:



    UriComponentsBuilder base = ServletUriComponentsBuilder.fromCurrentContextPath().path("/en");
    MvcUriComponentsBuilder builder = MvcUriComponentsBuilder.relativeTo(base);
    builder.withMethodCall(on(BookingController.class).getBooking(21)).buildAndExpand(42);

    URI uri = uriComponents.encode().toUri();
