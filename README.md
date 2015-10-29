# markdown-render

An example of rendering Markdown as a website. Complete with custom CSS and all that jazz.

# Here's how simple it is:
*all links are prefixed with the host domain, of course*

**URL:**
`/?github/hub` will show the README.md (by default-see below) of the GitHub directory `github/hub`. Easy, right? *You can also use `/?page=` if you really want to.*

# Okay, but what if I want it to show a different page by default?

That's really easy too. It requires using something called a *directive*. `redir` and `redir-silently` are the two we are going to be using here.
### `redir`
`redir` is an easy one. It will simply redirect the page, and it will appear in the URL bar for the user.

**Markdown code**
[//]: # (mr@stoplisten)
``` markdown
[//]: # (mr@redir=justinoboyle/markdown-render/example/index.md)
# Other markdown code
```

### `redir-silently`
`redir-silently` is probably more useful. It will change the content being displayed, but it will not update in the URL bar.

**Markdown code**

``` markdown
[//]: # (mr@redir-silently=justinoboyle/markdown-render/example/index.md)
# Other markdown code
```


# Why don't you give it a shot? It's free, I promise.
