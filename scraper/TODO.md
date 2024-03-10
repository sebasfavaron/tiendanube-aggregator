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
    - https://verlanbrand.com
  - empretienda
    - https://calico.empretienda.com.ar
    - https://www.cokles.com.ar
    - https://bakari.com.ar
    - https://motee.ar
  - billowshop
    - https://joggers.com.ar
  - shopify
    - https://juanperez.com.ar
- fix scrolling loader
  - still gets stuck some times, would love to make it load when its visible, not just when border is visible (my assumption but i could check)
- fix open on new tab
- filter by brand (add url to brand name convertion to show nice names) - could be in an interactive way to "discover" your style
