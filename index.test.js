// index.test.js

const { deserialize } = require("./index");
const { strictEqual, deepStrictEqual } = require("assert");

const resp = {
  data: {
    id: 1,
    type: "movie",
    attributes: {
      name: "test movie",
      year: 2014,
    },
    relationships: {
      actors: {
        data: [
          { id: 1, type: "actor" },
          { id: 2, type: "actor" },
        ],
      },
      awards: {
        data: [
          {
            id: 4,
            type: "award",
            links: {
              self: "/awards/1",
              related: "/awards/1/movie",
            },
            meta: {
              verified: false,
            },
          },
        ],
      },
      locations: {
        data: [{ id: 1, type: "location" }],
      },
      director: {
        data: { id: 1, type: "person" },
      },
    },
    links: {
      self: "/movies/1",
    },
    meta: {
      saved: false,
    },
  },
  included: [
    {
      type: "actor",
      id: 1,
      attributes: { name: "John", age: 80 },
    },
    {
      type: "actor",
      id: 2,
      attributes: { name: "Jenn", age: 40 },
    },
    {
      type: "award",
      id: 4,
      attributes: { type: "Oscar", category: "Best director" },
    },
    {
      type: "location",
      id: 1,
      attributes: { name: "LA" },
    },
    {
      type: "person",
      id: 1,
      attributes: { name: "Steven" },
    },
  ],
  meta: {
    copyright: "Copyright 2015 Example Corp.",
  },
  errors: [{ title: "Error!" }],
};

const expectedResponse = {
  data: {
    id: 1,
    type: "movie",
    links: { self: "/movies/1" },
    meta: { saved: false },
    name: "test movie",
    year: 2014,
    locations: [{ id: 1, name: "LA", type: "location" }],
    director: { id: 1, type: "person", name: "Steven" },
    actors: [
      { id: 1, type: "actor", name: "John", age: 80 },
      { id: 2, type: "actor", name: "Jenn", age: 40 },
    ],
    awards: [
      {
        id: 4,
        type: "award",
        links: { self: "/awards/1", related: "/awards/1/movie" },
        meta: { verified: false },
        category: "Best director",
      },
    ],
  },
  meta: { copyright: "Copyright 2015 Example Corp." },
  errors: [{ title: "Error!" }],
};

const respWithSeparators = {
  data: {
    id: 1,
    type: "user",
    attributes: {
      "first-name": "Foo",
      "last-name": "Bar",
    },
    relationships: {
      actors: {
        data: [
          { id: 1, type: "actor" },
          { id: 2, type: "actor" },
        ],
      },
      awards: {
        data: [
          {
            id: 4,
            type: "award",
            links: {
              self: "/awards/1",
              related: "/awards/1/movie",
            },
            meta: {
              verified: false,
            },
          },
        ],
      },
      locations: {
        data: [{ id: 1, type: "location" }],
      },
      director: {
        data: { id: 1, type: "person" },
      },
    },
    links: {
      self: "/movies/1",
    },
    meta: {
      saved: false,
    },
  },
  included: [
    {
      type: "actor",
      id: 1,
      attributes: { name: "John", age: 80, "is-super-hero": true },
    },
    {
      type: "actor",
      id: 2,
      attributes: { name: "Jenn", age: 40, "is-super-hero": false },
    },
    {
      type: "award",
      id: 4,
      attributes: { type: "Oscar", category: "Best director" },
    },
    {
      type: "location",
      id: 1,
      attributes: { name: "LA" },
    },
  ],
  meta: {
    copyright: "Copyright 2015 Example Corp.",
  },
  errors: [{ title: "Error!" }],
};

const expectedRespWithSeparators = {
  data: {
    id: 1,
    type: "user",
    links: { self: "/movies/1" },
    meta: { saved: false },
    firstName: "Foo",
    lastName: "Bar",
    locations: [{ id: 1, name: "LA", type: "location" }],
    director: { id: 1, type: "person" },
    actors: [
      { id: 1, type: "actor", name: "John", age: 80, isSuperHero: true },
      { id: 2, type: "actor", name: "Jenn", age: 40, isSuperHero: false },
    ],
    awards: [
      {
        id: 4,
        type: "award",
        links: { self: "/awards/1", related: "/awards/1/movie" },
        meta: { verified: false },
        category: "Best director",
      },
    ],
  },
  meta: { copyright: "Copyright 2015 Example Corp." },
  errors: [{ title: "Error!" }],
};

const nullResp = {
  data: null,
};

