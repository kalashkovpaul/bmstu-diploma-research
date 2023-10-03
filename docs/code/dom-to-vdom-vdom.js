const vdom = {
  tagName: "html",
  children: [
    { tagName: "head" },
    {
      tagName: "body",
      children: [
        {
            tagName: "ul",
            attributes: { "class": "list" },
            children: [
                {
                    tagName: "li",
                    attributes: { "class": "list__item" },
                    textContent: "List item"
                } // end li
            ]
        } // end ul
      ]
    } // end body
  ]
} // end html