<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  meta: {
    // sets document title
    title: "Tereval",
    // optional; sets final title as "Index Page - My Website", useful for multiple level meta
    //titleTemplate: title => `${title}`,

    // meta tags
    meta: {
      description: { name: "description", content: "Page 1" },
      keywords: { name: "keywords", content: "Quasar website" },
      equiv: {
        "http-equiv": "Content-Type",
        content: "text/html; charset=UTF-8"
      }
    },

    // CSS tags
    link: {
      // material: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
    },

    // JS tags
    script: {
      ldJson: {
        type: "application/ld+json",
        innerHTML: `{ "@context": "http://schema.org" }`
      }
    },

    // <html> attributes
    htmlAttr: {
      "xmlns:cc": "http://creativecommons.org/ns#", // generates <html xmlns:cc="http://creativecommons.org/ns#">,
      empty: undefined // generates <html empty>
    },

    // <body> attributes
    bodyAttr: {
      "action-scope": "xyz", // generates <body action-scope="xyz">
      empty: undefined // generates <body empty>
    },

    // <noscript> tags
    noscript: {
      default: "This is content for browsers with no JS (or disabled JS)"
    }
  }
};
</script>

<style>
#q-app {
}

#scrollerY {
  /* pa-top: 51px; */
  overflow-y: auto;
  height: calc(100vh - 51px);
  max-height: calc(100vh - 51px);
}

/* width */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