describe("deserialize", () => {
  it("should deserialize a single resource", () => {
    const result = deserialize(resp);
    deepStrictEqual(result, expectedResponse);
  });

  it("should handle null resource", () => {
    const result = deserialize(nullResp);
    deepStrictEqual(result, nullResp);
  });

  it("should deserialize an array of resources", () => {
    const { data, ...rest } = resp;
    const arrayResp = {
      data: [
        {
          type: "catalog-search",
          id: null,
          attributes: {
            spellingSuggestion: null,
            sort: {
              sortParamNames: [
                "name_asc",
                "name_desc",
                "price_asc",
                "price_desc",
              ],
              sortParamLocalizedNames: {
                name_asc: "Name (ascending)",
                name_desc: "Name (descending)",
                price_asc: "List Price (ascending)",
                price_desc: "List Price (descending)",
              },
              currentSortParam: "best_results",
              currentSortOrder: null,
            },
            pagination: {
              numFound: 1695,
              currentPage: 1,
              maxPage: 142,
              currentItemsPerPage: 12,
              config: {
                parameterName: "page",
                itemsPerPageParameterName: "ipp",
                defaultItemsPerPage: 12,
                validItemsPerPageOptions: [12, 24, 48],
              },
            },
            abstractProducts: [
              {
                abstractSku: "foo-1",
                price: 413,
                abstractName: "Print Kopierpapier",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 413,
                    DEFAULT: 413,
                  },
                ],
                abstractDescription:
                  "Thanks to the light weighting, shipping costs as well as storage volume can be clearly reduced. Comparable printing result as 80 g standard paper.<p>* Weighting: 60 g/m² *wood-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: pure white * 500 sheets/pack.",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall: "/image/A007754Y?$normal$",
                    externalUrlLarge: "/image/A007754Y",
                  },
                ],
              },
              {
                abstractSku: "foo-2",
                price: 18482,
                abstractName: "Smit visual flipchart - for double rail system",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 18482,
                    DEFAULT: 18482,
                  },
                  {
                    priceTypeName: "ORIGINAL",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 20535,
                    ORIGINAL: 20535,
                  },
                ],
                abstractDescription:
                  "Height-adjustable steel sheet work surface 700 x 1000 mm, magnet-adhering, wipeable dry. Attachments points of the flip chart terminal are adjustable, as well as suitable for all customary flipchart pads. Panel frame made of white coated aluminum.<br/><br/><B>Whether just on a wall, or throughout the entire room, this system makes it possible.</B><br/>The individual components can be easily mounted or unhooked. The double-rail system makes it possible for the panels to easily slide over one another. Special spacers keep them always upright and free from vibrations.<p>",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall: "/image/00031524F-03?$normal$",
                    externalUrlLarge: "/image/00031524F-03",
                  },
                  {
                    externalUrlSmall: "/image/00031524-01?$normal$",
                    externalUrlLarge: "/image/00031524-01",
                  },
                ],
              },
              {
                abstractSku: "foo-3",
                price: 471,
                abstractName:
                  "Oxford Collegeblock 100104341 DIN A5, checkered, 90 sheets",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 471,
                    DEFAULT: 471,
                  },
                ],
                abstractDescription:
                  "Satin coated paper (optic paper), pure white. Two-color polypropylene cover, flexible and durable. Arranged by color (blue, green, red, purple and gray). With an elegant metallic effect.<p>* DIN A5 * Weighting: 90 g/m² *primarily bleached chlorine-free * double spiral binding * including bookmark straightedge * Cover material: Polypropylene * 90 sheets",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall: "/image/A007845X?$normal$",
                    externalUrlLarge: "/image/A007845X",
                  },
                  {
                    externalUrlSmall: "/image/A007845Y?$normal$",
                    externalUrlLarge: "/image/A007845Y",
                  },
                  {
                    externalUrlSmall: "/image/A007845Z?$normal$",
                    externalUrlLarge: "/image/A007845Z",
                  },
                  {
                    externalUrlSmall: "/image/A007846A?$normal$",
                    externalUrlLarge: "/image/A007846A",
                  },
                  {
                    externalUrlSmall: "/image/A007846B?$normal$",
                    externalUrlLarge: "/image/A007846B",
                  },
                  {
                    externalUrlSmall: "/image/A007846C?$normal$",
                    externalUrlLarge: "/image/A007846C",
                  },
                ],
              },
              {
                abstractSku: "foo-4",
                price: 214,
                abstractName:
                  "BIC multi-color ballpoint pen, 4 colors, 831253 0.4 mm blue/black/red/green",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 214,
                    DEFAULT: 214,
                  },
                ],
                abstractDescription:
                  "Colored printer for simple color selection. Writing on average 8 km according to SGS writing length test. The colors red, black, and blue are permanent.<p>* Line width: 0.4 mm * red, blue, green, black * Type designation of the refill: 4-color refill * refill can be exchanged * pressure mechanics * shaft material: Plastic * shaft color: black * 4 refills",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall: "/image/A007077R?$normal$",
                    externalUrlLarge: "/image/A007077R",
                  },
                ],
              },
              {
                abstractSku: "foo-5",
                price: 711,
                abstractName: "FS101-300L-62-2UPN8-H1141",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 711,
                    DEFAULT: 711,
                  },
                ],
                abstractDescription: "Flow Sensor",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall:
                      "https://fakeimg.pl/1400x1400/cccccc/909090",
                    externalUrlLarge:
                      "https://fakeimg.pl/1400x1400/cccccc/909090",
                  },
                  {
                    externalUrlSmall:
                      "https://fakeimg.pl/1400x1400/111111/909090",
                    externalUrlLarge:
                      "https://fakeimg.pl/1400x1400/111111/909090",
                  },
                  {
                    externalUrlSmall:
                      "https://fakeimg.pl/1400x1400/666666/909090",
                    externalUrlLarge:
                      "https://fakeimg.pl/1400x1400/666666/909090",
                  },
                ],
              },
              {
                abstractSku: "foo-6",
                price: 454,
                abstractName:
                  "BIC multi-color ballpoint pen, 4 colors STYLUS 926404 Touchpen",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 454,
                    DEFAULT: 454,
                  },
                ],
                abstractDescription:
                  "Touchpen and 4-color ballpoint pen in a pen with colored pusher for simple refill selection. Rich writing length of up to 1.5 km per refill. Ink waterproof, except for green.<p>*Line width: 0.4 mm * black, red, blue, green * Type designation of the refill: 4-color refill * refill can be exchanged * pressure mechanics * waterproof * shaft material: Plastic * shaft color: silver/black * 4 refills",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall: "/image/A007751J?$normal$",
                    externalUrlLarge: "/image/A007751J",
                  },
                  {
                    externalUrlSmall: "/image/A007909S?$normal$",
                    externalUrlLarge: "/image/A007909S",
                  },
                ],
              },
              {
                abstractSku: "foo-7",
                price: 521,
                abstractName:
                  "HP copy paper printing CHP210 DIN A4 80 g, white, 500 sheets/pack.",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 521,
                    DEFAULT: 521,
                  },
                ],
                abstractDescription:
                  "Extra-white, powerful all-purpose paper with a smooth surface. High reliability. Optimal luminosity and engraved sharp printouts.<p>* DIN A4 * Weighting: 80 g/m² * primarily bleached chlorine-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: white * 500 sheets/pack.",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall: "/image/S104010Z?$normal$",
                    externalUrlLarge: "/image/S104010Z",
                  },
                ],
              },
              {
                abstractSku: "foo-8",
                price: 445,
                abstractName:
                  "HP copy paper Office CHP110 DIN A4 80 g, white, 500 sheets/pack.",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 445,
                    DEFAULT: 445,
                  },
                ],
                abstractDescription:
                  "The ColorLok technology ensures extra fast drying of the ink, deeper black and brilliant colors. Very high thickness ensures problem-free passage in all devices. For this purpose, this quality was checked so as to avoid paper jams: at most one jam per 60,000 sheets.<p>* Weighting: 80 g/m² * primarily bleached chlorine-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: white * 500 sheets/pack.",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall: "/image/H009197G?$normal$",
                    externalUrlLarge: "/image/H009197G",
                  },
                ],
              },
              {
                abstractSku: "foo-9",
                price: 521,
                abstractName:
                  "HP copy paper Copy Paper CHP910 DIN A4 80 g, white, 500 sheets/pack.",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 521,
                    DEFAULT: 521,
                  },
                ],
                abstractDescription:
                  "Tested quality prevents paper jams in high-speed laser printers and copiers.<p>* DIN A4 * Weighting: 80 g/m² * primarily bleached chlorine-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: white * 500 sheets/pack.",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall: "/image/A007741K?$normal$",
                    externalUrlLarge: "/image/A007741K",
                  },
                  {
                    externalUrlSmall: "/image/S104010Y?$normal$",
                    externalUrlLarge: "/image/S104010Y",
                  },
                ],
              },
              {
                abstractSku: "foo-10",
                price: 264,
                abstractName:
                  "Clairefontaine Collegeblock Forever Recycling DIN A4",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 264,
                    DEFAULT: 264,
                  },
                ],
                abstractDescription:
                  "With red border line alternating on inside or outside.<p>* DIN A4 * Weighting: 70 g/m² * bleached totally chlorine-free, 100% recycling paper * 4-fold perforation * double spiral binding * 80 sheets",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall: "/image/A006080J?$normal$",
                    externalUrlLarge: "/image/A006080J",
                  },
                ],
              },
              {
                abstractSku: "foo-11",
                price: 521,
                abstractName:
                  "Clairefontaine Collegeblock 8272C DIN A5, 90 sheets",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 521,
                    DEFAULT: 521,
                  },
                ],
                abstractDescription:
                  "With red border line alternating on inside or outside.<p>* DIN A4 * Weighting: 70 g/m² * bleached totally chlorine-free, 100% recycling paper * 4-fold perforation * double spiral binding * 80 sheets",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall: "/image/A007778B?$normal$",
                    externalUrlLarge: "/image/A007778B",
                  },
                ],
              },
              {
                abstractSku: "foo-12",
                price: 521,
                abstractName:
                  "Clairefontaine Collegeblock 8272C DIN A5, 90 sheets",
                prices: [
                  {
                    priceTypeName: "DEFAULT",
                    currency: {
                      code: "EUR",
                      symbol: "€",
                      name: "Euro",
                    },
                    netAmount: 521,
                    DEFAULT: 521,
                  },
                ],
                abstractDescription:
                  "With red border line alternating on inside or outside.<p>* DIN A4 * Weighting: 70 g/m² * bleached totally chlorine-free, 100% recycling paper * 4-fold perforation * double spiral binding * 80 sheets",
                keyFeatures: [],
                images: [
                  {
                    externalUrlSmall: "/image/A007778C?$normal$",
                    externalUrlLarge: "/image/A007778C",
                  },
                ],
              },
            ],
            valueFacets: [
              {
                name: "category",
                localizedName: "Categories",
                docCount: null,
                values: [
                  {
                    value: 1,
                    doc_count: 1695,
                  },
                  {
                    value: 2,
                    doc_count: 1480,
                  },
                  {
                    value: 3,
                    doc_count: 1434,
                  },
                  {
                    value: 72,
                    doc_count: 36,
                  },
                  {
                    value: 54,
                    doc_count: 30,
                  },
                  {
                    value: 42,
                    doc_count: 29,
                  },
                  {
                    value: 26,
                    doc_count: 24,
                  },
                  {
                    value: 79,
                    doc_count: 20,
                  },
                  {
                    value: 18,
                    doc_count: 18,
                  },
                  {
                    value: 35,
                    doc_count: 18,
                  },
                  {
                    value: 84,
                    doc_count: 18,
                  },
                  {
                    value: 75,
                    doc_count: 15,
                  },
                  {
                    value: 92,
                    doc_count: 15,
                  },
                  {
                    value: 49,
                    doc_count: 12,
                  },
                  {
                    value: 64,
                    doc_count: 12,
                  },
                  {
                    value: 43,
                    doc_count: 10,
                  },
                  {
                    value: 74,
                    doc_count: 9,
                  },
                  {
                    value: 76,
                    doc_count: 9,
                  },
                  {
                    value: 44,
                    doc_count: 8,
                  },
                  {
                    value: 46,
                    doc_count: 8,
                  },
                  {
                    value: 10,
                    doc_count: 7,
                  },
                  {
                    value: 73,
                    doc_count: 7,
                  },
                  {
                    value: 17,
                    doc_count: 6,
                  },
                  {
                    value: 58,
                    doc_count: 6,
                  },
                  {
                    value: 69,
                    doc_count: 6,
                  },
                  {
                    value: 83,
                    doc_count: 6,
                  },
                  {
                    value: 9,
                    doc_count: 5,
                  },
                  {
                    value: 80,
                    doc_count: 5,
                  },
                  {
                    value: 82,
                    doc_count: 5,
                  },
                  {
                    value: 14,
                    doc_count: 4,
                  },
                  {
                    value: 30,
                    doc_count: 4,
                  },
                  {
                    value: 40,
                    doc_count: 4,
                  },
                  {
                    value: 81,
                    doc_count: 4,
                  },
                  {
                    value: 87,
                    doc_count: 4,
                  },
                  {
                    value: 4,
                    doc_count: 3,
                  },
                  {
                    value: 5,
                    doc_count: 3,
                  },
                  {
                    value: 6,
                    doc_count: 3,
                  },
                  {
                    value: 7,
                    doc_count: 3,
                  },
                  {
                    value: 8,
                    doc_count: 3,
                  },
                  {
                    value: 11,
                    doc_count: 3,
                  },
                  {
                    value: 12,
                    doc_count: 3,
                  },
                  {
                    value: 13,
                    doc_count: 3,
                  },
                  {
                    value: 15,
                    doc_count: 3,
                  },
                  {
                    value: 16,
                    doc_count: 3,
                  },
                  {
                    value: 20,
                    doc_count: 3,
                  },
                  {
                    value: 21,
                    doc_count: 3,
                  },
                  {
                    value: 22,
                    doc_count: 3,
                  },
                  {
                    value: 23,
                    doc_count: 3,
                  },
                  {
                    value: 24,
                    doc_count: 3,
                  },
                  {
                    value: 25,
                    doc_count: 3,
                  },
                  {
                    value: 27,
                    doc_count: 3,
                  },
                  {
                    value: 28,
                    doc_count: 3,
                  },
                  {
                    value: 29,
                    doc_count: 3,
                  },
                  {
                    value: 31,
                    doc_count: 3,
                  },
                  {
                    value: 32,
                    doc_count: 3,
                  },
                  {
                    value: 34,
                    doc_count: 3,
                  },
                  {
                    value: 36,
                    doc_count: 3,
                  },
                  {
                    value: 37,
                    doc_count: 3,
                  },
                  {
                    value: 38,
                    doc_count: 3,
                  },
                  {
                    value: 39,
                    doc_count: 3,
                  },
                  {
                    value: 41,
                    doc_count: 3,
                  },
                  {
                    value: 45,
                    doc_count: 3,
                  },
                  {
                    value: 47,
                    doc_count: 3,
                  },
                  {
                    value: 48,
                    doc_count: 3,
                  },
                  {
                    value: 50,
                    doc_count: 3,
                  },
                  {
                    value: 51,
                    doc_count: 3,
                  },
                  {
                    value: 52,
                    doc_count: 3,
                  },
                  {
                    value: 53,
                    doc_count: 3,
                  },
                  {
                    value: 55,
                    doc_count: 3,
                  },
                  {
                    value: 56,
                    doc_count: 3,
                  },
                  {
                    value: 57,
                    doc_count: 3,
                  },
                  {
                    value: 59,
                    doc_count: 3,
                  },
                  {
                    value: 60,
                    doc_count: 3,
                  },
                  {
                    value: 61,
                    doc_count: 3,
                  },
                  {
                    value: 62,
                    doc_count: 3,
                  },
                  {
                    value: 63,
                    doc_count: 3,
                  },
                  {
                    value: 65,
                    doc_count: 3,
                  },
                  {
                    value: 66,
                    doc_count: 3,
                  },
                  {
                    value: 67,
                    doc_count: 3,
                  },
                  {
                    value: 68,
                    doc_count: 3,
                  },
                  {
                    value: 70,
                    doc_count: 3,
                  },
                  {
                    value: 71,
                    doc_count: 3,
                  },
                  {
                    value: 77,
                    doc_count: 3,
                  },
                  {
                    value: 78,
                    doc_count: 3,
                  },
                  {
                    value: 85,
                    doc_count: 3,
                  },
                  {
                    value: 86,
                    doc_count: 3,
                  },
                  {
                    value: 88,
                    doc_count: 3,
                  },
                  {
                    value: 89,
                    doc_count: 3,
                  },
                  {
                    value: 90,
                    doc_count: 3,
                  },
                  {
                    value: 93,
                    doc_count: 3,
                  },
                  {
                    value: 94,
                    doc_count: 3,
                  },
                  {
                    value: 95,
                    doc_count: 3,
                  },
                  {
                    value: 96,
                    doc_count: 3,
                  },
                  {
                    value: 98,
                    doc_count: 3,
                  },
                  {
                    value: 33,
                    doc_count: 2,
                  },
                  {
                    value: 91,
                    doc_count: 1,
                  },
                ],
                activeValue: null,
                config: {
                  parameterName: "category",
                  isMultiValued: false,
                },
              },
              {
                name: "cordset_application",
                localizedName: "Application",
                docCount: null,
                values: [
                  {
                    value: "Data",
                    doc_count: 18,
                  },
                  {
                    value: "Hazardous area",
                    doc_count: 17,
                  },
                  {
                    value: "Signal",
                    doc_count: 15,
                  },
                  {
                    value: "Power",
                    doc_count: 1,
                  },
                  {
                    value: "RFID",
                    doc_count: 1,
                  },
                  {
                    value: "Test-Application",
                    doc_count: 1,
                  },
                  {
                    value: "Washdown (F&B)",
                    doc_count: 1,
                  },
                  {
                    value: "Welding",
                    doc_count: 1,
                  },
                ],
                activeValue: null,
                config: {
                  parameterName: "cordset_application",
                  isMultiValued: false,
                },
              },
              {
                name: "protection_class",
                localizedName: "Protection class",
                docCount: null,
                values: [
                  {
                    value: "IP67",
                    doc_count: 979,
                  },
                  {
                    value: "IP68",
                    doc_count: 553,
                  },
                  {
                    value: "IP69K",
                    doc_count: 110,
                  },
                  {
                    value: "IP20",
                    doc_count: 45,
                  },
                  {
                    value: "IP65",
                    doc_count: 39,
                  },
                  {
                    value: "IP50",
                    doc_count: 9,
                  },
                  {
                    value: "IP66",
                    doc_count: 9,
                  },
                  {
                    value: "IP60",
                    doc_count: 4,
                  },
                  {
                    value: "IP66 front, IP20 rear",
                    doc_count: 3,
                  },
                  {
                    value: "IP69",
                    doc_count: 3,
                  },
                ],
                activeValue: null,
                config: {
                  parameterName: "protection_class",
                  isMultiValued: true,
                },
              },
            ],
            rangeFacets: [
              {
                name: "number_of_ports",
                localizedName: "Number of Ports",
                min: 1,
                max: 8,
                activeMin: 1,
                activeMax: 8,
                docCount: null,
                config: {
                  parameterName: "number_of_ports",
                  isMultiValued: false,
                },
              },
              {
                name: "rated_operating_distance",
                localizedName: "Rated switching distance",
                min: 1,
                max: 100,
                activeMin: 1,
                activeMax: 100,
                docCount: null,
                config: {
                  parameterName: "rated_operating_distance",
                  isMultiValued: false,
                },
              },
            ],
            categoryTreeFilter: [
              {
                nodeId: 72,
                name: "Industrial Network Technology",
                docCount: 36,
                children: [
                  {
                    nodeId: 73,
                    name: "Industrial Switches",
                    docCount: 7,
                    children: [],
                  },
                  {
                    nodeId: 74,
                    name: "Couplers and Converters",
                    docCount: 9,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 2,
                name: "Sensors",
                docCount: 1480,
                children: [
                  {
                    nodeId: 8,
                    name: "Radar Sensors",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 15,
                    name: "Level Sensors",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 9,
                    name: "Linear Position Sensors",
                    docCount: 5,
                    children: [],
                  },
                  {
                    nodeId: 3,
                    name: "Inductive Sensors",
                    docCount: 1434,
                    children: [],
                  },
                  {
                    nodeId: 16,
                    name: "Condition Monitoring Sensors",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 10,
                    name: "Encoders",
                    docCount: 7,
                    children: [],
                  },
                  {
                    nodeId: 4,
                    name: "Photoelectric Sensors",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 17,
                    name: "Accessories",
                    docCount: 6,
                    children: [],
                  },
                  {
                    nodeId: 11,
                    name: "Inclinometers",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 5,
                    name: "Capacitive Sensors",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 12,
                    name: "Pressure Sensors",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 6,
                    name: "Magnetic Field Sensors",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 13,
                    name: "Temperature Sensors",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 7,
                    name: "Ultrasonic Sensors",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 14,
                    name: "Flow Sensors/Flow Meters",
                    docCount: 4,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 47,
                name: "Control Cabinet Solutions",
                docCount: 3,
                children: [
                  {
                    nodeId: 48,
                    name: "Standard Ex Control Cabinet",
                    docCount: 3,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 79,
                name: "Industrial Wireless",
                docCount: 20,
                children: [
                  {
                    nodeId: 80,
                    name: "Industrial Wireless Radios",
                    docCount: 5,
                    children: [],
                  },
                  {
                    nodeId: 81,
                    name: "Controllers",
                    docCount: 4,
                    children: [],
                  },
                  {
                    nodeId: 82,
                    name: "Wireless Sensors, Lighting and Indicators",
                    docCount: 5,
                    children: [],
                  },
                  {
                    nodeId: 83,
                    name: "Accessories",
                    docCount: 6,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 92,
                name: "Vision",
                docCount: 15,
                children: [
                  {
                    nodeId: 98,
                    name: "Vision Accessories",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 93,
                    name: "Vision Sensors",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 94,
                    name: "Smart Cameras",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 95,
                    name: "Vision Lighting",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 96,
                    name: "Vision Controllers",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 97,
                    name: "Vision Software and Firmware",
                    docCount: 0,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 54,
                name: "Machine Safety",
                docCount: 30,
                children: [
                  {
                    nodeId: 59,
                    name: "Emergency Stop Controls",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 60,
                    name: "Two-Hand Controls",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 61,
                    name: "Safety I/O Modules",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 55,
                    name: "Safety Light Curtains",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 62,
                    name: "Safety Controllers",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 56,
                    name: "Safety Grid Systems",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 63,
                    name: "Safety Accessories",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 57,
                    name: "Safety Laser Scanners",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 58,
                    name: "Safety Switches",
                    docCount: 6,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 35,
                name: "Lighting and Indicators",
                docCount: 18,
                children: [
                  {
                    nodeId: 40,
                    name: "Pick-to-Light",
                    docCount: 4,
                    children: [],
                  },
                  {
                    nodeId: 41,
                    name: "Accessories",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 36,
                    name: "Industrial LED Task Lighting",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 37,
                    name: "Tower Lights",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 38,
                    name: "LED Indicators",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 39,
                    name: "Touch Buttons",
                    docCount: 3,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 42,
                name: "Fieldbus Technology",
                docCount: 29,
                children: [
                  {
                    nodeId: 43,
                    name: "I/O Systems",
                    docCount: 10,
                    children: [],
                  },
                  {
                    nodeId: 44,
                    name: "I/O Modules",
                    docCount: 8,
                    children: [],
                  },
                  {
                    nodeId: 45,
                    name: "PA Bus Components",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 46,
                    name: "Accessories",
                    docCount: 8,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 49,
                name: "Interface Technology",
                docCount: 12,
                children: [
                  {
                    nodeId: 53,
                    name: "Accessories",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 50,
                    name: "Safety Barriers",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 51,
                    name: "Signal Conditioners",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 52,
                    name: "Control Cabinet Monitoring",
                    docCount: 3,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 75,
                name: "Cloud Solutions",
                docCount: 15,
                children: [
                  {
                    nodeId: 76,
                    name: "Hardware",
                    docCount: 9,
                    children: [],
                  },
                  {
                    nodeId: 77,
                    name: "Software",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 78,
                    name: "Accessories",
                    docCount: 3,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 18,
                name: "Identification",
                docCount: 18,
                children: [
                  {
                    nodeId: 21,
                    name: "Tags HF/UHF",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 22,
                    name: "Interfaces HF/UHF",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 23,
                    name: "Handhelds HF/UHF/Barcode",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 24,
                    name: "Barcode Readers",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 25,
                    name: "Accessories",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 19,
                    name: "System Features",
                    docCount: 0,
                    children: [],
                  },
                  {
                    nodeId: 20,
                    name: "HF/UHF Read/Write Device",
                    docCount: 3,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 69,
                name: "Power Supplies",
                docCount: 6,
                children: [
                  {
                    nodeId: 70,
                    name: "Power Supplies DIN Rail IP20",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 71,
                    name: "Power Supplies for the Field IP67",
                    docCount: 3,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 64,
                name: "Industrial Controls",
                docCount: 12,
                children: [
                  {
                    nodeId: 66,
                    name: "Control",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 67,
                    name: "Programmable Gateway",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 68,
                    name: "Accessories",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 65,
                    name: "Programmable HMI",
                    docCount: 3,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 26,
                name: "Connectivity",
                docCount: 24,
                children: [
                  {
                    nodeId: 34,
                    name: "Accessories",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 28,
                    name: "Receptacles",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 29,
                    name: "2-Way Splitters",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 30,
                    name: "Passive Junction Boxes",
                    docCount: 4,
                    children: [],
                  },
                  {
                    nodeId: 31,
                    name: "Field-wireable Connectors",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 32,
                    name: "Bulk Cable",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 33,
                    name: "Inductive Coupling",
                    docCount: 2,
                    children: [],
                  },
                  {
                    nodeId: 27,
                    name: "Cordsets",
                    docCount: 3,
                    children: [],
                  },
                ],
              },
              {
                nodeId: 84,
                name: "Snap Signal",
                docCount: 18,
                children: [
                  {
                    nodeId: 91,
                    name: "Snap Signal Accessories",
                    docCount: 1,
                    children: [],
                  },
                  {
                    nodeId: 85,
                    name: "Controllers",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 86,
                    name: "IO-Link Masters",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 87,
                    name: "IO-Link Hubs",
                    docCount: 4,
                    children: [],
                  },
                  {
                    nodeId: 88,
                    name: "Converters",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 89,
                    name: "Serial Data Radios",
                    docCount: 3,
                    children: [],
                  },
                  {
                    nodeId: 90,
                    name: "Snap Signal Sensors",
                    docCount: 3,
                    children: [],
                  },
                ],
              },
            ],
          },
          links: {
            self: "https://catalog-search?currency=EUR&include=abstract-products,concrete-products,product-measurement-units,concrete-product-availabilities,concrete-product-prices&priceMode=NET_MODE&sort=best_results&ipp=12",
          },
          relationships: {
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-1",
                },
                {
                  type: "abstract-products",
                  id: "foo-2",
                },
                {
                  type: "abstract-products",
                  id: "foo-3",
                },
                {
                  type: "abstract-products",
                  id: "foo-4",
                },
                {
                  type: "abstract-products",
                  id: "foo-5",
                },
                {
                  type: "abstract-products",
                  id: "foo-6",
                },
                {
                  type: "abstract-products",
                  id: "foo-7",
                },
                {
                  type: "abstract-products",
                  id: "foo-8",
                },
                {
                  type: "abstract-products",
                  id: "foo-9",
                },
                {
                  type: "abstract-products",
                  id: "foo-10",
                },
                {
                  type: "abstract-products",
                  id: "foo-11",
                },
                {
                  type: "abstract-products",
                  id: "foo-12",
                },
              ],
            },
          },
        },
      ],
      links: {
        self: "https://catalog-search?currency=EUR&include=abstract-products,concrete-products,product-measurement-units,concrete-product-availabilities,concrete-product-prices&priceMode=NET_MODE&sort=best_results&ipp=12",
        last: "https://catalog-search?currency=EUR&include=abstract-products,concrete-products,product-measurement-units,concrete-product-availabilities,concrete-product-prices&priceMode=NET_MODE&sort=best_results&ipp=12&page[offset]=1692&page[limit]=12",
        first:
          "https://catalog-search?currency=EUR&include=abstract-products,concrete-products,product-measurement-units,concrete-product-availabilities,concrete-product-prices&priceMode=NET_MODE&sort=best_results&ipp=12&page[offset]=0&page[limit]=12",
        next: "https://catalog-search?currency=EUR&include=abstract-products,concrete-products,product-measurement-units,concrete-product-availabilities,concrete-product-prices&priceMode=NET_MODE&sort=best_results&ipp=12&page[offset]=12&page[limit]=12",
      },
      included: [
        {
          type: "concrete-product-availabilities",
          id: "921378",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/921378/concrete-product-availabilities",
          },
        },
        {
          type: "product-measurement-units",
          id: "ITEM",
          attributes: {
            name: "Item",
            defaultPrecision: 1,
          },
          links: {
            self: "https://product-measurement-units/ITEM",
          },
        },
        {
          type: "concrete-products",
          id: "921378",
          attributes: {
            sku: "921378",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-1",
            name: "Smart Print copy paper 1929C DIN A4 60 g, white, 500 sheets/pack.",
            description:
              "Thanks to the light weighting, shipping costs as well as storage volume can be clearly reduced. Comparable printing result as 80 g standard paper.<p>* Weighting: 60 g/m² *wood-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: pure white * 500 sheets/pack.",
            attributes: {
              cordset_application: "Test-Application",
              number_of_ports: "1",
              rated_operating_distance: "1.1",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Druckerpapiere,Druckerpapiere,Multifunktionspapiere,Multifunktionspapiere,Kopierpapiere,Kopierpapiere,Universalpapiere,Universalpapiere,Büropapiere,Büropapiere,Allroundpapiere,Allroundpapiere",
            metaDescription:
              "Durch die leichte Grammatur können Portokosten und auch das Lagervolumen deutlich reduziert werden. Vergelichbares Druckergebnis wie ein 80 g Standartpapier.<p>* Grammatur: 60 g/m² * holzfrei * beidseitig bedruckbar * Laserdrucker, Inkjetdrucker, Kopierer, Faxgeräte * Farbe: hochweiß * 500 Bl./Pack.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/921378",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "921378",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-1",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "921378",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-1",
          attributes: {
            sku: "foo-1",
            averageRating: null,
            reviewCount: 0,
            name: "Print Kopierpapier",
            description:
              "Thanks to the light weighting, shipping costs as well as storage volume can be clearly reduced. Comparable printing result as 80 g standard paper.<p>* Weighting: 60 g/m² *wood-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: pure white * 500 sheets/pack.",
            attributes: {
              cordset_application: "Test-Application",
              number_of_ports: "1",
              rated_operating_distance: "1.1",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [921378],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Druckerpapiere,Druckerpapiere,Multifunktionspapiere,Multifunktionspapiere,Kopierpapiere,Kopierpapiere,Universalpapiere,Universalpapiere,Büropapiere,Büropapiere,Allroundpapiere,Allroundpapiere",
            metaDescription:
              "Durch die leichte Grammatur können Portokosten und auch das Lagervolumen deutlich reduziert werden. Vergelichbares Druckergebnis wie ein 80 g Standartpapier.<p>* Grammatur: 60 g/m² * holzfrei * beidseitig bedruckbar * Laserdrucker, Inkjetdrucker, Kopierer, Faxgeräte * Farbe: hochweiß * 500 Bl./Pack.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
            },
            url: "/en/industrial-network-technology/foo-1",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-1",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "921378",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "921378",
          attributes: {
            price: 413,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 413,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/921378/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "101509",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/101509/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-products",
          id: "101509",
          attributes: {
            sku: "101509",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-2",
            name: "Smit visual flipchart - for double rail system - HxW 1000 x 700 mm",
            description:
              "Height-adjustable steel sheet work surface 700 x 1000 mm, magnet-adhering, wipeable dry. Attachments points of the flip chart terminal are adjustable, as well as suitable for all customary flipchart pads. Panel frame made of white coated aluminum.<br/><br/><B>Whether just on a wall, or throughout the entire room, this system makes it possible.</B><br/>The individual components can be easily mounted or unhooked. The double-rail system makes it possible for the panels to easily slide over one another. Special spacers keep them always upright and free from vibrations.<p>",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "2",
              rated_operating_distance: "2.2",
              protection_class: "Test-IP99",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Doppelschienensystem,Flipchart,Präsentationstafel,Schienensystem,Schienensystem für Moderationstafeln,Schienensysteme für Moderationstafeln,Schreibtafel,Wandtafel-Schienensystem,Wandtafelschienensystem,Wandtafelschienensysteme,Tafel",
            metaDescription:
              "Höhenverstellbare Arbeitsfläche aus Stahlblech 700 x 1000 mm, magnethaftend, trocken abwischbar. Aufhängepunkte der Flipchartklemme verstellbar, somit für alle handelsüblichen Flipchartblöcke passend. Tafelrahmen aus weiß beschichtetem Aluminium.<br/><br/><B>Ob an nur einer Wand oder im ganzen Raum, dieses System macht es möglich.</B><br/>Die einzelnen Komponenten werden einfach ein- bzw. ausgehängt. Das Doppelschienen-System ermöglicht ein leichtgängiges Übereinanderschieben der Tafeln. Spezielle Abstandshalter halten sie stets senkrecht und erschütterungsfrei.<p>",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              protection_class: "Protection class",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "protection_class",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/101509",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "101509",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-2",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "101509",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-2",
          attributes: {
            sku: "foo-2",
            averageRating: null,
            reviewCount: 0,
            name: "Smit visual flipchart - for double rail system",
            description:
              "Height-adjustable steel sheet work surface 700 x 1000 mm, magnet-adhering, wipeable dry. Attachments points of the flip chart terminal are adjustable, as well as suitable for all customary flipchart pads. Panel frame made of white coated aluminum.<br/><br/><B>Whether just on a wall, or throughout the entire room, this system makes it possible.</B><br/>The individual components can be easily mounted or unhooked. The double-rail system makes it possible for the panels to easily slide over one another. Special spacers keep them always upright and free from vibrations.<p>",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "2",
              rated_operating_distance: "2.2",
              protection_class: "Test-IP99",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [101509],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Doppelschienensystem,Flipchart,Präsentationstafel,Schienensystem,Schienensystem für Moderationstafeln,Schienensysteme für Moderationstafeln,Schreibtafel,Wandtafel-Schienensystem,Wandtafelschienensystem,Wandtafelschienensysteme,Tafel",
            metaDescription:
              "Höhenverstellbare Arbeitsfläche aus Stahlblech 700 x 1000 mm, magnethaftend, trocken abwischbar. Aufhängepunkte der Flipchartklemme verstellbar, somit für alle handelsüblichen Flipchartblöcke passend. Tafelrahmen aus weiß beschichtetem Aluminium.<br/><br/><B>Ob an nur einer Wand oder im ganzen Raum, dieses System macht es möglich.</B><br/>Die einzelnen Komponenten werden einfach ein- bzw. ausgehängt. Das Doppelschienen-System ermöglicht ein leichtgängiges Übereinanderschieben der Tafeln. Spezielle Abstandshalter halten sie stets senkrecht und erschütterungsfrei.<p>",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              protection_class: "Protection class",
            },
            url: "/en/industrial-network-technology/foo-2",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-2",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "101509",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "101509",
          attributes: {
            price: 18482,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 18482,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
              {
                priceTypeName: "ORIGINAL",
                netAmount: 20535,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/101509/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421247",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421247/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-products",
          id: "421247",
          attributes: {
            sku: "421247",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-3",
            name: "Oxford Collegeblock 100104341 DIN A5, checkered, 90 sheets",
            description:
              "Satin coated paper (optic paper), pure white. Two-color polypropylene cover, flexible and durable. Arranged by color (blue, green, red, purple and gray). With an elegant metallic effect.<p>* DIN A5 * Weighting: 90 g/m² *primarily bleached chlorine-free * double spiral binding * including bookmark straightedge * Cover material: Polypropylene * 90 sheets",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "3",
              rated_operating_distance: "3.3",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Kollegeblock,Collegeblöcke,Blöcke,Konferenzblock,Notizhefte,Kollegblock,Spiralblöcke,Konferenzblöcke,Spiralnotizblöcke,Spiralnotizblock,Seminarblock,Kollegeblöcke,Notizblöcke,Notizblock,Spiralbücher,Block,Spiralbuch,Briefblock,Briefblöcke,Kollegblöcke,Schreibblock,Spiralblock,Collegeblock,Schreibblöcke,Seminarblöcke",
            metaDescription:
              "Satiniertes Papier (Optik Paper), hochweiß. Zweifarbiger Polypropylen-Deckel, flexibel und strapazierfähig. Farbig sortiert (blau, grün, rot, violett und grau). Mit elegantem Metallic-Effekt.<p>* DIN A5 * Grammatur: 90 g/m² * elementar chlorfrei gebleicht * Doppelspiralbindung * inkl. Lesezeichenlineal * Material des Einbandes: Polypropylen * 90 Bl.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421247",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421247",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-3",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421247",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-3",
          attributes: {
            sku: "foo-3",
            averageRating: null,
            reviewCount: 0,
            name: "Oxford Collegeblock 100104341 DIN A5, checkered, 90 sheets",
            description:
              "Satin coated paper (optic paper), pure white. Two-color polypropylene cover, flexible and durable. Arranged by color (blue, green, red, purple and gray). With an elegant metallic effect.<p>* DIN A5 * Weighting: 90 g/m² *primarily bleached chlorine-free * double spiral binding * including bookmark straightedge * Cover material: Polypropylene * 90 sheets",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "3",
              rated_operating_distance: "3.3",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [421247],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Kollegeblock,Collegeblöcke,Blöcke,Konferenzblock,Notizhefte,Kollegblock,Spiralblöcke,Konferenzblöcke,Spiralnotizblöcke,Spiralnotizblock,Seminarblock,Kollegeblöcke,Notizblöcke,Notizblock,Spiralbücher,Block,Spiralbuch,Briefblock,Briefblöcke,Kollegblöcke,Schreibblock,Spiralblock,Collegeblock,Schreibblöcke,Seminarblöcke",
            metaDescription:
              "Satiniertes Papier (Optik Paper), hochweiß. Zweifarbiger Polypropylen-Deckel, flexibel und strapazierfähig. Farbig sortiert (blau, grün, rot, violett und grau). Mit elegantem Metallic-Effekt.<p>* DIN A5 * Grammatur: 90 g/m² * elementar chlorfrei gebleicht * Doppelspiralbindung * inkl. Lesezeichenlineal * Material des Einbandes: Polypropylen * 90 Bl.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
            },
            url: "/en/industrial-network-technology/industrial-switches/foo-3",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-3",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "421247",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "421247",
          attributes: {
            price: 471,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 471,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421247/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421261",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421261/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-products",
          id: "421261",
          attributes: {
            sku: "421261",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-4",
            name: "BIC multi-color ballpoint pen 4 colors 831253 0.4 mm blue/black/red/green",
            description:
              "Colored printer for simple color selection. Writing on average 8 km according to SGS writing length test. The colors red, black, and blue are permanent.<p>* Line width: 0.4 mm * red, blue, green, black * Type designation of the refill: 4-color refill * refill can be exchanged * pressure mechanics * shaft material: Plastic * shaft color: black * 4 refills",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "4",
              rated_operating_distance: "4.4",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Schreibgeräte,Kugelschreiber,Mehrfarbkugelschreiber,Farbkugelschreiber,Vierfarbkugelschreiber,Kulis",
            metaDescription:
              "Farbige Drücker für eine einfache Farbauswahl. Schreiblänge nach SGS-Schreiblängentest durchschnittlich 8 km. Dokumentenecht sind die Schreibfarben rot, schwarz und blau.<p>* Strichstärke: 0,4 mm * rot, blau, grün, schwarz * Typbezeichnung der Mine: 4 Colours Mine * Mine auswechselbar * Druckmechanik * Material des Schaftes: Kunststoff * Farbe des Schaftes: schwarz * 4 Minen",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421261",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421261",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-4",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421261",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-4",
          attributes: {
            sku: "foo-4",
            averageRating: null,
            reviewCount: 0,
            name: "BIC multi-color ballpoint pen, 4 colors, 831253 0.4 mm blue/black/red/green",
            description:
              "Colored printer for simple color selection. Writing on average 8 km according to SGS writing length test. The colors red, black, and blue are permanent.<p>* Line width: 0.4 mm * red, blue, green, black * Type designation of the refill: 4-color refill * refill can be exchanged * pressure mechanics * shaft material: Plastic * shaft color: black * 4 refills",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "4",
              rated_operating_distance: "4.4",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [421261],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Schreibgeräte,Kugelschreiber,Mehrfarbkugelschreiber,Farbkugelschreiber,Vierfarbkugelschreiber,Kulis",
            metaDescription:
              "Farbige Drücker für eine einfache Farbauswahl. Schreiblänge nach SGS-Schreiblängentest durchschnittlich 8 km. Dokumentenecht sind die Schreibfarben rot, schwarz und blau.<p>* Strichstärke: 0,4 mm * rot, blau, grün, schwarz * Typbezeichnung der Mine: 4 Colours Mine * Mine auswechselbar * Druckmechanik * Material des Schaftes: Kunststoff * Farbe des Schaftes: schwarz * 4 Minen",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
            },
            url: "/en/industrial-network-technology/industrial-switches/foo-4",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-4",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "421261",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "421261",
          attributes: {
            price: 214,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 214,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421261/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421263",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421263/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-products",
          id: "421263",
          attributes: {
            sku: "421263",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-5",
            name: "FS101-300L-62-2UPN8-H1141",
            description: "Flow Sensor",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "5",
              rated_operating_distance: "5.5",
              protection_class: "IP67",
              medium: "liquids",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Multifunktionsstifte,Schreibgeräte,Eingabegeräte,Mehrsystemstifte,Eingabestifte,Multifunktionsschreibgeräte,Universalstifte",
            metaDescription:
              "Mit Touchpen Funktion zur Anwendung auf Smartphones und Tablet PCs. Mit Konturrillen.<p>* Schreibfarbe des Kugelschreibers: schwarz * 2 Schreibfunktionen * Ausführung der Griffzone: rund * Werkstoff: ABS/Carbon/Aluminium",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              protection_class: "Protection class",
              medium: "Medium",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "protection_class",
              "medium",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421263",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421263",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-5",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421263",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-5",
          attributes: {
            sku: "foo-5",
            averageRating: null,
            reviewCount: 0,
            name: "FS101-300L-62-2UPN8-H1141",
            description: "Flow Sensor",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "5",
              rated_operating_distance: "5.5",
              protection_class: "IP67",
              medium: "liquids",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [421263],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Multifunktionsstifte,Schreibgeräte,Eingabegeräte,Mehrsystemstifte,Eingabestifte,Multifunktionsschreibgeräte,Universalstifte",
            metaDescription:
              "Mit Touchpen Funktion zur Anwendung auf Smartphones und Tablet PCs. Mit Konturrillen.<p>* Schreibfarbe des Kugelschreibers: schwarz * 2 Schreibfunktionen * Ausführung der Griffzone: rund * Werkstoff: ABS/Carbon/Aluminium",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              protection_class: "Protection class",
              medium: "Medium",
            },
            url: "/en/sensors/flow-sensors/flow-meters/foo-5",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-5",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "421263",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "421263",
          attributes: {
            price: 711,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 711,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421263/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421265",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421265/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-products",
          id: "421265",
          attributes: {
            sku: "421265",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-6",
            name: "BIC multi-color ballpoint pen, 4 colors STYLUS 926404 Touchpen",
            description:
              "Touchpen and 4-color ballpoint pen in a pen with colored pusher for simple refill selection. Rich writing length of up to 1.5 km per refill. Ink waterproof, except for green.<p>*Line width: 0.4 mm * black, red, blue, green * Type designation of the refill: 4-color refill * refill can be exchanged * pressure mechanics * waterproof * shaft material: Plastic * shaft color: silver/black * 4 refills",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "6",
              rated_operating_distance: "6.6",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Schreibgeräte,Kugelschreiber,Mehrfarbkugelschreiber,Farbkugelschreiber,Vierfarbkugelschreiber,Kulis",
            metaDescription:
              "Touchpen und 4-Farb-Kugelschreiber in einem Stift mit farbigen Drückern zur einfachen Minenauswahl. Ergiebige Schreiblänge von bis zu 1,5 km je Mine. Tinte dokumentenecht außer grün.<p>* Strichstärke: 0,4 mm * schwarz, rot, blau, grün * Typbezeichnung der Mine: 4 Colurs Mine * Mine auswechselbar * Druckmechanik * dokumentenecht * Material des Schaftes: Kunststoff * Farbe des Schaftes: silber/schwarz * 4 Minen",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421265",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421265",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-6",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421265",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-6",
          attributes: {
            sku: "foo-6",
            averageRating: null,
            reviewCount: 0,
            name: "BIC multi-color ballpoint pen, 4 colors STYLUS 926404 Touchpen",
            description:
              "Touchpen and 4-color ballpoint pen in a pen with colored pusher for simple refill selection. Rich writing length of up to 1.5 km per refill. Ink waterproof, except for green.<p>*Line width: 0.4 mm * black, red, blue, green * Type designation of the refill: 4-color refill * refill can be exchanged * pressure mechanics * waterproof * shaft material: Plastic * shaft color: silver/black * 4 refills",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "6",
              rated_operating_distance: "6.6",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [421265],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Schreibgeräte,Kugelschreiber,Mehrfarbkugelschreiber,Farbkugelschreiber,Vierfarbkugelschreiber,Kulis",
            metaDescription:
              "Touchpen und 4-Farb-Kugelschreiber in einem Stift mit farbigen Drückern zur einfachen Minenauswahl. Ergiebige Schreiblänge von bis zu 1,5 km je Mine. Tinte dokumentenecht außer grün.<p>* Strichstärke: 0,4 mm * schwarz, rot, blau, grün * Typbezeichnung der Mine: 4 Colurs Mine * Mine auswechselbar * Druckmechanik * dokumentenecht * Material des Schaftes: Kunststoff * Farbe des Schaftes: silber/schwarz * 4 Minen",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
            },
            url: "/en/industrial-network-technology/industrial-switches/foo-6",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-6",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "421265",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "421265",
          attributes: {
            price: 454,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 454,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421265/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421322",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421322/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-products",
          id: "421322",
          attributes: {
            sku: "421322",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-7",
            name: "HP copy paper printing CHP210 DIN A4 80 g white 500 sheets/pack.",
            description:
              "Extra-white, powerful all-purpose paper with a smooth surface. High reliability. Optimal luminosity and engraved sharp printouts.<p>* DIN A4 * Weighting: 80 g/m² * primarily bleached chlorine-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: white * 500 sheets/pack.",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "7",
              rated_operating_distance: "7.7",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Druckerpapiere,Multifunktionspapiere,Kopierpapiere,Universalpapiere,Büropapiere,Allroundpapiere",
            metaDescription:
              "Extraweißes, leistungsstarkes Allzweckpapier mit glatter Oberfläche. Hohe Zuverlässigkeit. Optimale Leuchtkraft und gestochen scharfe Ausdrucke.<p>* DIN A4 * Grammatur: 80 g/m² * elementar chlorfrei gebleicht * beidseitig bedruckbar * Laserdrucker, Inkjetdrucker, Kopierer, Faxgeräte * Farbe: weiß * 500 Bl./Pack.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421322",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421322",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-7",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421322",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-7",
          attributes: {
            sku: "foo-7",
            averageRating: null,
            reviewCount: 0,
            name: "HP copy paper printing CHP210 DIN A4 80 g, white, 500 sheets/pack.",
            description:
              "Extra-white, powerful all-purpose paper with a smooth surface. High reliability. Optimal luminosity and engraved sharp printouts.<p>* DIN A4 * Weighting: 80 g/m² * primarily bleached chlorine-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: white * 500 sheets/pack.",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "7",
              rated_operating_distance: "7.7",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [421322],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Druckerpapiere,Multifunktionspapiere,Kopierpapiere,Universalpapiere,Büropapiere,Allroundpapiere",
            metaDescription:
              "Extraweißes, leistungsstarkes Allzweckpapier mit glatter Oberfläche. Hohe Zuverlässigkeit. Optimale Leuchtkraft und gestochen scharfe Ausdrucke.<p>* DIN A4 * Grammatur: 80 g/m² * elementar chlorfrei gebleicht * beidseitig bedruckbar * Laserdrucker, Inkjetdrucker, Kopierer, Faxgeräte * Farbe: weiß * 500 Bl./Pack.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
            },
            url: "/en/industrial-network-technology/industrial-switches/foo-7",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-7",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "421322",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "421322",
          attributes: {
            price: 521,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 521,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421322/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421323",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421323/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-products",
          id: "421323",
          attributes: {
            sku: "421323",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-8",
            name: "HP copy paper Office CHP110 DIN A4 80 g white 500 sheets/pack.",
            description:
              "The ColorLok technology ensures extra fast drying of the ink, deeper black and brilliant colors. Very high thickness ensures problem-free passage in all devices. For this purpose, this quality was checked so as to avoid paper jams: at most one jam per 60,000 sheets.<p>* Weighting: 80 g/m² * primarily bleached chlorine-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: white * 500 sheets/pack.",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "1",
              rated_operating_distance: "1.1",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Druckerpapiere,Multifunktionspapiere,Kopierpapiere,Universalpapiere,Büropapiere,Allroundpapiere",
            metaDescription:
              "Die ColorLok-Technologie sorgt für extra schnelle Trocknung der Tinte, tieferes Schwarz und brillante Farben. Seine hohe Dicke sorgt für problemlosen Durchlauf in allen Geräten. Zu diesem Zweck wurde diese Qualität im Hinblick auf die Vermeidung von Papierstaus geprüft: maximal ein Stau pro 60.000 Blatt.<p>* Grammatur: 80 g/m² * elementar chlorfrei gebleicht * beidseitig bedruckbar * Laserdrucker, Inkjetdrucker, Kopierer, Faxgeräte * Farbe: weiß * 500 Bl./Pack.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421323",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421323",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-8",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421323",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-8",
          attributes: {
            sku: "foo-8",
            averageRating: null,
            reviewCount: 0,
            name: "HP copy paper Office CHP110 DIN A4 80 g, white, 500 sheets/pack.",
            description:
              "The ColorLok technology ensures extra fast drying of the ink, deeper black and brilliant colors. Very high thickness ensures problem-free passage in all devices. For this purpose, this quality was checked so as to avoid paper jams: at most one jam per 60,000 sheets.<p>* Weighting: 80 g/m² * primarily bleached chlorine-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: white * 500 sheets/pack.",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "1",
              rated_operating_distance: "1.1",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [421323],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Druckerpapiere,Multifunktionspapiere,Kopierpapiere,Universalpapiere,Büropapiere,Allroundpapiere",
            metaDescription:
              "Die ColorLok-Technologie sorgt für extra schnelle Trocknung der Tinte, tieferes Schwarz und brillante Farben. Seine hohe Dicke sorgt für problemlosen Durchlauf in allen Geräten. Zu diesem Zweck wurde diese Qualität im Hinblick auf die Vermeidung von Papierstaus geprüft: maximal ein Stau pro 60.000 Blatt.<p>* Grammatur: 80 g/m² * elementar chlorfrei gebleicht * beidseitig bedruckbar * Laserdrucker, Inkjetdrucker, Kopierer, Faxgeräte * Farbe: weiß * 500 Bl./Pack.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
            },
            url: "/en/industrial-network-technology/foo-8",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-8",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "421323",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "421323",
          attributes: {
            price: 445,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 445,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421323/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421324",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421324/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-products",
          id: "421324",
          attributes: {
            sku: "421324",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-9",
            name: "HP copy paper Copy Paper CHP910 DIN A4 80 g, white, 500 sheets/pack.",
            description:
              "Tested quality prevents paper jams in high-speed laser printers and copiers.<p>* DIN A4 * Weighting: 80 g/m² * primarily bleached chlorine-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: white * 500 sheets/pack.",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "2",
              rated_operating_distance: "2.2",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Druckerpapiere,Multifunktionspapiere,Kopierpapiere,Universalpapiere,Büropapiere,Allroundpapiere",
            metaDescription:
              "Getestete Qualität vermeidet Papierstaus in Hochgeschwindigkeits-Laserdruckern und -Kopierern.<p>* DIN A4 * Grammatur: 80 g/m² * elementar chlorfrei gebleicht * beidseitig bedruckbar * Laserdrucker, Inkjetdrucker, Kopierer, Faxgeräte * Farbe: weiß * 500 Bl./Pack.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421324",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421324",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-9",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421324",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-9",
          attributes: {
            sku: "foo-9",
            averageRating: null,
            reviewCount: 0,
            name: "HP copy paper Copy Paper CHP910 DIN A4 80 g, white, 500 sheets/pack.",
            description:
              "Tested quality prevents paper jams in high-speed laser printers and copiers.<p>* DIN A4 * Weighting: 80 g/m² * primarily bleached chlorine-free * inscribable on both sides * laser printer, inkjet printer, copier, fax devices * color: white * 500 sheets/pack.",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "2",
              rated_operating_distance: "2.2",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [421324],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Druckerpapiere,Multifunktionspapiere,Kopierpapiere,Universalpapiere,Büropapiere,Allroundpapiere",
            metaDescription:
              "Getestete Qualität vermeidet Papierstaus in Hochgeschwindigkeits-Laserdruckern und -Kopierern.<p>* DIN A4 * Grammatur: 80 g/m² * elementar chlorfrei gebleicht * beidseitig bedruckbar * Laserdrucker, Inkjetdrucker, Kopierer, Faxgeräte * Farbe: weiß * 500 Bl./Pack.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
            },
            url: "/en/industrial-network-technology/foo-9",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-9",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "421324",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "421324",
          attributes: {
            price: 521,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 521,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421324/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421327",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421327/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-products",
          id: "421327",
          attributes: {
            sku: "421327",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-10",
            name: "Clairefontaine Collegeblock Forever Recycling 17427C DIN A4, checkered",
            description:
              "With red border line alternating on inside or outside.<p>* DIN A4 * Weighting: 70 g/m² * bleached totally chlorine-free, 100% recycling paper * 4-fold perforation * double spiral binding * 80 sheets",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "3",
              rated_operating_distance: "3.3",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Kollegeblock,Kollegeblock,Collegeblöcke,Collegeblöcke,Blöcke,Blöcke,Konferenzblock,Konferenzblock,Notizhefte,Notizhefte,Kollegblock,Kollegblock,Spiralblöcke,Spiralblöcke,Konferenzblöcke,Konferenzblöcke,Spiralnotizblöcke,Spiralnotizblöcke,Spiralnotizblock,Spiralnotizblock,Seminarblock,Seminarblock,Kollegeblöcke,Kollegeblöcke,Notizblöcke,Notizblöcke,Notizblock,Notizblock,Spiralbücher,Spiralbücher,Block,Block,Spiralbuch,Spiralbuch,Briefblock,Briefblock,Briefblöcke,Briefblöcke,Kollegblöcke,Kollegblöcke,Schreibblock,Schreibblock,Spiralblock,Spiralblock,Collegeblock,Collegeblock,Schreibblöcke,Schreibblöcke,Seminarblöcke,Seminarblöcke",
            metaDescription:
              "Mit roter Randlinie abwechselnd innen oder außen.<p>* DIN A4 * Grammatur: 70 g/m² * total chlorfrei gebleicht, 100 % Recyclingpapier * 4fach Lochung * Doppelspiralbindung * 80 Bl.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421327",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421327",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-10",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421327",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-10",
          attributes: {
            sku: "foo-10",
            averageRating: null,
            reviewCount: 0,
            name: "Clairefontaine Collegeblock Forever Recycling DIN A4",
            description:
              "With red border line alternating on inside or outside.<p>* DIN A4 * Weighting: 70 g/m² * bleached totally chlorine-free, 100% recycling paper * 4-fold perforation * double spiral binding * 80 sheets",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "3",
              rated_operating_distance: "3.3",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [421327],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Kollegeblock,Kollegeblock,Collegeblöcke,Collegeblöcke,Blöcke,Blöcke,Konferenzblock,Konferenzblock,Notizhefte,Notizhefte,Kollegblock,Kollegblock,Spiralblöcke,Spiralblöcke,Konferenzblöcke,Konferenzblöcke,Spiralnotizblöcke,Spiralnotizblöcke,Spiralnotizblock,Spiralnotizblock,Seminarblock,Seminarblock,Kollegeblöcke,Kollegeblöcke,Notizblöcke,Notizblöcke,Notizblock,Notizblock,Spiralbücher,Spiralbücher,Block,Block,Spiralbuch,Spiralbuch,Briefblock,Briefblock,Briefblöcke,Briefblöcke,Kollegblöcke,Kollegblöcke,Schreibblock,Schreibblock,Spiralblock,Spiralblock,Collegeblock,Collegeblock,Schreibblöcke,Schreibblöcke,Seminarblöcke,Seminarblöcke",
            metaDescription:
              "Mit roter Randlinie abwechselnd innen oder außen.<p>* DIN A4 * Grammatur: 70 g/m² * total chlorfrei gebleicht, 100 % Recyclingpapier * 4fach Lochung * Doppelspiralbindung * 80 Bl.",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
            },
            url: "/en/industrial-network-technology/foo-10",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-10",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "421327",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "421327",
          attributes: {
            price: 264,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 264,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421327/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421339",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421339/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-products",
          id: "421339",
          attributes: {
            sku: "421339",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-11",
            name: "Clairefontaine Collegeblock 8272C DIN A5, 90 sheets",
            description:
              "Satin coated paper (optic paper), pure white. Two-color polypropylene cover, flexible and durable. Arranged by color (blue, green, red, purple and gray). With an elegant metallic effect.<p>* DIN A4 * Weighting: 90 g/m² *primarily bleached chlorine-free * double spiral binding * including bookmark straightedge * Cover material: Polypropylene * 90 sheets",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "4",
              rated_operating_distance: "4.4",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Kollegeblock,Collegeblöcke,Blöcke,Konferenzblock,Notizhefte,Kollegblock,Spiralblöcke,Konferenzblöcke,Spiralnotizblöcke,Spiralnotizblock,Seminarblock,Kollegeblöcke,Notizblöcke,Notizblock,Spiralbücher,Block,Spiralbuch,Briefblock,Briefblöcke,Kollegblöcke,Schreibblock,Spiralblock,Collegeblock,Schreibblöcke,Seminarblöcke",
            metaDescription: "",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421339",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421339",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-11",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421339",
                },
              ],
            },
          },
        },
        {
          type: "concrete-products",
          id: "421340",
          attributes: {
            sku: "421340",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-11",
            name: "Clairefontaine Collegeblock 8272C DIN A5, 90 sheets",
            description:
              "Satin coated paper (optic paper), pure white. Two-color polypropylene cover, flexible and durable. Arranged by color (blue, green, red, purple and gray). With an elegant metallic effect.<p>* DIN A4 * Weighting: 90 g/m² *primarily bleached chlorine-free * double spiral binding * including bookmark straightedge * Cover material: Polypropylene * 90 sheets",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "4",
              rated_operating_distance: "4.4",
              light_type: "Blue",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Kollegeblock,Collegeblöcke,Blöcke,Konferenzblock,Notizhefte,Kollegblock,Spiralblöcke,Konferenzblöcke,Spiralnotizblöcke,Spiralnotizblock,Seminarblock,Kollegeblöcke,Notizblöcke,Notizblock,Spiralbücher,Block,Spiralbuch,Briefblock,Briefblöcke,Kollegblöcke,Schreibblock,Spiralblock,Collegeblock,Schreibblöcke,Seminarblöcke",
            metaDescription: "",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421340",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421340",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-11",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421340",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-11",
          attributes: {
            sku: "foo-11",
            averageRating: null,
            reviewCount: 0,
            name: "Clairefontaine Collegeblock 8272C DIN A5, 90 sheets",
            description:
              "With red border line alternating on inside or outside.<p>* DIN A4 * Weighting: 70 g/m² * bleached totally chlorine-free, 100% recycling paper * 4-fold perforation * double spiral binding * 80 sheets",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "4",
              rated_operating_distance: "4.4",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [421339, 421340],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Kollegeblock,Collegeblöcke,Blöcke,Konferenzblock,Notizhefte,Kollegblock,Spiralblöcke,Konferenzblöcke,Spiralnotizblöcke,Spiralnotizblock,Seminarblock,Kollegeblöcke,Notizblöcke,Notizblock,Spiralbücher,Block,Spiralbuch,Briefblock,Briefblöcke,Kollegblöcke,Schreibblock,Spiralblock,Collegeblock,Schreibblöcke,Seminarblöcke",
            metaDescription: "",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
            },
            url: "/en/industrial-network-technology/foo-11",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-11",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "421339",
                },
                {
                  type: "concrete-products",
                  id: "421340",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "421339",
          attributes: {
            price: 521,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 521,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421339/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421340",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421340/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-product-prices",
          id: "421340",
          attributes: {
            price: 521,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 521,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421340/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421341",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421341/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-products",
          id: "421341",
          attributes: {
            sku: "421341",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-12",
            name: "Clairefontaine Collegeblock 8272C DIN A5, 90 sheets",
            description:
              "Satin coated paper (optic paper), pure white. Two-color polypropylene cover, flexible and durable. Arranged by color (blue, green, red, purple and gray). With an elegant metallic effect.<p>* DIN A4 * Weighting: 90 g/m² *primarily bleached chlorine-free * double spiral binding * including bookmark straightedge * Cover material: Polypropylene * 90 sheets",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "5",
              rated_operating_distance: "5.5",
              light_type: "Orange",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Kollegeblock,Collegeblöcke,Blöcke,Konferenzblock,Notizhefte,Kollegblock,Spiralblöcke,Konferenzblöcke,Spiralnotizblöcke,Spiralnotizblock,Seminarblock,Kollegeblöcke,Notizblöcke,Notizblock,Spiralbücher,Block,Spiralbuch,Briefblock,Briefblöcke,Kollegblöcke,Schreibblock,Spiralblock,Collegeblock,Schreibblöcke,Seminarblöcke",
            metaDescription: "",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421341",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421341",
                },
              ],
            },
            "product-measurement-units": {
              data: [
                {
                  type: "product-measurement-units",
                  id: "ITEM",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-12",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421341",
                },
              ],
            },
          },
        },
        {
          type: "concrete-products",
          id: "421342",
          attributes: {
            sku: "421342",
            isDiscontinued: false,
            discontinuedNote: null,
            averageRating: null,
            reviewCount: 0,
            productAbstractSku: "foo-12",
            name: "Clairefontaine Collegeblock 8272C DIN A5, 90 sheets",
            description:
              "Satin coated paper (optic paper), pure white. Two-color polypropylene cover, flexible and durable. Arranged by color (blue, green, red, purple and gray). With an elegant metallic effect.<p>* DIN A4 * Weighting: 90 g/m² *primarily bleached chlorine-free * double spiral binding * including bookmark straightedge * Cover material: Polypropylene * 90 sheets",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "5",
              rated_operating_distance: "5.5",
              light_type: "Blue",
            },
            superAttributesDefinition: [],
            metaTitle: "",
            metaKeywords:
              "Kollegeblock,Collegeblöcke,Blöcke,Konferenzblock,Notizhefte,Kollegblock,Spiralblöcke,Konferenzblöcke,Spiralnotizblöcke,Spiralnotizblock,Seminarblock,Kollegeblöcke,Notizblöcke,Notizblock,Spiralbücher,Block,Spiralbuch,Briefblock,Briefblöcke,Kollegblöcke,Schreibblock,Spiralblock,Collegeblock,Schreibblöcke,Seminarblöcke",
            metaDescription: "",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
              light_type: "Light type",
            },
            visibleOnPdpAttribute: [
              "cordset_application",
              "number_of_ports",
              "rated_operating_distance",
              "light_type",
            ],
            isBuyable: true,
            minOrderAmount: null,
            priceGroup: null,
          },
          links: {
            self: "https://concrete-products/421342",
          },
          relationships: {
            "concrete-product-availabilities": {
              data: [
                {
                  type: "concrete-product-availabilities",
                  id: "421342",
                },
              ],
            },
            "abstract-products": {
              data: [
                {
                  type: "abstract-products",
                  id: "foo-12",
                },
              ],
            },
            "concrete-product-prices": {
              data: [
                {
                  type: "concrete-product-prices",
                  id: "421342",
                },
              ],
            },
          },
        },
        {
          type: "abstract-products",
          id: "foo-12",
          attributes: {
            sku: "foo-12",
            averageRating: null,
            reviewCount: 0,
            name: "Clairefontaine Collegeblock 8272C DIN A5, 90 sheets",
            description:
              "With red border line alternating on inside or outside.<p>* DIN A4 * Weighting: 70 g/m² * bleached totally chlorine-free, 100% recycling paper * 4-fold perforation * double spiral binding * 80 sheets",
            attributes: {
              cordset_application: "Data",
              number_of_ports: "5",
              rated_operating_distance: "5.5",
            },
            superAttributesDefinition: [],
            superAttributes: [],
            attributeMap: {
              super_attributes: [],
              product_concrete_ids: [421341, 421342],
              attribute_variants: [],
              attribute_variant_map: [],
            },
            metaTitle: "",
            metaKeywords:
              "Kollegeblock,Collegeblöcke,Blöcke,Konferenzblock,Notizhefte,Kollegblock,Spiralblöcke,Konferenzblöcke,Spiralnotizblöcke,Spiralnotizblock,Seminarblock,Kollegeblöcke,Notizblöcke,Notizblock,Spiralbücher,Block,Spiralbuch,Briefblock,Briefblöcke,Kollegblöcke,Schreibblock,Spiralblock,Collegeblock,Schreibblöcke,Seminarblöcke",
            metaDescription: "",
            attributeNames: {
              cordset_application: "Application",
              number_of_ports: "Number of Ports",
              rated_operating_distance: "Rated switching distance",
            },
            url: "/en/industrial-network-technology/foo-12",
            keyFeatures: [],
          },
          links: {
            self: "https://abstract-products/foo-12",
          },
          relationships: {
            "concrete-products": {
              data: [
                {
                  type: "concrete-products",
                  id: "421341",
                },
                {
                  type: "concrete-products",
                  id: "421342",
                },
              ],
            },
          },
        },
        {
          type: "concrete-product-prices",
          id: "421341",
          attributes: {
            price: 521,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 521,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421341/concrete-product-prices",
          },
        },
        {
          type: "concrete-product-availabilities",
          id: "421342",
          attributes: {
            isNeverOutOfStock: true,
            availability: true,
            quantity: "0.0000000000",
          },
          links: {
            self: "https://concrete-products/421342/concrete-product-availabilities",
          },
        },
        {
          type: "concrete-product-prices",
          id: "421342",
          attributes: {
            price: 521,
            prices: [
              {
                priceTypeName: "DEFAULT",
                netAmount: 521,
                grossAmount: null,
                currency: {
                  code: "EUR",
                  name: "Euro",
                  symbol: "€",
                },
                volumePrices: [],
              },
            ],
          },
          links: {
            self: "https://concrete-products/421342/concrete-product-prices",
          },
        },
      ],
    };
    const result = deserialize(arrayResp);

    const { data: expectedData, ...expectedRest } = expectedResponse;
    const expectedArrayResponse = {
      data: [expectedData, expectedData, expectedData],
      ...expectedRest,
    };

    deepStrictEqual(result, expectedArrayResponse);
  });

  it("should camel case object keys", () => {
    const result = deserialize(respWithSeparators, {
      transformKeys: "camelCase",
    });
    deepStrictEqual(result, expectedRespWithSeparators);
  });

  // Additional edge cases
  const complexResponse = {
    data: {
      type: "posts",
      id: "2291",
      attributes: {},
      relationships: {
        user: {
          data: {
            type: "users",
            id: "39",
          },
        },
        comments: {
          data: [
            {
              type: "comments",
              id: "7989",
            },
            {
              type: "comments",
              id: "7990",
            },
          ],
        },
      },
    },
    included: [
      {
        type: "users",
        id: "39",
        attributes: {},
        relationships: {},
      },
      {
        type: "users",
        id: "100",
        attributes: {},
        relationships: {},
      },
      {
        type: "comments",
        id: "7989",
        attributes: {},
        relationships: {
          user: {
            data: {
              type: "users",
              id: "39",
            },
          },
          pre: {
            data: {
              type: "comments",
              id: "7986",
            },
          },
        },
      },
      {
        type: "comments",
        id: "7986",
        attributes: {},
        relationships: {
          user: {
            data: {
              type: "users",
              id: "39",
            },
          },
        },
      },
      {
        type: "comments",
        id: "7990",
        attributes: {},
        relationships: {
          user: {
            data: {
              type: "users",
              id: "100",
            },
          },
          pre: {
            data: {
              type: "comments",
              id: "7989",
            },
          },
        },
      },
    ],
  };

  const expectedComplexResponse = {
    data: {
      type: "posts",
      id: "2291",
      user: {
        type: "users",
        id: "39",
      },
      comments: [
        {
          type: "comments",
          id: "7989",
          user: {
            type: "users",
            id: "39",
          },
          pre: {
            type: "comments",
            id: "7986",
            user: {
              type: "users",
              id: "39",
            },
          },
        },
        {
          type: "comments",
          id: "7990",
          user: {
            type: "users",
            id: "100",
          },
          pre: {
            type: "comments",
            id: "7989",
            user: {
              type: "users",
              id: "39",
            },
            pre: {
              type: "comments",
              id: "7986",
              user: {
                type: "users",
                id: "39",
              },
            },
          },
        },
      ],
    },
  };

  it("should handle complex nested relationships", () => {
    const result = deserialize(complexResponse);
    deepStrictEqual(result, expectedComplexResponse);
  });
});
