# 21.10.1 概述


Spring's built-in multipart support handles file uploads in web applications.
You enable this multipart support with pluggable `MultipartResolver` objects,
defined in the `org.springframework.web.multipart` package. Spring provides
one `MultipartResolver` implementation for use with [_Commons
FileUpload_](http://jakarta.apache.org/commons/fileupload) and another for use
with Servlet 3.0 multipart request parsing.

By default, Spring does no multipart handling, because some developers want to
handle multiparts themselves. You enable Spring multipart handling by adding a
multipart resolver to the web application's context. Each request is inspected
to see if it contains a multipart. If no multipart is found, the request
continues as expected. If a multipart is found in the request, the
`MultipartResolver` that has been declared in your context is used. After
that, the multipart attribute in your request is treated like any other
attribute.
