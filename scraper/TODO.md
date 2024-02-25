- add support for shoppify sites (ex. https://vulkclothing.com)
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
