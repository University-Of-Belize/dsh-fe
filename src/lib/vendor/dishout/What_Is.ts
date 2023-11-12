// What is typescript?
/*
what_is_response
==================
{
what: “object”,  // What
[“property”, “property”, ...]  // Is
}
*/
// What is Svelte?

class WhatIs {
  what: string;
  is: any;

  constructor(what: string, is: any) {
    this.what = what;
    this.is = is;
  }
}

function what_is(what: string, is: any) {
  return new WhatIs(what, is);
}

export { what_is};
