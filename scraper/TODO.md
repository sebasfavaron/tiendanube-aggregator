- add support for shoppify sites (ex. https://vulkclothing.com, https://vcp.com.ar,)
  - curl 'https://vulkclothing.com/collections/all?view=ig-ajax&page=1&paginate=250' retrieves a json like:
    {
    "page": 1,
    "pages": 1,
    "totalCount": 110,
    "hasNextPage": null,
    "hasPreviousPage": null,
    "pageSize": 250,
    "products": [...]
    }
- add way to detect page type (tiendanube, shoppify, etc)
  - woocomerce
    - https://oneplaceworld.com
  - uncategorized
    - https://www.cokles.com.ar
    - https://joggers.com.ar
    - https://bakari.com.ar
    - https://motee.ar
- fix scrolling loader
- fix open on new tab
